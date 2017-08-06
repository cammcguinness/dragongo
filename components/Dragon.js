
import React from 'react';
import {StyleSheet,TouchableOpacity,View} from 'react-native';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {calculateDragonUpgradeCost,formatValue} from '../utilities/util';
import PopUp from './PopUp';
import {styles} from '../constants/styles';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class Dragon extends React.Component{

  state = {
    modalVisible: false
  }

  upgrade(){
    console.log("Attempting upgrade");
    if(this.props.resources.food > calculateDragonUpgradeCost(this.props.level)){
      //console.log("Can afford it, going to upgrade id="+this.props.id);
      this.props.dragonUpgraded(this.props.id);
    }
  }

  sell(){
    this.setModalVisible(false);
    this.props.sellDragon(this.props.dragon);

  }

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

  render(){
    return (
      <View style={styles.upgrade}>
      <TouchableOpacity onPress={this.upgrade.bind(this)} >
        <View style={styles.upgradeTitle}>
          <MonoText>{this.props.name} (Level {this.props.level})</MonoText>
          <MonoText style={this.props.resources.food > calculateDragonUpgradeCost(this.props.level)?styles.cost:styles.costTooMuch}>{formatValue(calculateDragonUpgradeCost(this.props.level))}</MonoText>
        </View>
        <MonoText style={styles.description}>{this.props.description}</MonoText>
      </TouchableOpacity>
      {this.props.dragon.habitat==-1||this.props.dragon.habitat==undefined?<TouchableOpacity onPress={()=>{this.setModalVisible(true)}} style={styles.upgradeTitle}>
        <MonoText>Sell</MonoText>
        <MonoText style={styles.cost}>{formatValue(this.props.dragon.steps*2)}</MonoText>
      </TouchableOpacity>:null}

      <PopUp visible={this.state.modalVisible} title="Are you sure?" close={()=>{this.setModalVisible(false)}}>
            <MonoText>Sell {this.props.name} (Level {this.props.level}) for {formatValue(this.props.dragon.steps*2)} gold?</MonoText>
            <TouchableOpacity onPress={this.sell.bind(this)} style={styles.upgradeTitle}><MonoText>Yes</MonoText></TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.setModalVisible(false)}} style={styles.upgradeTitle}><MonoText>No</MonoText></TouchableOpacity>
      </PopUp>
      </View>
    )
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(Dragon);
