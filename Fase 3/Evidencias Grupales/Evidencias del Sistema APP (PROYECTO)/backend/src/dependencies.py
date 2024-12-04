from typing import Annotated
from fastapi import Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import database
from datetime import datetime
from pydantic import WrapSerializer
from fastapi.security import OAuth2PasswordBearer
from pydantic.functional_validators import BeforeValidator

SessionDataBase = Annotated[Session, Depends(database.get_session)]
DatabaseConnectionCheck = Annotated[bool, Depends(database.check_database_connection)]


def format_datetime(value: datetime, _) -> str:
    return value.strftime("%Y-%m-%d %H:%M:%S")


FormattedDatetime = Annotated[
    datetime,
    WrapSerializer(format_datetime, return_type=str),
]

AuthFormData = Annotated[OAuth2PasswordRequestForm, Depends()]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/account/authenticate")
TokenOAuth2 = Annotated[str, Depends(oauth2_scheme)]


def str_id_to_int(v: str) -> int:
    if type(v) is not str:
        raise TypeError(
            "Input is not an string.",
        )

    v = v.strip()

    # is value not numeric or below 0
    if not v.isnumeric():
        raise ValueError(
            f"Input '{v}' contains non-numeric characters and cannot be converted to a number or number is negative.",
        )

    number = int(v)

    # number is more than 20 digits
    if len(v) > 20:
        raise ValueError(
            f"Input number had more than 20 digits. Number: {v}",
        )

    return number


CoercedIntId = Annotated[int, BeforeValidator(str_id_to_int)]


def clean_and_upper_str(value: str | None):
    if value is None:
        return value

    clean_value = value
    # remove spaces
    clean_value = clean_value.strip()
    # transform to uppercase
    clean_value = clean_value.upper()

    return clean_value


def strip_str(value: str | None):
    if value is None:
        return value

    return value.strip()
