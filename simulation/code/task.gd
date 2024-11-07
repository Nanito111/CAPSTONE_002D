class_name Task
extends Resource

@export var task_duration_range_in_minutes: Vector2
@export var devices: Array[DeviceData]

enum TaskType {ACTIVE, DEFERRED}
@export var task_type:TaskType

var task_timer: SceneTreeTimer

signal starting_task()
signal task_has_started()
signal task_has_ended()

func execute(user_instance: User, devices_instances:Array[Device]):
	# start task
	user_instance.doing_a_task = true

	prints("starting my task", self.resource_path)
	starting_task.emit()

	# doing task
	var timeout_minutes = randf_range(task_duration_range_in_minutes.x, task_duration_range_in_minutes.y)
	# convert minutes with seconds in a day
	var timeout_seconds = (timeout_minutes * 60) * (DayNight.seconds_in_day / DayNight.REAL_DAY_IN_SECONDS)

	prints("doing my task for", timeout_seconds, "seconds")
	task_timer = user_instance.get_tree().create_timer(timeout_seconds)

	if (task_type == TaskType.DEFERRED):
		user_instance.doing_a_task = false

	task_has_started.emit()

	for device in devices_instances:
		device.start_using()

	await task_timer.timeout

	# end task
	prints("finishing my task", self.resource_path)

	if (task_type == TaskType.ACTIVE):
		user_instance.doing_a_task = false

	task_has_ended.emit()

	for device in devices_instances:
		device.stop_using()

	user_instance.remove_ended_task_from_pool(self)

func stop_task():
	print("stoping task")
	task_timer.timeout.emit()
