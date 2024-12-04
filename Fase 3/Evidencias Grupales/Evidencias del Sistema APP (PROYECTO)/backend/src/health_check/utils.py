"""Health check utilities for the API.

This module contains the classes and functions used to perform the health check
and store the data in the API, including the constants for the status and detail
level of the health check.

Classes:
:class:`health_check_basic` is used to store the basic health check data, including
the timestamp and the status of the API.
:class:`health_check_full` is used to store the full health check data, including
the timestamp and the status of the API and the database as well as the last endpoint
:class:`status` is used to store the status of the API and the database.
:class:`detail_level` is used to store the level of detail to be stored.

Functions:
:func:`get_cpu_usage` is used to get the percentage of CPU usage.
:func:`get_cpu_usage_per_cpu` is used to get the percentage of CPU usage per CPU.
:func:`get_memory_usage` is used to get the percentage of memory usage.
:func:`get_disk_usage` is used to get the percentage of disk usage.
:func:`get_cpu_cores` is used to get the total number of CPU cores.
:func:`get_cpu_cores_logical` is used to get the total number of CPU cores.
:func:`get_memory_total` is used to get the total memory available in bytes.
:func:`get_disk_total` is used to get the total disk space available in bytes.
"""

import datetime
import psutil
import pytz


class health_check_basic:
    """
    This class is used to store the basic health check data.

    It includes the timestamp (UTC and local) and the status of the API.

    :param detail_level: The level of detail to be stored. Defined by :class:`DETAIL_LEVEL`.
    :type detail_level: str
    :param status_api: The status of the API. Defined by :class:`STATUS`.
    :type status_api: str
    :param error_message: Saves an error message in case the API or database are down. Can be used for other errors.
    :type error_message: str
    :param timezone: The timezone of the health check used for the local timestamp.
    :type timezone: str
    """

    detail_level: str
    status_api: str
    error_message: str
    timestamp_utc: datetime.datetime
    timestamp_local: datetime.datetime
    local_timezone: str


class health_check_full:
    """
    This class is used to store the full health check data

    It includes the timestamp (UTC and local) and the status of the API and the database as well
    as the last endpoint used. It also includes CPU, memory and disk data (total
    and usage percentages).

    :param detail_level: The level of detail to be stored. Defined by :class:`DETAIL_LEVEL`.
    :type detail_level: str
    :param status_api: The status of the API. Defined by :class:`STATUS`.
    :type status_api: str
    :param status_database: The status of the database. Defined by :class:`STATUS`.
    :type status_database: str
    :param error_message: Saves an error message in case the API or database are down. Can be used for other errors.
    :type error_message: str
    :param timestamp_utc: The timestamp of the health check in UTC (format "%Y-%m-%d %H:%M:%S.%f %z").
    :type timestamp_utc: datetime
    :param timestamp_local: The timestamp of the health check in local time (format: "%Y-%m-%d %H:%M:%S.%f %z").
    :type timestamp_local: datetime
    :param local_timezone: The timezone of the health check used for the local timestamp.
    :type local_timezone: str
    :param last_endpoint_used: The last endpoint used by the API.
    :type last_endpoint_used: str
    :param total_cpu_cores: The total number of CPU cores.
    :type total_cpu_cores: int
    :param total_memory: The total memory available in bytes.
    :type total_memory: int
    :param total_disk: The total disk space available in bytes.
    :type total_disk: int
    :param usage_cpu: The percentage of CPU usage.
    :type usage_cpu: float
    :param usage_memory: The percentage of memory usage.
    :type usage_memory: float
    :param usage_disk: The percentage of disk usage.
    :type usage_disk: float
    :param last_endpoint_used_id: The ID of the last endpoint used by the API.
    :type last_endpoint_used_id: str, optional
    :param last_endpoint_used_timestamp: The timestamp of the last endpoint used by the API.
    :type last_endpoint_used_timestamp: str, optional
    """

    detail_level: str
    status_api: str
    status_database: str
    error_message: str
    timestamp_utc: datetime.datetime
    timestamp_local: datetime.datetime
    local_timezone: str
    total_cpu_cores: int
    total_memory: int
    total_disk: int
    usage_cpu: float
    usage_memory: float
    usage_disk: float
    last_endpoint_used_id: int
    last_endpoint_used_timestamp: str


class status:
    """
    This class is used to store the status of the API and the database.

    :param unknown: The status is unknown.
    :type unknown: str
    :param unreachable: The status is unreachable (connection issue).
    :type unreachable: str
    :param error: The status is error (internal issue).
    :type error: str
    :param ok: The status is ok.
    :type ok: str
    """

    unknown = "unknown"
    unreachable = "unreachable"
    error = "error"
    ok = "ok"


class detail_level:
    """
    This class is used to store the level of detail to be stored.

    :param basic: The level of detail is basic (only includes timestamp and API status).
    :type basic: str
    :param full: The level of detail is full (includes database, CPU, memory and disk data).
    :type full: str
    """

    basic = "basic"
    full = "full"


class datetime_format:
    """
    This class is used to store the format of the timestamp.

    :param with_tz: The format of the timestamp with timezone.
    :type: str
    :param without_tz: The format of the timestamp without timezone.
    :type: str
    :param datetime: The format of the timestamp without timezone and milliseconds.
    :type: str
    """

    with_tz = "%Y-%m-%d %H:%M:%S.%f %z"
    without_tz = "%Y-%m-%d %H:%M:%S.%f"
    datetime = "%Y-%m-%d %H:%M:%S"


def get_cpu_usage():
    return psutil.cpu_percent(interval=1, percpu=False)


def get_cpu_usage_per_cpu():
    return psutil.cpu_percent(interval=1, percpu=True)


def get_memory_usage():
    return psutil.virtual_memory().percent


def get_disk_usage():
    return psutil.disk_usage("/").percent


def get_cpu_cores():
    return psutil.cpu_count(logical=False)


def get_cpu_cores_logical():
    return psutil.cpu_count(logical=True)


def get_memory_total():
    return psutil.virtual_memory().total


def get_disk_total():
    return psutil.disk_usage("/").total


def get_datetime_utc():
    return datetime.datetime.now(pytz.timezone("UTC"))


def get_datetime_tz(tz: str):
    """Retrieves a datetime using the specified timezone.
    Makes use of Wikipedia's "tz database":
    https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

    :param tz: The timezone used to retrieve the datetime.
    :type tz: str

    :return: The datetime with the specified timezone.
        If the timezone is incorrect, an empty string is returned.
    :rtype: str

    :example:
        >>> print(get_datetime_tz("America/Santiago"))
        "2024-02-07 11:38:44.632177-03:00"
        >>> print(get_datetime_tz("fake_timezone"))
        ""
    """
    result = ""

    # If the timezone exists in the list of timezones, assign the datetime
    if tz in pytz.all_timezones:
        result = datetime.datetime.now(pytz.timezone(tz))
    else:
        print(
            f"Timezone '{tz}' doesn't match any timezone in pytz.all_timezones. Returning empty string."
        )

    return result
