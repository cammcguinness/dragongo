import {StyleSheet} from 'react-native';
import Layout from './Layout';
import Colors from './Colors';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    minHeight: Layout.window.height+50,
    marginBottom: 50
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
    padding: 4,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'black',
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
  },
  modalBack: {
    height: Layout.window.height,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  description: {
    padding: 4,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  upgrade: {
    marginTop: 10,
    width: '80%',
    flex: 0,
    borderWidth: 1,
    borderColor: 'black'

  },
});
