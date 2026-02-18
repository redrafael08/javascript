// view matrix opstel functie
//3DGE. (z.d.)
function lookAt(eye, front) {
   const up = [0, 1, 0];
   const frontNorm = normalize(front);
   const right = normalize(crossProduct(up, frontNorm));           
   const upNorm = normalize(crossProduct(frontNorm, right));

   return [
      right[0], upNorm[0], -frontNorm[0], 0,
      right[1], upNorm[1], -frontNorm[1], 0,
      right[2], upNorm[2], -frontNorm[2], 0,
      -dotProduct(right, eye), -dotProduct(upNorm, eye), dotProduct(frontNorm, eye), 1
   ];
}

// reken functies
function normalize(v) {
   const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
   return [v[0] / length, v[1] / length, v[2] / length];
}

function crossProduct(a, b) {
   return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
   ];
}

function dotProduct(a, b) {
   return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function difference(a, b) {
   return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVector(a, b) {
   return [a * b[0], a * b[1], a * b[2]];
}

function addVector(a, b) {
   return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function distance(a, b) {
   let diff = difference(a, b);
   return Math.sqrt(diff[0]**2 + diff[1]**2 + diff[2]**2);
}

function facingObject(objectPos) {
   let pos = cameraPos;
   for (let i = 0; i < 5; i++) {
      pos = addVector(pos, front);
      if (distance(pos, objectPos) <= 10 && pos[1] > -1) return true;
   }
   return false;
}

function keyToNumber(key) {
   for (let i = 0; i <= 9; i++) {
      if (key == 'Digit'+i) {
         return(i)
      }
   }
   return false;
}

// random functies
function weightedRandom() {
   let x = Math.random();
   return x**3 * 99 + 1;
}

function randomPickaxe() {
   return new Pickaxe(weightedRandom(), weightedRandom(), weightedRandom(), weightedRandom(), 1);
}

function randomRange(l, r) {
   return Math.random() * (r - l) + l;
}