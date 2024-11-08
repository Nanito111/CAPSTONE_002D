class_name DeviceData
extends Resource

@export var name: String

@export_group("Consumption")

# values are in kWh
@export_range(0, 10, 0.001, "or_greater") var consumption_in_use: float = 0
@export_range(0, 10, 0.001, "or_greater") var consumption_in_idle: float = 0

@export var has_low_consumption_mode: bool = false
@export var has_sleep_mode: bool = false

@export_group("Battery")
@export var has_battery: bool = false
@export_range(0, 5000, 1,"or_greater") var battery_capacity_mAh: float = 0
