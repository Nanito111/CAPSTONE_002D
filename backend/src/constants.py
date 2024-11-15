import os
from dotenv import load_dotenv
import pathlib
import logging
from pydantic.types import SecretStr

load_dotenv("../.env")

ENVIRONMENT: str = os.environ["ENVIRONMENT"]

PROJECT_NAME: str = os.environ["PROJECT_NAME"]
PROJECT_VERSION: str = os.environ["PROJECT_VERSION"]

# API variables
API_PROTOCOL: str = os.environ["API_PROTOCOL"]
API_HOST_IP: str = os.environ["API_HOST_IP"]
API_BIND_IP: str = os.environ["API_BIND_IP"]
API_PORT: int = int(os.environ["API_PORT"])
API_WORKERS: int = int(os.environ["API_WORKERS"])
API_ENCRYPTION_KEY: SecretStr = SecretStr(os.environ["API_ENCRYPTION_KEY"])

# SQL Database variables
DB_HOST: str = os.environ["DB_HOST"]
DB_PORT: int = int(os.environ["DB_PORT"])
DB_DSN_ALIAS: str = os.environ["DB_DSN_ALIAS"]

DB_USER: str = os.environ["DB_USER"]
DB_PASSWORD: SecretStr = SecretStr(os.environ["DB_PASSWORD"])

DB_WALLET_DIR_NAME: str = os.environ["DB_WALLET_DIR_NAME"]
DB_WALLET_PATH: pathlib.Path = pathlib.Path("./../", DB_WALLET_DIR_NAME)
DB_WALLET_PASSWORD: SecretStr = SecretStr(os.environ["DB_WALLET_PASSWORD"])

DB_TNS_FILE_NAME: str = os.environ["DB_TNS_FILE_NAME"]
DB_TNS_PATH: pathlib.Path = pathlib.Path(DB_WALLET_PATH, DB_TNS_FILE_NAME)

DB_PEM_FILE_NAME: str = os.environ["DB_PEM_FILE_NAME"]
DB_PEM_PATH: pathlib.Path = pathlib.Path(DB_WALLET_PATH, DB_PEM_FILE_NAME)

# Directories name|path variables
LOGS_DIR_NAME: str = os.environ["LOGS_DIR_NAME"]
LOGS_PATH: pathlib.Path = pathlib.Path("./../", LOGS_DIR_NAME)

LOGGING_LEVEL: str = logging.getLevelName(logging.DEBUG)
