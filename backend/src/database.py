import sqlalchemy
from sqlalchemy.orm import Session, declarative_base

import logging

import constants

logger = logging.getLogger(__name__)


def check_database_connection():
    """
    Comprueba la conexion a la base de datos. Retonar True si la conexion fue exitosa, de lo contrario False.
    """

    engine = create_engine()

    # check database connection
    try:

        logger.info("Comprobando conexion a base de datos.")
        test_connection = engine.connect()
        logger.info("Conexion a base de datos OK.")
        test_connection.close()

        engine.dispose()

        return True

    except Exception as err:
        logger.exception(err)

        engine.dispose()

        return False


def create_engine():
    """
    Crea motor de base de datos y lo retorna.
    """

    # Help references https://medium.com/oracledevs/using-the-development-branch-of-sqlalchemy-2-0-with-python-oracledb-d6e89090899c

    engine = sqlalchemy.create_engine(
        "oracle+oracledb://:@",
        connect_args={
            "user": constants.DB_USER,
            "password": constants.DB_PASSWORD.get_secret_value(),
            "dsn": constants.DB_DSN_ALIAS,
            "wallet_location": constants.DB_WALLET_PATH.__str__(),
            "wallet_password": constants.DB_WALLET_PASSWORD.get_secret_value(),
            "config_dir": constants.DB_WALLET_PATH.__str__(),
        },
    )

    return engine


def get_session():
    """
    Genera y retorna una sesion de base de datos para realizar operaciones en ella.
    """

    engine = create_engine()

    with Session(bind=engine) as session:
        logger.info("Session de base de datos Creada.")
        yield session


Base = declarative_base()
