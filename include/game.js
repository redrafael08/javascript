//TutorialsPoint. (z.d.)
const canvas = document.getElementById('gl');

// init canvas voor webgl
gl = canvas.getContext('experimental-webgl'); 

const textCanvas = document.getElementById('text');

//W3Schools. (z.d.)
// init canvas voor 2d tekenen
const ctx = textCanvas.getContext("2d");


//WebGL Fundamentals. (z.d.)
// laad afbeeldingen
let pickaxeUpImg = new Image();
pickaxeUpImg.src = 'assets/pickaxeUp.png';

let pickaxeDownImg = new Image();
pickaxeDownImg.src = 'assets/pickaxeDown.png';


// input keys waardes
numberKeyPressed = 0;


let keys = {
   "KeyW":false, // w
   "KeyA":false, // a
   "KeyS":false, // s
   "KeyD":false // d
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

// lijst met all objecten om te renderen

// laad texture functie
function newTexture(texture, image) {

   let img = new Image();

   img.crossOrigin = '';
   img.src = `assets/textures/${image}`;

   img.onload = function() {


      gl.activeTexture(gl.TEXTURE0);
      
      
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);

   };


}


// laad alle textures
const stoneTexture = gl.createTexture();
newTexture(stoneTexture, 'stone_texture.png');

const skyTexture = gl.createTexture();
newTexture(skyTexture, 'skybox.png');


const grassTexture = gl.createTexture();
newTexture(grassTexture, 'grass.png');
const moonTexture = gl.createTexture();
newTexture(moonTexture, 'moon.png');
const marsTexture = gl.createTexture();
newTexture(marsTexture, 'mars.png');

const crateTexture = gl.createTexture();
newTexture(crateTexture, 'crate.png');

const anvilTexture = gl.createTexture();
newTexture(anvilTexture, 'anvil.png');

const oreTexture = gl.createTexture();
newTexture(oreTexture, 'crystal.png');

const woodTexture = gl.createTexture();
newTexture(woodTexture, 'wood.png');



// maak buffer op gpu voor lijst vertices 
const vertex_buffer = gl.createBuffer();


gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);


gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


gl.bindBuffer(gl.ARRAY_BUFFER, null);


// vertex shader code
const vertCode =
   'attribute vec3 coordinates;' +
   'attribute vec3 aNormal;' +
   'attribute vec2 aTexture;' +
   'varying vec3 vColor;' +
   'varying vec2 vTexture;' +
   'uniform mat4 projection;'+
   'uniform mat4 view;'+
   'uniform mat4 model;'+
   'uniform vec3 oColor;'+         
   'void main() {' +

      ' vColor = (dot(normalize(mat3(model) * aNormal) ,normalize(vec3(1,3,2)))*0.5+0.5)*oColor;'+
      ' vTexture = aTexture;'+
      ' gl_Position = projection*view*model*vec4(coordinates, 1.0);' +
   '}';
   

// compileer vertex shader
const vertShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertShader, vertCode);


gl.compileShader(vertShader);


// fragment shader code
const fragCode = 'precision mediump float;' +
   'uniform sampler2D uSampler;' +
   'varying vec3 vColor;' +
   'varying vec2 vTexture;' +
   'void main() {' +
      'gl_FragColor = texture2D(uSampler, vTexture)*vec4(vColor, 1.0);' +
   '}';
   

// compileer fragment shader
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);


gl.shaderSource(fragShader, fragCode); 


gl.compileShader(fragShader);


// maak shader programma
const shaderProgram = gl.createProgram();

gl.attachShader(shaderProgram, vertShader);

gl.attachShader(shaderProgram, fragShader);

gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram);


// locaties alle uniforms in vertex shader
const pLoc = gl.getUniformLocation(shaderProgram, "projection");
const vLoc = gl.getUniformLocation(shaderProgram, "view");
const mLoc = gl.getUniformLocation(shaderProgram, "model");
const cLoc = gl.getUniformLocation(shaderProgram, "oColor");

const uSamplerLoc = gl.getUniformLocation(shaderProgram, "uSampler");
gl.uniform1i(uSamplerLoc, 0);


gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);


// geef locatie aan van alle attributen in lijst vertices en in vertex shader
const coordLoc = gl.getAttribLocation(shaderProgram, "coordinates");

                  // locatie,  lengte in indices atribuut, datatype,   lengte vertex, start 
gl.vertexAttribPointer(coordLoc, // locatie attribuut
3,  // aantal items in lijst vertices
gl.FLOAT, // datatype
false,  // of data moet worden genormaliseerd (doet niks bij float)
8 * Float32Array.BYTES_PER_ELEMENT,  // lengte van een vertex
0 // locatie in vertex waar atribuut begint
); 


gl.enableVertexAttribArray(coordLoc);

const normalLoc = gl.getAttribLocation(shaderProgram, "aNormal");


gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT); 


gl.enableVertexAttribArray(normalLoc);


const textureLoc = gl.getAttribLocation(shaderProgram, "aTexture");


gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 8 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT); 


gl.enableVertexAttribArray(textureLoc);




// maak matrixen
let maxRender = 10000;
let minRender = 1;
let ang = Math.tan((40*0.5)*Math.PI/180);
let projMatrix = [0.5/ang, 0 , 0, 0,
                  0, 0.5*(canvas.width/canvas.height)/ang, 0, 0,
                  0, 0, -(maxRender+minRender)/(maxRender-minRender), -1,
                  0, 0, (-2*maxRender*minRender)/(maxRender-minRender), 0 
               ];
let viewMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
let modelMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

let pickaxesToFuse = [];



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


// convert functies
function shortenNumber(value) {
   let length = 0;
   if (value > 0) length = Math.floor(Math.log10(value));
   let suffix = "";
   let newValue = 0;
   let decimals = 2 - (length % 3);
   if (length >= 3) {
      suffix = numberSuffixes[Math.floor(length/3)-1]
      newValue = Math.round(value / (10**(length - (length % 3) - decimals))) / 10**decimals;
   }
   else {
      newValue = Math.round(value * 10**decimals) / 10**decimals;
   }
   return newValue.toString() + " " + suffix;
}

function statConvert(pickaxe, type) {
   if (type == 'cash') {return pickaxe.upgrades * pickaxe.upgradability**0.25 * pickaxe.quality * currentRock.quality * currentDimension.cashMultiplier;}
   else if (type == 'quality') {return pickaxe.quality;}
   else if (type == 'speed') {return Math.round((1 - (pickaxe.speed / 100)**2) * 45);}
   else if (type == 'damage') {return pickaxe.damage * Math.sqrt(pickaxe.upgrades * pickaxe.upgradability**0.25);}
   else if (type == 'upgradability') {return pickaxe.upgradability;}
   
}


// actie functies         

function clickRock() {
   cash += statConvert(pickaxes[currentPickaxe], 'cash');
   if (isFinite(currentRock.health)) {
      currentRock.health -= statConvert(pickaxes[currentPickaxe],'damage');
      if (currentRock.health <= 0) {
         currentRock = new Rock(rocks[currentRock.index + 1].health, rocks[currentRock.index + 1].quality, rocks[currentRock.index + 1].color, rocks[currentRock.index + 1].index);
         currentRock.health *= currentDimension.healthMultiplier;
      }
   }
}

function upgradeCost(currentUpgrades, upgrades) {
   totalUpgrades = currentUpgrades + upgrades;
   return (totalUpgrades*(totalUpgrades+1)*(2*totalUpgrades+1) - currentUpgrades*(currentUpgrades+1)*(2*currentUpgrades+1))/6
}

function buyUpgrade() {
   cost = upgradeCost(pickaxes[currentPickaxe].upgrades, 10**numberKeyPressed)
   if (cash >= cost) {  
      cash -= cost;
      pickaxes[currentPickaxe].upgrades += 10**numberKeyPressed;               
      document.getElementById("pickaxeUpgrades"+currentPickaxe).textContent = shortenNumber(pickaxes[currentPickaxe].upgrades);
      showStats("currentPickaxe", currentPickaxe);
   }
}


function addPickaxeInventory(index) {
      pickaxeContainer = document.createElement('button');
      pickaxeContainer.setAttribute("id", "pickaxeContainer"+index);
      pickaxeContainer.setAttribute("class", "button");
      pickaxeContainer.setAttribute("onclick", "equipPickaxe((this.id).replace('pickaxeContainer', ''))"); 
      pickaxeContainer.setAttribute("onmouseover", "showStats('selectedPickaxe',(this.id).replace('pickaxeContainer', ''))"); 

      document.getElementById("inventory").appendChild(pickaxeContainer);

      pickaxeImg = document.createElement('img');
      pickaxeImg.setAttribute("id", "pickaxeImg"+index);
      pickaxeImg.setAttribute("src", "assets/pickaxe icon.png");
      pickaxeImg.setAttribute("style", "width: 70px;height: 70px; float: left;"); 

      document.getElementById("pickaxeContainer"+index).appendChild(pickaxeImg);
      
      pickaxeStats = document.createElement('div');
      pickaxeStats.setAttribute("id", "pickaxeStats"+index);
      pickaxeStats.setAttribute("style", "width: 300px;height: 80px;padding: 0px; float: left;"); 

      document.getElementById("pickaxeContainer"+index).appendChild(pickaxeStats);
      
      pickaxeQuality = document.createElement('div');
      pickaxeQuality.setAttribute("id", "pickaxeQuality"+index);
      pickaxeQuality.setAttribute("class", "pickaxeStatBar");
      pickaxeQuality.style.width = pickaxes[index].quality*2+"px"; 
      document.getElementById("pickaxeStats"+index).appendChild(pickaxeQuality);  
      pickaxeDamage = document.createElement('div');
      pickaxeDamage.setAttribute("id", "pickaxeDamage"+index);
      pickaxeDamage.setAttribute("class", "pickaxeStatBar");
      pickaxeDamage.style.width = pickaxes[index].damage*2+"px"; 
      document.getElementById("pickaxeStats"+index).appendChild(pickaxeDamage);  
      pickaxeSpeed = document.createElement('div');
      pickaxeSpeed.setAttribute("id", "pickaxeSpeed"+index);
      pickaxeSpeed.setAttribute("class", "pickaxeStatBar");
      pickaxeSpeed.style.width = pickaxes[index].speed*2+"px"; 
      document.getElementById("pickaxeStats"+index).appendChild(pickaxeSpeed);    
      pickaxeUpgradability = document.createElement('div');
      pickaxeUpgradability.setAttribute("id", "pickaxeUpgradability"+index);
      pickaxeUpgradability.setAttribute("class", "pickaxeStatBar");
      pickaxeUpgradability.style.width = pickaxes[index].upgradability*2+"px"; 
      document.getElementById("pickaxeStats"+index).appendChild(pickaxeUpgradability);  
      
      pickaxeUpgrades = document.createElement('div');
      pickaxeUpgrades.textContent = pickaxes[index].upgrades;
      pickaxeUpgrades.setAttribute("id", "pickaxeUpgrades"+index);
      document.getElementById("pickaxeStats"+index).appendChild(pickaxeUpgrades);  
}

function showStats(id,index) {
   if (id == "currentPickaxe") {
      document.getElementById(id).innerHTML  = `Equipped Pickaxe:<br>Quality: ${shortenNumber(statConvert(pickaxes[index], 'quality'))}<br>Damage: ${shortenNumber(statConvert(pickaxes[index], 'damage'))}<br>Clicks/s: ${shortenNumber(1/(statConvert(pickaxes[index], 'speed')/30))}<br>Upgradability: ${shortenNumber(statConvert(pickaxes[index], 'upgradability'))}<br>Cash/click: ${shortenNumber(statConvert(pickaxes[index], 'cash'))}<br>Upgrades: ${shortenNumber(pickaxes[index].upgrades)}`;
   }
   else {
      document.getElementById(id).innerHTML  = `Quality: ${shortenNumber(statConvert(pickaxes[index], 'quality'))}<br>Damage: ${shortenNumber(statConvert(pickaxes[index], 'damage'))}<br>Clicks/s: ${shortenNumber(1/(statConvert(pickaxes[index], 'speed')/30))}<br>Upgradability: ${shortenNumber(statConvert(pickaxes[index], 'upgradability'))}<br>Cash/click: ${shortenNumber(statConvert(pickaxes[index], 'cash'))}<br>Upgrades: ${shortenNumber(pickaxes[index].upgrades)}`;
   }
}

function buyPickaxe() {
   if (cash >= pickaxeCost) {
      let id = unusedId();
      pickaxes[id] = randomPickaxe();
      addPickaxeInventory(id);
      
      cash -= pickaxeCost;
      pickaxeCost += pickaxeCost * Object.keys(pickaxes).length;
      document.getElementById("buyCost").innerHTML = "Cost: " + shortenNumber(pickaxeCost);
   }
}

function updateSelectedPickaxe() {
   let buttons = document.getElementsByClassName("button");
      for (let item of buttons) {
         item.style.backgroundColor = '#f0f0f0';
      }
      document.getElementById("pickaxeContainer"+currentPickaxe).style.backgroundColor = 'grey';
}

function unusedId() {
   let i = 0;
   while (i in pickaxes) {
      i += 1;
   }
   return i;
}

function equipPickaxe(index) {
   if (!(distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20)) {
      
      currentPickaxe = index;
      
      updateSelectedPickaxe();
      showStats("currentPickaxe", index);
   }
   else {
      if (!(pickaxesToFuse.includes(index))) {
         if (pickaxesToFuse.length < 2) {
            pickaxesToFuse.push(index);
            document.getElementById("pickaxeContainer"+index).style.backgroundColor = 'red';
         }
      }
      else {
         pickaxesToFuse.splice(pickaxesToFuse.indexOf(index), 1);
         let color = '#f0f0f0'
         if (index == currentPickaxe) {color = 'grey';}
         document.getElementById("pickaxeContainer"+index).style.backgroundColor = color;
         
      }
      if (pickaxesToFuse.length == 2) {document.getElementById("fuseCost").innerHTML = "Cost: "+shortenNumber(fuseCost())}
      else {document.getElementById("fuseCost").innerHTML = 'Select 2 pickaxes';}
   }
}


function displayText(string, posx, posy) {
   ctx.fillText(string, posx,posy);
   ctx.strokeText(string, posx,posy);
}

function fusePickaxes(selectedPickaxes) {
   if (selectedPickaxes.length == 2 && cash >= fuseCost()) {
      cash -= fuseCost();
      let i1 = selectedPickaxes[0];
      let i2 = selectedPickaxes[1];
      let pick1 = pickaxes[i1];
      let pick2 = pickaxes[i2];


      let speed = (pick1.speed + pick2.speed)/2 + randomRange(0, (pick1.speed + pick2.speed)*0.25);
      if (speed > 100) {speed = 100;}
      let damage = (pick1.damage + pick2.damage)/2 + randomRange(0, (pick1.damage + pick2.damage)*0.25);
      if (damage > 100) {damage = 100;}
      let quality = (pick1.quality + pick2.quality)/2 + randomRange(0, (pick1.quality + pick2.quality)*0.25);
      if (quality > 100) {quality = 100;}
      let upgradability = (pick1.upgradability + pick2.upgradability)/2 + randomRange(0, (pick1.upgradability + pick2.upgradability)*0.25);
      if (upgradability > 100) {upgradability = 100;}
      delete pickaxes[i1];
      delete pickaxes[i2];
      document.getElementById("pickaxeContainer"+i1).remove();
      document.getElementById("pickaxeContainer"+i2).remove();
      
      
      let id = unusedId();
      pickaxes[id] = new Pickaxe(speed, damage, quality, upgradability, 1);
      addPickaxeInventory(id);

      pickaxesToFuse = [];
      document.getElementById("fuseCost").innerHTML = 'Select 2 pickaxes';

      if (i1 == currentPickaxe || i2 == currentPickaxe) {
         currentPickaxe = id;
      
         updateSelectedPickaxe();
         showStats("currentPickaxe", id);
      }
   }
}

function fuseCost() {
   let pick1 = pickaxes[pickaxesToFuse[0]];
   let pick2 = pickaxes[pickaxesToFuse[1]];
   return pick1.speed**2+pick1.damage**2+pick1.quality**2+pick1.upgradability**2+pick2.speed**2+pick2.damage**2+pick2.quality**2+pick2.upgradability**2;
}


// save functies
// user3637210. (2014, 19 mei)
function saveGame() {
   let data = [
      cash,
      pickaxeCost,
      currentPickaxe,
      currentRock,
      dimensions.indexOf(currentDimension),
      pickaxes
   ];

   if (validSaveSlot(currentSaveSlot)) {
      saves[currentSaveSlot] = data;
   } else {
      currentSaveSlot = saves.length;
      saves.push(data);
   }

   localStorage.setItem("saves", JSON.stringify(saves));
   document.getElementById("saveSlotInput").setAttribute("max",saves.length + 1) 
   
   document.getElementById("worldNumberText").textContent = "Current world number: " + (currentSaveSlot + 1);
   document.getElementById("worldNumberText").hidden = false;
}

function validSaveSlot (saveSlot) {
   return saveSlot >= 0 && saveSlot < saves.length;
}

function confirmLoadGame() {
   document.getElementById("loadGameButton").hidden = false;
   document.getElementById("confirmLoadGameText").hidden = false;  
}   

function loadGame(saveSlot) {
   document.getElementById("loadGameButton").hidden = true;
   if (validSaveSlot(saveSlot)) {
      for (var key in pickaxes) {
         document.getElementById("pickaxeContainer"+key).remove();
      }

      let data = saves[saveSlot];
      currentSaveSlot = saveSlot;
      
      cash = data[0];
      pickaxeCost = data[1];
      currentPickaxe = data[2];
      currentRock = data[3];
      currentDimension = dimensions[data[4]];
      pickaxes = data[5];    

      if (currentRock.index == 8) {
         currentRock.health = Infinity;
      }

      for (let key in pickaxes) {
         addPickaxeInventory(key);
      }

      document.getElementById("buyCost").innerHTML = "Cost: " + shortenNumber(pickaxeCost);

      for (let key in keys) {
         document.getElementById("invalidSaveSlot").hidden = true;
         keys[key] = false;
      }

      document.getElementById("invalidSaveSlot").hidden = true;
      canvas.requestPointerLock()
   }
   else {
      document.getElementById("invalidSaveSlot").hidden = false;
   }
}


// classes
class Pickaxe {
   constructor(speed, quality, damage, upgradability, upgrades) {
      this.speed = speed;
      this.quality = quality;
      this.damage = damage;
      this.upgradability = upgradability;
      this.upgrades = upgrades;
   }
}

class Rock {
   constructor(health, quality, color, index) {
      this.health = health;
      this.quality = quality;
      this.color = [...color];
      this.index = index;
   }
}

class Dimension {
   constructor(healthMultiplier, cashMultiplier, groundTexture, rockTexture, skyColor, shadowColor) {
      this.healthMultiplier = healthMultiplier;
      this.cashMultiplier = cashMultiplier;
      this.groundTexture = groundTexture;
      this.rockTexture = rockTexture;
      this.skyColor = skyColor;
      this.shadowColor = shadowColor
   }
}


// variabelen

let cameraPos = [0, 10, 15];
let front = [0, 0, -1]     
let xAngle = 0;             
let yAngle = Math.PI;
let speed = 1;

let cash = 0;

const numberSuffixes = ["k","M","B","T","aa","ab","ac","ad","ae","af","ag","ah","ai","aj","ak"];


let pickaxeCost = 10;
let rocketCost = 1000000;

const rockPos = [0,0,0];
const anvilPos = [50,0,0];
const grindstonePos = [-50, 0, 0];
const rocketPos = [0,0,50];
const dropPos = [0, 0, -50];

const earthSky = [0.57, 0.79, 0.98, 1.0];
const moonSky = [0, 0, 0, 1.0];
const marsSky = [0.96, 0.80, 0.62, 1.0];

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


// gameloop
let firstFrame = true;
function gameloop() {
   if (document.pointerLockElement === canvas || (distance(cameraPos, [dropPos[0], cameraPos[1], dropPos[2]]) <= 20 || distance(cameraPos, [anvilPos[0], cameraPos[1], anvilPos[2]]) <= 20)) {

   if (firstFrame) {
      document.getElementById("loadGameButton").hidden = true;
      document.getElementById("confirmLoadGameText").hidden = true;
      document.getElementById("newGameButton").hidden = true;
      document.getElementById("saveGameButton").hidden = false;
      document.getElementById("resumeButton").hidden = false;

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
   projMatrix = [0.5/ang, 0 , 0, 0,
                  0, 0.5*(canvas.width/canvas.height)/ang, 0, 0,
                  0, 0, -(maxRender+minRender)/(maxRender-minRender), -1,
                  0, 0, (-2*maxRender*minRender)/(maxRender-minRender), 0 
               ];

   cosa = Math.cos(yAngle);
   sina = Math.sin(yAngle);
   front = [Math.cos(xAngle) * sina, Math.sin(xAngle), Math.cos(xAngle) * cosa]

   // movement
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


   if (pickaxeDelay > Math.round(statConvert(pickaxes[currentPickaxe], 'speed') / 3)) {
      // ctx.drawImage(pickaxeDownImg, 0, canvas.height-canvas.width*0.5625, canvas.width, canvas.width*0.5625);
   }
   else {
      //  ctx.drawImage(pickaxeUpImg, 0, canvas.height-canvas.width*0.5625, canvas.width, canvas.width*0.5625);
   }

   if (pickaxeDelay > 0) {
      pickaxeDelay--;
   }

   mouseClicked = false;




   // 3d render
   gl.clearColor(currentDimension.skyColor[0],currentDimension.skyColor[1],currentDimension.skyColor[2],currentDimension.skyColor[3]); 


   gl.enable(gl.DEPTH_TEST);


   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


   gl.uniformMatrix4fv(pLoc, false, projMatrix);

   viewMatrix = lookAt(cameraPos, front);


   gl.depthMask(false);
   gl.depthFunc(gl.LEQUAL);

   modelMatrix = [5,0,0,0, 0,5,0,0, 0,0,5,0, cameraPos[0],9.5,cameraPos[2],1];
   gl.bindTexture(gl.TEXTURE_2D, skyTexture);
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   gl.uniformMatrix4fv(vLoc, false, viewMatrix);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.drawArrays(gl.TRIANGLES, 1254-456-skyboxVertices.length, skyboxVertices.length);

   gl.depthMask(true);
   gl.depthFunc(gl.LESS);


   //ground
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);
   modelMatrix = [1000,0,0,0, 0,1,0,0, 0,0,1000,0, 0,0,0,1];
   //gl.uniformMatrix4fv(pLoc, false, projMatrix);
   gl.uniformMatrix4fv(vLoc, false, viewMatrix);
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   gl.uniform3fv(cLoc, [1,1,1]);

   gl.drawArrays(gl.TRIANGLES, 0, 6);


   //droppos
   modelMatrix = [10,0,0,0, 0,10,0,0, 0,0,10,0, dropPos[0],0.1,dropPos[2],1];
   gl.bindTexture(gl.TEXTURE_2D, stoneTexture);
   gl.uniform3fv(cLoc, [1.5,1.5,1.5]);
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);

   gl.drawArrays(gl.TRIANGLES, 6, 48);

   //crate
   modelMatrix = [5,0,0,0, 0,5,0,0, 0,0,5,0, dropPos[0],5,dropPos[2],1];
   gl.bindTexture(gl.TEXTURE_2D, crateTexture);
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.drawArrays(gl.TRIANGLES, 6+48, 36);

   gl.uniform3fv(cLoc, currentDimension.shadowColor);
   gl.uniformMatrix4fv(mLoc, false, [9,0,0,0, 0,9,0,0, 0,0,9,0, dropPos[0],0.05,dropPos[2],1]);  
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84+132, 42);
   gl.uniform3fv(cLoc, [1,1,1]);


   //anvil
   gl.bindTexture(gl.TEXTURE_2D, anvilTexture);
   modelMatrix = [3.5,0,0,0, 0,3.5,0,0, 0,0,3.5,0, anvilPos[0],0,anvilPos[2],1];
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);

   gl.drawArrays(gl.TRIANGLES, 6+48+36, 144);

   gl.uniform3fv(cLoc, currentDimension.shadowColor);
   gl.uniformMatrix4fv(mLoc, false, [8,0,0,0, 0,8,0,0, 0,0,8,0, anvilPos[0],0.05,anvilPos[2],1]);  
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84+132, 42);
   gl.uniform3fv(cLoc, [1,1,1]);



   //rock
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.rockTexture);
   modelMatrix = [10,0,0,0, 0,10,0,0, 0,0,10,0, 0,0,0,1];
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144, 84);


   // ore nodes
   if (currentRock.color[0] != -1) {
      gl.uniform3fv(cLoc, currentRock.color);
      gl.bindTexture(gl.TEXTURE_2D, oreTexture);
      gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84, 102);
   }

   gl.uniform3fv(cLoc, currentDimension.shadowColor);
   gl.uniformMatrix4fv(mLoc, false, [10,0,0,0, 0,10,0,0, 0,0,10,0, 0,0.05,0,1]);  
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84+132, 42);
   gl.uniform3fv(cLoc, [1,1,1]);



   // rocket
   modelMatrix = [5,0,0,0, 0,5,0,0, 0,0,5,0, rocketPos[0],0,rocketPos[2],1];  
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);  
   gl.bindTexture(gl.TEXTURE_2D, anvilTexture);
   gl.uniform3fv(cLoc, [1,0,0]);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102, 36);

   gl.uniform3fv(cLoc, [1.5,1.5,1.5]);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+36, 48);

   gl.uniform3fv(cLoc, currentDimension.shadowColor);
   gl.uniformMatrix4fv(mLoc, false, [17,0,0,0, 0,17,0,0, 0,0,17,0, rocketPos[0],0.05,rocketPos[2],1]);  
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84+132, 42);
   gl.uniform3fv(cLoc, [1,1,1]);


   //grindstone
   modelMatrix = [3,0,0,0, 0,3,0,0, 0,0,3,0, grindstonePos[0],0,grindstonePos[2],1];  
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);  
   gl.bindTexture(gl.TEXTURE_2D, stoneTexture);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36, 84);

   gl.bindTexture(gl.TEXTURE_2D, woodTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84, 132);
   
   gl.uniform3fv(cLoc, currentDimension.shadowColor);
   gl.uniformMatrix4fv(mLoc, false, [8,0,0,0, 0,8,0,0, 0,0,8,0, grindstonePos[0],0.05,grindstonePos[2],1]);  
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84+132, 42);
   gl.uniform3fv(cLoc, [1,1,1]);


   gl.clear(gl.DEPTH_BUFFER_BIT);

   gl.enable(gl.DEPTH_TEST);
   gl.depthMask(true);
   gl.depthFunc(gl.LESS);


   //pickaxe
   cy = Math.cos(yAngle);
   sy = Math.sin(yAngle);

   cx = Math.cos(xAngle);
   sx = Math.sin(xAngle);

   scale = 2;

   modelMatrix = [
   cy*scale,           sy*sx*scale,   -sy*cx*scale,   0,
   0,                  cx*scale,        sx*scale,     0,
   sy*scale,          -cy*sx*scale,    cy*cx*scale,   0,
   cameraPos[0],       cameraPos[1],   cameraPos[2],  1
   ];


   gl.bindTexture(gl.TEXTURE_2D, grassTexture);
   gl.uniformMatrix4fv(mLoc, false, [scale,0,0,0, 0,scale,0,0, 0,0,scale,0, 5,-5,-5-15,1]);
   
   gl.uniformMatrix4fv(vLoc, false, [1,0,0,0,  0,1,0,0,  0,0,1,0,  0,0,0,1]);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.drawArrays(gl.TRIANGLES, 1254-456, 456);


   gl.depthFunc(gl.LESS);
   gl.depthMask(true);

   } else {
      document.getElementById("settings").hidden = false;
   }
}


setInterval(gameloop, 1000 / 30);