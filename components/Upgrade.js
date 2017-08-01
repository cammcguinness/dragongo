import React from 'react';
import {StyleSheet,TouchableOpacity,View} from 'react-native';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {calculateFood,calculateCost,formatValue} from '../utilities/util';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources,skills: state.stepReducers.skills};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class Upgrade extends React.Component{

  upgrade(){

    if(this.props.resources.gold > this.cost()){
      this.props.upgradeBought(this.props.skill.name);
    }
  }

  level(){
    return this.props.skill?this.props.skill.level:0;
  }

  cost(){

      let level = this.level();
      //console.log("Level: "+level);
      //console.log(this.props.skill);
      return calculateCost(this.props.skill);
  }

  render(){
    let cost = this.cost();
    return (
      <TouchableOpacity onPress={this.upgrade.bind(this)} style={styles.upgradeTitle}><MonoText>{this.props.title}</MonoText><MonoText style={this.props.resources.gold>cost?styles.cost:styles.costTooMuch}>{formatValue(cost)}</MonoText></TouchableOpacity>
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


export default connect(mapStateToProps,mapDispatchToProps)(Upgrade);
