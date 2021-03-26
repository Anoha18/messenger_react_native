import React from 'react';
import { StyleSheet, ScrollView, StatusBar, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import RoomList from '../components/RoomList';

const HomeScreen = (props) => {
  const { navigation } = props;
  const chatRoomList = useSelector(state => state.chat.chatRoomList);
  const user = useSelector(state => state.user.user);

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      { chatRoomList.length ? (
        <RoomList
          roomList={chatRoomList}
          onSelectRoom={(id) => navigation.push('room', { chatRoomId: id })}
          user={user}
        />
      ) : (
        <View style={styles.notRoomListContainer}>
          <Text style={styles.notRoomListText}>Сообщений нет</Text>
        </View>
      )
      }
    </ScrollView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
  },
  notRoomListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notRoomListText: {
    color: 'gray'
  }
});
