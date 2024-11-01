from datetime import datetime, timezone
from typing import Annotated, Dict
from fastapi import (
    APIRouter,
    Depends,
    status,
)

from logging import getLogger

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy import insert, select
from account import exceptions
from account import schemas
from dependencies import SessionDataBase, AuthFormData
from models import Address, Comuna, Contract, Country, ElectricityCompany, Region, User
from constants import PWD_CONTEXT, API_SECRET_KEY, API_ALGORITHM, TOKEN_EXPIRATION_DELTA
import jwt
from jwt.exceptions import InvalidTokenError

logger = getLogger("login.router")

router = APIRouter(prefix="/account", tags=["account"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/account/authenticate")
TokenOAuth2 = Annotated[str, Depends(oauth2_scheme)]


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


def get_current_user_from_database(
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    try:
        payload = jwt.decode(
            token, API_SECRET_KEY.get_secret_value(), algorithms=[API_ALGORITHM]
        )

        user_email: str = payload.get("sub")

        # check if user_email is in token
        if user_email is None:
            raise exceptions.InvalidTokenException

    except InvalidTokenError:
        raise exceptions.InvalidTokenException

    # make query to get user
    statement = select(User).where(User.email.__eq__(user_email.upper()))
    user = database_session.execute(statement).scalar_one_or_none()

    if user is None:
        raise exceptions.UserIsMissingFromDatabase

    return database_session.execute(statement).scalar_one_or_none()


def verify_password(
    database_password: bytes,
    raw_password: str,
) -> bool:
    return PWD_CONTEXT.verify(raw_password, database_password)


def generate_access_token(data: Dict):
    # encode user data
    to_encode = data.copy()

    # creates deltatime to expire token
    expire = datetime.now(timezone.utc) + TOKEN_EXPIRATION_DELTA

    to_encode.update({"exp": expire})

    # create token with user data
    encoded_jwt = jwt.encode(
        to_encode,
        API_SECRET_KEY.get_secret_value(),
        algorithm=API_ALGORITHM,
    )
    return encoded_jwt


@router.post(
    path="/authenticate",
    status_code=status.HTTP_202_ACCEPTED,
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
        print("112")
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
        print("130")
        raise exceptions.FailedToAuthenticate

    token = generate_access_token(
        data={
            "sub": form_data.username,
        },
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
        middle_name=data.user.middle_name,
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
