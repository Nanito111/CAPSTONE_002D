from datetime import datetime
import logging
import logging.config

from gunicorn import glogging

import constants
import pathlib
from uvicorn.workers import UvicornWorker

# no mostrar excepciones del modulo logging
logging.raiseExceptions = False

logger = logging.getLogger(__name__)


@staticmethod
def create_log_file():

    # year month day _ 24hour minute second _ microsecond
    time_format: str = "%Y%m%d_%H%M%S_%f"
    log_file_name: str = datetime.now().strftime(time_format) + ".log"
    log_file_path = pathlib.Path(constants.LOGS_PATH, log_file_name)

    if not constants.LOGS_PATH.exists():
        logger.warning(
            "Directorio '{}' no encontrado. Creando el directorio '{}'.".format(
                constants.LOGS_DIR_NAME, constants.LOGS_DIR_NAME
            ),
        )
        constants.LOGS_PATH.mkdir()

    logger.info("Logging configurado.")
    logger.info(f"Archivo Log creado: {log_file_name}")

    return log_file_path


# Gunicorn Configuration, nombres de variables son reservados
# Docs Reference https://docs.gunicorn.org/en/stable/settings.html

glogging.Logger.syslog_fmt = "%(asctime)s [%(levelname)s] <%(name)s> %(message)s"
glogging.Logger.error_fmt = "%(asctime)s [%(levelname)s] <%(name)s> %(message)s"
glogging.Logger.access_fmt = "%(asctime)s [%(levelname)s] %(message)s"
glogging.Logger.datefmt = "[%Y-%m-%d %H:%M:%S]"

LOG_FILE = create_log_file()

bind = "{}:{}".format(constants.API_BIND_IP, constants.API_PORT)
workers = constants.API_WORKERS
worker_class = "{}.{}".format(UvicornWorker.__module__, UvicornWorker.__name__)
timeout = 0
reload = True if constants.ENVIRONMENT == "local" else False

logconfig_dict = {
    "version": 1,
    "disable_existing_loggers": False,
    "root": {
        "handlers": ["console", "file"],
        "level": constants.LOGGING_LEVEL,
    },
    "loggers": {
        "gunicorn.access": {
            "handlers": ["api_requests_console", "api_requests_file"],
            "level": "INFO",
            "propagate": True,
        },
        "gunicorn.error": {
            "level": "INFO",
            "handlers": ["gunicorn_console", "gunicorn_file"],
            "propagate": False,
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "error_fmt",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.FileHandler",
            "formatter": "error_fmt",
            "filename": LOG_FILE,
            "mode": "a",
        },
        "api_requests_console": {
            "class": "logging.StreamHandler",
            "formatter": "access_fmt",
            "stream": "ext://sys.stdout",
        },
        "api_requests_file": {
            "class": "logging.FileHandler",
            "formatter": "access_fmt",
            "filename": LOG_FILE,
            "mode": "a",
        },
        "gunicorn_console": {
            "class": "logging.StreamHandler",
            "formatter": "syslog_fmt",
            "stream": "ext://sys.stderr",
        },
        "gunicorn_file": {
            "class": "logging.FileHandler",
            "formatter": "syslog_fmt",
            "filename": LOG_FILE,
            "mode": "a",
        },
    },
    "formatters": {
        "error_fmt": {
            "format": glogging.Logger.error_fmt,
            "datefmt": glogging.Logger.datefmt,
            "class": "logging.Formatter",
        },
        "access_fmt": {
            "format": glogging.Logger.access_fmt,
            "datefmt": glogging.Logger.datefmt,
            "class": "logging.Formatter",
        },
        "syslog_fmt": {
            "format": glogging.Logger.syslog_fmt,
            "datefmt": glogging.Logger.datefmt,
            "class": "logging.Formatter",
        },
    },
}
