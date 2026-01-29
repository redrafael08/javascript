


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

function loadGame(saveSlot) {
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

