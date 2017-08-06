import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import Colors from '../constants/Colors';

import { MonoText } from '../components/StyledText';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {formatValue} from '../utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,weather: state.stepReducers.weather};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class TitleBar extends React.Component {


  render() {
    //console.log(this.props.weather?this.props.weather.weather[0].description:"Weather is null");
    return (
      <View style={styles.titleBar}>
        <MonoText style={styles.title}>Dragon Go</MonoText>
        <View style={styles.goldContainer}>
          <MonoText style={styles.weather}>{this.props.weather?this.props.weather.main.temp:""}C</MonoText>
          <MonoText style={styles.weather}>{this.props.weather?this.props.weather.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()):""}</MonoText>
        </View>
        <View style={styles.goldContainer}>
          <MonoText style={styles.gold}>Gold: {formatValue(this.props.resources.gold)}</MonoText>
          <MonoText style={styles.gold}>Food: {formatValue(this.props.resources.food)}</MonoText>
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#244f96',
    height: 50,
    alignItems: 'center',
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  goldContainer: {
    flexDirection: 'column',
  },
  gold: {
    fontSize: 14,
    color: 'gold',
  },
  weather: {
    fontSize: 14,
    color: 'white',
  },
  foodContainer: {
    flexDirection: 'column',
  },
  food: {
    fontSize: 14,
    color: 'red',
  }

});

export default connect(mapStateToProps,mapDispatchToProps)(TitleBar);
