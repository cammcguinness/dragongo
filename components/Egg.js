
import React from 'react';
import {StyleSheet,TouchableOpacity,View} from 'react-native';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {calculateDragonUpgradeCost} from '../utilities/util';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class Egg extends React.Component{

  activate(){
      this.props.toggleActiveEgg(this.props.id);
  }

  render(){
    return (
      <TouchableOpacity onPress={this.activate.bind(this)} style={styles.upgrade}>
        <View style={this.props.active?styles.titleActive:styles.upgradeTitle}>
          <MonoText>Type: {this.props.name}</MonoText>
        </View>
        <MonoText style={styles.description}>{'Steps: '+this.props.stepsLeft+'/'+this.props.stepsStart}</MonoText>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',

    },
  upgrade: {
    marginTop: 10,
    width: '80%',
    flex: 0,
    borderWidth: 1,
    borderColor: 'black'

  },
  upgradeTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.tabIconSelected,
    padding: 4
  },
  titleActive:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.activeColor,
    padding: 4
  },
  cost: {
    color: 'gold'
  },
  costTooMuch: {
    color: 'red'
  },
  description: {
    padding: 4
  }
});


export default connect(mapStateToProps,mapDispatchToProps)(Egg);
