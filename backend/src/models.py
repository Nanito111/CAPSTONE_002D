from datetime import datetime
from sqlalchemy.dialects.oracle.types import NUMBER, TIMESTAMP, VARCHAR2, RAW
from sqlalchemy.orm import MappedColumn, mapped_column
from sqlalchemy.orm.properties import ForeignKey
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
        TIMESTAMP,
        nullable=False,
    )


class UserDevice(Base):
    __tablename__ = "userdevice"
    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    alias: MappedColumn[str | None] = MappedColumn(
        "alias",
        VARCHAR2(15),
        nullable=True,
    )
    creation_date: MappedColumn[datetime] = MappedColumn(
        "creationdate",
        TIMESTAMP,
        nullable=False,
    )
    last_connection: MappedColumn[datetime] = MappedColumn(
        "lastconnection",
        TIMESTAMP,
        nullable=False,
    )
    description: MappedColumn[str | None] = MappedColumn(
        "description",
        VARCHAR2(50),
        nullable=True,
    )
    id_user: MappedColumn[int] = mapped_column(
        "iduser",
        NUMBER(20),
        ForeignKey("appuser.id"),
        nullable=False,
    )
    id_device: MappedColumn[int] = mapped_column(
        "iddevice",
        NUMBER(20),
        ForeignKey("device.id"),
        nullable=False,
    )


class Device(Base):
    __tablename__ = "device"
    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    serial_number: MappedColumn[str] = mapped_column(
        "serialnumber",
        VARCHAR2(20),
        nullable=False,
        unique=True,
    )
    id_device_model: MappedColumn[int] = mapped_column(
        "iddevicemodel",
        NUMBER(20),
        ForeignKey("devicemodel.id"),
        nullable=False,
    )


class DeviceModel(Base):
    __tablename__ = "devicemodel"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    name: MappedColumn[str] = mapped_column(
        "name",
        VARCHAR2(30),
        nullable=False,
    )


class ResultConsumption(Base):
    __tablename__ = "result"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    kws: MappedColumn[float] = mapped_column(
        "kws",
        NUMBER(10, 3),
        nullable=True,
    )
    measure_time: MappedColumn[datetime] = mapped_column(
        "measuretime",
        TIMESTAMP,
        nullable=True,
    )
    id_user_device: MappedColumn[int] = mapped_column(
        "iduserdevice",
        NUMBER(20),
        ForeignKey("userdevice.id"),
        nullable=False,
    )
