from datetime import datetime, timedelta, timezone
from typing import Any, Dict
from fastapi import (
    APIRouter,
    status,
)

from logging import getLogger
from sqlalchemy import delete, insert, select, update
from account import exceptions
from account import schemas
from dependencies import SessionDataBase, AuthFormData, TokenOAuth2
from models import (
    Address,
    Comuna,
    Contract,
    Country,
    ElectricityCompany,
    PassRecoverRequest,
    Region,
    User,
    UserDevice,
)
from constants import (
    FE_RECOVER_PASSWORD,
    FE_URL,
    PASSWORD_REQUEST_EXPIRATION_DELTA,
    PWD_CONTEXT,
    API_SECRET_KEY,
    API_ALGORITHM,
    SENDER_EMAIL,
    SENDER_PASSWORD,
    TOKEN_EXPIRATION_DELTA,
)
import jwt
from jwt.exceptions import InvalidTokenError
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from furl import furl as Furl

logger = getLogger("login.router")

router = APIRouter(prefix="/account", tags=["account"])


def does_user_exist(
    user_email: str,
    database_session: SessionDataBase,
):
    statement = select(User).where(User.email.__eq__(user_email.upper()))

    return database_session.execute(statement).one_or_none() is not None


def get_password_from_database(
    user_email: str,
    database_session: SessionDataBase,
):
    statement = select(User.password).where(User.email.__eq__(user_email.upper()))
    return database_session.execute(statement).scalar_one()


def get_user_email_from_token(token: TokenOAuth2 | str):
    try:
        payload = jwt.decode(
            token, API_SECRET_KEY.get_secret_value(), algorithms=[API_ALGORITHM]
        )

        user_email: str = payload.get("sub")

        # check if user_email is in token
        if user_email is None:
            raise exceptions.InvalidTokenException

        return user_email.upper()

    except InvalidTokenError:
        raise exceptions.InvalidTokenException


def validate_if_token_is_expired(token: str):
    try:
        payload: dict[str, Any] = jwt.decode(
            token, API_SECRET_KEY.get_secret_value(), algorithms=[API_ALGORITHM]
        )

        expiration: datetime | None = payload.get("exp")

        # check if expiration is in token
        if expiration is None:
            raise InvalidTokenError("Token does not have 'exp' item")

        if (datetime.now(timezone.utc) - expiration).total_seconds() >= 0:
            raise InvalidTokenError("Token has expired.")

        return expiration

    except InvalidTokenError as err:
        logger.exception(err)
        raise exceptions.InvalidTokenException


def get_current_user_from_database(
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    user_email = get_user_email_from_token(token)

    # make query to get user
    statement = select(User).where(User.email.__eq__(user_email.upper()))
    user = database_session.execute(statement).scalar_one_or_none()

    if user is None:
        raise exceptions.UserIsMissingFromDatabase

    return user


def verify_password(
    database_password: bytes,
    raw_password: str,
) -> bool:
    return PWD_CONTEXT.verify(raw_password, database_password)


def get_expiration_datetime(expire_delta: timedelta):
    return datetime.now(timezone.utc) + expire_delta


def generate_access_token(sub: str, expiration: datetime):
    # creates deltatime to expire token
    data = {
        "sub": sub,
        "exp": expiration,
    }
    # create token with user data
    encoded_jwt = jwt.encode(
        data,
        API_SECRET_KEY.get_secret_value(),
        algorithm=API_ALGORITHM,
    )
    return encoded_jwt


@router.post(
    path="/authenticate",
    status_code=status.HTTP_200_OK,
)
def authenticate(
    form_data: AuthFormData,
    database_session: SessionDataBase,
) -> schemas.TokenResponse:
    # transform username to uppercase
    form_data.username = form_data.username.upper()

    # check if user do not exist
    if not does_user_exist(
        user_email=form_data.username,
        database_session=database_session,
    ):
        raise exceptions.FailedToAuthenticate

    # get password from database
    database_password = get_password_from_database(
        user_email=form_data.username,
        database_session=database_session,
    )

    # check password
    if not verify_password(
        raw_password=form_data.password,
        database_password=database_password,
    ):
        raise exceptions.FailedToAuthenticate

    expiration_time = get_expiration_datetime(TOKEN_EXPIRATION_DELTA)
    token = generate_access_token(
        sub=form_data.username,
        expiration=expiration_time,
    )

    return schemas.TokenResponse(
        access_token=token, expires_in=TOKEN_EXPIRATION_DELTA.seconds
    )


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: schemas.RegistroData,
    database_session: SessionDataBase,
):
    # check if user already exist
    if does_user_exist(
        user_email=data.user.email,
        database_session=database_session,
    ):
        raise exceptions.UserAlreadyExistCannotRegister

    # insert values in db
    insert_contract = (
        insert(Contract)
        .values(
            service_admin_cost=data.contract.service_administration_cost,
            transport_cost=data.contract.transport_cost,
            electricity_cost=data.contract.electricity_cost,
            id_electricity_company=int(data.contract.electricity_company),
        )
        .returning(Contract.id)
    )

    id_contract_row: int = database_session.execute(insert_contract).scalar_one()
    database_session.commit()

    # check if address exist
    search_address = select(Address.id).where(
        Address.street_name.__eq__(
            data.address.street_name,
        ).__and__(
            Address.street_number.__eq__(data.address.street_number),
        ),
    )

    id_address_row: int | None = database_session.execute(
        search_address,
    ).scalar_one_or_none()

    # if address do not exist, insert new address
    if id_address_row is None:
        insert_address = (
            insert(Address)
            .values(
                street_name=data.address.street_name,
                street_number=data.address.street_number,
                id_comuna=data.address.comuna,
            )
            .returning(Address.id)
        )
        id_address_row = database_session.execute(insert_address).scalar_one()
        database_session.commit()

    raw_password = data.user.password.get_secret_value()
    hashed_password = PWD_CONTEXT.hash(raw_password).encode()

    # register new user
    insert_user = insert(User).values(
        first_name=data.user.first_name,
        last_name=data.user.last_name,
        second_last_name=data.user.second_last_name,
        phone_number=data.user.phone_number,
        country_code=data.user.country_code,
        email=data.user.email,
        password=hashed_password,
        id_address=id_address_row,
        id_contract=id_contract_row,
    )
    database_session.execute(insert_user)
    database_session.commit()


@router.get("/user")
def get_current_user(
    token: TokenOAuth2,
    database_session: SessionDataBase,
) -> schemas.GetUser:
    user_from_bd = get_current_user_from_database(
        token=token,
        database_session=database_session,
    )

    if user_from_bd is None:
        raise exceptions.UserIsMissingFromDatabase

    # query contract
    statement = select(Contract, ElectricityCompany.name).where(
        ElectricityCompany.id.__eq__(Contract.id_electricity_company).__and__(
            Contract.id.__eq__(user_from_bd.id_contract)
        )
    )
    contract, company = database_session.execute(statement).one().tuple()

    # query address
    statement = select(
        Address.street_name,
        Address.street_number,
        Comuna.name,
        Region.name,
        Country.name,
    ).where(
        Address.id.__eq__(user_from_bd.id_address).__and__(
            Comuna.id.__eq__(Address.id_comuna).__and__(
                Region.id.__eq__(Comuna.id_region).__and__(
                    Country.id.__eq__(Region.id_country)
                )
            )
        )
    )

    street_name, street_number, comuna, region, country = (
        database_session.execute(statement).one().tuple()
    )

    user_data = schemas.GetUser.User(
        first_name=user_from_bd.first_name,
        last_name=user_from_bd.last_name,
        second_last_name=user_from_bd.second_last_name,
        email=user_from_bd.email,
        phone_number=user_from_bd.phone_number,
        country_code=user_from_bd.country_code,
    )

    address_data = schemas.GetUser.Address(
        street_name=street_name,
        street_number=street_number,
        comuna=comuna,
        region=region,
        country=country,
    )
    contract_data = schemas.GetUser.Contract(
        electricity_company=company,
        service_administration_cost=contract.service_admin_cost,
        transport_cost=contract.transport_cost,
        electricity_cost=contract.electricity_cost,
    )

    return schemas.GetUser(
        user=user_data,
        address=address_data,
        contract=contract_data,
    )


def insert_modification_values(
    payload: schemas.ModificarData,
    user_email: str,
    database_session: SessionDataBase,
):
    # dump model modifications and insert in database
    # modify Address
    if payload.address is not None:
        modifications: Dict[str, Any] = payload.address.model_dump(
            by_alias=True,
            exclude_unset=True,
        )
        sub_query = (
            select(User.id_address)
            .where(User.email.__eq__(user_email))
            .scalar_subquery()
        )

        statement = (
            update(
                Address,
            )
            .where(
                Address.id.__eq__(sub_query),
            )
            .values(modifications)
        )
        database_session.execute(statement)

    # modify Contract
    if payload.contract is not None:
        modifications: Dict[str, Any] = payload.contract.model_dump(
            by_alias=True,
            exclude_unset=True,
        )
        sub_query = (
            select(User.id_contract)
            .where(User.email.__eq__(user_email))
            .scalar_subquery()
        )
        statement = (
            update(
                Contract,
            )
            .where(
                Contract.id.__eq__(sub_query),
            )
            .values(modifications)
        )
        database_session.execute(statement)

    # modify User
    if payload.user is not None:
        modifications: Dict[str, Any] = payload.user.model_dump(
            by_alias=True,
            exclude_unset=True,
        )
        statement = (
            update(
                User,
            )
            .where(
                User.email.__eq__(user_email),
            )
            .values(modifications)
        )
        database_session.execute(statement)


@router.put(
    "/user",
    status_code=status.HTTP_204_NO_CONTENT,
)
def modify_current_user(
    payload: schemas.ModificarData,
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    user_email = get_user_email_from_token(token)

    if not does_user_exist(
        user_email=user_email,
        database_session=database_session,
    ):
        raise exceptions.UserIsMissingFromDatabase

    # check if payload is empty
    payload_is_empty = (
        payload.user is None and payload.address is None and payload.contract is None
    )

    if payload_is_empty:
        logger.error(f"No field were set to modify user: {user_email}.")
        raise exceptions.NoFieldsSetToModifyUser

    # check if non none model is unset
    for model in (payload.user, payload.address, payload.contract):
        if model is None:
            continue

        if model.model_fields_set.__len__() <= 0:
            logger.error(f"No field were set to modify user: {user_email}")
            raise exceptions.NoFieldsSetToModifyUser

    try:
        insert_modification_values(
            payload=payload,
            user_email=user_email,
            database_session=database_session,
        )
        database_session.commit()

    except Exception as err:
        database_session.rollback()
        logger.exception(err)
        raise exceptions.UserModificationFailed


@router.delete(
    "/user",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_current_user(
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    user_db = get_current_user_from_database(
        token=token,
        database_session=database_session,
    )

    try:
        # delete user registred devices
        logger.info(f"Deleting devices from user {user_db.email}.")
        delete_user_devices = delete(UserDevice).where(
            UserDevice.id_user.__eq__(user_db.id)
        )
        database_session.execute(delete_user_devices)

        # delete user
        delete_user = delete(User).where(User.id.__eq__(user_db.id))
        logger.info(f"Deleting user {user_db.email}.")
        database_session.execute(delete_user)

        # delete user contract
        delete_user_contract = delete(Contract).where(
            Contract.id.__eq__(user_db.id_contract),
        )
        logger.info(f"Deleting user {user_db.email} contract.")
        database_session.execute(delete_user_contract)

        # commit all executed actions
        database_session.commit()
        logger.info(f"User {user_db.email} deleted successfully.")
    except Exception as err:
        logger.error(f"Fail to delete user: {user_db.email}")
        logger.exception(err)
        raise exceptions.UserDeletionFailed


@router.put(
    "/password/change",
    status_code=status.HTTP_204_NO_CONTENT,
)
def change_password_current_user(
    payload: schemas.PasswordChange,
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    user_email = get_user_email_from_token(token)

    if not does_user_exist(
        user_email=user_email,
        database_session=database_session,
    ):
        raise exceptions.UserIsMissingFromDatabase

    raw_password = payload.new_password.get_secret_value()
    hashed_password = PWD_CONTEXT.hash(raw_password).encode()

    try:
        logger.info(f"Changing password of user: {user_email}")
        insert_user = (
            update(User)
            .values(password=hashed_password)
            .where(User.email.__eq__(user_email))
        )
        database_session.execute(insert_user)
        database_session.commit()

    except Exception as err:
        database_session.rollback()
        logger.exception(err)
        raise exceptions.FailedToChangePassword


def create_email_message(
    recipient: str,
    subject: str,
    body: str,
):
    msg = MIMEMultipart()
    msg["From"] = f"EnergyMeter <{SENDER_EMAIL}>"
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    return msg.as_string()


def send_email(
    recipient: str,
    subject: str,
    body: str,
):
    email_message = create_email_message(recipient, subject, body)
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.ehlo()
    server.starttls()
    server.login(SENDER_EMAIL, SENDER_PASSWORD.get_secret_value())
    server.sendmail(
        from_addr=SENDER_EMAIL,
        to_addrs=recipient,
        msg=email_message,
    )


@router.post(
    "/password/recover",
    status_code=status.HTTP_202_ACCEPTED,
)
def recover_password(
    payload: schemas.RecoverPassword,
    database_session: SessionDataBase,
):
    user_email = payload.email

    if not does_user_exist(user_email, database_session):
        raise exceptions.UserIsMissingFromDatabase

    try:
        # create solicitud
        expiration_time = get_expiration_datetime(PASSWORD_REQUEST_EXPIRATION_DELTA)

        request_token = generate_access_token(
            sub=user_email,
            expiration=expiration_time,
        )

        query_create_solicitud = insert(PassRecoverRequest).values(
            request=request_token.encode(),
            email=user_email,
            expire_datetime=expiration_time,
        )
        database_session.execute(query_create_solicitud)

        with open("assets/emails/recover_password.html", "r") as file:
            email_html = file.read()

        # replace html variables

        # get user first name for email html
        query_get_firstname = select(User.first_name).where(
            User.email.__eq__(user_email)
        )
        user_name = (
            database_session.execute(query_get_firstname).scalar_one().capitalize()
        )
        email_html = email_html.replace("$(user)", user_name)

        image_email = FE_URL.copy().add(path="email_logo.png")
        email_html = email_html.replace("$(image-url)", image_email.url)

        if payload.dev is True:
            recover_url = Furl("http://localhost:3000/", path=FE_RECOVER_PASSWORD.path)
        else:
            recover_url = FE_RECOVER_PASSWORD.copy()

        recover_url = recover_url.add(path=request_token)
        email_html = email_html.replace("$(recover-url)", recover_url.url)

        send_email(
            recipient=user_email,
            subject="Recuperación de Contraseña",
            body=email_html,
        )

        # commit inserted values after all process
        database_session.commit()

    except Exception as err:
        database_session.rollback()
        logger.exception(err)
        raise exceptions.FailedToRequestPasswordRecover


@router.get(
    "/password/confirm-recover",
    status_code=status.HTTP_200_OK,
)
def confirm_password_recover(
    token: str,
    database_session: SessionDataBase,
):
    validate_if_token_is_expired(token)

    encoded_token = token.encode()

    query_where = PassRecoverRequest.request.__eq__(encoded_token)

    # check if token of request exist in db
    statement = select(PassRecoverRequest).where(query_where)
    token_exist = database_session.execute(statement).one_or_none() is not None

    if not token_exist:
        raise exceptions.InvalidTokenException

    # delete request record in db
    try:
        logger.info("removing confirm-recover token from database.")
        statement = delete(PassRecoverRequest).where(query_where)
        database_session.execute(statement)
    except Exception as err:
        database_session.rollback()
        logger.exception(err)
        raise exceptions.FailToConfirmPasswordToken

    database_session.commit()
