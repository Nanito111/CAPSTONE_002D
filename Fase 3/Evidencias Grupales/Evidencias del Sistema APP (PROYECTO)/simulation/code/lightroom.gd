extends OmniLight3D

@onready var user: User = get_node("../User")


func active_light():
	if (not self.visible):
		self.visible = true


func deactivate_light():
	if (self.visible):
		self.visible = false


func _ready():
	DayNight.night_has_started.connect(active_light)
	user.going_to_sleep.connect(deactivate_light)
	if (not user.is_sleeping and DayNight.current_day_state == DayNight.DayStates.NIGHT):
		active_light()
	else:
		deactivate_light()
