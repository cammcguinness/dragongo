import React from 'react';
import {StyleSheet,TouchableOpacity,View,Picker,FlatList,Image} from 'react-native';
import { MonoText } from '../components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {styles} from '../constants/styles';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import PopUp from './PopUp';
import {FOOD} from '../data/food';
import {formatValue,getHabitatUpgradeCost,getMaxCollectValue,getTotalHabitatGPS} from '../utilities/util';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources, habitats: state.stepReducers.habitats,dragons: state.stepReducers.dragons};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class FoodItem extends React.Component {
  getImage(name){
    let mouse = require('../assets/images/RoundAnimals/mouse.png');
    let squirrel = require('../assets/images/RoundAnimals/squirrel.png');
    let cow = require('../assets/images/RoundAnimals/cow.png');

    switch(name.toLowerCase()){
      case 'mouse':
        return mouse;
      case 'squirrel':
        return squirrel;
      case 'cow':
        return cow;
    }
  }

  selectFood(){
    //console.log("Pressed the "+this.props.item.name);
    this.props.foodSelect(this.props.item);

  }

  render(){
      return (

        <TouchableOpacity onPress={this.selectFood.bind(this)} style={{flex: 1,alignItems: 'center', justifyContent: 'center',marginLeft: 10, paddingLeft: 5}}>
          <Image resizeMode='contain' source={this.getImage(this.props.item.name)} style={{width: 50,height: 50}} />
          <MonoText>Food: {formatValue(this.props.item.food)}</MonoText>
          <MonoText>Steps: {formatValue(this.props.item.steps)}</MonoText>
          <MonoText>Cost: {formatValue(this.props.item.cost)}</MonoText>
        </TouchableOpacity>);
  }
}

class FoodFarm extends React.Component{

  state = {
    modalVisible: false,
    food: null,
  }

  upgrade(){

  }

  collect(){
      if(this.props.farm.stepsLeft==0){
        this.props.collectFarm(this.props.farm,this.props.index);
      }
  }

  selectFood(item){
    //console.log("Starting a farm");
    if(this.props.resources.gold > item.cost){
      this.props.startFarm(this.props.farm,item,this.props.index);
      this.setModalVisible(false);
    }
  }

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }



  render(){
    let foodAvailable = FOOD.filter(food=>food.level<=Math.max(this.props.level,1));
    return (<View style={styles.upgrade}>
      <View style={styles.upgradeTitle}>
        <MonoText>{this.props.name} (Level {this.props.level})</MonoText>
      </View>
      <View style={styles.description}>
        {this.props.farm.active?<MonoText>{this.props.farm.food.name} ({this.props.farm.stepsLeft} / {this.props.farm.food.steps})</MonoText>:<TouchableOpacity onPress={()=>this.setModalVisible(true)}><MonoText>Choose Food</MonoText></TouchableOpacity>}

      </View>
      {this.props.level<5?<TouchableOpacity onPress={this.upgrade.bind(this)} style={[styles.upgradeTitle,styles.button]}>
        <MonoText>Upgrade</MonoText>
      </TouchableOpacity>:null}
      {this.props.farm.active?<TouchableOpacity onPress={this.collect.bind(this)} style={styles.upgradeTitle}>
        <MonoText>Collect</MonoText>
        <MonoText>{formatValue(this.props.farm.stepsLeft==0?this.props.farm.food.food:0)}</MonoText>
      </TouchableOpacity>:null}

      <PopUp visible={this.state.modalVisible} title="Choose Food" close={()=>{this.setModalVisible(false)}}>
          <FlatList style={{height: 150}} horizontal={true} data={foodAvailable} renderItem={({item})=><FoodItem item={item} foodSelect={(food)=>{this.selectFood(food)}}/>} />
          <TouchableOpacity onPress={()=>{this.setModalVisible(false)}} style={styles.upgradeTitle}><MonoText>Cancel</MonoText></TouchableOpacity>
      </PopUp>
    </View>

  );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FoodFarm);
