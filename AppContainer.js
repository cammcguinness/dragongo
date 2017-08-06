import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AppState,AsyncStorage } from 'react-native';
import { AppLoading,Pedometer,Location,Permissions } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import {Provider,connect} from 'react-redux';
import {createStore,combineReducers,bindActionCreators} from 'redux';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import {UPGRADES} from './data/upgrades';
import * as Actions from './actions';
import TitleBar from './components/TitleBar';
import {randomDragon,randomEgg,GOLD,CURRENT_VERSION,getHabitat,RESET,saveFileName} from './utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,eggs: state.stepReducers.eggs,lastUpdate: state.stepReducers.lastUpdate};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}


class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    appState: 'active',
  };


  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this._loadSavedState();
   this._subscribe();
   this._loadAssetsAsync();


   //this._notificationSubscription = this._registerForPushNotifications();
 }

 _handleAppStateChange = (nextAppState) => {
   if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
     this.offlineProduction(null);
   }
   this.setState({appState: nextAppState});
 }

 newPlayer(){
   //console.log("-----------------Creating first dragon--------------------");
   let dragon = randomDragon(1000);
   dragon.id = 1;
   dragon.habitat = 1;
   dragon.level = 1;
   // let dragon2 = randomDragon(1000);
   // dragon2.id = 2;
   // dragon2.habitat = -1;
   // dragon2.level = 1;
   //console.log("-----------------Creating first egg--------------------");
   let egg = randomEgg(1250);
   egg.id = 1;

   let hab = getHabitat(dragon.habitats[0]);
   hab.level = 1;
   hab.dragons = [1,-1,-1,-1,-1];
   hab.gold = 0;
   hab.id = 1;

   let newState = {version: CURRENT_VERSION,dragonMaxID: 1,eggMaxID: 1,habitatMaxID: 1,steps: 0,resources: {gold: 0,food: 0},
   dragons: [dragon,], eggs: [egg,], activeEggs: [1],skills: UPGRADES,
   lastUpdate: new Date(),dens: [],habitats:[hab],farms:[]};
   this.props.setState(newState);
 }

 offlineProduction(start=null){
   console.log("Getting Offline Production");
   if(start==null){
     start = this.props.lastUpdate;
   }
   let end = new Date();
   if(start >= end){
     return;
   }
   Pedometer.getStepCountAsync(start, end).then(
       result => {
         //this.setState({ pastStepCount: result.steps });
         this.props.offlineProduction(result.steps);
       },
       error => {
           console.log("Offline steps didn't work");
           console.log(error);
       }
     );
 }

 async _loadSavedState(){
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   let weather = {};
   if (status !== 'granted') {
     console.log("No access to location given");
   }
   else{
       let location = await Location.getCurrentPositionAsync({});
       let lat = location.coords.latitude;
       let long = location.coords.longitude;
       //console.log(location);

       try {
         let response = await fetch('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid=d1a7e41166a1ff0d704daf1631402eff&units=metric');
         weather =  await response.json();

       } catch(error) {
         console.error(error);
       }
   }
   //console.log("Loading saved state");
   try {

   const value = await AsyncStorage.getItem(saveFileName+':state');
   //console.log("Value retrieved");
   if (value !== null){
     //console.log(value);
     /*if(__DEV__){
       value = `{"version":28,"dragonMaxID":17,"eggMaxID":22,"habitatMaxID":1,"steps":8479,"resources":{"gold":191501.0374624001,"food":4300,"gps":119.72543680000008},"dragons":[{"id":1,"name":"Light","habitats":[1],"weight":1,"steps":1000,"gold":0.5,"restrictions":[{"type":"time","time":[9,21]}],"level":5,"habitat":1,"breeding":false},{"id":2,"name":"Summer","habitats":[3],"weight":1,"steps":1000,"gold":0.5,"restrictions":[{"type":"months","months":[5,6,7]}],"level":5,"habitat":2,"breeding":false},{"id":3,"name":"Shade","habitats":[3,2],"weight":0.5,"steps":1450,"gold":0.75,"restrictions":[{"type":"months","months":[5,6,7]},{"type":"weather","categories":[800,801]}],"level":5,"breeding":false,"habitat":2},{"id":4,"name":"Travel","habitats":[3,15],"weight":0.05,"steps":4350,"gold":1.6,"restrictions":[{"type":"months","months":[5,6,7]}],"level":5,"habitat":3,"breeding":false},{"id":5,"name":"Shade","habitats":[3,2],"weight":0.5,"steps":1450,"gold":0.75,"restrictions":[{"type":"months","months":[5,6,7]},{"type":"weather","categories":[800,801]}],"level":4,"breeding":false,"habitat":4},{"id":6,"name":"July","habitats":[3,8],"weight":0.5,"steps":1150,"gold":0.62,"restrictions":[{"type":"months","months":[6]}],"level":5,"habitat":4,"breeding":false},{"id":7,"name":"Shade","habitats":[3,2],"weight":0.5,"steps":1450,"gold":0.75,"restrictions":[{"type":"months","months":[5,6,7]},{"type":"weather","categories":[800,801]}],"level":0,"habitat":3},{"id":8,"name":"Travel","habitats":[3,15],"weight":0.05,"steps":4350,"gold":1.6,"restrictions":[{"type":"months","months":[5,6,7]}],"level":0,"habitat":4},{"id":9,"name":"Watermelon","habitats":[3,12],"weight":0.14,"steps":1610,"gold":0.93,"restrictions":[{"type":"months","months":[5,6,7]}],"level":5,"habitat":5,"breeding":false},{"id":10,"name":"Raspberry","habitats":[3,12],"weight":0.23,"steps":1460,"gold":0.8,"restrictions":[{"type":"months","months":[5,6,7]}],"level":5,"breeding":false,"habitat":5},{"id":11,"name":"Blueberry","habitats":[3,12],"weight":0.18,"steps":1545,"gold":0.89,"restrictions":[{"type":"months","months":[5,6,7]}],"level":4,"breeding":false,"habitat":6},{"id":12,"name":"Vacation","habitats":[3,15],"weight":0.05,"steps":4725,"gold":1.62,"restrictions":[{"type":"months","months":[5,6,7]}],"level":5,"habitat":7,"breeding":false},{"id":13,"name":"Owl","habitats":[2,14],"weight":0.1,"steps":2650,"gold":1.4,"restrictions":[{"type":"time","time":[21,9]}],"level":4,"breeding":false,"habitat":8},{"id":14,"name":"Sky","habitats":[1,14],"weight":0.7,"steps":2050,"gold":1.1,"restrictions":[{"type":"time","time":[9,21]},{"type":"weather","categories":[800,801]}],"level":4,"habitat":1},{"id":15,"name":"Raspberry","habitats":[3,12],"weight":0.23,"steps":1460,"gold":0.8,"restrictions":[{"type":"months","months":[5,6,7]}],"level":0,"habitat":-1},{"id":17,"name":"Wonder","habitats":[3,15],"weight":0.01,"steps":5100,"gold":2.2,"restrictions":[{"type":"months","months":[5,6,7]}],"level":0}],"eggs":[{"dragon":{"id":318,"name":"Vacation","habitats":[3,15],"weight":0.05,"steps":4725,"gold":1.62,"restrictions":[{"type":"months","months":[5,6,7]}],"level":0},"stepsStart":4725,"stepsLeft":4725,"id":18},{"dragon":{"id":320,"name":"Cottage","habitats":[3,15],"weight":0.05,"steps":4125,"gold":1.42,"restrictions":[{"type":"months","months":[5,6,7]}],"level":0},"stepsStart":4125,"stepsLeft":4125,"id":20},{"dragon":{"id":315,"name":"Swim","habitats":[3,10,13],"weight":0.4,"steps":1350,"gold":0.74,"restrictions":[{"type":"months","months":[5,6,7]}],"level":0},"stepsStart":1350,"stepsLeft":1350,"id":21},{"dragon":{"id":107,"name":"Day","habitats":[1,8],"weight":0.8,"steps":1250,"gold":0.6,"restrictions":[{"type":"time","time":[9,17]}]},"stepsStart":1250,"stepsLeft":1250,"id":22}],"activeEggs":[],"skills":[{"name":"Food Farm","base":100,"description":"Increase number of food generated per step. No maximum.","level":0},{"name":"Discovery","base":1000,"description":"Decrease number of steps required to find an egg.","level":2},{"name":"Hatchery","base":1000,"description":"Increase number of active eggs allowed by 1.","level":2,"multiplier":10},{"name":"Egg Carton","base":1000,"description":"Increase the number of eggs allowed by 5","level":1,"multiplier":10},{"name":"Breeding Grounds","base":1000,"description":"Increase number of active breeding spots by 1","level":2,"multiplier":10},{"name":"Dragon Stables","base":1000,"description":"Increase number of dragons not in habitats allowed by 5.","level":3,"multiplier":10},{"name":"Land Size","base":1000,"description":"Increase number of habitats allowed by 5.","level":1,"multiplier":10},{"name":"Food Farms","base":100,"description":"Increase number of food farms by 1.","level":3,"multiplier":10}],"lastUpdate":"2017-08-03T15:26:36.989Z","dens":[{"id":1,"active":false,"stepsLeft":0},{"id":2,"active":false,"stepsLeft":0}],"habitats":[{"habitatID":1,"name":"Light","baseCost":100,"baseGold":500,"level":3,"dragons":[1,14,-1,-1,-1],"gold":2000,"id":1},{"habitatID":3,"name":"Summer","baseCost":100,"baseGold":500,"level":3,"gold":2000,"dragons":[2,3,-1,-1,-1],"id":2},{"habitatID":3,"name":"Summer","baseCost":100,"baseGold":500,"level":4,"gold":4000,"dragons":[4,7,-1,-1,-1],"id":3},{"habitatID":3,"name":"Summer","baseCost":100,"baseGold":500,"level":3,"gold":2000,"dragons":[6,5,8,-1,-1],"id":4},{"habitatID":12,"name":"Fruit","baseCost":1000,"baseGold":5000,"level":2,"gold":10000,"dragons":[9,10,-1,-1,-1],"id":5},{"habitatID":12,"name":"Fruit","baseCost":1000,"baseGold":5000,"level":2,"gold":10000,"dragons":[11,-1,-1,-1,-1],"id":6},{"habitatID":3,"name":"Summer","baseCost":100,"baseGold":500,"level":3,"gold":2000,"dragons":[12,-1,-1,-1,-1],"id":7},{"habitatID":2,"name":"Dark","baseCost":100,"baseGold":500,"level":3,"gold":2000,"dragons":[13,-1,-1,-1,-1],"id":8},{"habitatID":1,"name":"Light","baseCost":100,"baseGold":500,"level":3,"gold":964.2704896000006,"dragons":[16,-1,-1,-1,-1],"id":9}],"farms":[{"id":1,"level":1,"active":true,"stepsLeft":0,"food":{"key":2,"name":"Squirrel","steps":1000,"food":1500,"cost":1000,"level":1}},{"id":2,"level":1,"active":true,"stepsLeft":0,"food":{"key":2,"name":"Squirrel","steps":1000,"food":1500,"cost":1000,"level":1}},{"id":3,"level":1,"active":true,"stepsLeft":0,"food":{"key":2,"name":"Squirrel","steps":1000,"food":1500,"cost":1000,"level":1}}],"stepsSinceLastEgg":8479,"loaded":false,"weather":{"coord":{"lon":-80.24,"lat":43.52},"weather":[{"id":721,"main":"Haze","description":"haze","icon":"50d"}],"base":"stations","main":{"temp":24,"pressure":1019,"humidity":69,"temp_min":24,"temp_max":24},"visibility":14484,"wind":{"speed":1},"clouds":{"all":1},"dt":1501772700,"sys":{"type":1,"id":3730,"message":0.005,"country":"CA","sunrise":1501755213,"sunset":1501807190},"id":5967629,"name":"Guelph","cod":200},"maxHabitatID":9}`;
     }*/
     let newState = JSON.parse(value);
     if(newState.habitats){
       newState.habitats.map(function(habitat,index){
         if(!habitat.level){
           habitat.level = 1;
         }
         habitat.dragons.map((dragonID,index)=>{
           var drag = newState.dragons.filter(dragon=>(dragonID==dragon.id))
           if(drag==undefined||drag.length==0){
             habitat.dragons[index] = -1;
           }
         })
       });
     }
     if(newState.version==undefined||newState.version < CURRENT_VERSION|| RESET){
       this.newPlayer();
     }
     else {
       //let dragon = randomDragon(true);

       newState.steps = 0;
       if(!newState.habitats){
         let hab = getHabitat(3);
         hab.level = 1;
         newState.habitats = [getHabitat(3)];
       }
       newState.habitats.map(function(habitat,index){
         if(habitat.id==null){
           habitat.id = index;
           newState.maxHabitatID = index;
         }
       });
       if(newState.dragons.length==0){
         let dragon = randomDragon(true);
         dragon.id = 1;
         dragon.habitat = -1;
         newState.dragons.push(dragon);
         newState.resources.gps = GOLD[dragon.rarity];
         newState.dragonMaxID = 1;
         newState.eggMaxID = 1;
         let egg = randomEgg(true);
         egg.id = 1;
         newState.eggs.push(egg);
         newState.activeEggs.push(1);
         let hab = getHabitat(dragon.habitats[0])
         hab.level = 1;
         newState.habitats = [hab];
       }
       else{
         //offline progress needs to be done.
         let start = new Date(newState.lastUpdate);
         //newState.activeEggs = [];
         //console.log(newState.dragons);
         //newState.eggs = [];
         //newState.dens = [];
         /*newState.dragons.map(function(dragon,index){
           dragon.breeding = false;
         });*/
         if(isNaN(newState.resources.food)){
           newState.resources.food = 0;
         }
         //newState.dens[0].active = false;
       //  newState.dragons[0].breeding = false;
       //  newState.dragons[1].breeding = false;
       //console.log(newState.dens);
       // newState.skills.map((skill,index)=>{
       //   var s = UPGRADES.filter(u=>u.name==skill.name)[0];
       //   s.level = skill.level;
       //   newState.skills[index] = s;
       // })
       //newState.eggs = [newState.eggs[0]];
         //console.log("Loaded food="+newState.resources.food);
         this.offlineProduction(start);

         /*for(var i=0;i<newState.skills.length;i++){
           if(newState.skills[i].name=="Offline Production"&&newState.skills[i].level>0){

             let end = new Date();

           }
         }*/
       }
       newState.weather = weather;
       this.props.setState(newState);
     }

   }
   else{
     //There has been no saved data. Give them a dragon and egg here and start it blank.
     this.newPlayer();
   }
 } catch (error) {
   console.log("There was an error getting the saved state: "+error);
   throw error;
 }
 }

 _subscribe = () => {
   //console.log("Subscribing to pedometer");
  this._subscription = Pedometer.watchStepCount(result => {
    this.props.step(result.steps);
    //console.log("Steps: "+result.steps);
  });
}



  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });

    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' &&
            <View style={styles.statusBarUnderlay} />}
            <TitleBar />
          <RootNavigation />
        </View>
      );
    } else {
      return <AppLoading />;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);
