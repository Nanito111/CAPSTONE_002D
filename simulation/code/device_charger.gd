class_name DeviceCharger
extends Device

var device_to_charge: DeviceWithBattery


func charge_device():
	var amperes_for_charging = device_data.consumption_in_use_curve.max_value / device_to_charge.device_data.battery_nominal_voltage
	amperes_for_charging = amperes_for_charging / DayNight.hour_in_seconds

	device_to_charge.battery_energy_available += amperes_for_charging
	# prints("battery charging", device_to_charge.battery_energy_available, "<=", amperes_for_charging)


func set_consumption():
	super.set_consumption()
	if (is_being_use):
		charge_device()
