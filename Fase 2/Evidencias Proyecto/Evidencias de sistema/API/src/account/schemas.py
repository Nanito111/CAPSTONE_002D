import re
from typing import Annotated
from pydantic import (
    BaseModel,
    Field,
    PositiveInt,
    EmailStr,
    SecretStr,
)
from pydantic.functional_validators import BeforeValidator, field_validator
from models import User as UserDB, Contract as ContractDB, Address as AddressDB


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


def clean_strings(value: str) -> str:
    clean_value = value
    # remove spaces
    clean_value = clean_value.strip()
    # transform to uppercase
    clean_value = clean_value.upper()

    return clean_value


def validate_password(value: SecretStr) -> SecretStr:
    def check(pattern, error_msg):
        if re.search(pattern, value.get_secret_value()) is None:
            raise ValueError(f"Invalid Password: {error_msg}")

    check(r"[a-z]", "missing lowercase letters")
    check(r"[A-Z]", "missing uppercase letters")
    check(r"[0-9]", "missing number characters")
    check(r"[^a-zA-Z0-9]", "missing symbols")

    return value


class TokenResponse(BaseModel):
    token_type: str = "Bearer"
    access_token: str
    expires_in: int


NAME_PATTERN = r"^[a-zA-ZÀ-ÿ\s]+$"


class UserRegistro(BaseModel):
    first_name: str = Field(
        max_length=20,
        pattern=NAME_PATTERN,
        description="Nombre de pila del usuario.",
    )
    last_name: str = Field(
        max_length=20,
        pattern=NAME_PATTERN,
        description="Apellido del usuario.",
    )
    second_last_name: str = Field(
        max_length=20,
        pattern=NAME_PATTERN,
        description="Segundo apellido del usuario.",
    )
    phone_number: PositiveInt = Field(
        le=999999999,
        description="Número de teléfono del usuario.",
    )
    country_code: str = Field(
        max_length=3,
        description="Código del país en el que reside el usuario.",
    )
    email: EmailStr = Field(
        max_length=500,
        description="Dirección de correo electrónico del usuario.",
    )
    password: SecretStr = Field(
        min_length=8,
        max_length=255,
        description="Contraseña del usuario.",
    )
    _validate_password = field_validator(
        "password",
        mode="after",
    )(validate_password)

    _clean_str = field_validator(
        "first_name",
        "last_name",
        "second_last_name",
        "country_code",
        "email",
        mode="after",
    )(clean_strings)


class AddressRegistro(BaseModel):
    street_name: str = Field(
        max_length=100,
        description="Nombre de la calle.",
    )
    street_number: str = Field(
        max_length=50,
        description="Numero de la calle/domicilio.",
    )
    comuna: CoercedIntId = Field(
        description="Id en base de datos de la comuna.",
    )

    _clean_str = field_validator(
        "street_name",
        "street_number",
        mode="after",
    )(clean_strings)


class ContractRegistro(BaseModel):
    electricity_company: CoercedIntId = Field(
        description="Id en base de datos de la compañía electrica del usuario.",
    )
    service_administration_cost: int = Field(
        description="Costo por administración del servicio.",
        ge=0,
    )
    transport_cost: int = Field(
        description="Costo de transporte de electricidad por 1 kWh, obtenida del costo total de transporte de electricidad dividido por total consumido de kWh.",
        ge=0,
    )
    electricity_cost: int = Field(
        description="Costo de 1 kWh, obtenida del costo total de electricidad dividido por total consumido de kWh.",
        ge=0,
    )


class RegistroData(BaseModel):
    user: UserRegistro
    address: AddressRegistro
    contract: ContractRegistro


class GetUser(BaseModel):
    class User(BaseModel):
        first_name: str
        last_name: str
        second_last_name: str
        phone_number: int
        country_code: str
        email: str

    class Address(BaseModel):
        street_name: str
        street_number: str
        comuna: str
        region: str
        country: str

    class Contract(BaseModel):
        electricity_company: str
        service_administration_cost: int
        transport_cost: int
        electricity_cost: int

    user: User
    address: Address
    contract: Contract


class UserModificar(BaseModel):
    first_name: str = Field(
        default=None,
        strict=False,
        max_length=20,
        pattern=NAME_PATTERN,
        description="Nombre de pila del usuario.",
        serialization_alias=UserDB.first_name.key,
    )
    last_name: str = Field(
        default=None,
        strict=False,
        max_length=20,
        pattern=NAME_PATTERN,
        description="Apellido del usuario.",
        serialization_alias=UserDB.last_name.key,
    )
    second_last_name: str = Field(
        default=None,
        strict=False,
        max_length=20,
        pattern=NAME_PATTERN,
        description="Segundo apellido del usuario.",
        serialization_alias=UserDB.second_last_name.key,
    )
    phone_number: PositiveInt = Field(
        default=None,
        strict=False,
        le=999999999,
        description="Número de teléfono del usuario.",
        serialization_alias=UserDB.phone_number.key,
    )
    country_code: str = Field(
        default=None,
        strict=False,
        max_length=3,
        description="Código del país en el que reside el usuario.",
        serialization_alias=UserDB.country_code.key,
    )
    _clean_str = field_validator(
        "first_name",
        "last_name",
        "second_last_name",
        "country_code",
        mode="after",
    )(clean_strings)


class AddressModificar(BaseModel):
    street_name: str = Field(
        default=None,
        strict=False,
        max_length=100,
        description="Nombre de la calle.",
        serialization_alias=AddressDB.street_name.key,
    )
    street_number: str = Field(
        default=None,
        strict=False,
        max_length=50,
        description="Numero de la calle/domicilio.",
        serialization_alias=AddressDB.street_number.key,
    )
    comuna: CoercedIntId = Field(
        default=None,
        strict=False,
        description="Id en base de datos de la comuna.",
        serialization_alias=AddressDB.id_comuna.key,
    )

    _clean_str = field_validator(
        "street_name",
        "street_number",
        mode="after",
    )(clean_strings)


class ContractModificar(BaseModel):
    electricity_company: CoercedIntId = Field(
        default=None,
        strict=False,
        description="Id en base de datos de la compañía electrica del usuario.",
        serialization_alias=ContractDB.id_electricity_company.key,
    )
    service_administration_cost: int = Field(
        default=None,
        strict=False,
        description="Costo por administración del servicio.",
        ge=0,
        serialization_alias=ContractDB.service_admin_cost.key,
    )
    transport_cost: int = Field(
        default=None,
        strict=False,
        description="Costo de transporte de electricidad por 1 kWh, obtenida del costo total de transporte de electricidad dividido por total consumido de kWh.",
        ge=0,
        serialization_alias=ContractDB.transport_cost.key,
    )
    electricity_cost: int = Field(
        default=None,
        strict=False,
        description="Costo de 1 kWh, obtenida del costo total de electricidad dividido por total consumido de kWh.",
        ge=0,
        serialization_alias=ContractDB.electricity_cost.key,
    )


class ModificarData(BaseModel):
    user: UserModificar | None = Field(
        default=None,
        strict=False,
    )
    address: AddressModificar | None = Field(
        default=None,
        strict=False,
    )
    contract: ContractModificar | None = Field(
        default=None,
        strict=False,
    )


class PasswordChange(BaseModel):
    new_password: SecretStr = Field(
        min_length=8,
        max_length=255,
        description="Nueva contraseña del usuario.",
    )
    _validate_password = field_validator(
        "new_password",
        mode="after",
    )(validate_password)


class RecoverPassword(BaseModel):
    email: EmailStr = Field(
        max_length=500,
        description="Dirección de correo electrónico del usuario.",
    )
    dev: bool = Field(False, strict=False)

    _clean_str = field_validator(
        "email",
        mode="after",
    )(clean_strings)
