from typing import Optional
from pydantic import (
    BaseModel,
    Field,
    field_validator,
)

from dependencies import clean_and_upper_str, strip_str
# from models import User as UserDB, Contract as ContractDB, Address as AddressDB

NAME_PATTERN = r"^[a-zA-ZÀ-ÿ\s]+$"


class AddDevice(BaseModel):
    serial_number: str = Field(
        min_length=20,
        max_length=20,
        pattern=r"^[A-Z0-9]{20}$",
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

    _clean_upper_str = field_validator(
        "serial_number",
        mode="after",
    )(clean_and_upper_str)

    _strip_str = field_validator(
        "alias",
        mode="after",
    )(strip_str)
