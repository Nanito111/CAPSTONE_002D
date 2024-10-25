from sqlalchemy.dialects.oracle import NUMBER, VARCHAR2, RAW
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
    middle_name: MappedColumn[str] = mapped_column(
        "middlename",
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
    address_id: MappedColumn[int] = mapped_column(
        "idaddress",
        NUMBER(20),
        ForeignKey("address.id"),
        nullable=False,
    )
    contract_id: MappedColumn[int] = mapped_column(
        "idcontract",
        NUMBER(20),
        ForeignKey("contract.id"),
        nullable=False,
    )
