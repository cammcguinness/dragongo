import { Notifications } from 'expo';
import React from 'react';
import {AsyncStorage,AppState} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Pedometer,Location,Permissions } from "expo";
import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import {UPGRADES} from '../data/upgrades';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {randomDragon,randomEgg,GOLD,CURRENT_VERSION,getHabitat,RESET} from '../utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,eggs: state.stepReducers.eggs,lastUpdate: state.stepReducers.lastUpdate};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
  },
  {
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      eggs: 1,
    }),
  }
);

class RootNavigator extends React.Component {

   state = {
     appState: 'active',
   }

   componentDidMount() {
     AppState.addEventListener('change', this._handleAppStateChange);
     this._loadSavedState();
    this._subscribe();


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

    // let dragon2 = randomDragon(true);
    // dragon2.id = 2;
    // dragon2.habitat = -1;
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
    //console.log("Getting Offline Production");
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

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
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
    const value = await AsyncStorage.getItem('@DragonGo:state');
    //console.log("Value retrieved");
    if (value !== null){
      //console.log(value);
      let newState = JSON.parse(value);
      if(newState.habitats){
        newState.habitats.map(function(habitat,index){
          if(!habitat.level){
            habitat.level = 1;
          }
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

  render() {
    return <RootStackNavigator onNavigationStateChange={null}/>;
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    //registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }


}

export default connect(mapStateToProps,mapDispatchToProps)(RootNavigator);
