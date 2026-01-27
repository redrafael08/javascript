import matplotlib.pyplot as plt


# OBJ formatter that respects existing vertex normals only

vertices = []
texcoords = []
normals = []
faces = []

# ---------------- LOAD OBJ ---------------- #

with open("blender objects/skybox.obj", "r") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        parts = line.split()

        if parts[0] == "v":
            vertices.append(list(map(float, parts[1:4])))

        elif parts[0] == "vt":
            texcoords.append(list(map(float, parts[1:3])))

        elif parts[0] == "vn":
            normals.append(list(map(float, parts[1:4])))

        elif parts[0] == "f":
            face = []
            for v in parts[1:]:
                # supports v, v/vt, v//vn, v/vt/vn
                idx = v.split("/")
                vi = int(idx[0]) - 1
                ti = int(idx[1]) - 1 if len(idx) > 1 and idx[1] else None
                ni = int(idx[2]) - 1 if len(idx) > 2 and idx[2] else None
                face.append((vi, ti, ni))
            faces.append(face)

# ---------------- TRIANGULATE ---------------- #

triangles = []
for face in faces:
    for i in range(1, len(face) - 1):
        triangles.append((face[0], face[i], face[i + 1]))



plt.figure(figsize=(6, 6))

for tri in triangles:
    uv = []
    for vi, ti, ni in tri:
        if ti is None:
            continue
        u, v = texcoords[ti]
        uv.append((u, v))

    if len(uv) == 3:
        uv.append(uv[0])  # close triangle
        xs, ys = zip(*uv)
        plt.plot(xs, ys, "k-", linewidth=0.5)
'''
plt.title("OBJ UV Map")
plt.xlabel("U")
plt.ylabel("V")
plt.axis("equal")
plt.grid(True)

# Uncomment if your texture appears upside-down
# plt.gca().invert_yaxis()

plt.show()

''' 

# ---------------- EXPORT ---------------- #


print(len(triangles)*3)
with open("object.txt", "w") as out:
   

    for tri in triangles:
        for vi, ti, ni in tri:
            v = vertices[vi]
            # Flip V for WebGL
            if ti is not None:
                u, v_uv = texcoords[ti]
                t = (u, 1.0 - v_uv)
            else:
                t = (0.0, 0.0)

            n = normals[ni] if ni is not None else (0.0, 0.0, 0.0)

            out.write(
                f"{v[0]:.6f},{v[1]:.6f},{v[2]:.6f}, "
                f"{n[0]:.6f},{n[1]:.6f},{n[2]:.6f}, "
                f"{t[0]:.6f},{t[1]:.6f},\n"
            )
