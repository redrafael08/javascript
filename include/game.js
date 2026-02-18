// maak matrixen
let maxRender = 500;
let minRender = 1;
let ang = Math.tan((40*0.5)*Math.PI/180);
let projMatrix = [
   0.5/ang, 0 , 0, 0,
   0, 0.5*(canvas.width/canvas.height)/ang, 0, 0,
   0, 0, -(maxRender+minRender)/(maxRender-minRender), -1,
   0, 0, (-2*maxRender*minRender)/(maxRender-minRender), 0 
];
let viewMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
let modelMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

let pickaxesToFuse = [];

let cameraPos = [0, 10, 15];
let front = [0, 0, -1]     
let xAngle = 0;             
let yAngle = Math.PI;
let speed = 1;

let cash = 0;

const numberSuffixes = ["k","M","B","T","aa","ab","ac","ad","ae","af","ag","ah","ai","aj","ak"];


let fused = false;


let pickaxeCost = 10;
let rocketCost = 1000000;

const rockPos = [0,0,0];
const anvilPos = [50,0,0];
const grindstonePos = [-50, 0, 0];
const rocketPos = [0,0,50];
const dropPos = [0, 0, -50];

const earthSky = skyTexture;
const moonSky = moonSkyTexture;
const marsSky = marsSkyTexture;

const rocks = [new Rock(100, 1, [-1,0,0], 0), new Rock(200, 1.2, [0.25,0.25,0.25], 1), new Rock(500, 1.5, [1+0.5,0.54+0.5,0.5], 2), new Rock(1000, 2, [0.85+0.5,0.73+0.5,0.59+0.5], 3), new Rock(5000, 2.5, [1.5,1.4,0.5], 4), new Rock(15000, 3, [0,0,1], 5), new Rock(50000, 5, [0,1,0], 6), new Rock(500000, 7, [1,0,0], 7), new Rock(Infinity, 10, [0.5+0.5,1.5,1.5], 8)];
const dimensions = [new Dimension(1, 1, grassTexture, stoneTexture, earthSky, [0.7,0.7,0.7]), new Dimension(10, 10, moonTexture, moonTexture, moonSky, [0.1,0.1,0.1]), new Dimension(100, 100, marsTexture, marsTexture, marsSky, [0.4,0.4,0.4])];

let pickaxes = {0: new Pickaxe(1, 1, 1, 1, 1)};

let currentPickaxe = 0;
let currentRock = new Rock(rocks[0].health, rocks[0].quality, rocks[0].color, rocks[0].index);
let currentDimension = dimensions[0];
let pickaxeDelay = 0;

let win = false;

let currentSaveSlot = -1;

if (localStorage.getItem("saves") === null) {
   localStorage.setItem("saves", JSON.stringify([]));
}
let saves = JSON.parse(localStorage.getItem("saves"));

document.getElementById("buyCost").innerHTML = "Cost: " + pickaxeCost;

document.getElementById("saveSlotInput").setAttribute("max",saves.length + 1) 

addPickaxeInventory(0);
equipPickaxe(0);

bobtime = 0;

// gameloop
let firstFrame = true;
function gameloop() {
   if (document.pointerLockElement === canvas || (distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20 || distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20)) {

   if (firstFrame) {
      document.getElementById("newGameButton").hidden = true;
      document.getElementById("saveGameButton").hidden = false;
      document.getElementById("resumeButton").hidden = false;
      let audio = new Audio("assets/audio/a music blippiece.mp3");
      audio.loop = true;
      audio.play();

      firstFrame = false;
   }

   document.getElementById("settings").hidden = true;
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   textCanvas.width = canvas.width;
   textCanvas.height = canvas.height;
   ctx.font = "50px Arial";
   ctx.fillStyle = 'white';
   gl.viewport(0,0,canvas.width,canvas.height);
   projMatrix = [
      0.5/ang, 0 , 0, 0,
      0, 0.5*(canvas.width/canvas.height)/ang, 0, 0,
      0, 0, -(maxRender+minRender)/(maxRender-minRender), -1,
      0, 0, (-2*maxRender*minRender)/(maxRender-minRender), 0 
   ];

   cosa = Math.cos(yAngle);
   sina = Math.sin(yAngle);
   front = [Math.cos(xAngle) * sina, Math.sin(xAngle), Math.cos(xAngle) * cosa]

   // keyboard inputs
   prevPos = [...cameraPos];
   if (keys["KeyW"]) {
      cameraPos[0] += sina * speed;
      cameraPos[2] += cosa * speed;
   }
   if (keys["KeyA"]) {
      cameraPos[0] -= cosa * speed;
      cameraPos[2] += sina * speed;
   }
   if (keys["KeyS"]) {
      cameraPos[0] -= sina * speed;
      cameraPos[2] -= cosa * speed;
   }
   if (keys["KeyD"]) {
      cameraPos[0] += cosa * speed;
      cameraPos[2] -= sina * speed;
   }

   if (keys["ArrowUp"]) {
      xAngle += 0.05;
      if (xAngle > Math.PI*0.5) xAngle = Math.PI*0.5;
      if (xAngle < -Math.PI*0.5) xAngle = -Math.PI*0.5;
   }
   if (keys["ArrowDown"]) {
      xAngle -= 0.05;
      if (xAngle > Math.PI*0.5) xAngle = Math.PI*0.5;
      if (xAngle < -Math.PI*0.5) xAngle = -Math.PI*0.5;
   }
   if (keys["ArrowLeft"]) {
      yAngle -= 0.05;
   }
   if (keys["ArrowRight"]) {
      yAngle += 0.05;
   }

   if (keys["Space"]) {
      mouseClicked = true;
   }

   // collisions
   if (distance(cameraPos, [0, cameraPos[1], 0]) > 400 || distance(cameraPos, [0, cameraPos[1], 0]) <= 9 || distance(cameraPos, [grindstonePos[0], cameraPos[1], grindstonePos[2]]) <= 9 || distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 9 || distance(cameraPos, [rocketPos[0], cameraPos[1], rocketPos[2]]) <= 9 || distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 9) {
      cameraPos = [...prevPos];
   }


   // 2d canvas render en game logica
   ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

   if (facingObject(grindstonePos)) {
      displayText("Upgrade Cost: " + shortenNumber(upgradeCost(pickaxes[currentPickaxe].upgrades, 10**numberKeyPressed)), 10,100);

      if (mouseClicked) {
         buyUpgrade();
      }
   }
   if (facingObject(rockPos)) {
      if (!isFinite(currentRock.health)) {
         displayText("Rock Health: \u221e", 10,100);
      }
      else {
         displayText("Rock Health: " + shortenNumber(currentRock.health), 10,100);
      }
      if (mouseClicked && pickaxeDelay == 0) {
         pickaxeDelay = statConvert(pickaxes[currentPickaxe], 'speed');
         clickRock();
      }
   }


   if ((distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20 && !(distance(prevPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20)) || (distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20 && !(distance(prevPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20))) {
      
      if (distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20){
         document.getElementById("buyGui").hidden = false;
         document.getElementById("fuseGui").hidden = true;
      }
      if (distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20){
         document.getElementById("fuseGui").hidden = false;
         document.getElementById("buyGui").hidden = true;
      }
      document.getElementById("inventory").hidden = false;
      document.exitPointerLock();
      updateSelectedPickaxe();
      pickaxesToFuse = [];
   }
   if ((distance(prevPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20 && !(distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20)) || (distance(prevPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20 && !(distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20))) {
      document.getElementById("inventory").hidden = true; 
      canvas.requestPointerLock();
   }


   if (distance(cameraPos, [rocketPos[0], cameraPos[1], rocketPos[2]]) <= 20) {
      displayText("Rocket Cost: " + shortenNumber(rocketCost), 10,100);
      if (mouseClicked) {
         if (cash >= rocketCost) {
            if (dimensions.indexOf(currentDimension) != 2) {
               cash -= rocketCost;
               rocketCost **= 2;
               currentDimension = dimensions[dimensions.indexOf(currentDimension)+1];
               currentRock = new Rock(rocks[0].health, rocks[0].quality, rocks[0].color, rocks[0].index);
               currentRock.health *= currentDimension.healthMultiplier;
            }
            else {win = true;}
         }
      }
   }

   displayText("$ " + shortenNumber(cash), 10,50);

   if (!win) {displayText("+", canvas.width/2 - 15,canvas.height/2 + 15);}
   else {displayText("You win!", canvas.width/2,canvas.height/2);}

   tutorial();


   if (pickaxeDelay > 0) {
      pickaxeDelay--;
   }

   mouseClicked = false;


   renderObjects();

   } else {
      document.getElementById("settings").hidden = false;
   }
}


setInterval(gameloop, 1000 / 30);