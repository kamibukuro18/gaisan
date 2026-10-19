import bpy
import math
import sys
from mathutils import Vector
from pathlib import Path


def output_dir() -> Path:
    argv = sys.argv
    if "--" in argv:
        index = argv.index("--")
        if index + 1 < len(argv):
            return Path(argv[index + 1]).resolve()
    return Path.cwd().resolve() / "assets"


OUT = output_dir()
OUT.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def mat(name, color, metallic=0.0, roughness=0.65, emission=None):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    shader = nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    if emission:
        input_name = "Emission Color" if "Emission Color" in shader.inputs else "Emission"
        shader.inputs[input_name].default_value = (*emission, 1.0)
        if "Emission Strength" in shader.inputs:
            shader.inputs["Emission Strength"].default_value = 3.0
    return material


def apply_mat(obj, material):
    obj.data.materials.append(material)
    return obj


def box(name, loc, dims, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_mat(obj, material)
    if bevel:
        modifier = obj.modifiers.new("Soft edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
    return obj


def sphere(name, loc, scale, material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=12, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    apply_mat(obj, material)
    return obj


def cylinder_between(name, start, end, radius, material, vertices=12):
    start = Vector(start)
    end = Vector(end)
    direction = end - start
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=direction.length, location=(start + end) / 2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(direction.normalized())
    apply_mat(obj, material)
    return obj


def text_obj(name, body, loc, size, material, rotation=(math.pi / 2, 0, 0)):
    curve = bpy.data.curves.new(name, type="FONT")
    curve.body = body
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    curve.size = size
    curve.extrude = 0.015
    curve.bevel_depth = 0.004
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler = rotation
    apply_mat(obj, material)
    return obj


def export_glb(filename, merge_meshes=False):
    if merge_meshes:
        mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
        bpy.ops.object.select_all(action="DESELECT")
        for obj in mesh_objects:
            obj.select_set(True)
        if mesh_objects:
            bpy.context.view_layer.objects.active = mesh_objects[0]
            bpy.ops.object.join()
    bpy.ops.object.select_all(action="SELECT")
    bpy.context.view_layer.objects.active = bpy.context.selected_objects[0] if bpy.context.selected_objects else None
    bpy.ops.export_scene.gltf(
        filepath=str(OUT / filename),
        export_format="GLB",
        export_materials="EXPORT",
        export_apply=False,
        export_cameras=False,
        export_lights=False,
    )


def build_human(filename, jacket_color, gesture="run"):
    clear_scene()
    skin = mat("Skin", (0.82, 0.46, 0.32), roughness=0.8)
    hair = mat("Hair", (0.035, 0.025, 0.05), roughness=0.4)
    jacket = mat("Jacket", jacket_color, roughness=0.55)
    shirt = mat("Shirt", (0.92, 0.88, 0.78), roughness=0.7)
    pants = mat("Pants", (0.08, 0.11, 0.19), roughness=0.75)
    shoe = mat("Shoes", (0.035, 0.04, 0.06), metallic=0.15, roughness=0.35)
    eye = mat("Eyes", (0.02, 0.02, 0.03), roughness=0.2)
    accent = mat("Accent", (0.1, 0.85, 1.0), emission=(0.1, 0.85, 1.0))

    box("Torso", (0, 1.35, 0), (0.82, 1.05, 0.5), jacket, bevel=0.1)
    box("ShirtFront", (0, 1.45, 0.27), (0.32, 0.5, 0.035), shirt, bevel=0.02)
    box("Pelvis", (0, 0.78, 0), (0.72, 0.32, 0.46), pants, bevel=0.06)
    cylinder_between("Neck", (0, 1.82, 0), (0, 1.98, 0), 0.12, skin)
    sphere("Head", (0, 2.28, 0), (0.39, 0.44, 0.36), skin)
    sphere("HairCap", (0, 2.54, -0.01), (0.405, 0.24, 0.37), hair)
    sphere("EyeL", (-0.13, 2.3, 0.34), (0.045, 0.07, 0.025), eye)
    sphere("EyeR", (0.13, 2.3, 0.34), (0.045, 0.07, 0.025), eye)
    box("Visor", (0, 2.16, 0.345), (0.45, 0.035, 0.06), accent, bevel=0.015)

    shoulders = [(-0.52, 1.63, 0), (0.52, 1.63, 0)]
    hands = [(-0.7, 0.74, 0.05), (0.7, 1.18, 0.1)] if gesture == "run" else [(-0.7, 1.08, 0.1), (0.78, 1.95, 0.12)]
    for side, (shoulder, hand) in enumerate(zip(shoulders, hands)):
        label = "L" if side == 0 else "R"
        elbow = ((shoulder[0] + hand[0]) * 0.55, (shoulder[1] + hand[1]) * 0.55, 0.02)
        cylinder_between(f"Arm{label}Upper", shoulder, elbow, 0.12, jacket)
        cylinder_between(f"Arm{label}Lower", elbow, hand, 0.105, jacket)
        sphere(f"Hand{label}", hand, (0.13, 0.13, 0.13), skin)

    leg_l = [(-0.25, 0.72, 0), (-0.28, 0.1, 0.14 if gesture == "run" else 0)]
    leg_r = [(0.25, 0.72, 0), (0.29, 0.1, -0.12 if gesture == "run" else 0)]
    for label, points in (("L", leg_l), ("R", leg_r)):
        cylinder_between(f"Leg{label}", points[0], points[1], 0.15, pants)
        foot = (points[1][0], 0.05, points[1][2] + 0.2)
        box(f"Shoe{label}", foot, (0.32, 0.16, 0.52), shoe, bevel=0.06)
        box(f"Sole{label}", (foot[0], 0.0, foot[2] + 0.03), (0.34, 0.045, 0.55), accent, bevel=0.015)
    box("BackTag", (0, 1.52, -0.28), (0.34, 0.16, 0.03), accent, bevel=0.01)
    export_glb(filename)


def build_street():
    clear_scene()
    wall_l = mat("WallL", (0.18, 0.12, 0.25), roughness=0.85)
    wall_r = mat("WallR", (0.12, 0.17, 0.25), roughness=0.85)
    trim = mat("Trim", (0.46, 0.26, 0.38), roughness=0.5)
    glass = mat("Glass", (0.04, 0.34, 0.46), metallic=0.15, roughness=0.2, emission=(0.02, 0.2, 0.3))
    magenta = mat("MagentaSign", (0.9, 0.12, 0.62), emission=(0.9, 0.12, 0.62))
    cyan = mat("CyanSign", (0.12, 0.8, 0.95), emission=(0.12, 0.8, 0.95))
    warm = mat("WarmLight", (1.0, 0.45, 0.14), emission=(1.0, 0.22, 0.04))
    concrete = mat("Concrete", (0.25, 0.28, 0.34), roughness=0.95)
    cable = mat("Cable", (0.015, 0.02, 0.035), roughness=0.5)
    vending = mat("Vending", (0.16, 0.55, 0.66), metallic=0.25, roughness=0.3, emission=(0.05, 0.25, 0.35))

    box("BuildingLeft", (-5.4, 3.8, 0), (3.7, 7.6, 8.0), wall_l)
    box("BuildingRight", (5.4, 3.4, 0), (3.7, 6.8, 8.0), wall_r)
    for side, x, facade_x, sign_mat in (("L", -5.4, -3.48, magenta), ("R", 5.4, 3.48, cyan)):
        for row, y in enumerate((1.7, 3.25, 4.8, 6.25)):
            for col, z in enumerate((-2.6, 0.0, 2.6)):
                box(f"Window{side}{row}{col}", (facade_x, y, z), (0.08, 0.75, 1.1), glass, bevel=0.025)
        box(f"ShopFrame{side}", (facade_x, 0.75, 0), (0.12, 1.25, 5.8), trim, bevel=0.03)
        for z in (-2.3, 0, 2.3):
            box(f"VerticalSign{side}{z}", (facade_x - 0.12 if side == "L" else facade_x + 0.12, 3.1, z), (0.16, 1.7, 0.52), sign_mat, bevel=0.03)
        box(f"Awning{side}", (facade_x, 1.42, 0), (0.28, 0.13, 6.0), warm, bevel=0.03)
        box(f"AC{side}", (x + (1.55 if side == "L" else -1.55), 2.0, -1.5), (0.65, 0.55, 0.8), concrete, bevel=0.08)
        box(f"ACGrill{side}", (x + (1.2 if side == "L" else -1.2), 2.0, -1.5), (0.04, 0.35, 0.55), cable)
        box(f"Vending{side}", (x + (1.3 if side == "L" else -1.3), 1.2, 2.0), (0.75, 1.8, 0.55), vending, bevel=0.08)
        for row in range(3):
            box(f"VendingGlow{side}{row}", (x + (0.9 if side == "L" else -0.9), 1.55 - row * 0.35, 2.0), (0.03, 0.15, 0.32), warm if row == 0 else glass, bevel=0.01)
    for z in (-3.0, -0.4, 2.2):
        cylinder_between(f"OverheadCable{z}", (-4.2, 6.7, z), (4.2, 6.4, z + 1.3), 0.035, cable, vertices=8)
    for x in (-3.8, 3.8):
        cylinder_between(f"LampPost{x}", (x, 0.0, 1.0), (x, 4.0, 1.0), 0.06, cable, vertices=8)
        box(f"Lamp{x}", (x, 4.1, 1.0), (0.32, 0.12, 0.56), warm, bevel=0.02)
    box("SidewalkLeft", (-3.8, 0.05, 0), (0.7, 0.2, 8.0), concrete)
    box("SidewalkRight", (3.8, 0.05, 0), (0.7, 0.2, 8.0), concrete)
    export_glb("street_module.glb", merge_meshes=True)


def build_gate():
    clear_scene()
    white = mat("GateWhite", (0.9, 0.88, 0.82), roughness=0.5)
    red = mat("GateRed", (0.9, 0.08, 0.12), emission=(0.75, 0.04, 0.02))
    dark = mat("GateFrame", (0.04, 0.04, 0.07), metallic=0.25, roughness=0.35)
    for index, x in enumerate((-3.8, -1.9, 0, 1.9, 3.8)):
        bpy.ops.mesh.primitive_cone_add(vertices=3, radius1=0.92, radius2=0.92, depth=0.22, location=(x, 5.8, -3.7))
        panel = bpy.context.object
        panel.name = f"GateTriangle{index}"
        panel.scale = (1.0, 0.82, 1.0)
        panel.rotation_euler[2] = math.radians(-8 if x < 0 else 8)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        apply_mat(panel, white)
    box("GateBeam", (0, 5.15, -3.7), (9.2, 0.25, 0.35), dark, bevel=0.04)
    cylinder_between("GatePostL", (-4.55, 0, -3.7), (-4.55, 5.2, -3.7), 0.13, dark)
    cylinder_between("GatePostR", (4.55, 0, -3.7), (4.55, 5.2, -3.7), 0.13, dark)
    text_obj("GateTitle", "NEON GATE", (0, 5.2, -3.95), 0.68, red, rotation=(math.pi / 2, 0, 0))
    text_obj("GateSubtitle", "NORTH SIDE", (0, 4.55, -3.95), 0.22, red, rotation=(math.pi / 2, 0, 0))
    export_glb("north_gate.glb")


build_human("runner.glb", (0.08, 0.5, 0.82), "run")
build_human("recruiter.glb", (0.72, 0.08, 0.16), "gesture")
build_street()
build_gate()
print(f"NEON_ASSETS_READY {OUT}")
