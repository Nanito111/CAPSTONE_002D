class_name DeviceData
extends Resource

@export var name: String

@export_group("Consumption")

# values are in Watts and percentage for jitter
@export var consumption_in_use_curve: Curve
@export_range(0, 1, 0.01, "or_greater") var jitter_percentage_in_use: float = 0
@export_range(0, 10, 0.001, "or_greater") var consumption_in_idle: float = 0
@export_range(0, 1, 0.01, "or_greater") var jitter_percentage_in_idle: float = 0

@export_group("Battery")
@export var has_battery: bool = false
@export_range(0, 5, 0.001,"or_greater") var battery_capacity_Ah: float = 0
@export_range(0, 10, 0.001,"or_greater") var battery_nominal_voltage: float = 0
