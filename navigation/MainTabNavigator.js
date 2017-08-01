/**
 * @flow
 */

import React from 'react';
import {View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import {MonoText} from '../components/StyledText';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
//import UpgradesScreen from '../screens/UpgradesScreen';
import FoodScreen from '../screens/FoodScreen';
import EggsScreen from '../screens/EggsScreen';
import BreedingScreen from '../screens/BreedingScreen';
import HabitatScreen from '../screens/HabitatScreen';

export default TabNavigator(
  {
    Habitats: {
      screen: HabitatScreen,
    },
    Dragons: {
      screen: HomeScreen,
    },
    Food: {
      screen: FoodScreen,

    },
    Eggs: {
      screen: EggsScreen,
    },
    Breeding: {
      screen: BreedingScreen,
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      // Set the tab bar icon
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        let textName;
        switch (routeName) {
          case 'Habitats':
            iconName = 'ios-home';
            textName = 'Habitats';
            break;
          case 'Food':
            iconName = 'ios-restaurant';
            textName = 'Food';
            break;
          case 'Eggs':
            iconName = 'ios-egg';
            textName = 'Eggs';
            break;
          case 'Breeding':
            iconName='ios-bonfire';
            textName = 'Breeding';
            break;
          case 'Dragons':
            iconName='ios-bug';
            textName = 'Dragons';
        }
        return (<View style={{alignItems: 'center'}}>
          <Ionicons
            name={iconName}
            size={32}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          /><MonoText>{textName}</MonoText></View>
        );
      },
    }),
    // Put tab bar on bottom of screen on both platforms
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    // Disable animation so that iOS/Android have same behaviors
    animationEnabled: false,
    // Don't show the labels
    tabBarOptions: {
      showLabel: false,
    },
  }
);
