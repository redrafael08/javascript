import random


file = open('skybox.obj', 'r').read()


#print(repr(file))




n = 0
vertices = ''
while True:
    try:
        startV = file.index('v ',n)
       # print(startV)
        endV = file.index('\n',startV)
       # print(endV)
      #  print(startV+2)
        vertices += file[startV:endV]+'\n'
       # print(file[startV:endV])
        n = endV
    except:
        break



n = 0
texturecoords = ''
while True:
    try:
        startV = file.index('vt ',n)
       # print(startV)
        endV = file.index('\n',startV)
       # print(endV)
      #  print(startV+2)
        texturecoords += file[startV:endV]+'\n'
       # print(file[startV:endV])
        n = endV
    except:
        break


n = 0
shapes = ''
while True:
    try:
        startV = file.index('f ',n)
       # print(startV)
        endV = file.index('\n',startV)
       # print(endV)
      #  print(startV+2)
        shapes += file[startV:endV]+'\n'
       # print(file[startV:endV])
        n = endV
    except:
        break





vertices = vertices.replace('v', '')
vertices = vertices.strip()

vertices = vertices.replace(' ', ',')

vertices = eval(f"[{vertices}]")

newvertices = []
for i in range(int(len(vertices)/3)):
    newvertices.append(vertices[i*3:i*3+3])

#print(len(newvertices))
texturecoords = texturecoords.replace('vt', '')
texturecoords = texturecoords.strip()
texturecoords = texturecoords.replace(' ', ',')
texturecoords = eval(f"[{texturecoords}]")
newtexturecoords = []
for i in range(int(len(texturecoords)/2)):
    newtexturecoords.append(texturecoords[i*2:i*2+2])


#print((newtexturecoords))

shapes = shapes.replace('f', '')
shapes = shapes.strip()

shapes = shapes.split('\n')
newshapes = []

for shape in shapes:
    shape = shape.strip()
    shape = shape.replace('/', ',')
    shape = shape.replace(' ', ',')
    shape = shape[0:]
   # print(shape)
    shape = eval(f"[{shape}]")

    newshape = []
    for i in range(int(len(shape)/3)):
        newshape.append([shape[i*3],shape[i*3+1]])

    newshapes.append(newshape)

#print(len(newshapes))

#print(newshapes)


triangles = []
for shape in newshapes:
   # print('e',shape)
    shapecolor = 1#random.random()/2+0.5
    for i in range(len(shape)-2):
       # print(shape)
        triangles.append([[newvertices[shape[0][0]-1], newtexturecoords[shape[0][1]-1]], [newvertices[shape[i+1][0]-1], newtexturecoords[shape[i+1][1]-1]], [newvertices[shape[i+2][0]-1], newtexturecoords[shape[i+2][1]-1]], shapecolor,shapecolor,shapecolor])
  #  for vertex in shape:

      #  print(vertex)
       # print(newvertices[vertex-1])
print(len(triangles)*3)
for triangle in triangles:
    #print(triangle)
    vertprintlist = []
    for vertex in triangle[:3]:
        vertprintlist.append(f"      {vertex[0][0]},{vertex[0][1]},{vertex[0][2]},   {triangle[3]},{triangle[4]},{triangle[5]},   {vertex[1][0]},{1-vertex[1][1]}")
    print(f"{vertprintlist[0]},{vertprintlist[1]},{vertprintlist[2]},")




import matplotlib.pyplot as plt

plt.figure(figsize=(6, 6))

for tri in triangles:
    uvs = []
    for v in tri[:3]:
        u = v[1][0] 
        vcoord = 1 - v[1][1]   # same flip as WebGL
        uvs.append((u, vcoord))

    # close the triangle
    uvs.append(uvs[0])

    xs = [p[0] for p in uvs]
    ys = [p[1] for p in uvs]

    plt.plot(xs, ys, 'k-', linewidth=0.5)

plt.title("UV Map (WebGL space)")
plt.xlabel("U")
plt.ylabel("V")
plt.xlim(0, 1)
plt.ylim(0, 1)
plt.gca().set_aspect('equal', adjustable='box')
plt.gca().invert_yaxis()  # optional: matches texture image view
plt.show()

