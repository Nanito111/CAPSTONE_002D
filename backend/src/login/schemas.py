from typing import (
    Optional,
)
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    SecretBytes,
)
from models import Usuario


class Credenciales(BaseModel):
    email: EmailStr
    password: SecretBytes


class LoginResultado(BaseModel):
    user_id: Optional[bytes] = None
    user: Optional[str] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    numero_telefono: Optional[str] = None
    codigo_telefono: Optional[str] = None
    result: bool = False


class DatosCuenta(BaseModel):
    nombre: str = Field(max_length=255)
    apellido: str = Field(max_length=255)
    numero_telefono: int = Field(ge=0, le=99999999999)
    codigo_telefono: str = Field(max_length=10)
    correo: EmailStr = Field(max_length=500)
    password: SecretBytes = Field(max_length=255)


class ModifyUser(BaseModel):
    user_id: bytes = Field(exclude=True)

    # campos de modificaciones
    nombre: Optional[str] = Field(
        default=None,
        strict=False,
        max_length=255,
        serialization_alias=Usuario.nombre.key,
    )
    apellido: Optional[str] = Field(
        default=None,
        strict=False,
        max_length=255,
        serialization_alias=Usuario.apellido.key,
    )
    numero_telefono: Optional[int] = Field(
        default=None,
        strict=False,
        ge=0,
        le=99999999999,
        serialization_alias=Usuario.numero_telefono.key,
    )
    codigo_telefono: Optional[str] = Field(
        default=None,
        strict=False,
        max_length=10,
        serialization_alias=Usuario.codigo_telefono.key,
    )
    correo: Optional[EmailStr] = Field(
        default=None,
        strict=False,
        max_length=500,
        serialization_alias=Usuario.correo.key,
    )
    password: Optional[SecretBytes] = Field(
        default=None,
        strict=False,
        max_length=255,
        serialization_alias=Usuario.password.key,
    )


class DeleteUser(BaseModel):
    user_id: bytes
