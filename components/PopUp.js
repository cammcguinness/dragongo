import React from 'react';
import {Modal, View} from 'react-native';
import { MonoText } from '../components/StyledText';
import {styles} from '../constants/styles';


export default class PopUp extends React.Component{

  render(){
    return <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.close}>
        <View style={styles.modalBack}>
           <View style={styles.modal}>
              <View style={styles.upgradeTitle}>
                <MonoText>{this.props.title}</MonoText>
              </View>
              <View style={styles.description}>
                {this.props.children}
              </View>
           </View>
       </View>
      </Modal>
  }
}
