from datetime import datetime
from sqlalchemy.dialects.oracle.types import NUMBER, TIMESTAMP, VARCHAR2, RAW
from sqlalchemy.orm import MappedColumn, mapped_column
from sqlalchemy.orm.properties import ForeignKey
from database import Base


class User(Base):
    __tablename__ = "appuser"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    first_name: MappedColumn[str] = mapped_column(
        "firstname",
        VARCHAR2(20),
        nullable=True,
    )
    last_name: MappedColumn[str] = mapped_column(
        "lastname",
        VARCHAR2(12),
        nullable=True,
    )
    second_last_name: MappedColumn[str] = mapped_column(
        "secondlastname",
        VARCHAR2(12),
        nullable=True,
    )
    phone_number: MappedColumn[int] = mapped_column(
        "numberphone",
        NUMBER(9),
        nullable=True,
    )
    country_code: MappedColumn[str] = mapped_column(
        "countrycode",
        VARCHAR2(3),
        nullable=True,
    )
    email: MappedColumn[str] = mapped_column(
        "email",
        VARCHAR2(500),
        nullable=False,
    )
    password: MappedColumn[bytes] = mapped_column(
        "password",
        RAW(255),
        nullable=False,
    )
    id_address: MappedColumn[int] = mapped_column(
        "idaddress",
        NUMBER(20),
        ForeignKey("address.id"),
        nullable=False,
    )
    id_contract: MappedColumn[int] = mapped_column(
        "idcontract",
        NUMBER(20),
        ForeignKey("contract.id"),
        nullable=False,
    )


class Address(Base):
    __tablename__ = "address"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    street_name: MappedColumn[str] = mapped_column(
        "streetname",
        VARCHAR2(100),
        nullable=False,
    )
    street_number: MappedColumn[str] = mapped_column(
        "streetnumber",
        VARCHAR2(50),
        nullable=False,
    )
    id_comuna: MappedColumn[int] = mapped_column(
        "idcomuna",
        NUMBER(20),
        ForeignKey("comuna.id"),
        nullable=False,
    )


class Comuna(Base):
    __tablename__ = "comuna"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    name: MappedColumn[str] = mapped_column(
        "name",
        VARCHAR2(20),
        nullable=False,
    )
    id_region: MappedColumn[int] = mapped_column(
        "idregion",
        NUMBER(20),
        ForeignKey("region.id"),
        nullable=False,
    )


class Region(Base):
    __tablename__ = "region"
    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    name: MappedColumn[str] = mapped_column(
        "name",
        VARCHAR2(20),
        nullable=False,
    )
    id_country: MappedColumn[int] = mapped_column(
        "idcountry",
        NUMBER(20),
        ForeignKey("country.id"),
        nullable=False,
    )


class Country(Base):
    __tablename__ = "country"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    name: MappedColumn[str] = mapped_column(
        "name",
        VARCHAR2(20),
        nullable=False,
    )


class Contract(Base):
    __tablename__ = "contract"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    service_admin_cost: MappedColumn[int] = mapped_column(
        "serviceadmincost",
        NUMBER(10),
        nullable=False,
    )
    transport_cost: MappedColumn[int] = mapped_column(
        "transportcost",
        NUMBER(10),
        nullable=False,
    )
    electricity_cost: MappedColumn[int] = mapped_column(
        "electricitycost",
        NUMBER(10),
        nullable=False,
    )
    id_electricity_company: MappedColumn[int] = mapped_column(
        "idelectricitycompany",
        NUMBER(20),
        ForeignKey("electricitycompany.id"),
        nullable=False,
    )


class ElectricityCompany(Base):
    __tablename__ = "electricitycompany"

    id: MappedColumn[int] = mapped_column(
        "id",
        NUMBER(20),
        nullable=False,
        primary_key=True,
    )
    name: MappedColumn[str] = mapped_column(
        "name",
        VARCHAR2(40),
        nullable=False,
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
