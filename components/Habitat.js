
import React from 'react';
import {StyleSheet,TouchableOpacity,View,Picker} from 'react-native';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {styles} from '../constants/styles';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {formatValue,getHabitatUpgradeCost,getMaxCollectValue,getTotalHabitatGPS} from '../utilities/util';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources, habitats: state.stepReducers.habitats,dragons: state.stepReducers.dragons};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class Habitat extends React.Component{

  state = {
    dragons: []
  }

  upgrade(){
    if(this.props.resources.gold > getHabitatUpgradeCost(this.props.habitatID,this.props.level)){
      this.props.upgradeHabitat(this.props.id);
    }
  }

  componentDidMount(){
    //console.log(this.props.selectedDragons);
    this.setState({dragons: this.props.selectedDragons})
  }

  collect(){
    this.props.collectGold(this.props.id);
  }

  setDragon(number,value){
    //console.log("Setting dragon#"+number+" to value "+value);


    this.props.dragonAddedToHabitat(this.props.id,number,value);
  }

  removeDragon(slot,dragon){
    this.props.dragonRemovedFromHabitat(this.props.id,slot,dragon);
  }

  getDragonSlot(index){
    if(this.props.level <= index){
      return null;
    }
    //console.log(this.props.dragons);
    let pickers1 = this.props.dragons.filter(dragon=>(dragon.habitat==undefined||dragon.habitat==-1)&&dragon.habitats.indexOf(this.props.habitatID)>-1).map(function(dragon,index){
      //console.log("Can have "+dragon.name);
      return <Picker.Item key={index} value={dragon.id} label={dragon.name+'(Level: '+dragon.level+')'} />
    }.bind(this));
    return this.props.selectedDragons[index]==-1?<Picker selectedValue={this.props.selectedDragons[index]} onValueChange={(itemValue, itemIndex) => this.setDragon(index,itemValue)}>
      <Picker.Item value={-1} label="Choose a dragon" />
      {pickers1}
    </Picker>:<View style={{marginLeft: 5, marginRight: 5,flex: 1,flexDirection: 'row', justifyContent: 'space-between'}}>
    <MonoText>{this.props.dragons.filter(dragon=>dragon.id==this.props.selectedDragons[index])[0].name} (Level: {this.props.dragons.filter(dragon=>dragon.id==this.props.selectedDragons[index])[0].level})</MonoText>
    <TouchableOpacity onPress={()=>this.removeDragon(index,this.props.selectedDragons[index])}><MonoText style={styles.costTooMuch} >Remove</MonoText></TouchableOpacity></View>
  }

  render(){
    //console.log(this.props.dragons);
    //console.log("Dragon 1: "+this.props.selectedDragons[0]);
    return (
      <View style={styles.upgrade}>
        <View style={styles.upgradeTitle}>
          <MonoText>{this.props.name} (Level {this.props.level})</MonoText>
          <MonoText style={styles.cost}>GPS: {formatValue(getTotalHabitatGPS(this.props.habitats,this.props.dragons,this.props.id))}</MonoText>
        </View>
        <View style={styles.description}>
            {this.getDragonSlot(0)}
            {this.getDragonSlot(1)}
            {this.getDragonSlot(2)}
            {this.getDragonSlot(3)}
            {this.getDragonSlot(4)}

        </View>
        {this.props.level<5?<TouchableOpacity onPress={this.upgrade.bind(this)} style={[styles.upgradeTitle,styles.button]}>
          <MonoText>Upgrade</MonoText>
          <MonoText style={this.props.resources.gold >getHabitatUpgradeCost(this.props.habitatID,this.props.level)?styles.cost:styles.costTooMuch }>{formatValue(getHabitatUpgradeCost(this.props.habitatID,this.props.level))}</MonoText>
        </TouchableOpacity>:null}
        <TouchableOpacity onPress={this.collect.bind(this)} style={styles.upgradeTitle}>
          <MonoText>Collect</MonoText>
          <MonoText>{formatValue(this.props.gold)} / {formatValue(getMaxCollectValue(this.props.habitatID,this.props.level))}</MonoText>
        </TouchableOpacity>
      </View>
    )
  }
}




export default connect(mapStateToProps,mapDispatchToProps)(Habitat);
