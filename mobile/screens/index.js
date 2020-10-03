import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LoginScreen from './LoginScreen';
import RegistrationSreen from './RegistrationSreen';
import HomeScreen from './HomeScreen';
import RoomScreen from './RoomScreen';

const Stack = createStackNavigator();

export default ({ navigation }) => {
  const { user } = useSelector(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
      >
        {!user
          ? (
            <>
              <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="registration"
                component={RegistrationSreen}
                options={{
                  title: 'Регистрация',
                  animationEnabled: true,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="home"
                component={HomeScreen}
                options={{
                  headerTitle: 'Чаты',
                  headerTitleStyle: {
                    alignSelf: 'center'
                  }
                }}
              />
              <Stack.Screen
                name="room"
                component={RoomScreen}
              />
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
