from logging import getLogger
from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException
from sqlalchemy import insert, select

from dependencies import SessionDataBase
from models import (
    Comuna,
    Country,
    Device,
    DeviceModel,
    ElectricityCompany,
    Region,
    UserDevice,
)
from utils import schemas

from random import choice
import string

logger = getLogger("utils.router")

router = APIRouter(prefix="/utils", tags=["utils"])


@router.get("/get-countries")
def get_countries(
    database_session: SessionDataBase,
) -> schemas.GetNameAndIdList:
    statement = select(Country)
    rows = database_session.execute(statement).scalars().all()
    countries_as_obj = [country.__dict__ for country in rows]

    return schemas.GetNameAndIdList.model_validate(countries_as_obj)


@router.get("/get-regions")
def get_regions(
    database_session: SessionDataBase,
    country: str,
) -> schemas.GetNameAndIdList:
    statement = select(Region).where(Region.id_country.__eq__(country))
    rows = database_session.execute(statement).scalars().all()
    regions_as_obj = [region.__dict__ for region in rows]

    return schemas.GetNameAndIdList.model_validate(regions_as_obj)


@router.get("/get-comuna")
def get_comuna(
    database_session: SessionDataBase,
    region: str,
) -> schemas.GetNameAndIdList:
    statement = select(Comuna).where(Comuna.id_region.__eq__(region))
    rows = database_session.execute(statement).scalars().all()
    comuna_as_obj = [comuna.__dict__ for comuna in rows]

    return schemas.GetNameAndIdList.model_validate(comuna_as_obj)


@router.get("/get-empresas")
def get_empresas(
    database_session: SessionDataBase,
) -> schemas.GetNameAndIdList:
    statement = select(ElectricityCompany)
    rows = database_session.execute(statement).scalars().all()
    empresas_as_obj = [empresa.__dict__ for empresa in rows]

    return schemas.GetNameAndIdList.model_validate(empresas_as_obj)


@router.get("/get-device-models")
def get_device_models(
    database_session: SessionDataBase,
) -> schemas.GetNameAndIdList:
    statement = select(DeviceModel)
    rows = database_session.execute(statement).scalars().all()
    device_models_as_obj = [device_model.__dict__ for device_model in rows]

    return schemas.GetNameAndIdList.model_validate(device_models_as_obj)


def generate_random_serial_number():
    # collect all lowercase letters and digits
    characters = string.ascii_lowercase + string.digits
    # choice characters
    serial_number = "".join(choice(characters) for _ in range(20))

    return serial_number.lower()


@router.post(
    "/create-random-device",
    status_code=status.HTTP_201_CREATED,
)
def create_random_device(
    database_session: SessionDataBase,
):
    try:
        get_device_model = select(DeviceModel.id)
        device_model_id = database_session.execute(get_device_model).scalars().first()
        if device_model_id is None:
            device_model_id = 1

        # generate random serial number
        serial_number = generate_random_serial_number()

        device_already_exist = False
        while device_already_exist:
            get_device = select(Device.id).where(
                Device.serial_number.__eq__(serial_number)
            )
            device_already_exist = (
                database_session.execute(get_device).one_or_none() is not None
            )
            if not device_already_exist:
                break
            serial_number = generate_random_serial_number()

        # create device
        insert_device = insert(Device).values(
            serial_number=serial_number,
            id_device_model=device_model_id,
        )

        database_session.execute(insert_device)
    except Exception as err:
        database_session.rollback()
        logger.exception(err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Create random device has failed",
        )

    database_session.commit()
    logger.info(f"Device created. serial number: {serial_number}")
    return serial_number


@router.get(
    "/is-device-registered/{serial_number}",
    status_code=status.HTTP_200_OK,
)
def is_device_registered(
    serial_number: str,
    database_session: SessionDataBase,
):
    try:
        get_device_registered = (
            select(UserDevice.id)
            .join(Device)
            .where(Device.serial_number.__eq__(serial_number))
        )
        return database_session.execute(get_device_registered).one_or_none() is not None
    except Exception as err:
        logger.exception(err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something wrong happend...",
        )
