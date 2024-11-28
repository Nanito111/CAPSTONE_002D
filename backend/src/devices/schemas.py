from enum import Enum
from datetime import datetime
from typing import List, Optional, Sequence
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


class RangeTypes(str, Enum):
    HOUR = "hour"
    MONTH = "month"


class ConsumptionFilter(BaseModel):
    type: RangeTypes
    range: int

    @field_validator("range", mode="after")
    @classmethod
    def validate_range(cls, value: int, info):
        detail: str = (
            "Range value must be beetween {valid_range}. Input value: {input_range}"
        )

        type_value = info.data.get("type")

        if type_value == RangeTypes.HOUR and (value < 1 or value > 24):
            detail = detail.format(valid_range="1-24", input_range=value)
            raise ValueError(detail)

        elif type_value == RangeTypes.MONTH and (value < 1 or value > 12):
            detail = detail.format(valid_range="1-12", input_range=value)
            raise ValueError(detail)
        else:
            return value


class ConsumptionInTimeUnit(BaseModel):
    time: int = Field(
        description="Campo que señala la hora o mes (en número) del registro de consumo."
    )
    total: float = Field(
        description="Total de consumo del dispositivo en Kilo watts/Horas"
    )
    avg: float = Field(
        description="Promedio de consumo del dispositivo en Kilo watts/Horas"
    )
    min: float = Field(
        description="Valor minimo de consumo del dispositivo en Kilo watts/Horas"
    )
    max: float = Field(
        description="Valor maximo de consumo del dispositivo en Kilo watts/Horas"
    )


class ConsumptionInTimeRange(RootModel):
    root: Sequence[ConsumptionInTimeUnit]
