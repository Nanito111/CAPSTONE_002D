from datetime import date
from typing import Optional
from pydantic import (
    BaseModel,
    Field,
    field_validator,
)

from dependencies import strip_str

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
    creation_date: date
    last_connection: date
