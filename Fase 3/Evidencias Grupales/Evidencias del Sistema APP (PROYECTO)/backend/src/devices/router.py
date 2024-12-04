from datetime import datetime, timedelta, timezone
from dateutil.relativedelta import relativedelta
from logging import getLogger
from typing import Annotated
from fastapi import APIRouter, Query, status
from sqlalchemy import delete, extract, insert, select, update, func

from account.router import does_user_exist, get_user_email_from_token
from account.exceptions import InvalidTokenException
from dependencies import SessionDataBase, TokenOAuth2
from devices import schemas
from devices.exceptions import (
    DeviceAlreadyAdded,
    DeviceDoNotExist,
    FailToAddDevice,
    FailToGetAllUserDevices,
    FailToGetConsumptionData,
    FailToModifyDevice,
    FailToRemoveDevice,
    NoDeviceFieldsToSet,
    UserDontOwnDevice,
)
from models import Device, DeviceModel, ResultConsumption, User, UserDevice

logger = getLogger("devices.router")

router = APIRouter(prefix="/devices", tags=["devices"])


def do_device_exist(
    serial_number: str,
    database_session: SessionDataBase,
):
    statement = select(Device).where(Device.serial_number.__eq__(serial_number))
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


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
)
def get_all_devices(
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

    try:
        get_all_user_devices = (
            select(Device.serial_number)
            .join(UserDevice)
            .where(UserDevice.id_user.__eq__(user_id))
        )
        user_devices = schemas.GetAllUserDevices.model_validate(
            database_session.execute(get_all_user_devices).scalars().all()
        )
        return user_devices

    except Exception as err:
        logger.error(f"Fail to get all user devices. User {user_email}")
        logger.exception(err)
        raise FailToGetAllUserDevices


@router.get(
    "/consumption",
    status_code=status.HTTP_200_OK,
)
def get_all_devices_consumption(
    filter: Annotated[schemas.ConsumptionFilter, Query()],
    token: TokenOAuth2,
    database_session: SessionDataBase,
) -> schemas.ConsumptionInTimeRange:
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

    try:
        # get range time
        current_time = datetime.now(timezone.utc)
        if filter.type == schemas.RangeTypes.HOUR:
            old_time = current_time - timedelta(hours=filter.range)
        else:
            old_time = current_time - relativedelta(months=filter.range)

        logger.info(
            f"Getting consumption data from {old_time} to {current_time}. User {user_email}"
        )

        extract_expression = extract(
            filter.type.value, ResultConsumption.measure_time
        ).label("time")
        get_consumption_data = (
            select(
                # extract type of range (hour or month)
                extract_expression,
                func.sum(ResultConsumption.kws).label("total"),
                func.avg(ResultConsumption.kws).label("avg"),
                func.min(ResultConsumption.kws).label("min"),
                func.max(ResultConsumption.kws).label("max"),
            )
            .join(UserDevice)
            .where(
                UserDevice.id_user.__eq__(user_id),
                ResultConsumption.id_user_device.__eq__(UserDevice.id),
                ResultConsumption.measure_time.between(old_time, current_time),
            )
            .group_by(extract_expression)
            .order_by(extract_expression.asc())
        )
        result_query = database_session.execute(get_consumption_data).scalars().all()

    except Exception as err:
        logger.error("Fail to get consumption data.")
        logger.exception(err)
        raise FailToGetConsumptionData

    return schemas.ConsumptionInTimeRange(result_query)


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
        serial_number=new_device.serial_number,
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
        creation_date = datetime.now(timezone.utc)
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
        serial_number=serial_number,
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
        serial_number=serial_number,
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


@router.put(
    "/{serial_number}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def modify_device(
    serial_number: str,
    payload: schemas.ModifyUserDevice,
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

    # check if payload is empty
    if payload.model_fields_set.__len__() <= 0:
        logger.exception(NoDeviceFieldsToSet)
        raise NoDeviceFieldsToSet

    modifications = payload.model_dump(
        by_alias=True,
        exclude_unset=True,
    )

    # check if device exist
    if not do_device_exist(
        serial_number=serial_number,
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
        logger.info(f"Modifying device. User {user_email} | Device {serial_number}")
        modify_user_device = (
            update(UserDevice)
            .where(UserDevice.id.__eq__(user_device.id))
            .values(modifications)
        )
        database_session.execute(modify_user_device)

    except Exception as err:
        database_session.rollback()
        logger.error(
            f"Fail to modify device. User {user_email} | Device {serial_number}"
        )
        logger.exception(err)
        raise FailToModifyDevice

    database_session.commit()
    logger.info(f"Device has been modified. User {user_email} | Device {serial_number}")


@router.get(
    "/{serial_number}/consumption",
    status_code=status.HTTP_200_OK,
)
def get_device_consumption(
    serial_number: str,
    filter: Annotated[schemas.ConsumptionFilter, Query()],
    token: TokenOAuth2,
    database_session: SessionDataBase,
) -> schemas.ConsumptionInTimeRange:
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
        serial_number=serial_number,
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

    # get result consumption
    try:
        current_time = datetime.now(timezone.utc)
        if filter.type == schemas.RangeTypes.HOUR:
            old_time = current_time - timedelta(hours=filter.range)
        else:
            old_time = current_time - relativedelta(months=filter.range)

        logger.info(
            f"Getting consumption data from {old_time} to {current_time} | device: {serial_number}"
        )

        extract_expression = extract(
            filter.type.value, ResultConsumption.measure_time
        ).label("time")
        get_consumption_data = (
            select(
                # extract type of range (hour or month)
                extract_expression,
                func.sum(ResultConsumption.kws).label("total"),
                func.avg(ResultConsumption.kws).label("avg"),
                func.min(ResultConsumption.kws).label("min"),
                func.max(ResultConsumption.kws).label("max"),
            )
            .where(
                ResultConsumption.id_user_device.__eq__(user_device.id),
                ResultConsumption.measure_time.between(old_time, current_time),
            )
            .group_by(extract_expression)
            .order_by(extract_expression.asc())
        )
        result_query = database_session.execute(get_consumption_data).scalars().all()

    except Exception as err:
        logger.error("Fail to get consumption data.")
        logger.exception(err)
        raise FailToGetConsumptionData

    return schemas.ConsumptionInTimeRange(result_query)
