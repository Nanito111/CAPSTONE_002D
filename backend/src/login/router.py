from datetime import datetime, timezone
from typing import Annotated, Dict
from fastapi import (
    APIRouter,
    Depends,
)
import logging

from fastapi.security import OAuth2PasswordBearer

from sqlalchemy import select
from login import exceptions
from login.schemas import TokenResponse
from dependencies import SessionDataBase, AuthFormData
from models import User
from constants import PWD_CONTEXT, API_SECRET_KEY, API_ALGORITHM, TOKEN_EXPIRATION_DELTA
import jwt
from jwt.exceptions import InvalidTokenError

logger = logging.getLogger("login.router")

router = APIRouter(prefix="/account", tags=["login"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/account/authenticate")


def does_user_exist(
    user_email: str,
    database_session: SessionDataBase,
):
    statement = select(User).where(User.email.__eq__(user_email))

    return database_session.execute(statement).one_or_none() is not None


def get_password_from_database(
    user_email: str,
    database_session: SessionDataBase,
):
    statement = select(User.password).where(User.email.__eq__(user_email))
    return database_session.execute(statement).scalar_one()


def get_current_user_from_database(
    token: Annotated[str, Depends(oauth2_scheme)],
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
    statement = select(User).where(User.email.__eq__(user_email))
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


@router.post(path="/authenticate", tags=["login"])
def authenticate(
    form_data: AuthFormData,
    database_session: SessionDataBase,
):
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

    token = generate_access_token(
        data={
            "sub": form_data.username,
        },
    )

    return TokenResponse(access_token=token, expires_in=TOKEN_EXPIRATION_DELTA.seconds)
