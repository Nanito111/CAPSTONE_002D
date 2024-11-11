extends Node

@onready var source_light:DirectionalLight3D = %SourceLight
@onready var world_environment:WorldEnvironment = %WorldEnvironment

@export_group("Day Cycle")
@export var sky_settings:SkySettings
@export var light_rotation_offset:float = 5

@export_subgroup("Fake Time")
@export var max_day_minutes:float = 6
@export var current_daytime_seconds:float = 0

enum DayStates {DAY, NIGHT}
var current_day_state: DayStates = DayStates.DAY

var current_half_time_percentage:float
var day_in_seconds:float
var hour_in_seconds:float
var day_passed:int = 0

# current daytime
var real_today_unix_time: int
const REAL_DAY_IN_SECONDS: int = 86400

const COUNT_QUARTER_HOUR_IN_DAY: int = 96
var quarter_hour_in_seconds: float
var next_quarter_hour_in_seconds: float
signal at_quarter_hour(quarter_hour_count:int)

var simulation_second_in_seconds:float
var next_simulation_second_in_seconds: float
signal a_second_has_passed()

signal night_has_started()

func get_today_datetime_at_zero():
	return Time.get_unix_time_from_datetime_dict(Time.get_date_dict_from_system(true))


func get_current_day_seconds():
	if (Globals.test_environment):
		current_daytime_seconds = clampf(current_daytime_seconds + get_physics_process_delta_time(), 0, day_in_seconds)
		return
	current_daytime_seconds = clampf(Time.get_unix_time_from_system() - real_today_unix_time, 0, day_in_seconds)


func reset_day_time():
	next_quarter_hour_in_seconds = quarter_hour_in_seconds
	next_simulation_second_in_seconds = simulation_second_in_seconds
	current_daytime_seconds = 0

	if (not Globals.test_environment):
		real_today_unix_time = get_today_datetime_at_zero()


func get_current_or_next_quarter_hour_count(next_quarter_hour:bool = false):
	var quarter_hour: int = floori(current_daytime_seconds / quarter_hour_in_seconds)
	if next_quarter_hour:
		quarter_hour += 1
	return clampi(quarter_hour, 0, COUNT_QUARTER_HOUR_IN_DAY)

func set_next_quarter_hour_in_seconds():
	next_quarter_hour_in_seconds = get_current_or_next_quarter_hour_count(true) * quarter_hour_in_seconds
	next_quarter_hour_in_seconds = clampf(next_quarter_hour_in_seconds, 0, day_in_seconds)


func set_quarter_hour():
	at_quarter_hour.emit(get_current_or_next_quarter_hour_count())
	# printt(current_daytime_seconds, next_quarter_hour_in_seconds)
	set_next_quarter_hour_in_seconds()


func get_current_or_next_second_count(next:bool = false):
	var second: int = floori(current_daytime_seconds / simulation_second_in_seconds)
	if next:
		second += 1
	return clampi(second, 0, REAL_DAY_IN_SECONDS)


func set_next_simulation_second_in_seconds():
	next_simulation_second_in_seconds = get_current_or_next_second_count(true) * simulation_second_in_seconds
	next_simulation_second_in_seconds = clampf(next_simulation_second_in_seconds, 0, day_in_seconds)


func set_simulation_second():
	a_second_has_passed.emit()
	# printt(current_daytime_seconds, next_simulation_second_in_seconds)
	set_next_simulation_second_in_seconds()


func calculate_time_variables():
	get_current_day_seconds()

	var half_day:float = day_in_seconds * 0.5

	if (current_day_state == DayStates.NIGHT and current_daytime_seconds < half_day):
		current_day_state = DayStates.DAY

		day_passed += 1

	if (current_day_state == DayStates.DAY and current_daytime_seconds > half_day):
		current_day_state = DayStates.NIGHT
		night_has_started.emit()

	current_half_time_percentage = current_daytime_seconds / half_day - current_day_state
	current_half_time_percentage = clampf(current_half_time_percentage, 0, 1)

	if (current_daytime_seconds >= next_simulation_second_in_seconds):
		set_simulation_second()

	# es media hora
	if (current_daytime_seconds >= next_quarter_hour_in_seconds):
		set_quarter_hour()

	if (current_daytime_seconds == day_in_seconds):
		reset_day_time()


func light_setting():
	source_light.rotation.x = lerpf(
		deg_to_rad(light_rotation_offset),
		deg_to_rad(-180 - light_rotation_offset),
		current_half_time_percentage
	)


func day_night_global_shader_parameters():
	if (current_day_state == DayStates.DAY):
		#light color
		source_light.light_color = sky_settings.sun_light_color.sample(current_half_time_percentage)
		#ambient color
		world_environment.environment.ambient_light_color = sky_settings.day_ambient_color.sample(current_half_time_percentage)
		world_environment.environment.background_energy_multiplier = sky_settings.sun_light_energy.sample(current_half_time_percentage)
		#light intensity
		source_light.light_energy = sky_settings.sun_light_energy.sample(current_half_time_percentage)
	else:
		#light color
		source_light.light_color = sky_settings.moon_light_color.sample(current_half_time_percentage)
		#ambient color
		world_environment.environment.ambient_light_color = sky_settings.night_ambient_color.sample(current_half_time_percentage)
		world_environment.environment.background_energy_multiplier = sky_settings.moon_light_energy.sample(current_half_time_percentage)
		#light intensity
		source_light.light_energy = sky_settings.moon_light_energy.sample(current_half_time_percentage)


func _ready():
	current_half_time_percentage = 0

	if (Globals.test_environment):
		day_in_seconds = max_day_minutes * 60
	else:
		day_in_seconds = REAL_DAY_IN_SECONDS
		real_today_unix_time = get_today_datetime_at_zero()
		current_daytime_seconds = Time.get_unix_time_from_system() - real_today_unix_time

	quarter_hour_in_seconds = day_in_seconds / COUNT_QUARTER_HOUR_IN_DAY
	set_next_quarter_hour_in_seconds()
	hour_in_seconds = day_in_seconds / 24
	simulation_second_in_seconds = day_in_seconds / REAL_DAY_IN_SECONDS


func _process(_delta):
	light_setting()
	day_night_global_shader_parameters()


func _physics_process(_delta) -> void:
	calculate_time_variables()
