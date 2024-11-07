class_name User
extends Node3D

@export var tasks: Array[Task]

var is_sleeping: bool = false
var doing_a_task: bool = false
var is_waiting_for_task: bool = false

var tasks_in_progress: Array[Task]
var last_task: Task

func go_to_sleep(current_half_hour:int):
	if(current_half_hour != 32):
		return
	is_sleeping = true

	if (last_task.task_type == Task.TaskType.ACTIVE):
		last_task.stop_task()

	print("im going to sleep...")


func awake(current_half_hour:int):
	if (current_half_hour != 1):
		return
	is_sleeping = false
	print("im awaking!")


func execute_random_task():
	var selected_task: Task = last_task

	while (selected_task == last_task):
		if (len(tasks) == 1):
			selected_task = tasks[0]
			break
		# get random task from tasks
		selected_task = tasks.pick_random()

	if (selected_task in tasks_in_progress):
		return

	last_task = selected_task
	tasks_in_progress.append(selected_task)

	var devices: Array[Device]
	for device_data in selected_task.devices:
		devices.append(get_parent().find_child(device_data.name))

	selected_task.execute(self, devices)


func remove_ended_task_from_pool(task:Task):
	var task_index: int = tasks_in_progress.find(task)
	tasks_in_progress.remove_at(task_index)


func do_a_task(_half_hour):
	if (is_sleeping):
		# skip task execution when user sleeps
		print("skiping task because im sleeping...")
		return
	if (not doing_a_task):
		print("im not doing a task, so im doing a task right now!")
		execute_random_task()
		return

	if (is_waiting_for_task):
		# avoid multiple task execution or waiting
		print("im already waiting for a task, not waiting for another one!")
		return

	is_waiting_for_task = true
	print("waiting for a task to end...")

	if (last_task.task_type == Task.TaskType.ACTIVE):
		await last_task.task_has_ended
	else:
		await last_task.task_has_started

	is_waiting_for_task = false

	if (is_sleeping):
		# skip task execution when user sleeps
		print("skiping task because im sleeping...")
		return

	print("executing task after waiting")
	execute_random_task()


func _ready():
	DayNight.at_half_hour.connect(go_to_sleep)
	DayNight.at_half_hour.connect(awake)
	DayNight.at_half_hour.connect(do_a_task)
