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
import {randomDragon,randomEgg,GOLD,CURRENT_VERSION,getHabitat,RESET,saveFileName} from '../utilities/util';

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



  render() {
    return <RootStackNavigator onNavigationStateChange={null}/>;
  }




}

export default connect(mapStateToProps,mapDispatchToProps)(RootNavigator);
