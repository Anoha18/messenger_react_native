import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import IconAntd from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RoomHeader, SearchUsersHeader } from '../headers';
import { connectSocket, disconnectSocket } from '../store/actions/socket';

import LoginScreen from './LoginScreen';
import RegistrationSreen from './RegistrationSreen';
import HomeScreen from './HomeScreen';
import RoomScreen from './RoomScreen';
import SettingsScreen from './SettingsScreen';
import SearchUserScreen from './SearchUserScreen';

const TabsHome = {
  home: {
    icon: 'message1',
    label: 'Сообщения',
    iconProvider: 'Antd'
  },
  settings: {
    icon: 'setting',
    label: 'Настройки',
    iconProvider: 'Antd'
  },
  search_user: {
    icon: 'account-search-outline',
    label: 'Поиск',
    iconProvider: 'MaterialCommunity'
  }
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SettingStack = createStackNavigator();
const SearchUserStack = createStackNavigator();

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
      options={{
        headerTitle: 'Настройки',
        headerShown: true,
        headerTitleStyle: {
          alignSelf: 'center'
        }
      }}
    />
  </SettingStack.Navigator>
);

const SearchUserStackScreen = () => (
  <SearchUserStack.Navigator
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}
  >
    <SearchUserStack.Screen
      name="search_user"
      component={SearchUserScreen}
      options={{
        headerTitle: 'Поиск',
        headerShown: true,
        headerTitleStyle: {
          alignSelf: 'center'
        },
        header: SearchUsersHeader
      }}
    />
  </SearchUserStack.Navigator>
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
    initialRouteName="home"
    screenOptions={({ route }) => ({
      tabBarIcon({ focused, color, size }) {
        const tabInfo = TabsHome[route.name] || null;
        if (!tabInfo) return;

        if (tabInfo.iconProvider === 'Antd') {
          return <IconAntd name={tabInfo.icon} size={size} color={color} />
        } else if (tabInfo.iconProvider === 'MaterialCommunity') {
          return <MaterialCommunityIcon name={tabInfo.icon} size={size} color={color} />
        }
      },
      tabBarLabel: TabsHome[route.name].label,
    })}
  >
    <Tab.Screen
      name="search_user"
      component={SearchUserStackScreen}
    />
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
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (user) {
      dispatch(connectSocket())
    }
    if (!user) {
      dispatch(disconnectSocket());
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(disconnectSocket());
    }
  }, []);

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
                initialRouteName="main"
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
