from fastapi import status
from fastapi.exceptions import HTTPException


FailedToAuthenticate = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid user credentials",
)

InvalidTokenException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid Token",
    headers={"WWW-Authenticate": "Bearer"},
)

UserIsMissingFromDatabase = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="User is missing",
)

UserAlreadyExistCannotRegister = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Cannot register user. User already exist.",
)

NoFieldsSetToModifyUser = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="No fields were set to modify. Invalid Request",
)
UserModificationFailed = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="User couldn't be modified. Internal Error",
)
FailedToChangePassword = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="Password couldn't be changed. Internal Error",
)
FailedToRequestPasswordRecover = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="Failed to request password recovery",
)
FailToConfirmPasswordToken = HTTPException(
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="Failed to confirm password token. Internal Error",
)
