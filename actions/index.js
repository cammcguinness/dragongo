export const SET_STATE = 'SET_STATE';
export const STEP_TAKEN = 'STEP_TAKEN';
export const UPGRADE_BOUGHT = 'UPGRADE_BOUGHT';
export const DRAGON_UPGRADED = 'DRAGON_UPGRADED';
export const OFFLINE_PRODUCTION = 'OFFLINE_PRODUCTION';
export const TOGGLE_ACTIVE_EGG = "TOGGLE_ACTIVE_EGG";
export const START_BREED = "START_BREED";
export const DRAGON_ADDED_TO_HABITAT = "DRAGON_ADDED_TO_HABITAT";
export const DRAGON_REMOVED_FROM_HABITAT = "DRAGON_REMOVED_FROM_HABITAT";
export const COLLECT_GOLD = "COLLECT_GOLD";
export const UPGRADE_HABITAT = "UPGRADE_HABITAT";
export const BUY_HABITAT = "BUY_HABITAT";
export const COLLECT_FARM = "COLLECT_FARM";
export const START_FARM = "START_FARM";
export const UPGRADE_FARM = "UPGRADE_FARM";
export const SELL_DRAGON = "SELL_DRAGON";
export function step(amount){
    return {type: STEP_TAKEN, amount: amount}
}

export function upgradeBought(name){
  return {type: UPGRADE_BOUGHT,name: name}
}

export function dragonUpgraded(id){
  return {type: DRAGON_UPGRADED,id: id}
}

export function setState(state){
  return {type: SET_STATE,state: state}
}

export function offlineProduction(steps){
  return {type: OFFLINE_PRODUCTION,steps: steps};
}

export function toggleActiveEgg(id){
  return {type: TOGGLE_ACTIVE_EGG,id: id};
}

export function startBreed(id,dragon1, dragon2){
  return {type: START_BREED,dragon1: dragon1, dragon2: dragon2,id: id};
}


export function dragonAddedToHabitat(habID,index,dragon){
  return {type: DRAGON_ADDED_TO_HABITAT,habitatID: habID, index: index,dragon: dragon};
}

export function dragonRemovedFromHabitat(habID,index,dragon){
  return {type: DRAGON_REMOVED_FROM_HABITAT,habitatID: habID, index: index,dragon: dragon};
}

export function collectGold(habitatID){
  return {type: COLLECT_GOLD,habitatID: habitatID};
}

export function upgradeHabitat(habitatID){
  return {type: UPGRADE_HABITAT,habitatID: habitatID};
}

export function buyHabitat(habitatID){
  return {type: BUY_HABITAT,habitatID: habitatID};
}

export function collectFarm(farm,index){
  return {type: COLLECT_FARM,farm: farm,index: index};
}

export function startFarm(farm,food,index){
  return {type: START_FARM,farm: farm,food: food,index};
}
export function sellDragon(dragon){
  return {type: SELL_DRAGON,dragon:dragon};
}
