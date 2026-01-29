



//TutorialsPoint. (z.d.)
const canvas = document.getElementById('gl');

// init canvas voor webgl
const gl = canvas.getContext('experimental-webgl'); 

const textCanvas = document.getElementById('text');

//W3Schools. (z.d.)
// init canvas voor 2d tekenen
const ctx = textCanvas.getContext("2d");




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


const emptyTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
gl.texImage2D(
  gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
  gl.RGBA, gl.UNSIGNED_BYTE,
  new Uint8Array([255, 255, 255, 255])
);




const stoneTexture = gl.createTexture();
newTexture(stoneTexture, 'stone_texture.png');



const grassBladeTexture = gl.createTexture();
newTexture(grassBladeTexture, 'grassblade.png');

const shadowTexture = gl.createTexture();
newTexture(shadowTexture, 'shadow map.png');

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

      ' vColor = (dot(normalize(mat3(model) * aNormal) ,normalize(vec3(1,1,1)))*0.5+0.5)*oColor;'+
      ' vTexture = aTexture;'+
      ' gl_Position = projection*view*model*vec4(coordinates, 1.0);' +
   '}';
   

// compileer vertex shader
const vertShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertShader, vertCode);


gl.compileShader(vertShader);


// fragment shader code
const fragCode = 'precision mediump float;' +
   'uniform sampler2D uDiffuse;' +
   'uniform sampler2D uShadowMap;' +
   'varying vec3 vColor;' +
   'varying vec2 vTexture;' +
   'void main() {' +
      'vec4 baseColor = texture2D(uDiffuse, vTexture);' +
      'if (baseColor.a < 0.9) discard;'+
      'vec4 shadow = texture2D(uShadowMap, vTexture);' +
      'gl_FragColor = baseColor*shadow*vec4(vColor, 1.0);' +
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

const uDiffuseLoc = gl.getUniformLocation(shaderProgram, "uDiffuse");
gl.uniform1i(uDiffuseLoc, 0);

const uShadowLoc = gl.getUniformLocation(shaderProgram, "uShadowMap");
gl.uniform1i(uShadowLoc, 1);


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





function renderObjects() 
{


   // 3d render
   gl.clearColor(currentDimension.skyColor[0],currentDimension.skyColor[1],currentDimension.skyColor[2],currentDimension.skyColor[3]); 


   gl.enable(gl.DEPTH_TEST);

   gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);



   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


   gl.uniformMatrix4fv(pLoc, false, projMatrix);

   viewMatrix = lookAt(cameraPos, front);


   gl.depthMask(false);
   gl.depthFunc(gl.LEQUAL);

   modelMatrix = [5,0,0,0, 0,5,0,0, 0,0,5,0, cameraPos[0],9.5,cameraPos[2],1];

gl.activeTexture(gl.TEXTURE0);


gl.bindTexture(gl.TEXTURE_2D, skyTexture);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, emptyTexture);

gl.activeTexture(gl.TEXTURE0);


   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   gl.uniformMatrix4fv(vLoc, false, viewMatrix);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.drawArrays(gl.TRIANGLES, 1254-456-skyboxVertices.length, skyboxVertices.length);

   gl.depthMask(true);
   gl.depthFunc(gl.LESS);



   //ground
   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, shadowTexture);

gl.activeTexture(gl.TEXTURE0);


   modelMatrix = [500,0,0,0, 0,1,0,0, 0,0,500,0, 0,0,0,1];
   //gl.uniformMatrix4fv(pLoc, false, projMatrix);
   gl.uniformMatrix4fv(vLoc, false, viewMatrix);
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   gl.uniform3fv(cLoc, [1,1,1]);

   gl.drawArrays(gl.TRIANGLES, 0, 6);


   gl.bindTexture(gl.TEXTURE_2D, currentDimension.groundTexture);


gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, emptyTexture);

gl.activeTexture(gl.TEXTURE0);

gl.bindTexture(gl.TEXTURE_2D, grassBladeTexture);


//gl.depthMask(false);
   for (let i=0;i<5000;i++) {

      r1 = (Math.sin((i+0) * 12.9898) * 43758.5453) % 1;
      r2 = (Math.sin((i+50) * 12.9898) * 43758.5453) % 1;
      r3 = (Math.sin((i+100) * 12.9898) * 43758.5453) % 1;
      r4 = (Math.sin((i+150) * 12.9898) * 43758.5453) % 1;
      r5 = (Math.sin((i+200) * 12.9898) * 43758.5453) % 1;
      r6 = (Math.sin((i+250) * 12.9898) * 43758.5453) % 1;

      const c = Math.cos(r1*5);
      const s = Math.sin(r1*5);
      size = 5;
      sizea = 2;
      modelMatrix = [size*c,0,-s*size,0, 
         0,sizea,0,0, 
         s*size,0,size*c,0, 
         r2*r4*400,0,r3*r5*400,1];

      gl.uniformMatrix4fv(mLoc, false, modelMatrix);
      gl.drawArrays(gl.TRIANGLES, 1254, 12);
   }

  // gl.depthMask(true);


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


   //anvil
   gl.bindTexture(gl.TEXTURE_2D, anvilTexture);
   modelMatrix = [3.5,0,0,0, 0,3.5,0,0, 0,0,3.5,0, anvilPos[0],0,anvilPos[2],1];
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);

   gl.drawArrays(gl.TRIANGLES, 6+48+36, 144);



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


   // rocket
   modelMatrix = [5,0,0,0, 0,5,0,0, 0,0,5,0, rocketPos[0],0,rocketPos[2],1];  
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);  
   gl.bindTexture(gl.TEXTURE_2D, anvilTexture);
   gl.uniform3fv(cLoc, [1,0,0]);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102, 36);

   gl.uniform3fv(cLoc, [1.5,1.5,1.5]);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+36, 48);




   //grindstone
   modelMatrix = [3,0,0,0, 0,3,0,0, 0,0,3,0, grindstonePos[0],0,grindstonePos[2],1];  
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);  
   gl.bindTexture(gl.TEXTURE_2D, stoneTexture);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36, 84);

   gl.bindTexture(gl.TEXTURE_2D, woodTexture);
   gl.drawArrays(gl.TRIANGLES, 6+48+36+144+84+102+48+36+84, 132);
   


   gl.clear(gl.DEPTH_BUFFER_BIT);

   gl.enable(gl.DEPTH_TEST);
   gl.depthMask(true);
   gl.depthFunc(gl.LESS);


   //pickaxe
   const cy = Math.cos(yAngle);
   const sy = Math.sin(yAngle);

   const cx = Math.cos(-xAngle);
   const sx = Math.sin(-xAngle);



   const s = statConvert(pickaxes[currentPickaxe], 'speed');
   const t = 1 - pickaxeDelay / (s); 

   let swing;
   if (t <= 1/6) {

      swing = (t / (1/6)) * 1.5;
   } else if (t <= 1/2) {

      swing = 1.5;
   } else if (t <= 2/3) {

      swing = 1.5 - ((t - 1/2) / (2/3 - 1/2)) * 1.5;
   } else {

      swing = 0;
   }

   if (pickaxeDelay > Math.round(s / 3)) {
      cx2 = Math.cos(swing-xAngle);
      sx2 = Math.sin(swing-xAngle);
   }
   else {
      cx2 = Math.cos(-xAngle);
      sx2 = Math.sin(-xAngle);
   }



   scale = 2;

   modelMatrix = [
   cy,      0,     -sy,   0, 
   sy*sx2,   cx2,    cy*sx2, 0, 
   sy*cx2,  -sx2,    cy*cx2, 0,  
   0,       0,     0,     1   
   ];




   let vel = distance(cameraPos,prevPos)

   bobtime += vel*0.5;


   invmodelMatrix = [
   -cy*scale,     sy*sx*scale,   -sy*cx*scale,   0, 
   0,      cx*scale,     sx*scale,      0,  
   sy*scale,    cy*sx*scale,   -cy*cx*scale,   0,  
   7+Math.cos(bobtime/2)*0.25,  -6+Math.sin(bobtime)*0.25,  -15,     1  
   ];




  
   gl.uniformMatrix4fv(mLoc, false, modelMatrix);
   
   gl.uniformMatrix4fv(vLoc, false, invmodelMatrix);
   gl.uniform3fv(cLoc, [1,1,1]);
   gl.bindTexture(gl.TEXTURE_2D, woodTexture);

   gl.drawArrays(gl.TRIANGLES, 1254-456, 300);

   gl.bindTexture(gl.TEXTURE_2D, anvilTexture);
   gl.drawArrays(gl.TRIANGLES, 1254-156, 156);


   gl.depthFunc(gl.LESS);
   gl.depthMask(true);
}

