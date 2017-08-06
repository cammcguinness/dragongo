import React from 'react';
import {Provider} from 'react-redux';
import {createStore,combineReducers} from 'redux';
import AppContainer from './AppContainer';
import stepReducers from './reducers/step';
let store = createStore(combineReducers({stepReducers}));


export default class App extends React.Component {

  render(){
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}
