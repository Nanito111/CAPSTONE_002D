from datetime import datetime
from typing import List, Optional
from pydantic import (
    BaseModel,
    Field,
    RootModel,
    field_validator,
)

from dependencies import strip_str
from models import UserDevice

NAME_PATTERN = r"^[a-zA-ZÀ-ÿ\s]+$"


class AddDevice(BaseModel):
    serial_number: str = Field(
        min_length=20,
        max_length=20,
        pattern=r"^[a-z0-9]{20}$",
    )
    alias: Optional[str] = Field(
        default=None,
        max_length=15,
        pattern=NAME_PATTERN,
        description="Nombre personalizado del dispositivo.",
    )
    description: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    _strip_str = field_validator(
        "serial_number",
        "alias",
        mode="after",
    )(strip_str)


class GetUserDevice(BaseModel):
    alias: Optional[str] = Field(
        default=None,
        description="Nombre personalizado del dispositivo.",
    )
    description: Optional[str] = Field(
        default=None,
    )
    status: bool = Field(
        default=False,
        description="Estado de conexion del dispositivo, True para cuando esta conectado, False para cuando no.",
    )
    model: str = Field(
        description="Nombre del modelo del dispositivo.",
    )
    creation_date: datetime
    last_connection: datetime


class ModifyUserDevice(BaseModel):
    alias: Optional[str] = Field(
        default=None,
        strict=False,
        max_length=15,
        pattern=NAME_PATTERN,
        description="Nombre personalizado del dispositivo.",
        serialization_alias=UserDevice.alias.key,
    )
    description: Optional[str] = Field(
        default=None,
        strict=False,
        max_length=50,
        serialization_alias=UserDevice.description.key,
    )

    _strip_str = field_validator(
        "alias",
        mode="after",
    )(strip_str)


class GetAllUserDevices(RootModel):
    root: List[str]
