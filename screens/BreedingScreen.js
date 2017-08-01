import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import Layout from '../constants/Layout';
import { MonoText } from '../components/StyledText';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import BreedingDen from '../components/BreedingDen';
import Upgrade from '../components/Upgrade';
import {maxActiveEggs,getNumberofDens} from '../utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,skills: state.stepReducers.skills,dens: state.stepReducers.dens};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}
class BreedingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {

    return (
      <View style={{flex: 1}}>
      <Upgrade title="Buy another breeding den" skill={this.props.skills.filter(skill=>skill.name=="Breeding Grounds")[0]} />
      <ScrollView>
      <View style={styles.container}>
        {this.props.dens.map((den,index) => (
          <BreedingDen key={index} id={den.id} active={den.active} stepsLeft={den.stepsLeft} stepsStart={den.stepsStart} type={den.egg?den.egg.dragon.name:''}/>
        ))}
      </View>
      </ScrollView>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    minHeight: Layout.window.height,
  },

});

export default connect(mapStateToProps,mapDispatchToProps)(BreedingScreen);
