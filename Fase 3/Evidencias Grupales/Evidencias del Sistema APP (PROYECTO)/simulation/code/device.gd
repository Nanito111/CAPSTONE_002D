class_name Device
extends Node3D

@export var device_data: DeviceData

var is_being_use: bool
var current_energy_consumption: float

var send_data: bool = true


func start_using():
	is_being_use = true
	prints("start using device ", device_data.name)


func stop_using():
	is_being_use = false
	prints("stop using device ", device_data.name)


func jitter_value(value:float, jitter_amount: float):
	var jitter_range = value * jitter_amount
	var jitter:float = randf_range(-jitter_range, jitter_range) + value
	return jitter


func consumption_in_idle():
	current_energy_consumption = jitter_value(
		device_data.consumption_in_idle,
		device_data.jitter_percentage_in_idle
	) / DayNight.hour_in_seconds

	# prints(
	# 	"Device",
	# 	device_data.name,
	# 	"is idle, energy consumed at this second:",
	# 	current_energy_consumption,
	# 	"Watts"
	# )


func consumption_in_use():
	var consumption = device_data.consumption_in_use_curve.sample(randf())
	consumption = jitter_value(consumption, device_data.jitter_percentage_in_use)
	consumption = clampf(
		consumption,
		device_data.consumption_in_use_curve.min_value,
		device_data.consumption_in_use_curve.max_value
	)
	current_energy_consumption = consumption / DayNight.hour_in_seconds

	prints(
		"Device",
		device_data.name,
		"in use, energy consumed at this second:",
		current_energy_consumption,
		"Watts"
	)


func set_consumption():
	if (is_being_use):
		consumption_in_use()
	else:
		consumption_in_idle()


func _ready():
	self.name = device_data.name
	DayNight.a_second_has_passed.connect(set_consumption)
