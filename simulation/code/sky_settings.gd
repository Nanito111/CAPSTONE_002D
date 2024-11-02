class_name SkySettings
extends Resource

@export_group("Light Energy")
@export var sun_light_energy:Curve
@export var moon_light_energy:Curve

@export_group("Light Colors")
@export var sun_light_color:Gradient
@export var moon_light_color:Gradient

@export_group("Ambient Colors")
@export var day_ambient_color:Gradient
@export var night_ambient_color:Gradient
