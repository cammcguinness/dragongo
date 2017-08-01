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
import Egg from '../components/Egg';
import Upgrade from '../components/Upgrade';
import {maxActiveEggs,stepsLeftForEgg,maxEggCount,formatValue} from '../utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,eggs: state.stepReducers.eggs,activeEggs: state.stepReducers.activeEggs,
  skills: state.stepReducers.skills,stepsSinceLastEgg: state.stepReducers.stepsSinceLastEgg};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}
class EggsScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    var numSteps = stepsLeftForEgg(this.props.skills.filter(skill=>skill.name=="Discovery")[0],this.props.stepsSinceLastEgg?this.props.stepsSinceLastEgg:0);
    return (
      <View style={{flex: 1}}>
      <MonoText>You have {this.props.eggs.length} out of a maximum of {maxEggCount(this.props.skills)} eggs.</MonoText>
      <Upgrade title="Increase Max Eggs" skill={this.props.skills.filter(skill=>skill.name=="Egg Carton")[0]} />
      <MonoText>You have {this.props.activeEggs.length} out of a maximum of {maxActiveEggs(this.props.skills)} active eggs.</MonoText>
      <Upgrade title="Increase Max Active Eggs" skill={this.props.skills.filter(skill=>skill.name=="Hatchery")[0]} />
      <MonoText>The next egg will arrive in {formatValue(numSteps)} steps.</MonoText>
      <Upgrade title="Decrease steps for next egg" skill={this.props.skills.filter(skill=>skill.name=="Discovery")[0]} />
      <ScrollView>
      <View style={styles.container}>

      {this.props.eggs.map((egg,index) => (
        <Egg key={index} id={egg.id} active={this.props.activeEggs.indexOf(egg.id)>-1?true:false} name={egg.dragon.name} stepsLeft={egg.stepsLeft} stepsStart={egg.stepsStart} />
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

export default connect(mapStateToProps,mapDispatchToProps)(EggsScreen);
