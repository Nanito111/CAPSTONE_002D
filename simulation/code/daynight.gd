class_name DayNight
extends Node

@onready var source_light:DirectionalLight3D = %SourceLight
@onready var world_environment:WorldEnvironment = %WorldEnvironment

@export_group("Day Cycle")
@export var sky_settings:SkySettings
@export var light_rotation_offset:float = 5

@export var use_real_life_time:bool = true
@export_subgroup("Fake Time")
@export var max_day_minutes:float = 6
@export var current_daytime_seconds:float = 0

enum DayStates {DAY, NIGHT}
var current_day_state: DayStates = DayStates.DAY

var current_half_time_percentage:float
var seconds_in_day:float
var day_passed:int = 0

# current daytime
var real_today_unix_time: int

const COUNT_HALF_HOUR_IN_DAY: int = 48
var half_hour_in_seconds: float
var next_half_hour_in_seconds: float
signal at_half_hour()

func get_today_datetime_at_zero():
	return Time.get_unix_time_from_datetime_dict(Time.get_date_dict_from_system(true))

func calculate_time_variables(delta:float):

	if (use_real_life_time):
		current_daytime_seconds = clampf(Time.get_unix_time_from_system() - real_today_unix_time, 0, seconds_in_day)

		if (current_daytime_seconds == seconds_in_day):
			real_today_unix_time = get_today_datetime_at_zero()
			next_half_hour_in_seconds = current_daytime_seconds + half_hour_in_seconds

	else:
		current_daytime_seconds = clampf(current_daytime_seconds + delta, 0, seconds_in_day)
		if (current_daytime_seconds == seconds_in_day):
			current_daytime_seconds = 0
			next_half_hour_in_seconds = current_daytime_seconds + half_hour_in_seconds

	var half_day:float = seconds_in_day * 0.5

	if (current_day_state == DayStates.NIGHT and current_daytime_seconds < half_day):
		current_day_state = DayStates.DAY

		day_passed += 1

	if (current_day_state == DayStates.DAY and current_daytime_seconds > half_day):
		current_day_state = DayStates.NIGHT

	current_half_time_percentage = current_daytime_seconds / half_day - current_day_state
	current_half_time_percentage = clampf(current_half_time_percentage, 0, 1)

	# es media hora
	if current_daytime_seconds >= next_half_hour_in_seconds:
		at_half_hour.emit()
		next_half_hour_in_seconds = current_daytime_seconds + half_hour_in_seconds
	

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

	if (use_real_life_time):
		seconds_in_day = 86400
		real_today_unix_time = get_today_datetime_at_zero()
		current_daytime_seconds = Time.get_unix_time_from_system() - real_today_unix_time
	else:
		seconds_in_day = max_day_minutes * 60

	half_hour_in_seconds = seconds_in_day / COUNT_HALF_HOUR_IN_DAY



func _process(delta):
	calculate_time_variables(delta)
	light_setting()
	day_night_global_shader_parameters()
