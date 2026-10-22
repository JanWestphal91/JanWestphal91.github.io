# ═══ Blender-Modell → GLB für die 3D-Viewer der Website ═══════════════
#
# Aufruf (Blender 4.2 oder neuer, im Projektordner):
#
#   blender --background modell.blend --python _build/blender-export-glb.py -- Images/3D/modell.glb
#
# Objekte, die nicht mit sollen (z. B. ein Boden-Würfel), hinten anhängen:
#
#   ... -- Images/3D/bruecke.glb Cube
#
# Ohne Animationen, als festes Modell in der Grundhaltung des Rigs:
#
#   ... -- Images/3D/ente.glb --static
#
# Danach die Datei verkleinern (etwa auf ein Drittel):
#
#   npx @gltf-transform/cli meshopt Images/3D/modell.glb Images/3D/modell.glb
#
# Was das Skript macht:
#   - exportiert alle sichtbaren Meshes, bei einem Rig auch Skin und alle
#     Actions als Animationen (nur Deform-Knochen, Constraints werden gebacken);
#     mit --static wird die Grundhaltung fest ins Mesh übernommen
#   - wendet alle Modifier außer der Armatur an
#   - trianguliert selbst und schreibt an jede Dreiecksecke das Attribut
#     _EDGE: 1 = die gegenüberliegende Kante ist eine echte Kante aus Blender,
#     0 = eine Diagonale, die erst beim Triangulieren entsteht. Damit zeigt
#     die Ansicht „Topologie“ im Viewer Quads statt Dreiecke.
#   - speichert Kennzahlen (Flächen, Quad-Anteil, Punkte) in der Szene,
#     der Viewer zeigt sie unter dem Modell an
#
# Die .blend-Datei selbst wird nicht verändert.
import bpy, bmesh, sys

args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if args and args[0].endswith(".blend"):          # Aufruf ohne Blender-Oberfläche als Python-Modul
    bpy.ops.wm.open_mainfile(filepath=args.pop(0))
if not args:
    sys.exit("Bitte die Zieldatei angeben, z. B. -- Images/3D/modell.glb")
static = "--static" in args
args = [a for a in args if a != "--static"]
out, skip = args[0], set(args[1:])

if bpy.context.object and bpy.context.object.mode != "OBJECT":
    bpy.ops.object.mode_set(mode="OBJECT")

stats = {"verts": 0, "faces": 0, "quads": 0, "tris": 0, "ngons": 0}
meshes = [o for o in bpy.data.objects if o.type == "MESH" and o.visible_get()
          and not o.name.startswith("WGT") and o.name not in skip and len(o.data.polygons)]
for o in bpy.data.objects:
    o.select_set(False)

for o in meshes:
    # Armatur-Modifier auf ein ausgeblendetes Rig entfernen
    for m in list(o.modifiers):
        if m.type == "ARMATURE" and m.object and not m.object.visible_get():
            o.modifiers.remove(m)
    if o.data.users > 1:
        o.data = o.data.copy()
    bpy.context.view_layer.objects.active = o
    if static:
        for m in o.modifiers:
            if m.type == "ARMATURE" and m.object:
                m.object.data.pose_position = "REST"
    for m in list(o.modifiers):
        if static or m.type != "ARMATURE":
            with bpy.context.temp_override(object=o, active_object=o):
                bpy.ops.object.modifier_apply(modifier=m.name)

    me = o.data
    for p in me.polygons:
        n = len(p.vertices)
        stats["quads" if n == 4 else "tris" if n == 3 else "ngons"] += 1
    stats["verts"] += len(me.vertices)
    stats["faces"] += len(me.polygons)

    bm = bmesh.new()
    bm.from_mesh(me)
    res = bmesh.ops.triangulate(bm, faces=bm.faces[:], quad_method="BEAUTY", ngon_method="BEAUTY")
    diagonals = set(res["edges"])
    layer = bm.loops.layers.float.new("_EDGE")
    for f in bm.faces:
        for loop in f.loops:
            # Kante gegenüber dieser Ecke = Kante der nächsten Ecke
            loop[layer] = 0.0 if loop.link_loop_next.edge in diagonals else 1.0
    bm.to_mesh(me)
    bm.free()
    o.select_set(True)

if static:
    for o in meshes:                      # Mesh steht jetzt für sich, ohne Rig
        if o.parent and o.parent.type == "ARMATURE":
            mw = o.matrix_world.copy()
            o.parent = None
            o.matrix_world = mw
rigs = [] if static else [o for o in bpy.data.objects if o.type == "ARMATURE" and o.visible_get()]
for r in rigs:
    r.select_set(True)

bpy.context.scene["jw_topology"] = dict(stats, actions=len(bpy.data.actions) if rigs else 0)
options = dict(filepath=out, export_format="GLB", use_selection=True, export_apply=False,
               export_extras=True, export_attributes=True, export_yup=True, export_materials="EXPORT")
if rigs:
    options.update(export_animations=True, export_animation_mode="ACTIONS", export_def_bones=True,
                   export_force_sampling=True, export_optimize_animation_size=True, export_skins=True)
else:
    options.update(export_animations=False)
bpy.ops.export_scene.gltf(**options)
print("Fertig:", out, stats)
