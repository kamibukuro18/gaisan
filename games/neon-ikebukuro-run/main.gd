extends Node3D

const LANES := [-2.4, 0.0, 2.4]
const JAPANESE_FONT = preload("res://fonts/NotoSansJP.ttf")
const RUNNER_SCENE = preload("res://assets/neon_ikebukuro_run/runner.glb")
const RECRUITER_SCENE = preload("res://assets/neon_ikebukuro_run/recruiter.glb")
const STREET_SCENE = preload("res://assets/neon_ikebukuro_run/street_module.glb")
const GATE_SCENE = preload("res://assets/neon_ikebukuro_run/north_gate.glb")

var player: Node3D
var cam: Camera3D
var street_root: Node3D
var street_segments: Array[Node3D] = []
var recruiter: Node3D
var gate: Node3D
var distance := 0.0
var energy := 100.0
var lane := 1
var speed := 10.0
var normal_speed := 10.0
var combo := 0
var playing := false
var finished := false
var recruiter_timer := 1.5
var attack_cooldown := 0.0
var voice_lines := ["すみません！", "急いでます！", "間に合います！", "結構です！", "駅に向かっています！"]
var recruiter_line := ""
var rng := RandomNumberGenerator.new()

var hud: Label
var status: Label
var bubble: Label
var touch_left: Button
var touch_right: Button
var touch_talk: Button
var retry_button: Button
var volume_slider: HSlider
var mute_button: Button
var muted := false


func _ready():
	rng.seed = 22
	build_world()
	build_ui()
	show_title()


func mat(color: Color, emission := Color.BLACK) -> StandardMaterial3D:
	var material := StandardMaterial3D.new()
	material.albedo_color = color
	material.roughness = 0.78
	if emission != Color.BLACK:
		material.emission_enabled = true
		material.emission = emission
		material.emission_energy_multiplier = 2.5
	return material


func box(pos: Vector3, size: Vector3, color: Color, parent: Node = self, emission := Color.BLACK) -> MeshInstance3D:
	var node := MeshInstance3D.new()
	var mesh := BoxMesh.new()
	mesh.size = size
	node.mesh = mesh
	node.position = pos
	node.material_override = mat(color, emission)
	parent.add_child(node)
	return node


func build_world():
	var env := WorldEnvironment.new()
	var environment := Environment.new()
	environment.background_mode = Environment.BG_COLOR
	environment.background_color = Color("0b1024")
	environment.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	environment.ambient_light_color = Color("8a83bb")
	environment.ambient_light_energy = 0.72
	env.environment = environment
	add_child(env)

	var moon := DirectionalLight3D.new()
	moon.rotation_degrees = Vector3(-54, -28, 0)
	moon.light_energy = 0.82
	moon.light_color = Color("c8c4ec")
	add_child(moon)

	box(Vector3(0, -0.38, -105), Vector3(9.2, 0.5, 240), Color("242633"))
	box(Vector3(-5.2, 0.0, -105), Vector3(0.9, 0.65, 240), Color("171a25"))
	box(Vector3(5.2, 0.0, -105), Vector3(0.9, 0.65, 240), Color("171a25"))
	for z in range(0, -241, -12):
		var left_paver := box(Vector3(-1.45, -0.08, z), Vector3(2.35, 0.04, 0.32), Color("8d9098"))
		left_paver.rotation.y = deg_to_rad(18)
		var right_paver := box(Vector3(1.45, -0.075, z - 2), Vector3(2.35, 0.04, 0.32), Color("424653"))
		right_paver.rotation.y = deg_to_rad(-18)
		for x in [-3.7, 3.7]:
			box(Vector3(x, 0.02, z - 4), Vector3(0.38, 0.05, 1.0), Color("f0eee7"))

	street_root = Node3D.new()
	street_root.name = "IkebukuroNorthStreet"
	add_child(street_root)
	for index in range(24):
		var segment := STREET_SCENE.instantiate() as Node3D
		street_root.add_child(segment)
		segment.position = Vector3(0, 0, -float(index) * 8.0)
		street_segments.append(segment)

	gate = GATE_SCENE.instantiate() as Node3D
	gate.name = "FictionalNeonGate"
	gate.position = Vector3(0, 0, -3.8)
	gate.scale = Vector3.ONE * 1.12
	street_root.add_child(gate)
	var gate_white := Color("f4f0e6")
	var gate_red := Color("d83b47")
	for index in range(5):
		var gate_panel := box(Vector3((index - 2) * 1.72, 4.65, -3.45), Vector3(1.48, 0.6, 0.2), gate_white, street_root)
		gate_panel.rotation.z = deg_to_rad(-8 if index < 2 else (8 if index > 2 else 0))
	box(Vector3(0, 4.05, -3.45), Vector3(8.8, 0.22, 0.24), gate_red, street_root, gate_red)

	player = RUNNER_SCENE.instantiate() as Node3D
	player.name = "RunnerHuman"
	player.position = Vector3(0, 0, 4)
	player.scale = Vector3.ONE * 0.95
	add_child(player)

	cam = Camera3D.new()
	cam.position = Vector3(0, 3.65, 10.3)
	cam.rotation_degrees = Vector3(-12.5, 0, 0)
	add_child(cam)
	cam.look_at(Vector3(0, 1.1, -24.0), Vector3.UP)
	cam.make_current()


func build_ui():
	var layer := CanvasLayer.new()
	add_child(layer)
	hud = Label.new()
	hud.position = Vector2(24, 18)
	layer.add_child(hud)
	status = Label.new()
	status.set_anchors_preset(Control.PRESET_FULL_RECT)
	status.offset_left = 18
	status.offset_top = 250
	status.offset_right = -18
	status.offset_bottom = -250
	status.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	status.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	status.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layer.add_child(status)
	bubble = Label.new()
	bubble.set_anchors_preset(Control.PRESET_FULL_RECT)
	bubble.offset_left = 24
	bubble.offset_top = 430
	bubble.offset_right = -24
	bubble.offset_bottom = -40
	bubble.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	bubble.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	bubble.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	layer.add_child(bubble)
	for control in [hud, status, bubble]:
		control.add_theme_font_override("font", JAPANESE_FONT)

	touch_left = make_button(layer, "←", 0.02, 0.82, 0.18, 0.98)
	touch_left.pressed.connect(_press_left)
	touch_right = make_button(layer, "→", 0.82, 0.82, 0.98, 0.98)
	touch_right.pressed.connect(_press_right)
	touch_talk = make_button(layer, "会話", 0.35, 0.82, 0.65, 0.98)
	touch_talk.pressed.connect(_press_talk)
	retry_button = make_button(layer, "リトライ", 0.39, 0.68, 0.61, 0.77)
	retry_button.visible = false
	retry_button.pressed.connect(restart_game)
	volume_slider = HSlider.new()
	volume_slider.set_anchors_preset(Control.PRESET_FULL_RECT)
	volume_slider.anchor_left = 0.70
	volume_slider.anchor_top = 0.02
	volume_slider.anchor_right = 0.86
	volume_slider.anchor_bottom = 0.07
	volume_slider.min_value = -30
	volume_slider.max_value = 0
	volume_slider.value = -6
	volume_slider.tooltip_text = "音量"
	volume_slider.value_changed.connect(_on_volume_changed)
	layer.add_child(volume_slider)
	mute_button = make_button(layer, "消音", 0.56, 0.02, 0.69, 0.07)
	mute_button.add_theme_font_size_override("font_size", 16)
	mute_button.pressed.connect(_toggle_mute)
	_on_volume_changed(volume_slider.value)
	get_viewport().size_changed.connect(_on_viewport_resized)
	_on_viewport_resized()


func make_button(layer: CanvasLayer, text_value: String, left: float, top: float, right: float, bottom: float) -> Button:
	var button := Button.new()
	button.text = text_value
	button.set_anchors_preset(Control.PRESET_FULL_RECT)
	button.anchor_left = left
	button.anchor_top = top
	button.anchor_right = right
	button.anchor_bottom = bottom
	button.offset_left = 8
	button.offset_top = 8
	button.offset_right = -8
	button.offset_bottom = -8
	button.add_theme_font_override("font", JAPANESE_FONT)
	button.add_theme_font_size_override("font_size", 22)
	layer.add_child(button)
	return button


func _on_viewport_resized():
	var width := get_viewport().get_visible_rect().size.x
	var compact := width < 600.0
	hud.position = Vector2(16, 126 if compact else 18)
	hud.add_theme_font_size_override("font_size", 18 if compact else 24)
	status.offset_left = 12 if compact else 18
	status.offset_right = -12 if compact else -18
	status.offset_top = 210 if compact else 250
	status.offset_bottom = -230 if compact else -250
	status.add_theme_font_size_override("font_size", clamp(int(width * 0.045), 16, 30) if compact else clamp(int(width * 0.033), 24, 42))
	bubble.offset_left = 12 if compact else 24
	bubble.offset_right = -12 if compact else -24
	bubble.add_theme_font_size_override("font_size", clamp(int(width * 0.035), 14, 20) if compact else clamp(int(width * 0.019), 16, 24))


func _press_left():
	if not playing:
		start_game()
	lane = maxi(0, lane - 1)


func _press_right():
	if not playing:
		start_game()
	lane = mini(2, lane + 1)


func _press_talk():
	if not playing:
		start_game()
	else:
		decline()


func _on_volume_changed(db: float):
	AudioServer.set_bus_volume_db(0, db)
	if OS.has_feature("web"):
		JavaScriptBridge.eval("if (typeof window.neonVoiceSetVolume === 'function') { window.neonVoiceSetVolume(" + str(db_to_linear(db)) + "); }")


func _toggle_mute():
	muted = not muted
	AudioServer.set_bus_mute(0, muted)
	mute_button.text = "音量ON" if muted else "消音"
	if OS.has_feature("web"):
		JavaScriptBridge.eval("if (typeof window.neonVoiceSetMuted === 'function') { window.neonVoiceSetMuted(" + str(muted).to_lower() + "); }")


func show_title():
	status.text = "NEON IKEBUKURO RUN\n\nA/D・←/→：よける　 SPACE / J：急いでます！\n\nクリック / SPACE でスタート"
	bubble.text = "架空の北口商店街・NEON GATE"
	hud.text = ""
	playing = false
	finished = false


func _unhandled_input(event):
	if event is InputEventKey and event.pressed:
		if not playing and (event.keycode == KEY_SPACE or event.keycode == KEY_ENTER):
			start_game()
		elif playing:
			if event.is_action_pressed("move_left"):
				lane = maxi(0, lane - 1)
			if event.is_action_pressed("move_right"):
				lane = mini(2, lane + 1)
			if event.is_action_pressed("decline"):
				decline()
	if event is InputEventScreenTouch and event.pressed:
		if not playing:
			start_game()
		elif event.position.y > get_viewport().get_visible_rect().size.y * 0.78:
			if event.position.x < get_viewport().get_visible_rect().size.x * 0.25:
				lane = maxi(0, lane - 1)
			elif event.position.x > get_viewport().get_visible_rect().size.x * 0.75:
				lane = mini(2, lane + 1)
			else:
				decline()


func restart_game():
	retry_button.disabled = true
	get_tree().change_scene_to_file("res://main.tscn")


func start_game():
	playing = true
	finished = false
	retry_button.visible = false
	retry_button.disabled = false
	distance = 0.0
	energy = 100.0
	lane = 1
	recruiter_timer = 1.5
	attack_cooldown = 0.0
	combo = 0
	speed = normal_speed
	player.position = Vector3(0, 0, 4)
	cam.position = Vector3(0, 3.65, 10.3)
	if recruiter:
		recruiter.queue_free()
		recruiter = null
	for index in range(street_segments.size()):
		street_segments[index].position.z = -float(index) * 8.0
	status.text = "池袋北口風の路地を突破！"
	bubble.text = "客引きの吹き出しを SPACE / 会話 で迎撃"
	speak("駅に行きたいんだよ！")


func decline():
	if not playing or attack_cooldown > 0.0:
		return
	attack_cooldown = 0.65
	if recruiter and abs(recruiter.position.z - player.position.z) < 9.0:
		var reply: String = voice_lines[rng.randi_range(0, voice_lines.size() - 1)]
		combo += 1
		energy = minf(100.0, energy + 8.0)
		speed = 4.0
		status.text = "「%s」\n\nCONVERSATION HIT!  ×%d" % [reply, combo]
		bubble.text = "吹き出し撃破！ コンボ継続！"
		speak(reply)
		recruiter.queue_free()
		recruiter = null
	else:
		bubble.text = "まだ相手がいない！ タイミングを合わせよう"


func spawn_recruiter():
	var incoming_lane := rng.randi_range(0, 2)
	recruiter_line = voice_lines[rng.randi_range(0, voice_lines.size() - 1)]
	recruiter = RECRUITER_SCENE.instantiate() as Node3D
	recruiter.name = "FictionalRecruiter"
	recruiter.position = Vector3(LANES[incoming_lane], 0, player.position.z - 34.0)
	recruiter.scale = Vector3.ONE * 0.86
	add_child(recruiter)
	bubble.text = "声かけ予告：『%s』\n会話 / SPACE で迎撃" % recruiter_line


func animate_human(root: Node3D, phase: float, gesture := false):
	if not root:
		return
	var left_arm := root.find_child("ArmLUpper", true, false) as Node3D
	var right_arm := root.find_child("ArmRUpper", true, false) as Node3D
	var left_leg := root.find_child("LegL", true, false) as Node3D
	var right_leg := root.find_child("LegR", true, false) as Node3D
	if left_arm:
		left_arm.rotation.z = sin(phase * 8.0) * 0.28 + (0.35 if gesture else 0.0)
	if right_arm:
		right_arm.rotation.z = -sin(phase * 8.0) * 0.28 - (0.55 if gesture else 0.0)
	if left_leg:
		left_leg.rotation.z = sin(phase * 8.0) * 0.16
	if right_leg:
		right_leg.rotation.z = -sin(phase * 8.0) * 0.16
	root.position.y = sin(phase * 8.0) * 0.035


func _process(delta):
	if not playing:
		return
	var frame_delta := minf(delta, 0.05)
	var phase := Time.get_ticks_msec() / 1000.0
	attack_cooldown = maxf(0.0, attack_cooldown - frame_delta)
	distance += speed * frame_delta
	player.position.z -= speed * frame_delta
	player.position.x = lerpf(player.position.x, LANES[lane], frame_delta * 10.0)
	cam.position.z = player.position.z + 6.3
	animate_human(player, phase)
	if recruiter:
		recruiter.position.z += speed * frame_delta
		animate_human(recruiter, phase, true)
		if recruiter.position.z > player.position.z + 1.6:
			if abs(recruiter.position.x - player.position.x) > 0.8:
				combo += 1
				status.text = "ひらり回避！  ×%d" % combo
				bubble.text = "自転車の横をすり抜けた！"
				energy = minf(100.0, energy + 3.0)
			else:
				energy -= 22.0
				status.text = "客引きに捕まった！"
				bubble.text = "「%s」に足止めされた！  -22 FOCUS" % recruiter_line
			recruiter.queue_free()
			recruiter = null
	recruiter_timer -= frame_delta
	if recruiter_timer <= 0.0 and not recruiter:
		spawn_recruiter()
		recruiter_timer = 4.5 + rng.randf_range(0.0, 2.0)
	var farthest_z := player.position.z - 190.0
	for segment in street_segments:
		if segment.position.z > player.position.z + 14.0:
			segment.position.z = farthest_z
			farthest_z -= 8.0
	hud.text = "DISTANCE  %03dm / 800m     FOCUS  %d%%" % [int(distance), int(energy)]
	if energy <= 0.0:
		fail()
	elif distance >= 800.0:
		win()


func fail():
	finished = true
	playing = false
	status.text = "つかまった！\n\nSPACE / ENTER でリトライ"
	bubble.text = "もう一度、街の流れを読もう。"
	retry_button.visible = true
	speak("つかまった！")


func win():
	finished = true
	playing = false
	status.text = "GOAL！ 駅に到着！\n\nCONVOY COMBO ×%d\nSPACE / ENTER でリトライ" % combo
	bubble.text = "架空の NEON GATE を突破したよ！クリア！"
	retry_button.visible = true
	speak("ゴール！駅に到着！")


func speak(text: String):
	if OS.has_feature("web"):
		JavaScriptBridge.eval("if (typeof window.neonSpeak === 'function') { window.neonSpeak(" + JSON.stringify(text) + "); }")
