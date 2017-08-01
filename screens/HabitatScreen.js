import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker
} from 'react-native';
import Layout from '../constants/Layout';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Habitat from '../components/Habitat';
import PopUp from '../components/PopUp';
import Upgrade from '../components/Upgrade';
import {styles} from '../constants/styles';
import {GOLD,calculateDragonGPS,maxHabitats,formatValue,getHabitatUpgradeCost} from '../utilities/util';
import {HABITATS} from '../data/habitats';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,habitats: state.stepReducers.habitats,skills: state.stepReducers.skills};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}


class HabitatScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    selectedHabitat: 1,
    modalVisible: false,
  }

  buyHabitat(){
    this.setState({modalVisible: false});
    let cost = getHabitatUpgradeCost(this.state.selectedHabitat,0);
    if(this.props.resources.gold > cost){
      this.props.buyHabitat(this.state.selectedHabitat);
    }

  }

  setModalVisible(visible){
    console.log("Setting modal visibility to "+visible);
    this.setState({modalVisible: visible});
  }

  render() {
    //let skill = this.props.skills.filter(skill=>skill.level==0)[0];
    //this.props.skills.map(skill=>{console.log(skill)});
    //console.log(this.props.skills);
    return (
      <View style={{flex: 1, paddingBottom: 10, backgroundColor: 'white'}}>
        <MonoText>You have {this.props.habitats.length} out of a maximum of {maxHabitats(this.props.skills.filter(skill=>skill.name=="Land Size")[0])} habitats.</MonoText>
        <Upgrade title="Increase Max Habitats" skill={this.props.skills.filter(skill=>skill.name=="Land Size")[0]} />
        <TouchableOpacity onPress={()=>{this.setModalVisible(true)}} style={styles.upgradeTitle}><MonoText>Buy New Habitat</MonoText></TouchableOpacity>
      <ScrollView>
      <View style={styles.container}>

          {this.props.habitats.map((habitat,index) => (
            <Habitat key={index} id={habitat.id} habitatID={habitat.habitatID} name={habitat.name} level={habitat.level} gold={habitat.gold} selectedDragons={habitat.dragons}  />
          ))}

      </View>
      </ScrollView>
      <PopUp visible={this.state.modalVisible} close={()=>{this.setModalVisible(false)}} title="Buy New Habitat">
        <Picker selectedValue={this.state.selectedHabitat} onValueChange={(itemValue, itemIndex) => this.setState({selectedHabitat: itemValue})}>
          {HABITATS.filter(habitat=>habitat.baseCost < this.props.resources.gold).map((habitat,index)=>(
            <Picker.Item key={index} value={habitat.habitatID} label={habitat.name+'('+habitat.baseCost+')'} />
          ))}
          </Picker>
          <TouchableOpacity onPress={this.buyHabitat.bind(this)} style={styles.upgradeTitle}><MonoText>Buy</MonoText></TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.setModalVisible(false)}} style={styles.upgradeTitle}><MonoText>Cancel</MonoText></TouchableOpacity>
        </PopUp>
        </View>
    );
  }


}

export default connect(mapStateToProps,mapDispatchToProps)(HabitatScreen);
