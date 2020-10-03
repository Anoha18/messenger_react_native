import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import RoomList from '../components/RoomList';

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

export default ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <RoomList
        roomList={mockRoomList()}
        onSelectRoom={(id) => navigation.push('room', { id })}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 10
  }
})