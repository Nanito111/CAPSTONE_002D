class_name Device
extends Node3D

@export var device_data: DeviceData
var is_being_use: bool
var current_energy_consumption: float


func start_using():
	is_being_use = true
	prints("start using device ", device_data.name)


func stop_using():
	is_being_use = false
	prints("stop using device ", device_data.name)


func jitter_value(value:float):
	var jitter_range = value * 0.1
	var jitter:float = randf_range(-jitter_range, jitter_range) + value
	return jitter


func consumption_in_idle():
	current_energy_consumption = jitter_value(device_data.consumption_in_idle) / DayNight.hour_in_seconds

	prints("Device", device_data.name, "is idle, energy consumed in this second:", current_energy_consumption, "Watts")


func consumption_in_use():
	current_energy_consumption = jitter_value(device_data.consumption_in_use) / DayNight.hour_in_seconds
	current_energy_consumption *= get_physics_process_delta_time()


func set_consumption():
	if (is_being_use):
		consumption_in_use()
	else:
		consumption_in_idle()


func _ready():
	self.name = device_data.name
	DayNight.a_second_has_passed.connect(set_consumption)
