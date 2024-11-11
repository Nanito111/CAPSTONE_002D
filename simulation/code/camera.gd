extends Camera3D

@export_category("Camera Limits")

@export_group("Zoom")
@export_range(0.1, 5, 0.1, "or_greater") var camera_min_distance: float = 1
@export_range(5, 10, 0.1, "or_greater") var camera_max_distance: float = 10

@export_group("Orbit")
@export_range(0.1, 90, 0.1, "radians_as_degrees") var orbit_limit_x_min: float = 0.017
@export_range(0.1, 90, 0.1, "radians_as_degrees") var orbit_limit_x_max: float = 1.571

@export_category("Input Settings")
@export_range(0.01, 2) var zoom_sensitivity: float = 0.1
@export_range(0.1, 5) var pan_sensitivity: float = 0.1
@export_range(0.1, 5) var orbit_sensitivity: float =0.1


var orbiting: bool = false
var panning: bool = false
# var pre_panning: bool = false

var orbit_rotation: Vector2
var camera_actual_distance: float
var camera_target_distance: float


func _ready() -> void:

	orbit_rotation.x = orbit_limit_x_min + ((orbit_limit_x_max - orbit_limit_x_min) * 0.5)
	camera_actual_distance = camera_min_distance + ((camera_max_distance - camera_min_distance) * 0.5)
	camera_target_distance = camera_min_distance + ((camera_max_distance - camera_min_distance) * 0.5)

	position = Vector3(position.x, position.y, -camera_actual_distance)


func _process(delta: float) -> void:
	if (absf(camera_actual_distance - camera_target_distance) > 0.01):
		camera_actual_distance = lerpf(camera_actual_distance, camera_target_distance, delta * 10)

	camera_target_distance = clamp(
		camera_target_distance,
		camera_min_distance,
		camera_max_distance
	)

	camera_actual_distance = clamp(
		camera_actual_distance,
		camera_min_distance,
		camera_max_distance
	)

	look_at(get_parent_node_3d().global_position)

	orbit_rotation.x = clamp(
		orbit_rotation.x,
		orbit_limit_x_min,
		orbit_limit_x_max
	)
	get_parent_node_3d().global_rotation = Vector3(orbit_rotation.x, orbit_rotation.y, 0)
	position = Vector3(position.x, position.y, -camera_actual_distance)

func _input(event: InputEvent) -> void:
	# zooming
	if (event.is_action_pressed("zoom_in")):
		camera_target_distance -= zoom_sensitivity
	if (event.is_action_pressed("zoom_out")):
		camera_target_distance += zoom_sensitivity

	# orbiting
	if (event.is_action_pressed("orbiting")):
		orbiting = true
	if (event.is_action_released("orbiting")):
		orbiting = false

	# panning
	if (event.is_action_pressed("panning")):
		panning = true
	if (event.is_action_released("panning")):
		panning = false

	if (event is InputEventMouseMotion):
		if (orbiting):
			orbit_rotation.x += event.relative.y * 0.01 * orbit_sensitivity
			orbit_rotation.y -= event.relative.x * 0.01 * orbit_sensitivity

		if (panning):
			var camera_direction_forward_sin = sin(get_parent_node_3d().global_rotation.y)
			var camera_direction_forward_cos = cos(get_parent_node_3d().global_rotation.y)

			var camera_direction_horizontal_sin = sin(
				get_parent_node_3d().global_rotation.y + deg_to_rad(90)
			)
			var camera_direction_horizontal_cos = cos(
				get_parent_node_3d().global_rotation.y + deg_to_rad(90)
			)

			var panning_forward = Vector3(
				camera_direction_forward_sin,
				0,
				camera_direction_forward_cos
			)

			var panning_horizontal = Vector3(
				camera_direction_horizontal_sin,
				0,
				camera_direction_horizontal_cos
			)

			get_parent_node_3d().global_position += (
				panning_forward * (event.relative.y * 0.01 * pan_sensitivity) +
				panning_horizontal * (event.relative.x * 0.01 * pan_sensitivity)
			)
