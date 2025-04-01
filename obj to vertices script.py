import random

vertices = '''
v 1.000000 -1.000000 -1.000000
v 1.000000 -1.000000 1.000000
v -1.000000 -1.000000 1.000000
v -1.000000 -1.000000 -1.000000
v 1.000000 1.000000 -1
v 1 1.000000 1.000001
v -1.000000 1.000000 1.000000
v -1.000000 1.000000 -1.000000

'''

texturecoords = '''
vt 1.000000 0.333333
vt 1.000000 0.666667
vt 0.666667 0.666667
vt 0.666667 0.333333
vt 0.666667 0.000000
vt 0.000000 0.333333
vt 0.000000 0.000000
vt 0.333333 0.000000
vt 0.333333 1.000000
vt 0.000000 1.000000
vt 0.000000 0.666667
vt 0.333333 0.333333
vt 0.333333 0.666667
vt 1.000000 0.000000
'''

shapes = '''
f 2/1/1 3/2/1 4/3/1
f 8/1/2 7/4/2 6/5/2
f 5/6/3 6/7/3 2/8/3
f 6/8/4 7/5/4 3/4/4
f 3/9/5 7/10/5 8/11/5
f 1/12/6 4/13/6 8/11/6
f 1/4/1 2/1/1 4/3/1
f 5/14/2 8/1/2 6/5/2
f 1/12/3 5/6/3 2/8/3
f 2/12/4 6/8/4 3/4/4
f 4/13/5 3/9/5 8/11/5
f 5/6/6 1/12/6 8/11/6
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





