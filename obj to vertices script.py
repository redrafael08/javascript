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

shapes = '''
f 6/1/1 5/2/1 17/3/1 16/4/1 1/5/1 9/6/1
f 8/7/2 1/5/2 16/8/2 18/9/2 2/10/2 11/11/2
f 10/12/3 2/13/3 18/14/3 19/15/3 3/16/3 13/17/3
f 12/18/4 3/16/4 19/19/4 20/20/4 4/21/4 15/22/4
f 14/23/5 4/21/5 20/24/5 17/25/5 5/2/5 7/26/5
f 16/4/6 17/25/6 20/20/6 19/15/6 18/9/6
f 14/23/7 15/22/7 4/21/7
f 12/18/8 13/17/8 3/16/8
f 10/12/9 11/27/9 2/13/9
f 8/7/10 9/6/10 1/5/10
f 6/1/11 7/26/11 5/2/11
'''



vertices = vertices.replace('v', '')
vertices = vertices.strip()

vertices = vertices.replace(' ', ',')

vertices = eval(f"[{vertices}]")

newvertices = []
for i in range(int(len(vertices)/3)):
    newvertices.append(vertices[i*3:i*3+3])


print(newvertices)

shapes = shapes.replace('f', '')
shapes = shapes.strip()

shapes = shapes.split('\n')
newshapes = []
for shape in shapes:
    shape = shape.strip()
    shape = shape.replace('/', ',')
    shape = shape.replace(' ', ',')
    shape = shape[0:]
    shape = eval(f"[{shape}]")

    newshape = []
    for i in range(int(len(shape)/3)):
        newshape.append(shape[i*3])

    newshapes.append(newshape)

print(len(newshapes))


triangles = []
for shape in newshapes:
    shapecolor = random.random()/4+0.5
    for i in range(len(shape)-2):
        triangles.append([newvertices[shape[0]-1], newvertices[shape[i+1]-1], newvertices[shape[i+2]-1], shapecolor,shapecolor,shapecolor])
  #  for vertex in shape:

      #  print(vertex)
       # print(newvertices[vertex-1])

for triangle in triangles:

    vertprintlist = []
    for vertex in triangle[:3]:
        vertprintlist.append(f"{vertex[0]},{vertex[1]},{vertex[2]},   {triangle[3]},{triangle[4]},{triangle[5]}")
    print(f"{vertprintlist[0]},{vertprintlist[1]},{vertprintlist[2]},")





