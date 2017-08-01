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
} from 'react-native';
import Layout from '../constants/Layout';
import { MonoText } from '../components/StyledText';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import Dragon from '../components/Dragon';
import Upgrade from '../components/Upgrade';
import {GOLD,calculateDragonGPS,maxDragons,formatValue} from '../utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,dragons: state.stepReducers.dragons,skills: state.stepReducers.skills};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}


class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={{flex: 1, paddingBottom: 10, backgroundColor: 'white'}}>
      <MonoText>You have {this.props.dragons.length} out of a maximum of {maxDragons(this.props.skills)} dragons.</MonoText>
      <Upgrade title="Increase Max Dragons" skill={this.props.skills.filter(skill=>skill.name=="Dragon Stables")[0]} />
      <ScrollView>
      <View style={styles.container}>

          {this.props.dragons.map((dragon,index) => (
            <Dragon key={index} id={dragon.id} name={dragon.name} level={dragon.level} description={'Makes '+formatValue(calculateDragonGPS(dragon))+'GPS'} />
          ))}

      </View>
      </ScrollView></View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    minHeight: Layout.window.height-40,
  },
  main: {
    flex: 5,
    padding: 5,
  },
  bar: {
    flex: 0,
    height: 10,

  }


});

export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);
