class_name Task
extends Resource

@export var task_duration_range_in_minutes: Vector2
@export var devices: Array[DeviceData]

enum TaskType {ACTIVE, DEFERRED, CHARGE_DEVICE, DISCONNECT_CHARGER}
@export var task_type:TaskType

var task_timer: SceneTreeTimer

signal starting_task()
signal task_has_started()
signal task_has_ended()


func regular_task(
	user:User,
	devices_instances:Array[Device]
):

	var timeout_minutes = randf_range(task_duration_range_in_minutes.x, task_duration_range_in_minutes.y)
	# convert minutes with seconds in a day
	var timeout_seconds = (timeout_minutes * 60) * (DayNight.day_in_seconds / DayNight.REAL_DAY_IN_SECONDS)

	prints("doing my task for", timeout_seconds, "seconds")
	task_timer = user.get_tree().create_timer(timeout_seconds)

	if (task_type == TaskType.DEFERRED):
		user.doing_a_task = false

	task_has_started.emit()

	for device in devices_instances:
		device.start_using()

	await task_timer.timeout

	# end task
	prints("finishing my task", self.resource_path)

	if (task_type == TaskType.ACTIVE):
		user.doing_a_task = false

	task_has_ended.emit()

	for device in devices_instances:
		device.stop_using()

	user.remove_ended_task_from_pool(self)


func charge_device_task(
	user: User,
	device_to_charge: DeviceWithBattery,
	charger: DeviceCharger
):
	charger.device_to_charge = device_to_charge
	user.doing_a_task = false

	device_to_charge.is_battery_charging = true

	task_has_started.emit()

	charger.start_using()

	await device_to_charge.battery_has_charged

	task_has_ended.emit()

	user.remove_ended_task_from_pool(self)


func disconnect_device_from_charger_task(
	user: User,
	device: DeviceWithBattery,
	charger: DeviceCharger
):
	var timeout_minutes = randf_range(task_duration_range_in_minutes.x, task_duration_range_in_minutes.y)
	# convert minutes with seconds in a day
	var timeout_seconds = (timeout_minutes * 60) * (DayNight.day_in_seconds / DayNight.REAL_DAY_IN_SECONDS)

	prints("disconection charger from device", device.name)
	task_timer = user.get_tree().create_timer(timeout_seconds)

	task_has_started.emit()

	await task_timer.timeout

	prints("finishing task", self.resource_path)

	user.doing_a_task = false
	task_has_ended.emit()

	charger.stop_using()
	charger.device_to_charge = null

	user.remove_ended_task_from_pool(self)


func execute(user_instance: User, devices_instances:Array[Device]):
	# start task
	user_instance.doing_a_task = true

	prints("starting my task", self.resource_path)
	starting_task.emit()

	user_instance.navigation_agent.target_position = devices_instances[0].global_position

	match task_type:
		TaskType.ACTIVE, TaskType.DEFERRED:
			regular_task(user_instance, devices_instances)

		TaskType.CHARGE_DEVICE:
			var device_with_battery: DeviceWithBattery = devices_instances[0]
			var device_charger: DeviceCharger = device_with_battery.device_charger

			charge_device_task(user_instance, device_with_battery, device_charger)

		TaskType.DISCONNECT_CHARGER:

			var device_with_battery: DeviceWithBattery = devices_instances[0]
			var device_charger: DeviceCharger = device_with_battery.device_charger

			disconnect_device_from_charger_task(user_instance, device_with_battery, device_charger)


func stop_task():
	print("stoping task")
	task_timer.timeout.emit()
