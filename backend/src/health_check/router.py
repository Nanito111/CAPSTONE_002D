from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from dependencies import DatabaseConnectionCheck
import health_check.utils as utils
from datetime import datetime

import logging

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/health", tags=["health"])


@router.get("/ping")
def ping():
    """
    Realiza un ping al API y devuelve un mensaje de respuesta.

    :return: Un mensaje de respuesta que indica que el API está activo.
    :rtype: str
    """
    return "Pong!"


@router.get("/basic")
def get_health_check_basic(local_timezone: str = "America/Santiago"):
    """
    Realiza un chequeo básico de salud del sistema y devuelve un JSON con los resultados.

    Este endpoint realiza un chequeo básico de salud del sistema, generando un
    timestamp y utilizando la función `health_check_basic` para obtener los
    resultados del chequeo. Los resultados se codifican en un formato compatible
    con JSON y se devuelven en la respuesta.

    :return: Un objeto JSONResponse que contiene los resultados del chequeo de salud.
    El contenido del JSON incluye el timestamp del chequeo y el estado del API.
    :rtype: JSONResponse
    """
    logger.info("Realizando health check con nivel de detalle 'basic'.")
    logger.info(f"Zona horaria local definida como '{local_timezone}'.")

    json_salida = utils.health_check_basic()
    json_salida.detail_level = utils.detail_level.basic
    json_salida.status_api = utils.status.ok
    json_salida.error_message = ""

    # Definir formato del timestamp a utilizar
    timestamp_format = utils.datetime_format.with_tz

    # Calcular y formatear timestamp UTC
    json_salida.timestamp_utc = utils.get_datetime_utc()
    json_salida.timestamp_utc.strftime(timestamp_format)

    # Calcular y formatear timestamp LOCAL
    timestamp_local = utils.get_datetime_tz(local_timezone)
    if type(timestamp_local) is not datetime:
        timestamp_local = datetime.now()

    json_salida.timestamp_local = timestamp_local
    json_salida.timestamp_local.strftime(timestamp_format)
    json_salida.local_timezone = local_timezone

    # Preparar variables de salida
    json_salida = jsonable_encoder(json_salida)
    logger.debug(f"JSON_SALIDA ENCODEADO: {json_salida}")
    return JSONResponse(content=json_salida)


@router.get("/full")
def get_health_check_full(
    can_database_connect: DatabaseConnectionCheck,
    local_timezone: str = "America/Santiago",
):
    """
    Realiza un chequeo completo de salud del sistema y devuelve un JSON con los resultados.

    Este endpoint realiza un chequeo completo de salud del sistema, generando un
    timestamp y utilizando la función `health_check_full` para obtener los resultados
    del chequeo. Los resultados se codifican en un formato compatible con JSON y
    se devuelven en la respuesta.

    :param local_timezone: La zona horaria a utilizar en el timestamp_local (ej: "America/Santiago").
    :type local_timezone: str

    :return: Un objeto JSONResponse que contiene los resultados del chequeo de salud.
    El contenido del JSON incluye el timestamp del chequeo, el estado del API,
    el estado de la base de datos, el último endpoint utilizado, el uso de CPU,
    memoria y disco, y la capacidad de CPU, memoria y disco.
    :rtype: JSONResponse
    """

    logger.info("Realizando health check con nivel de detalle 'full'.")
    logger.info(f"Zona horaria local definida como '{local_timezone}'.")

    json_salida = utils.health_check_full()
    json_salida.detail_level = utils.detail_level.full
    json_salida.status_api = utils.status.ok
    json_salida.error_message = ""

    # Definir formato del timestamp a utilizar
    timestamp_format = utils.datetime_format.with_tz

    # Calcular y formatear timestamp UTC
    json_salida.timestamp_utc = utils.get_datetime_utc()
    json_salida.timestamp_utc.strftime(timestamp_format)

    # Calcular y formatear timestamp LOCAL
    json_salida.local_timezone = local_timezone

    timestamp_local = utils.get_datetime_tz(local_timezone)
    if type(timestamp_local) is not datetime:
        timestamp_local = datetime.now()

    json_salida.timestamp_local = timestamp_local

    # Si el parámetro del timezone coincide es válido, formatear timestamp
    if json_salida.timestamp_local != "":
        json_salida.timestamp_local.strftime(timestamp_format)
    else:
        json_salida.error_message += "El timezone ingresado no es válido. "

    # Definir endpoints inalcanzables por defecto
    json_salida.last_endpoint_used_id = -1
    json_salida.last_endpoint_used_timestamp = ""

    # Revisar conexión con base de datos
    try:
        if can_database_connect:
            json_salida.status_database = utils.status.ok

            # Obtener último endpoint utilizado
            # TODO: Programar esto cuando se almacenen los endpoints en la BBDD
            json_salida.last_endpoint_used_id = -1
            json_salida.last_endpoint_used_timestamp = ""

            # Si se obtuvo el último endpoint utilizado, formatear timestamp
            # Sino, agregar mensaje de error
            # if json_salida.last_endpoint_used_id > -1:
            #    json_salida.last_endpoint_used_timestamp.strftime(
            #        timestamp_format)
            # else:
            #    json_salida.error_message += "Conexión con BBDD exitosa, pero hay un error al obtener el último endpoint utilizado. "
        else:
            json_salida.error_message += "La base de datos no es alcanzable. "
            json_salida.status_database = utils.status.unreachable
    except Exception:
        json_salida.error_message += (
            "Hubo un error en la API al conectar con la base de datos. "
        )
        json_salida.status_database = utils.status.error

    # Obtener capacidad de recursos
    json_salida.total_cpu_cores = utils.get_cpu_cores()
    json_salida.total_memory = utils.get_memory_total()
    json_salida.total_disk = utils.get_disk_total()

    # Obtener uso de recursos
    json_salida.usage_cpu = utils.get_cpu_usage()
    json_salida.usage_memory = utils.get_memory_usage()
    json_salida.usage_disk = utils.get_disk_usage()

    json_compatible_item_data = jsonable_encoder(json_salida)
    logger.debug(f"JSON_SALIDA ENCODEADO: {json_compatible_item_data}")
    return JSONResponse(content=json_compatible_item_data)
