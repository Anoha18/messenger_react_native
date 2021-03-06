import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import IconAntd from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connectSocket, disconnectSocket } from '../store/actions/socket';
import { Badge, Button, Spinner } from 'native-base';
import { Text, View, TouchableOpacity } from 'react-native';

import LoginScreen from './LoginScreen';
import RegistrationSreen from './RegistrationSreen';
import HomeScreen from './HomeScreen';
import RoomScreen from './RoomScreen';
import SettingsScreen from './SettingsScreen';
import SearchUserScreen from './SearchUserScreen';
import EditUserScreen from './EditUserScreen';
import GroupChatCreateScreen from './GroupChatCreateScreen';
import SelectCompetitorsScreen from './SelectCompetitorsScreen';

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
const CreateGroupStack = createStackNavigator();

const HomeStackScreen = () => {
  const { connect } = useSelector(state => state.socket);
  return (
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
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {!connect && <Spinner color="blue" style={{ marginLeft: -20 }} size={20} />}
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginLeft: (!connect && 10) || undefined,
                }}
              >
                Чаты
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              hitSlop={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
              }}
              onPress={() => navigation.navigate('group_chat_create')}
            >
              <IconAntd name="plus" size={25} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: () => <View />,
          headerRightContainerStyle: {
            paddingRight: 20
          },
          headerShown: true,
          headerTitleStyle: {
            alignSelf: 'center'
          }
        })}
      />
    </HomeStack.Navigator>
  );
}

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
);

const MainTabNav = () => {
  const { chatRoomList } = useSelector((state) => state.chat);
  const [countNewMessages, setCountNewMessages] = useState(0)
  useEffect(() => {
    if (chatRoomList.length) {
      let count = 0;
      chatRoomList.map(chatRoom => { count += +chatRoom.not_view_count});
      setCountNewMessages(count);
    }
  }, [chatRoomList])

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarIcon({ focused, color, size }) {
          const tabInfo = TabsHome[route.name] || null;
          if (!tabInfo) return;
          if (route.name === 'home') return (
            <View>
              {countNewMessages !== 0 ? (
                <Badge style={{
                  position: 'absolute',
                  top: -5,
                  right: -15,
                  height: 25,
                  width: 25,
                  zIndex: 10
                }}><Text numberOfLines={1} style={{ fontSize: 10, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>{countNewMessages > 99 ? '99+' : countNewMessages}</Text></Badge>
              ) : (
                <></>
              )}
              <IconAntd name={tabInfo.icon} size={size} color={color} />
            </View>
          )
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
        component={SearchUserScreen}
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
}

const CreateGroupStackScreen = () => (
  <Stack.Navigator
    initialRouteName="select_competitors_group"
    screenOptions={{
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}
  >
    <Stack.Screen
      name="select_competitors_group"
      component={SelectCompetitorsScreen}
      options={{
        title: 'Новая беседа',
        headerRightContainerStyle: {
          paddingRight: 20,
        },
      }}
    />
    <Stack.Screen
      name="create_group"
      component={GroupChatCreateScreen}
      options={{
        title: 'Новая беседа'
      }}
    />
  </Stack.Navigator>
);

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
        {user
          ? (
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
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="room"
                component={RoomScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="edit_user"
                component={EditUserScreen}
                options={{
                  headerShown: true,
                  title: 'Редактирование профиля',
                }}
              />
              <Stack.Screen
                name="group_chat_create"
                component={CreateGroupStackScreen}
                options={{
                  headerShown: false
                }}
              />
            </Stack.Navigator>
          ) : (
            <LoginStackScreen />
          )
        }
    </NavigationContainer>
  )
}
