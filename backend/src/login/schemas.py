# from typing import (
#     Optional,
# )
from pydantic import (
    BaseModel,
    # EmailStr,
    # Field,
    # SecretBytes,
)
# from models import User


class TokenResponse(BaseModel):
    token_type: str = "Bearer"
    access_token: str
    expires_in: int


# class ModifyUser(BaseModel):
#     user_id: bytes = Field(exclude=True)
#
#     # campos de modificaciones
#     nombre: Optional[str] = Field(
#         default=None,
#         strict=False,
#         max_length=255,
#         serialization_alias=User.nombre.key,
#     )
#     apellido: Optional[str] = Field(
#         default=None,
#         strict=False,
#         max_length=255,
#         serialization_alias=User.apellido.key,
#     )
#     numero_telefono: Optional[int] = Field(
#         default=None,
#         strict=False,
#         ge=0,
#         le=99999999999,
#         serialization_alias=User.numero_telefono.key,
#     )
#     codigo_telefono: Optional[str] = Field(
#         default=None,
#         strict=False,
#         max_length=10,
#         serialization_alias=User.codigo_telefono.key,
#     )
#     correo: Optional[EmailStr] = Field(
#         default=None,
#         strict=False,
#         max_length=500,
#         serialization_alias=User.correo.key,
#     )
#     password: Optional[SecretBytes] = Field(
#         default=None,
#         strict=False,
#         max_length=255,
#         serialization_alias=User.password.key,
#     )
