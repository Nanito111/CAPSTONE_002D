from typing import Any
from fastapi import (
    APIRouter,
    Response,
    status,
)
import logging

from fastapi.exceptions import (
    ValidationException,
    RequestValidationError,
)
from pydantic import SecretBytes, ValidationError

from sqlalchemy import delete, insert, select, update
from sqlalchemy.exc import MultipleResultsFound
from dependencies import SessionDataBase
from login import schemas
import models
from constants import API_ENCRYPTION_KEY
from hashlib import sha256
from cryptography.fernet import Fernet

logger = logging.getLogger("login.router")

router = APIRouter(prefix="/login", tags=["login"])


@router.post(
    "/comprobar-credenciales",
    tags=["login"],
    status_code=status.HTTP_200_OK,
)
def comprobar_credenciales(
    credenciales: schemas.Credenciales,
    session_db: SessionDataBase,
    response: Response,
) -> schemas.LoginResultado:
    try:
        statement = select(models.Usuario).where(
            models.Usuario.correo.__eq__(credenciales.email)
        )

        user_db = session_db.execute(statement).scalar_one_or_none()

        # usuario no existe
        if user_db is None:
            logger.warning("El usuario no existe.")
            return schemas.LoginResultado()

        password_db: bytes = user_db.password

        # decrypt db password
        fernet_encrypter: Fernet = Fernet(API_ENCRYPTION_KEY)
        password_db = fernet_encrypter.decrypt(password_db)

        # hash input password SHA-256
        input_password: bytes = sha256(
            credenciales.password.get_secret_value()
        ).digest()

        if password_db != input_password:
            logger.warning("Password incorrecta.")
            return schemas.LoginResultado()

        # encrypt user id
        encoded_user_id: bytes = str(user_db.id).encode()
        user_id_encrypted: bytes = fernet_encrypter.encrypt(encoded_user_id)

        return schemas.LoginResultado(
            user_id=user_id_encrypted,
            user=user_db.correo,
            nombre=user_db.nombre,
            apellido=user_db.apellido,
            numero_telefono=user_db.numero_telefono.__str__(),
            codigo_telefono=user_db.codigo_telefono.__str__(),
            result=True,
        )

    except (ValidationError, ValidationException, RequestValidationError) as err:
        response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
        logger.exception(err)
        return schemas.LoginResultado()

    except MultipleResultsFound as err:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        logger.exception(err)
        return schemas.LoginResultado()

    except Exception as err:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        logger.exception(err)
        return schemas.LoginResultado()


@router.post(
    "/crear-cuenta",
    tags=["login", "crud"],
    status_code=status.HTTP_201_CREATED,
)
def crear_cuenta(
    datos_cuenta: schemas.DatosCuenta,
    session_db: SessionDataBase,
    response: Response,
) -> str | None:
    try:
        # hashear
        password_with_salt: bytes = sha256(
            datos_cuenta.password.get_secret_value()
        ).digest()

        # encriptar
        fernet_encrypter: Fernet = Fernet(API_ENCRYPTION_KEY)

        password_with_salt = fernet_encrypter.encrypt(password_with_salt)

        datos_cuenta.password = SecretBytes(password_with_salt)

        # check if user already exist
        statement = select(models.Usuario).where(
            models.Usuario.correo.__eq__(datos_cuenta.correo)
        )

        user_exist: bool = session_db.execute(statement).one_or_none() is not None

        if user_exist:
            logger.warning(
                "Usuario no fue creado por que ya existe. user: %s",
                datos_cuenta.correo,
            )
            response.status_code = status.HTTP_409_CONFLICT
            return "Usuario ya existe."

        # send data to DB
        statement = insert(models.Usuario).values(
            nombre=datos_cuenta.nombre,
            apellido=datos_cuenta.apellido,
            numero_telefono=datos_cuenta.numero_telefono,
            codigo_telefono=datos_cuenta.codigo_telefono,
            correo=datos_cuenta.correo,
            password=datos_cuenta.password.get_secret_value(),
        )
        session_db.execute(statement)
        session_db.commit()

        return "Usuario creado exitosamente"

    except Exception as err:
        logger.exception(err)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return


@router.patch(
    "/modificar-usuario",
    tags=["login", "crud"],
    status_code=status.HTTP_204_NO_CONTENT,
)
def modificar_usuario(
    modificacion_body: schemas.ModifyUser,
    session_db: SessionDataBase,
    response: Response,
) -> None:
    try:
        # crea un diccionario excluyendo los campos que no estan modificados
        modificaciones: dict[str, Any] = modificacion_body.model_dump(
            exclude_unset=True,
            by_alias=True,
        )

        # Error si no hay modificaciones
        if modificaciones.__len__() <= 0:
            logger.warning(
                "Modificacion fallida ya que la solicitud no tiene campos para modificar.",
            )
            response.status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
            return

        fernet_encrypter: Fernet = Fernet(API_ENCRYPTION_KEY)

        # comprobar si usuario existe

        id_usuario_decrypted: int = int(
            fernet_encrypter.decrypt(modificacion_body.user_id).decode()
        )

        statement = select(
            models.Usuario.id,
        ).where(
            models.Usuario.id.__eq__(id_usuario_decrypted),
        )

        user_not_exist: bool = session_db.execute(statement).one_or_none() is None

        if user_not_exist:
            logger.warning(
                "Modificacion de usuario fallida debido a que el usuario no existe.",
            )
            response.status_code = status.HTTP_404_NOT_FOUND
            return

        logger.info(
            "Campos de Usuario a modificar: %s",
            list(modificaciones.keys()),
        )

        # encriptar password si modificacion existe
        password_db_column = models.Usuario.password.key
        if modificaciones.get(password_db_column) is not None:
            # hashear
            password_with_salt: bytes = sha256(
                modificaciones[password_db_column].get_secret_value()
            ).digest()

            password_with_salt = fernet_encrypter.encrypt(password_with_salt)

            modificaciones[password_db_column] = password_with_salt

        # validar que el nuevo correo no existe en otro usuario
        correo_db_column = models.Usuario.correo.key
        if modificaciones.get(correo_db_column) is not None:
            statement = select(
                models.Usuario.id,
            ).where(
                models.Usuario.correo.__eq__(
                    modificaciones[correo_db_column],
                ),
            )
            user_exist: bool = session_db.execute(statement).one_or_none() is not None
            if user_exist:
                logger.warning(
                    "Modificacion de usuario fallida debido a que hay un usuario con el mismo correo.",
                )
                response.status_code = status.HTTP_409_CONFLICT

                return

        # modificar registros en bd
        statement = (
            update(
                models.Usuario,
            )
            .where(
                models.Usuario.id.__eq__(id_usuario_decrypted),
            )
            .values(
                modificaciones,
            )
        )
        session_db.execute(statement)
        session_db.commit()

        return

    except Exception as err:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        logger.exception(err)

        return


@router.delete(
    "/eliminar-usuario",
    tags=["login", "crud"],
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_usuario(
    user_to_delete: schemas.DeleteUser,
    session_db: SessionDataBase,
    response: Response,
) -> None:
    try:
        fernet_encrypter: Fernet = Fernet(API_ENCRYPTION_KEY)

        # desencriptar id
        id_usuario_decrypted: int = int(
            fernet_encrypter.decrypt(user_to_delete.user_id).decode()
        )

        statement = select(
            models.Usuario.id,
        ).where(
            models.Usuario.id.__eq__(id_usuario_decrypted),
        )

        user_not_exist: bool = session_db.execute(statement).one_or_none() is None

        if user_not_exist:
            logger.warning(
                "Eliminación de usuario fallida debido a que el usuario no existe.",
            )
            response.status_code = status.HTTP_404_NOT_FOUND

            return

        # eliminar usuario de bd
        statement = delete(
            models.Usuario,
        ).where(
            models.Usuario.id.__eq__(id_usuario_decrypted),
        )

        session_db.execute(statement)
        session_db.commit()

        return

    except MultipleResultsFound as err:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        logger.exception(err)
        return

    except Exception as err:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        logger.exception(err)
        return
