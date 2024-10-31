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
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    detail="User is missing",
)

UserAlreadyExistCannotRegister = HTTPException(
    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    detail="Cannot register user. User already exist.",
)
