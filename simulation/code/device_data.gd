class_name DeviceData
extends Resource

@export var name: String

@export_group("Consumption")
@export_range(0, 3000, 1, "or_greater") var power_watts: int = 0
@export_range(0, 1000000, 1,"or_greater") var consumption_ws: int = 0
@export var has_low_consumption_mode: bool = false
@export var has_sleep_mode: bool = false

@export_group("Battery")
@export var has_battery: bool = false
@export_range(0, 5000, 1,"or_greater") var battery_capacity_mAh: float = 0
