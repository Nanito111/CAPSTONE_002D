class_name User
extends CharacterBody3D

@export var tasks: Array[Task]

@export_group("Movement")

@export_range(0.1, 15, true) var speed: float = 5
@export_range(0.01, 100, true) var look_acceleration_speed: float = 5
@export_range(0.1, 1) var destination_stop_range: float = 0.3
var is_at_destination: bool = true

signal destination_reached()


var is_sleeping: bool = false
signal going_to_sleep()

var doing_a_task: bool = false
var is_waiting_for_task: bool = false

var tasks_in_progress: Array[Task]
var last_task: Task

var next_active_tasks: Array[Task]

@onready var navigation_agent: NavigationAgent3D = %NavigationAgent3D
@onready var devices_parent_node: Node = %Devices


func go_to_sleep(current_quarter_hour:int):
	if(current_quarter_hour != 64):
		return
	is_sleeping = true
	going_to_sleep.emit()

	if (last_task.task_type == Task.TaskType.ACTIVE):
		last_task.stop_task()

	print("im going to sleep...")


func awake(current_quarter_hour:int):
	if (current_quarter_hour != 1):
		return
	is_sleeping = false
	print("im awaking!")


func get_devices_from_task(task: Task):
	var devices: Array[Device]
	for device_data in task.devices:
		devices.append(devices_parent_node.find_child(device_data.name))

	return devices


func get_device_with_battery_from_task(task: Task):
	var devices_with_battery: Array[Device]

	for device in devices_parent_node.get_children():
		if(device is DeviceWithBattery):
			devices_with_battery.push_back(device)

	if (len(devices_with_battery) == 0):
		return null

	var task_devices: Array[Device] = get_devices_from_task(task)

	var device_with_battery_index: int = -1

	for index in task_devices.size():
		if (task_devices[index] is DeviceWithBattery):
			device_with_battery_index = index
			break

	if (device_with_battery_index == -1):
		return null

	var device_with_battery_from_task = task_devices[device_with_battery_index]

	
	for device in devices_with_battery:
		if (device == device_with_battery_from_task):
			return device

	return null


func get_random_task(conflict_task: Task):
	var selected_task: Task = conflict_task
	while (selected_task == conflict_task):
		if (len(tasks) == 1):
			selected_task = tasks[0]
			break
		# get random task from tasks
		selected_task = tasks.pick_random()

		# selected task is to use device with battery while is charging
		var device_with_battery = get_device_with_battery_from_task(selected_task)

		if (device_with_battery != null and (device_with_battery.is_battery_charging or device_with_battery.battery_energy_available == 0)):
			conflict_task = selected_task
			continue

	return selected_task


func select_and_execute_a_task():
	var selected_task: Task

	if (len(next_active_tasks) > 0):
		selected_task = next_active_tasks.pop_back()
	else:
		selected_task = get_random_task(last_task)

	if (selected_task in tasks_in_progress):
		return

	last_task = selected_task
	tasks_in_progress.append(selected_task)

	selected_task.execute(self, get_devices_from_task(selected_task))


func remove_ended_task_from_pool(task:Task):
	var task_index: int = tasks_in_progress.find(task)
	tasks_in_progress.remove_at(task_index)


func do_a_task(_quarter_hour):
	if (is_sleeping):
		# skip task execution when user sleeps
		print("skiping task because im sleeping...")
		return
	if (not doing_a_task):
		print("im not doing a task, so im doing a task right now!")
		select_and_execute_a_task()
		return

	if (is_waiting_for_task):
		# avoid multiple task execution or waiting
		print("im already waiting for a task, not waiting for another one!")
		return

	is_waiting_for_task = true
	prints("waiting for a task", last_task.resource_path, "to end...")

	match last_task.task_type:
		Task.TaskType.ACTIVE, Task.TaskType.DISCONNECT_CHARGER:
			await last_task.task_has_ended

		Task.TaskType.DEFERRED, Task.TaskType.CHARGE_DEVICE:
			await last_task.task_has_started

	is_waiting_for_task = false

	if (is_sleeping):
		# skip task execution when user sleeps
		print("skiping task because im sleeping...")
		return

	print("executing task after waiting")
	select_and_execute_a_task()


func add_task_to_next_active_task(task: Task):
	next_active_tasks.push_back(task)


func _ready():
	DayNight.at_quarter_hour.connect(go_to_sleep)
	DayNight.at_quarter_hour.connect(awake)
	DayNight.at_quarter_hour.connect(do_a_task)

	# connect device with battery events
	for device in devices_parent_node.get_children():
		if (device is DeviceWithBattery):
			device.battery_has_empty.connect(add_task_to_next_active_task)

			var stop_using_on_empty_battery = func (_task):
				if (not (device.device_data in last_task.devices)):
					return
				last_task.stop_task()

			device.battery_has_empty.connect(stop_using_on_empty_battery)

			device.battery_has_charged.connect(add_task_to_next_active_task)

	global_position.y = 0.5


func movement(delta: float):
	if (is_at_destination): return

	var next_path_postition: Vector3 = navigation_agent.get_next_path_position()
	var travel_velocity: Vector3 = (next_path_postition - self.global_position).normalized()

	if (travel_velocity != Vector3.ZERO):
		var looking_angle: float = atan2(travel_velocity.x, travel_velocity.z)
		var looking_angle_interpolated = lerp_angle(global_rotation.y, looking_angle, delta * look_acceleration_speed)

		global_rotation = Vector3(global_rotation.x, looking_angle_interpolated, global_rotation.z)

	velocity = travel_velocity * speed

	move_and_slide()


func get_distance_to_final_position():
	return navigation_agent.get_final_position().distance_to(self.global_position)


func is_agent_at_destination():
	if(get_distance_to_final_position() < destination_stop_range):
		if(not is_at_destination):
			is_at_destination = true
			destination_reached.emit()
	else:
		if (is_at_destination): is_at_destination = false

func _physics_process(delta: float) -> void:
	is_agent_at_destination()
	movement(delta)
