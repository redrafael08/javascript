// WebGL Fundamentals. (z.d.)
// input keys waardes
numberKeyPressed = 0;

let keys = {
   "KeyW":false, // w
   "KeyA":false, // a
   "KeyS":false, // s
   "KeyD":false, // d

   "ArrowUp":false, // w
   "ArrowLeft":false, // a
   "ArrowDown":false, // s
   "ArrowRight":false, // d

   "Space": false 
};

let mouseClicked = false;


// muis beweging detectie
document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === canvas) {
         mouseX = e.movementX;
         mouseY = e.movementY;
         xAngle -= mouseY*0.001;
         yAngle += mouseX*0.001;
         if (xAngle > Math.PI*0.5) xAngle = Math.PI*0.5;
         if (xAngle < -Math.PI*0.5) xAngle = -Math.PI*0.5;
      }
});

// muis click detectie
document.addEventListener('click', (e) => {
   if (e.button == 0) {  
      mouseClicked = true;
   } 
});

//Green, A. (2012, 30 november)
// toets indruk detectie
document.addEventListener('keydown', (e) => {
   if (e.code in keys) {
      keys[e.code] = true;
   }
   if (keyToNumber(e.code) !== false) {
      numberKeyPressed = keyToNumber(e.code);
   }
});

// toets loslaat detectie
document.addEventListener('keyup', (e) => {
   if (e.code in keys) {
      keys[e.code] = false;
   }
   if (e.code == 'Escape') {
      if (document.pointerLockElement !== canvas &&  !(distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20 || distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20)) {
         canvas.requestPointerLock();
      }
      for (let key in keys) {
         document.getElementById("invalidSaveSlot").hidden = true;
         keys[key] = false;
      }
   }
   if (keyToNumber(e.code) !== false) {
      numberKeyPressed = 0;
   }
});

window.addEventListener('beforeunload', function (e) {
// Cancel the event
e.preventDefault();
// Chrome requires returnValue to be set
// e.returnValue = '';
});

window.onbeforeunload=function(){return "Navigating away will lose the changes you've made to your code."};