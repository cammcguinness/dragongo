import {Alert} from 'react-native';
import {STEP_TAKEN,UPGRADE_BOUGHT,SET_STATE,DRAGON_UPGRADED,OFFLINE_PRODUCTION,
  TOGGLE_ACTIVE_EGG,START_BREED,DRAGON_ADDED_TO_HABITAT,COLLECT_GOLD,UPGRADE_HABITAT,BUY_HABITAT,DRAGON_REMOVED_FROM_HABITAT,START_FARM,COLLECT_FARM} from '../actions';
import {STEPS_FOR_EGG,saveState,getUpgrade,calculateCost,calculateFood,calculateDragonUpgradeCost,calculateTotalGPS,updateActiveEggs,getUpgradeLevel,randomEgg,
eggStepCount,CURRENT_VERSION,maxEggCount,updateDens,updateEggDiscovery,updateHabitats,getHabitatUpgradeCost,updateFarms} from '../utilities/util';
import {HABITATS} from '../data/habitats';
import {FOOD} from '../data/food';
let cloneObject = function(obj){
  return JSON.parse(JSON.stringify(obj));
}

let newState = {version: CURRENT_VERSION,loaded: true, stepsSinceLastEgg: 0,
  dragonMaxID: 1,eggMaxID: 1,habitatMaxID: 1,steps: 0,resources: {gold: 0,gps:0,food: 0, fps: 0},
  dragons: [], eggs: [], activeEggs: [],skills: [],lastUpdate: new Date(),
  dens: [{id: 1,active: false}],habitats:[],farms: []};



export default function(state,action){

  switch(action.type){
    case STEP_TAKEN:
      newState = cloneObject(state);
      /*if(newState.loaded==false){
        console.log("NOT LOADED YET!");
        return newState;
      }*/
      console.log(action.amount+ " steps were taken");
      //update the resources.
      //newState.resources.gold+=newState.resources.gps*(action.amount-newState.steps);
      //newState.resources.food+=newState.resources.fps*(action.amount-newState.steps);

      //update the active eggs
      newState = updateHabitats(newState,action.amount-newState.steps);
      newState = updateActiveEggs(newState,action.amount-newState.steps);
      newState = updateDens(newState,action.amount-newState.steps);
      newState = updateEggDiscovery(newState,action.amount-newState.steps);
      newState = updateFarms(newState,action.amount - newState.steps);
      newState.steps = action.amount;
      newState.lastUpdate = new Date();
      saveState(newState);
      return newState;
    case UPGRADE_BOUGHT:
      newState = cloneObject(state);
      let upgrade = getUpgrade(action.name);
      let level = 0;
      let found = false;
      for(var i=0;i<newState.skills.length;i++){
        if(newState.skills[i].name==action.name){
          level = newState.skills[i].level;
          newState.skills[i].level++;
          found = true;
          break;
        }
      }
      if(!found){
        newState.skills.push({name: action.name,level: 1});
      }

      let cost = calculateCost(upgrade);
      newState.resources.gold-=cost;
      if(action.name=="Food Farm"){
        let fps = calculateFood(level);
        newState.resources.fps=fps;
      }
      else if(action.name=="Breeding Grounds"){
          newState.dens.push({id: newState.dens.length+1,active:false});
      }
      else if(action.name=="Food Farms"){
        newState.farms.push({id: newState.farms.length+1,level: 1,active:false});
      }
      newState.lastUpdate = new Date();
      saveState(newState);
      return newState;
    case DRAGON_UPGRADED:

      newState = cloneObject(state);
      for(var i=0;i<newState.dragons.length;i++){
        if(newState.dragons[i].id==action.id){
          let foodCost = calculateDragonUpgradeCost(newState.dragons[i].level);
          newState.resources.food -=foodCost;
          newState.dragons[i].level++;
          break;
        }
      }
      newState.resources.gps = calculateTotalGPS(newState.dragons);
      newState.lastUpdate = new Date();
      saveState(newState);
      return newState;
    case OFFLINE_PRODUCTION:
      newState = cloneObject(state);

      /*var level = 0;
      for(var i=0;i<newState.skills.length;i++){
        if(newState.skills[i].name=="Offline Production"){
          level = newState.skills[i].level;
          break;
        }
      }*/
      //console.log("Offline steps: "+action.steps);
      var goldAdd = Math.floor((newState.resources.gps*(action.steps)));
      var foodAdd = Math.floor((newState.resources.fps*(action.steps)));
      var stepsTaken = Math.floor(action.steps);
      newState = updateDens(newState,stepsTaken);
      //newState.resources.gold+=goldAdd;
      //newState.resources.food+=foodAdd;
      if(stepsTaken > 0){
        // Alert.alert(
        //   'Offline Production',
        //   'You did '+stepsTaken+' steps and made '+foodAdd+' food');
        newState = updateHabitats(newState,stepsTaken);
        newState = updateActiveEggs(newState,stepsTaken);
        newState = updateDens(newState,stepsTaken);
        newState = updateEggDiscovery(newState,stepsTaken);
        newState = updateFarms(newState,stepsTaken);

        saveState(newState);
      }
      newState.loaded = true;
      return newState;

    case TOGGLE_ACTIVE_EGG:
      newState = cloneObject(state);
      if(newState.activeEggs.indexOf(action.id)>-1){
        newState.activeEggs.splice(newState.activeEggs.indexOf(action.id),1);
      }
      else{
        var hatchery = getUpgradeLevel(newState.skills,"Hatchery");
        if(hatchery+1>newState.activeEggs.length){
          newState.activeEggs.push(action.id);
        }
      }
      saveState(newState);
      return newState;

    case START_BREED:
      newState = cloneObject(state);
      if(action.dragon1==action.dragon2){
        return newState;
      }
      for(var i=0;i<newState.dens.length;i++){
        let den = newState.dens[i];
        if(den.id==action.id){
          den.active = true;
          den.egg = randomEgg(100000,newState.weather);
          den.stepsStart = den.egg.stepsStart;
          den.stepsLeft = den.egg.stepsLeft;
          den.dragon1 = action.dragon1;
          den.dragon2 = action.dragon2;
          break;
        }
      }
      let dragons = newState.dragons.filter(d => d.id==action.dragon1||d.id==action.dragon2);
      dragons[0].breeding = true;
      dragons[1].breeding = true;
      saveState(newState);
      return newState;
    case SET_STATE:
      //console.log("Setting initial state");
      newState = cloneObject(action.state);
      //saveState(newState);
      return newState

    case DRAGON_ADDED_TO_HABITAT:
      newState = cloneObject(state);
      if(action.dragon==-1||action.habitatID==-1){
        return newState;
      }
      //console.log(newState.habitats);
      //console.log("Habitat: "+action.habitatID);
      //console.log("Dragon: "+action.dragon);
      newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].dragons[action.index]=action.dragon;
      newState.dragons.filter(dragon=>dragon.id==action.dragon)[0].habitat = action.habitatID;
      saveState(newState);
      return newState;
    case DRAGON_REMOVED_FROM_HABITAT:
      newState = cloneObject(state);
      //console.log("Removing Dragon: "+action.dragon+" from slot "+action.index+" in habitat "+action.habitatID);
      newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].dragons[action.index]=-1;
      newState.dragons.filter(dragon=>dragon.id==action.dragon)[0].habitat = -1;
      saveState(newState);
      return newState;

    case COLLECT_GOLD:
      newState = cloneObject(state);
      let gold = newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].gold;
      newState.resources.gold+=gold;
      newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].gold = 0;
      saveState(newState);
      return newState;
    case UPGRADE_HABITAT:
      newState = cloneObject(state);
      var cost = getHabitatUpgradeCost(newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].habitatID,newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].level);
      newState.resources.gold-=cost;
      newState.habitats.filter(habitat=>habitat.id==action.habitatID)[0].level++;
      saveState(newState);
      return newState;
    case BUY_HABITAT:
      newState = cloneObject(state);
      var habitat = HABITATS.filter(habitat=>habitat.habitatID==action.habitatID)[0]
      var cost = habitat.baseCost;
      newState.resources.gold-=cost;
      habitat.level = 1;
      habitat.gold = 0;
      habitat.dragons = [-1,-1,-1,-1,-1];
      if(newState.maxHabitatID==undefined){
        newState.maxHabitatID=1;
      }
      //console.log("maxHabitatID="+newState.maxHabitatID);
      habitat.id = newState.maxHabitatID+1;
      //console.log("habitat.id="+habitat.id);
      newState.maxHabitatID++;
      newState.habitats.push(habitat);
      saveState(newState);
      return newState;
    case START_FARM:
      newState = cloneObject(state);
      //console.log("Starting a farm: "+action.index+" with "+action.food.name);
      let farm = action.farm;
      farm.active = true;
      farm.stepsLeft = action.food.steps;//FOOD.filter(food=>food.name==action.food.name)[0].steps;
      farm.food = action.food;
      newState.resources.gold -= action.food.cost;
      newState.farms[action.index] = farm;
      saveState(newState);
      return newState;
    case COLLECT_FARM:
      newState = cloneObject(state);
      var farm = action.farm;
      newState.resources.food += farm.food.food;
      newState.farms[action.index] = {id: action.farm.id,level: action.farm.level,active:false};

      saveState(newState);
      return newState;
    default:
      return state || newState;
  }
};
