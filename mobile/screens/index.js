import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { connectSocket } from '../store/actions/socket';

import LoginScreen from './LoginScreen';
import RegistrationSreen from './RegistrationSreen';
import HomeScreen from './HomeScreen';

const Stact = createStackNavigator();

export default ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (user) {
      dispatch(connectSocket(user));
    }
  })

  return (
    <NavigationContainer>
      <Stact.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
      >
        {!user
          ? (
            <>
              <Stact.Screen
                name="login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stact.Screen
                name="registration"
                component={RegistrationSreen}
                options={{
                  title: 'Регистрация',
                  animationEnabled: true
                }}
              />
            </>
          ) : (
            <Stact.Screen
              name="home"
              component={HomeScreen}
            />
          )
        }
      </Stact.Navigator>
    </NavigationContainer>
  )
}
