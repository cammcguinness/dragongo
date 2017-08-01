
import React from 'react';
import {StyleSheet,TouchableOpacity,View} from 'react-native';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {calculateDragonUpgradeCost,formatValue} from '../utilities/util';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class Dragon extends React.Component{

  upgrade(){
    console.log("Attempting upgrade");
    if(this.props.resources.food > calculateDragonUpgradeCost(this.props.level)){
      console.log("Can afford it, going to upgrade id="+this.props.id);
      this.props.dragonUpgraded(this.props.id);
    }
  }

  render(){
    return (
      <TouchableOpacity onPress={this.upgrade.bind(this)} style={styles.upgrade}>
        <View style={styles.upgradeTitle}>
          <MonoText>{this.props.name} (Level {this.props.level})</MonoText>
          <MonoText style={this.props.resources.food > calculateDragonUpgradeCost(this.props.level)?styles.cost:styles.costTooMuch}>{formatValue(calculateDragonUpgradeCost(this.props.level))}</MonoText>
        </View>
        <MonoText style={styles.description}>{this.props.description}</MonoText>
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


export default connect(mapStateToProps,mapDispatchToProps)(Dragon);
