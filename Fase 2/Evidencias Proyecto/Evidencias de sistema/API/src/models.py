from datetime import datetime
from sqlalchemy.dialects.oracle import NUMBER, VARCHAR2, RAW
from sqlalchemy.orm import MappedColumn, mapped_column
from sqlalchemy.orm.properties import ForeignKey
from sqlalchemy.sql.sqltypes import DateTime
from database import Base


class Usuario(Base):
    __tablename__ = "Usuario"

    id: MappedColumn[int] = mapped_column(
        "ID",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    nombre: MappedColumn[str] = mapped_column(
        "Nombre",
        VARCHAR(255),
        nullable=True,
    )
    apellido: MappedColumn[str] = mapped_column(
        "Apellido",
        VARCHAR(255),
        nullable=True,
    )
    numero_telefono: MappedColumn[int] = mapped_column(
        "TelefonoContacto",
        NUMBER(10),
        nullable=True,
    )
    codigo_telefono: MappedColumn[str] = mapped_column(
        "CodigoTelefono",
        VARCHAR(10),
        nullable=True,
    )
    correo: MappedColumn[str] = mapped_column(
        "Correo",
        VARCHAR(500),
        nullable=True,
    )
    password: MappedColumn[bytes] = mapped_column(
        "Password",
        RAW(255),
        nullable=True,
    )


class PassRecoverRequest(Base):
    __tablename__ = "passrecoverrequest"
    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    request: MappedColumn[bytes] = mapped_column(
        "request",
        RAW(255),
        nullable=False,
        unique=True,
    )
    email: MappedColumn[str] = mapped_column(
        "email",
        VARCHAR2(500),
        nullable=False,
    )
    expire_datetime: MappedColumn[datetime] = mapped_column(
        "expiredatetime",
        DateTime(),
        nullable=False,
    )
