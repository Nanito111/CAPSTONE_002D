from datetime import date
from logging import getLogger
from fastapi import APIRouter, status
from sqlalchemy import insert, select

from account.router import does_user_exist, get_user_email_from_token
from account.exceptions import InvalidTokenException
from dependencies import SessionDataBase, TokenOAuth2
from devices import schemas
from devices.exceptions import DeviceAlreadyAdded, DeviceDoNotExist, FailToAddDevice
from models import Device, User, UserDevice

logger = getLogger("devices.router")

router = APIRouter(prefix="/devices", tags=["devices"])


def do_device_exist(
    serial_numer: str,
    database_session: SessionDataBase,
):
    statement = select(Device).where(Device.serial_number.__eq__(serial_numer))
    return database_session.execute(statement).one_or_none() is not None


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
