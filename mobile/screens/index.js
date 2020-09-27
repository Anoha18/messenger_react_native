import React from 'react';
import { createAppContainer, createSwitchNavigator  } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { useSelector } from 'react-redux';

import LoginScreen from './LoginScreen';

const Auth = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false
    }
  }
});

const App = createSwitchNavigator({
  Auth: {
    screen: Auth
  }
});

export default createAppContainer(App);
