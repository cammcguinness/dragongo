
import React from 'react';
import {StyleSheet,TouchableOpacity,View,Picker} from 'react-native';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {calculateFood,calculateCost,formatValue} from '../utilities/util';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources,skills: state.stepReducers.skills,dragons: state.stepReducers.dragons,dens: state.stepReducers.dens};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class BreedingDen extends React.Component{

  state = {
    dragon1: -1,
    dragon2: -1,
  }


  breed(){
      this.props.startBreed(this.props.id,this.state.dragon1,this.state.dragon2);
  }

  renderDen(){

    if(!this.props.active){
      var picker1 = this.props.dragons.filter(dragon => dragon.id!=this.state.dragon2&&(dragon.breeding==false||dragon.breeding==undefined)).map(function(dragon,index){
        return <Picker.Item key={index} value={dragon.id} label={dragon.name+'(Level: '+dragon.level+')'} />
      }.bind(this));

      var picker2 = this.props.dragons.filter(dragon => dragon.id!=this.state.dragon1&&(dragon.breeding==false||dragon.breeding==undefined)).map(function(dragon,index){
        return <Picker.Item key={index} value={dragon.id} label={dragon.name+'(Level: '+dragon.level+')'} />
      }.bind(this));

      return (
          <View>
          <View style={styles.upgradeTitle}>
            <MonoText>Breeding Den</MonoText>
          </View>
          <View>
            <MonoText>Dragon 1:</MonoText><Picker selectedValue={this.state.dragon1} onValueChange={(itemValue, itemIndex) => this.setState({dragon1: itemValue})}>
            <Picker.Item value={-1} label='Choose a dragon' />
              {picker1}
            </Picker>
          </View>
          <View>
            <MonoText>Dragon 2:</MonoText><Picker selectedValue={this.state.dragon2} onValueChange={(itemValue, itemIndex) => this.setState({dragon2: itemValue})}>
            <Picker.Item value={-1} label='Choose a dragon' />
              {picker2}
            </Picker>
            <TouchableOpacity onPress={this.breed.bind(this)} style={styles.upgradeTitle}><MonoText>Breed</MonoText></TouchableOpacity>
          </View>
          </View>

      )
    }
      else {
        return <View>
        <View style={styles.upgradeTitle}>
          <MonoText>Breeding Den</MonoText>
          <MonoText>Type: {this.props.type}</MonoText>
        </View>
        <MonoText>{this.props.stepsLeft}/{this.props.stepsStart} steps.</MonoText>
        </View>;
      }
  }


  render(){

    return (
      <View style={styles.upgrade}>
      {this.renderDen()}
      </View>
    );
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

export default connect(mapStateToProps,mapDispatchToProps)(BreedingDen);
