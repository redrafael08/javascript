import random

vertices = '''
v 0.250000 4.000000 -0.250000
v 0.250000 -4.000000 -0.250000
v 0.250000 4.000000 0.250000
v 0.250000 -4.000000 0.250000
v -0.250000 4.000000 -0.250000
v -0.250000 -4.000000 -0.250000
v -0.250000 4.000000 0.250000
v -0.250000 -4.000000 0.250000
v -2.500000 4.000000 0.250000
v -2.500000 4.500000 0.250000
v -2.500000 4.000000 -0.250000
v -2.500000 4.500000 -0.250000
v 2.500000 4.000000 0.250000
v 2.500000 4.500000 0.250000
v 2.500000 4.000000 -0.250000
v 2.500000 4.500000 -0.250000

'''

texturecoords = '''
vt 0.000000 0.000000
vt 1.000000 0.000000
vt 1.000000 1.000000
vt 0.000000 1.000000
'''

shapes = '''
f 1/1/1 5/2/1 7/3/1 3/4/1
f 4/1/2 3/2/2 7/3/2 8/4/2
f 8/1/3 7/2/3 5/3/3 6/4/3
f 6/1/4 2/2/4 4/3/4 8/4/4
f 2/1/5 1/2/5 3/3/5 4/4/5
f 6/1/6 5/2/6 1/3/6 2/4/6
f 9/1/3 10/2/3 12/3/3 11/4/3
f 11/1/6 12/2/6 16/3/6 15/4/6
f 15/1/5 16/2/5 14/3/5 13/4/5
f 13/1/2 14/2/2 10/3/2 9/4/2
f 11/1/4 15/2/4 13/3/4 9/4/4
f 16/1/1 12/2/1 10/3/1 14/4/1
'''



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
    shapecolor = random.random()/2+0.5
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
        vertprintlist.append(f"      {vertex[0][0]},{vertex[0][1]},{vertex[0][2]},   {triangle[3]},{triangle[4]},{triangle[5]},   {vertex[1][0]},{vertex[1][1]}")
    print(f"{vertprintlist[0]},{vertprintlist[1]},{vertprintlist[2]},")





