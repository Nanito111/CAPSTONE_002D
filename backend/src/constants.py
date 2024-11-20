import os
from dotenv import load_dotenv
import pathlib
import logging
from pydantic.types import SecretStr
from passlib.context import CryptContext
from furl import furl as Furl

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

# FRONTEND variables
FE_URL: Furl = Furl(os.environ["FE_URL"])
FE_RECOVER_PASSWORD: Furl = FE_URL.copy().add(path="recover/")
SENDER_EMAIL: str = os.environ["SENDER_EMAIL"]
SENDER_PASSWORD: SecretStr = SecretStr(os.environ["SENDER_PASSWORD"])


# Directories name|path variables
LOGS_DIR_NAME: str = os.environ["LOGS_DIR_NAME"]
LOGS_PATH: pathlib.Path = pathlib.Path("./../", LOGS_DIR_NAME)
ASSETS_PATH: pathlib.Path = pathlib.Path("./assets/")
EMAILS_TEMPLATES_PATH: pathlib.Path = pathlib.Path(ASSETS_PATH, "emails/")

LOGGING_LEVEL: str = logging.getLevelName(logging.INFO)

PWD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

TOKEN_EXPIRATION_DELTA = timedelta(minutes=60)
PASSWORD_REQUEST_EXPIRATION_DELTA = timedelta(hours=24)
