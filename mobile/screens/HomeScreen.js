import React from 'react';
import { StyleSheet, ScrollView, StatusBar, View, Text } from 'react-native';
import RoomList from '../components/RoomList';
import { connect } from 'react-redux';

const HomeScreen = (props) => {
  const { navigation, chatRoomList, user } = props;
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

export default connect(
  state => ({
    chatRoomList: state.chat.chatRoomList,
    user: state.user.user
  }),
  {}
)(HomeScreen)

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
})