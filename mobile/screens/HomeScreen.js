import React from 'react';
import { StyleSheet, ScrollView, StatusBar } from 'react-native';
import RoomList from '../components/RoomList';
import { connect } from 'react-redux';

const random = (max, min) => Math.random() * (max - min) + min;

const mockRoomList = () => {
  const data = [];
  for (let index = 0; index < 15; index++) {
    data.push({
      id: index + random(-100, 100),
      name: 'Петр Петров ' + index,
      last_message: 'Ла ллаа',
      seen: random(-100, 100) > 0 ? true : false,
      time: '10:12'
    })
  }

  return data;
}

const HomeScreen = ({
  navigation,
  getChatRoomList
}) => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#8E8E8F" />
      <RoomList
        roomList={mockRoomList()}
        onSelectRoom={(id) => navigation.push('room', { id })}
      />
    </ScrollView>
  )
}

export default connect(
  null,
  {}
)(HomeScreen)

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10,
  }
})