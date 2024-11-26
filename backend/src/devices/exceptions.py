from fastapi import status
from fastapi.exceptions import HTTPException

DeviceDoNotExist = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Device do not exist.",
)

DeviceAlreadyAdded = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Cannot add device, device already added",
)

FailToAddDevice = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="Fail to add device.",
)
UserDontOwnDevice = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Device is not registered by user.",
)
FailToRemoveDevice = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="Fail to remove device.",
)
