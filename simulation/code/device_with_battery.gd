class_name DeviceWithBattery
extends Device

var battery_energy_available: float = 0
@export var device_charger: Device
@export var charge_device_task: Task
@export var disconnect_device_task: Task
var is_battery_charging: bool = false

signal battery_has_empty(charge_device: Task)
signal battery_has_charged(disconnect_charger: Task)


func discharge_battery():
	if (battery_energy_available > 0):
		var amperes: float = current_energy_consumption / device_data.battery_nominal_voltage
		battery_energy_available -= amperes / DayNight.hour_in_seconds

		battery_energy_available = clampf(
			battery_energy_available,
			0,
			device_data.battery_capacity_Ah
		)

		prints(
			"Current",
			device_data.name,
			"battery:",
			battery_energy_available,
			"percentage:",
			ceilf(battery_energy_available / device_data.battery_capacity_Ah * 100)
		)

		if (battery_energy_available == 0):
			battery_has_empty.emit(charge_device_task)


func set_consumption():
	super.set_consumption()
	if (device_data.has_battery):
		if (battery_energy_available == 0):
			return
		discharge_battery()

	# bateria cargada
	if (device_data.has_battery and is_battery_charging):
		battery_energy_available = clampf(battery_energy_available, 0, device_data.battery_capacity_Ah)

		if (battery_energy_available == device_data.battery_capacity_Ah):
			is_battery_charging = false
			battery_has_charged.emit(disconnect_device_task)


func _ready():
	super._ready()
	send_data = false

	if (device_data.has_battery):
		battery_energy_available = device_data.battery_capacity_Ah
