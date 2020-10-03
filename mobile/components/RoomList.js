import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { List, ListItem, Thumbnail, Body, Left, Right, Badge } from 'native-base';

export default ({
  roomList,
  onSelectRoom
}) => {

  return (
    <List>
      {roomList.map(room => (
        <ListItem onPressOut={() => onSelectRoom(room.id)} avatar>
          <Left>
            <Thumbnail />
          </Left>
          <Body>
            <Text style={styles.itemTitle}>{room.name}</Text>
            <Text style={styles.itemDescription}>{room.last_message}</Text>
          </Body>
          <Right>
            <Text note>{room.time}</Text>
            { room.seen ? (
              <></>
            ) : (
              <Badge style={{ backgroundColor: 'blue' }}>
                <Text style={{ color: '#fff' }}>12</Text>
              </Badge>
            )}
          </Right>
        </ListItem>
      ))}
    </List>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: 'bold'
  },
})