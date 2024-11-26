from datetime import date
from logging import getLogger
from fastapi import APIRouter, status
from sqlalchemy import delete, insert, select

from account.router import does_user_exist, get_user_email_from_token
from account.exceptions import InvalidTokenException
from dependencies import SessionDataBase, TokenOAuth2
from devices import schemas
from devices.exceptions import (
    DeviceAlreadyAdded,
    DeviceDoNotExist,
    FailToAddDevice,
    FailToRemoveDevice,
    UserDontOwnDevice,
)
from models import Device, DeviceModel, User, UserDevice

logger = getLogger("devices.router")

router = APIRouter(prefix="/devices", tags=["devices"])


def do_device_exist(
    serial_numer: str,
    database_session: SessionDataBase,
):
    statement = select(Device).where(Device.serial_number.__eq__(serial_numer))
    return database_session.execute(statement).one_or_none() is not None


def get_device_from_user(
    user_id: int,
    serial_number: str,
    database_session: SessionDataBase,
):
    # get device id
    get_device_id = select(Device.id).where(Device.serial_number.__eq__(serial_number))
    device_id = database_session.execute(get_device_id).scalar_one()

    # get user device
    get_user_device = select(UserDevice).where(
        UserDevice.id_device.__eq__(device_id),
        UserDevice.id_user.__eq__(user_id),
    )

    return database_session.execute(get_user_device).scalar_one_or_none()


def get_device_model_from_device(
    device_id: int,
    database_session: SessionDataBase,
):
    get_device_model = select(Device.id_device_model).where(Device.id.__eq__(device_id))
    device_model_id = database_session.execute(get_device_model).scalar_one()

    get_model_name = select(DeviceModel.name).where(
        DeviceModel.id.__eq__(device_model_id)
    )
    model_name = database_session.execute(get_model_name).scalar_one()

    # capitalize each word
    model_name = model_name.title()
    # replace underscore with space
    model_name = model_name.replace("_", " ")

    return model_name


@router.post(
    "/add",
    status_code=status.HTTP_201_CREATED,
)
def add_device(
    new_device: schemas.AddDevice,
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    # check if user exist
    user_email = get_user_email_from_token(token)
    if not does_user_exist(
        user_email=user_email,
        database_session=database_session,
    ):
        logger.exception(InvalidTokenException)
        raise InvalidTokenException

    # check if device exist
    if not do_device_exist(
        serial_numer=new_device.serial_number,
        database_session=database_session,
    ):
        logger.exception(DeviceDoNotExist)
        raise DeviceDoNotExist

    # get device id
    get_device_id = select(Device.id).where(
        Device.serial_number.__eq__(new_device.serial_number)
    )
    device_id = database_session.execute(get_device_id).scalar_one()

    # check if device has been already added
    get_user_device = select(UserDevice.id).where(
        UserDevice.id_device.__eq__(device_id)
    )
    user_device_has_been_added = database_session.execute(
        get_user_device
    ).scalar_one_or_none()
    if user_device_has_been_added:
        logger.exception(DeviceAlreadyAdded)
        raise DeviceAlreadyAdded

    # get user id
    get_user_id = select(User.id).where(User.email.__eq__(user_email))
    user_id = database_session.execute(get_user_id).scalar_one()

    try:
        creation_date = date.today()
        insert_device = insert(UserDevice).values(
            alias=new_device.alias,
            creation_date=creation_date,
            last_connection=creation_date,
            description=new_device.description,
            id_user=user_id,
            id_device=device_id,
        )
        database_session.execute(insert_device)

    except Exception as err:
        database_session.rollback()
        logger.error("Fail to add device.")
        logger.exception(err)
        raise FailToAddDevice

    database_session.commit()


@router.get(
    "/{serial_number}",
    status_code=status.HTTP_200_OK,
)
def get_device(
    serial_number: str,
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    # check if user exist
    user_email = get_user_email_from_token(token)
    if not does_user_exist(
        user_email=user_email,
        database_session=database_session,
    ):
        logger.exception(InvalidTokenException)
        raise InvalidTokenException

    get_user_id = select(User.id).where(User.email.__eq__(user_email))
    user_id: int = database_session.execute(get_user_id).scalar_one()

    # check if device exist
    if not do_device_exist(
        serial_numer=serial_number,
        database_session=database_session,
    ):
        logger.exception(DeviceDoNotExist)
        raise DeviceDoNotExist

    user_device = get_device_from_user(
        user_id=user_id,
        serial_number=serial_number,
        database_session=database_session,
    )

    # check if user owns device
    if user_device is None:
        logger.exception(UserDontOwnDevice)
        raise UserDontOwnDevice

    model_name = get_device_model_from_device(
        device_id=user_device.id_device,
        database_session=database_session,
    )

    # Capitalize each word if is not None
    alias_name = user_device.alias
    if alias_name is not None:
        alias_name = alias_name.title()

    # return user device info
    return schemas.GetUserDevice(
        alias=alias_name,
        description=user_device.description,
        status=False,
        model=model_name,
        creation_date=user_device.creation_date,
        last_connection=user_device.last_connection,
    )


@router.delete(
    "/{serial_number}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_device(
    serial_number: str,
    token: TokenOAuth2,
    database_session: SessionDataBase,
):
    # check if user exist
    user_email = get_user_email_from_token(token)
    if not does_user_exist(
        user_email=user_email,
        database_session=database_session,
    ):
        logger.exception(InvalidTokenException)
        raise InvalidTokenException

    get_user_id = select(User.id).where(User.email.__eq__(user_email))
    user_id: int = database_session.execute(get_user_id).scalar_one()

    # check if device exist
    if not do_device_exist(
        serial_numer=serial_number,
        database_session=database_session,
    ):
        logger.exception(DeviceDoNotExist)
        raise DeviceDoNotExist

    user_device = get_device_from_user(
        user_id=user_id,
        serial_number=serial_number,
        database_session=database_session,
    )

    # check if user owns device
    if user_device is None:
        logger.exception(UserDontOwnDevice)
        raise UserDontOwnDevice

    try:
        # delete registered device
        remove_user_device = delete(UserDevice).where(
            UserDevice.id.__eq__(user_device.id)
        )
        database_session.execute(remove_user_device)

    except Exception as err:
        database_session.rollback()

        logger.error(f"Fail to remove device from user: {user_email}")
        logger.exception(err)
        raise FailToRemoveDevice

    database_session.commit()
