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
  Picker,
  Modal,
  TouchableHighlight
} from 'react-native';
import Layout from '../constants/Layout';
import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions';
import FoodFarm from '../components/FoodFarm';
import Upgrade from '../components/Upgrade';
import {GOLD,calculateDragonGPS,maxHabitats,formatValue,HABITATS,getHabitatUpgradeCost} from '../utilities/util';

function mapStateToProps(state)  {return {resources: state.stepReducers.resources,farms: state.stepReducers.farms,skills: state.stepReducers.skills};}
function mapDispatchToProps(dispatch) { return bindActionCreators(Actions, dispatch);}


class FoodScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    modalVisible: false
  }

  buyNewFarm(){

  }

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <Upgrade title="Buy New Farm" skill={this.props.skills.filter(skill=>skill.name=="Food Farms")[0]} />
      <ScrollView>
        <View style={styles.container}>
          {this.props.farms.map((farm,index)=>{
              return <FoodFarm key={index} farm={farm} name={"Farm#"+(index+1)} level={1} index={index} />
          })}
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
    minHeight: Layout.window.height-40,
  },
  main: {
    flex: 5,
    padding: 5,
  },
  bar: {
    flex: 0,
    height: 10,

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
  modal: {
    marginTop: 150,
    marginLeft: (Layout.window.width-300)/2,
    width: 300,
    borderWidth: 1,
    borderColor: 'black'
  }
});

export default connect(mapStateToProps,mapDispatchToProps)(FoodScreen);
