from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
import database
from datetime import datetime
from pydantic import WrapSerializer

SessionDataBase = Annotated[Session, Depends(database.get_session)]
DatabaseConnectionCheck = Annotated[bool, Depends(database.check_database_connection)]


def format_datetime(value: datetime, _) -> str:
    return value.strftime("%Y-%m-%d %H:%M:%S")


FormattedDatetime = Annotated[
    datetime,
    WrapSerializer(format_datetime, return_type=str),
]
