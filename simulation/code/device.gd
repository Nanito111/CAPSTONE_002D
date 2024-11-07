class_name Device
extends Node3D

@export var device_data: DeviceData
# @onready var device_mesh_parent: Node3D = get_node("mesh")
var is_being_use: bool

func start_using():
	is_being_use = true
	prints("start using device ", device_data.name)

func stop_using():
	is_being_use = false
	prints("stop using device ", device_data.name)

func _ready():
	self.name = device_data.name
