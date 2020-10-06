import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import IconAntd from 'react-native-vector-icons/AntDesign';
import { RoomHeader } from '../headers';

import LoginScreen from './LoginScreen';
import RegistrationSreen from './RegistrationSreen';
import HomeScreen from './HomeScreen';
import RoomScreen from './RoomScreen';
import SettingsScreen from './SettingsScreen';

const IconTabsHome = {
  home: 'message1',
  settings: 'setting',
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}
  >
    <HomeStack.Screen
      name="home"
      component={HomeScreen}
      options={{
        headerTitle: 'Чаты',
        headerShown: true,
        headerTitleStyle: {
          alignSelf: 'center'
        }
      }}
    />
  </HomeStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingStack.Navigator
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}
  >
    <SettingStack.Screen
      name="settings"
      component={SettingsScreen}
    />
  </SettingStack.Navigator>
);

const LoginStackScreen = () => (
  <Stack.Navigator
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
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
  </Stack.Navigator>
)

const MainTabNav = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = IconTabsHome[route.name] || '';
        return <IconAntd name={iconName} size={size} color={color} />
      },
    })}
  >
    <Tab.Screen
      name="home"
      component={HomeStackScreen}
    />
    <Tab.Screen
      name="settings"
      component={SettingsStackScreen}
    />
  </Tab.Navigator>
)

export default ({ navigation }) => {
  const { user } = useSelector(state => state.user);

  

  return (
    <NavigationContainer>
        {!user
          ? (
            <LoginStackScreen />
          ) : (
            <>
              <Stack.Navigator
                screenOptions={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
              >
                <Stack.Screen
                  name="main"
                  component={MainTabNav}
                  options={{
                    headerShown: false
                  }}
                />
                <Stack.Screen
                  name="room"
                  component={RoomScreen}
                  options={{
                    headerShown: true,
                    headerTitle: 'Room',
                    header: RoomHeader
                  }}
                /> 
              </Stack.Navigator>
            </>
          )
        }
    </NavigationContainer>
  )
}
