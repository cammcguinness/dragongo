import {AsyncStorage,ToastAndroid} from 'react-native';
import numeral from 'numeral';
import {DRAGONS} from '../data/dragons';
import {HABITATS} from '../data/habitats';
import {UPGRADES} from '../data/upgrades';
export const CURRENT_VERSION = 28;
export const RESET = false;

export const GOLD = [1,5,10,25];
export const UPGRADE_MULTI = 2;
export const RESOURCE_MULTI = 1.6;

export const STEPS = [10000,20000,50000,100000];
export const STEPS_FOR_EGG = 10000;

export var saveFileName = "@DragonGo";
if(__DEV__){
  saveFileName = "@DragonGoDev";
}







export function calculateCost(upgrade){
  if(!upgrade){
    return 0;
  }
  return upgrade.base*Math.pow(upgrade.multiplier?upgrade.multiplier:UPGRADE_MULTI,upgrade.level);
}
export function calculateFood(level){
  return Math.pow(RESOURCE_MULTI,level+1);
}

export function calculateDragonUpgradeCost(level){
  return 100*Math.pow(UPGRADE_MULTI,level);
}

export function calculateDragonGPS(dragon){
  if(dragon==undefined){
    return 0;
  }
  return dragon.gold*Math.pow(RESOURCE_MULTI,dragon.level);
}

export function updateActiveEggs(newState,steps){
  let toRemove = [];
  for(var i=0;i<newState.activeEggs.length;i++){
      for(var j=0;j<newState.eggs.length;j++){
        if(newState.eggs[j].id==newState.activeEggs[i]){
          newState.eggs[j].stepsLeft -=steps;
          if(newState.eggs[j].stepsLeft<=0&&newState.dragons.length <maxDragons(newState.skills) ){
            let dragon = newState.eggs[j].dragon;
            dragon.id = newState.dragonMaxID+1;
            dragon.level = 0;
            newState.dragonMaxID++;
            newState.dragons.push(dragon);
            ToastAndroid.show("You hatched an egg!",ToastAndroid.LONG);
            toRemove.push(newState.eggs[j]);
          }
          if(newState.eggs[j].stepsLeft<=0){
            newState.eggs[j].stepsLeft = 0;
          }
          break;
        }
      }
  }
  for(var i=0;i<toRemove.length;i++){
    newState.eggs.splice(newState.eggs.indexOf(toRemove[i]),1);
    newState.activeEggs.splice(newState.activeEggs.indexOf(toRemove[i].id),1);
  }
  //newState.resources.gps = calculateTotalGPS(newState.dragons);

  return newState;
}

export function updateDens(newState,steps){
  let numDens = getNumberofDens(newState.skills);
  //console.log("Updating dens: "+numDens);
  //console.log("Number of dens made: "+newState.dens.length);
  newState.dens.map((den,index)=>{

    den.stepsLeft -=steps;
    //console.log("Den#"+index+", stepsLeft="+den.stepsLeft,);
    if(den.active&&den.stepsLeft<=0&&newState.eggs.length < maxEggCount(newState.skills)){
      ToastAndroid.show("One of your breeding dens has finished!",ToastAndroid.LONG);
      let egg = den.egg;
      egg.id = newState.eggMaxID+1;
      newState.eggMaxID++;
      newState.eggs.push(egg);
      let dragon1 = den.dragon1;
      let dragon2 = den.dragon2;

      let dragons = newState.dragons.filter(d=>d.id==dragon1||d.id==dragon2);
      dragons[0].breeding = false;
      dragons[1].breeding = false;
      den = {id: den.id,active: false};
      //console.log("Replacing den at index"+index);
      newState.dens[index] = den;

    }
    else if(den.stepsLeft <=0){
      den.stepsLeft = 0;
      newState.dens[index] = den;
    }
  });
  return newState;
}

export async function saveState(state){
  try {
    //console.log(JSON.stringify(state));
    if(state.habitats.length==0){
      return;
    }
    state.loaded = false;
    state.lastUpdate = new Date();
    //console.log("Saving state, food="+state.resources.food);
    await AsyncStorage.setItem(saveFileName+':state', JSON.stringify(state));
  } catch (error) {
    console.log("Error saving data: "+error);
  }
}

export function randomDragonName(){
  return 'Dragonator';
}
function checkRestrictions(restrictions,weather){

  let now = new Date();
  let month = now.getMonth();
  let hour = now.getHours();
  let day = now.getDate();
  //console.log(weather);
  let weatherCategories = weather.weather?weather.weather:[];
  let temperature = weather.main?weather.main.temp:0;
  let passed = true;
  restrictions.map(restriction=>{
    switch(restriction.type){
      case 'months':

        if(restriction.months.indexOf(month) == -1){
          passed = false;
        }
        break;
      case 'time':

        let first = restriction.time[0];
        let last = restriction.time[1];
        if(first < last){
          if (!(first < hour && last > hour)){
            passed = false;
          }
        }
        else{
          if(!(hour > first || hour < last )){
            passed = false;
          }
        }
        break;
      case 'dates':
        let months = restriction.months;
        let days = restriction.days;
        let found = false;
        for(var i=0;i<months.length;i++){
          if(months[i]==month&&days[i]==day){
            found = true;
            break;
          }
        }
        if(!found){
          passed = false;
        }
        break;
      case 'weather':
        if(weatherCategories.filter(w=>restriction.categories.indexOf(w.id)>-1).length==0){
          passed = false;
        }
        break;
      case 'temperature':
        let temp = restriction.value;
        let equality = restriction.equality;
        if(equality=="less"&&temp<temperature){
          passed = false;
        }
        else if(equality=="greater"&&temp>temperature){
          passed = false;
        }
        else if(equality=="equal"&&temp!=temperature){
          passed = false;
        }
        break;
      default:
        break;
    }
  });
  return passed;
}

function getAllowedDragons(maxSteps,weather){
  let allowed = [];
  /*for(var i=0;i<DRAGONS.length;i++){
    let dragon = DRAGONS[i];
    console.log("Checking dragon: "+dragon.name);

    if(dragon.steps>maxSteps){
      continue;
    }

    console.log("Checking restrictions for "+dragon.name);
    if(checkRestrictions(dragon.restrictions,weather)){
      console.log(dragon.name+" allowed");
      allowed.push(dragon);
    }
  }*/
  allowed = DRAGONS.filter(dragon=>(dragon.steps<=maxSteps)&&checkRestrictions(dragon.restrictions,weather));
  return allowed;
}

export function randomDragon(maxSteps,weather={}){

    let allowed = getAllowedDragons(maxSteps,weather);
    /*console.log("----------------Allowed Dragons----------------------");
    for(var i=0;i<allowed.length;i++){
      console.log(allowed[i].name);
    }
    console.log("-=-=--==-===--===============------------=-=-=-=-=--==-");*/
    // let rand = Math.floor((Math.random() * allowed.length));
    // allowed[rand].level = 0;
    // return allowed[rand];
    let total = 0;
    for(var i=0;i<allowed.length;i++){
      total+=allowed[i].weight;
    }
    var rand = Math.random()*total;
    let current = 0;
    for(var i=0;i<allowed.length;i++){
      current+=allowed[i].weight;
      if(current >= rand){
        return allowed[i];
      }
    }

}

export function randomEgg(maxSteps,weather={}){

    let dragon = randomDragon(maxSteps,weather);
    let egg = {dragon: dragon,stepsStart: dragon.steps,stepsLeft: dragon.steps};
    if(maxSteps<=1250){
      egg.stepsStart = 500;
      egg.stepsLeft = 500;
    }
    return egg;
}


export function getUpgrade(name){
  for(var i=0;i<UPGRADES.length;i++){
    if(UPGRADES[i].name==name){
      return UPGRADES[i];
    }
  }
}

export function getUpgradeLevel(upgrades,name){
  for(var i=0;i<upgrades.length;i++){
    if(upgrades[i].name==name){
      return upgrades[i].level;
    }
  }
  return 0;
}

export function calculateTotalGPS(dragons){
  let gps = 0;
  for(var i=0;i<dragons.length;i++){
    gps+=calculateDragonGPS(dragons[i]);
  }
  return gps;
}


export function maxDragons(skills){
  for(var i=0;i<skills.length;i++){
    if(skills[i].name=="Dragon Stables"){
      return skills[i].level*5+5;
    }
  }
  return 5;
}

export function maxHabitats(skill){
  if(skill==undefined){
    return 5;
  }
  let level = skill.level;
    //console.log("MaxHabitats level = "+level);
   return level*5+5;

}

export function maxActiveEggs(skills){
  for(var i=0;i<skills.length;i++){
    if(skills[i].name=="Hatchery"){
      return skills[i].level+1;
    }
  }
  return 1;
}

export function maxEggCount(skills){
  for(var i=0;i<skills.length;i++){
    if(skills[i].name=="Egg Carton"){
      return skills[i].level*5+5;
    }
  }
  return 5;
}

export function getNumberofDens(skills){
  for(var i=0;i<skills.length;i++){
    //console.log(skills[i].name);
    if(skills[i].name=="Breeding Grounds"){
      //console.log("Found breeding grounds skill: "+skills[i].level+1);
      return skills[i].level+1;
    }
  }
  return 1;
}

export function eggStepCount(skill){
  //for(var i=0;i<skills.length;i++){
    //if(skills[i].name=="Discovery"){
    if(!skill){
      //console.log("Discovery skill was null");
      return STEPS_FOR_EGG;
    }
    var stepsLeft = (1000-skill.level)/1000*STEPS_FOR_EGG;
    //console.log("Steps left for skill level: "+skill.level+" = "+stepsLeft);
      return stepsLeft;
  //   }
  // }
  // return STEPS_FOR_EGG;
}

export function stepsLeftForEgg(skill,steps){
  return eggStepCount(skill)-steps;
}

export function formatValue(value){
  return numeral(value).format('0.00a');
}

export function updateEggDiscovery(newState,steps){
  newState.stepsSinceLastEgg +=steps;
  //console.log("stepsSinceLastEgg="+newState.stepsSinceLastEgg)
  if(newState.stepsSinceLastEgg > eggStepCount(newState.skills.filter(skill=>skill.name=="Discovery")[0]) && newState.eggs.length < maxEggCount(newState.skills)){
   //console.log("Getting a new egg!");
   ToastAndroid.show("You found an egg!",ToastAndroid.LONG);
    var egg = randomEgg(1000000,newState.weather);
    egg.id = newState.eggMaxID+1;
    newState.eggMaxID++;
    newState.stepsSinceLastEgg = 0;
    newState.eggs.push(egg);
  }
  return newState;
}

export function updateHabitats(newState,steps){
  newState.habitats.map(function(habitat,index){
    habitat.dragons.filter(dragon=>dragon!=-1).map(function(dragonID,index){
      let dragon = newState.dragons.filter(dragon=>dragon.id==dragonID)[0];
      let gps = calculateDragonGPS(dragon);
      habitat.gold+=gps*steps;
      let max = getMaxCollectValue(habitat.habitatID,habitat.level);
      if(habitat.gold > max){
        habitat.gold = max;
      }
    })
  })
  return newState;
}

export function updateFarms(newState,steps){
  //console.log("Updating farms");
  newState.farms.map(function(farm,index){
    if(farm.active){
      //console.log("Updating farm# "+index+",steps="+steps+", stepsLeft="+farm.stepsLeft);
    //let stepsLeft = farm.stepsLeft - steps;
      farm.stepsLeft = farm.stepsLeft-steps;
      if(farm.stepsLeft <=0){
        farm.stepsLeft = 0;
      }
      //console.log("New steps left: "+farm.stepsLeft+","+stepsLeft);
    }
  })
  return newState;
}


export function getHabitat(id){
  return HABITATS.filter(habitat => habitat.habitatID==id)[0];
}

export function getHabitatUpgradeCost(habitatID,level){
  let base = HABITATS.filter(habitat=> habitat.habitatID==habitatID)[0].baseCost;
  return base*Math.pow(10,level);
}

export function getMaxCollectValue(habitatID,level){
  let base = HABITATS.filter(habitat=> habitat.habitatID==habitatID)[0].baseGold;
  return base*Math.pow(2,level-1);
}

export function getTotalHabitatGPS(habitats,dragons,habitatID){
  let gps = 0;

  //console.warn(habitats);
  //console.warn(dragons);
  let hdragons = habitats.filter(habitat=>habitat.id==habitatID)[0].dragons.filter(dragon=>dragon>-1);
  hdragons.map(hdragon=>{[]
    let d = dragons.filter(dragon=>dragon.id==hdragon)[0];
    gps+=calculateDragonGPS(d);
  })
  return gps;
}
