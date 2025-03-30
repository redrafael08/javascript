import random

vertices = '''
v 0.216895 0.431983 0.635348
v -0.567850 0.359418 0.392663
v -0.567850 0.359418 -0.538387
v 0.216895 0.316459 -0.635348
v 0.656733 0.430465 0.000000
v 0.746341 0.000000 0.230801
v 0.746341 0.000000 -0.230801
v 0.000000 0.000000 0.746898
v 0.461264 0.000000 0.604253
v -0.746341 0.000000 0.230801
v -0.461264 0.000000 0.604253
v -0.409550 0.000000 -0.688039
v -0.746341 0.000000 -0.230801
v 0.508497 0.000000 -0.685735
v 0.000000 0.000000 -0.901586
v 0.127487 0.683647 0.373445
v 0.412566 0.650941 0.058112
v -0.333771 0.683647 0.230800
v -0.333771 0.574645 -0.309413
v 0.127487 0.682858 -0.414821
'''

texturecoords = '''
vt 0.500000 1.000000
vt 0.933013 0.750000
vt 0.933013 0.250000
vt 0.500000 0.000000
vt 0.066987 0.250000
vt 0.066987 0.750000
vt 0.975528 0.654508
vt 0.793893 0.095491
vt 0.206107 0.095492
vt 0.024472 0.654509
vt 0.000000 0.000000
vt 1.000000 0.000000
vt 1.000000 1.000000
'''

shapes = '''
f 6/1/1 5/2/1 17/3/1 16/4/1 1/5/1 9/6/1
f 8/1/2 1/2/2 16/3/2 18/4/2 2/5/2 11/6/2
f 10/1/3 2/2/3 18/3/3 19/4/3 3/5/3 13/6/3
f 12/1/4 3/2/4 19/3/4 20/4/4 4/5/4 15/6/4
f 14/1/5 4/2/5 20/3/5 17/4/5 5/5/5 7/6/5
f 16/1/6 17/7/6 20/8/6 19/9/6 18/10/6
f 14/11/7 15/12/7 4/13/7
f 12/11/8 13/12/8 3/13/8
f 10/11/9 11/12/9 2/13/9
f 8/11/10 9/12/10 1/13/10
f 6/11/11 7/12/11 5/13/11
'''



vertices = vertices.replace('v', '')
vertices = vertices.strip()

vertices = vertices.replace(' ', ',')

vertices = eval(f"[{vertices}]")

newvertices = []
for i in range(int(len(vertices)/3)):
    newvertices.append(vertices[i*3:i*3+3])


texturecoords = texturecoords.replace('vt', '')
texturecoords = texturecoords.strip()
texturecoords = texturecoords.replace(' ', ',')
texturecoords = eval(f"[{texturecoords}]")
newtexturecoords = []
for i in range(int(len(texturecoords)/2)):
    newtexturecoords.append(texturecoords[i*2:i*2+2])


print((newtexturecoords))

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
    shapecolor = random.random()/4+0.5
    for i in range(len(shape)-2):
        print(shape)
        triangles.append([[newvertices[shape[0][0]-1], newtexturecoords[shape[0][1]-1]], [newvertices[shape[i+1][0]-1], newtexturecoords[shape[i+1][1]-1]], [newvertices[shape[i+2][0]-1], newtexturecoords[shape[i+2][1]-1]], shapecolor,shapecolor,shapecolor])
  #  for vertex in shape:

      #  print(vertex)
       # print(newvertices[vertex-1])

for triangle in triangles:
    #print(triangle)
    vertprintlist = []
    for vertex in triangle[:3]:
        vertprintlist.append(f"      {vertex[0][0]},{vertex[0][1]},{vertex[0][2]},   {triangle[3]},{triangle[4]},{triangle[5]},   {vertex[1][0]},{vertex[1][1]}")
    print(f"{vertprintlist[0]},{vertprintlist[1]},{vertprintlist[2]},")





