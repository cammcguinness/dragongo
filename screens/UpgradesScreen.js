import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SQLite} from 'expo';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import {calculateFood,calculateCost,UPGRADES} from '../utilities/util';
import Upgrade from '../components/Upgrade';
function mapStateToProps(state)  {return {resources: state.stepReducers.resources,skills: state.stepReducers.skills};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}

class UpgradesScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };



  componentDidMount(){

  }





  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
        {UPGRADES.map((upgrade,index) =>(
          <Upgrade key={index} name={upgrade.name} description={upgrade.description} base={upgrade.base} />
        ))}
        </View>
      </ScrollView>
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




export default connect(mapStateToProps,mapDispatchToProps)(UpgradesScreen);
