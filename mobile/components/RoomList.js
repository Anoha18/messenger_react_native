import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { List, ListItem, Thumbnail, Body, Left, Right, Badge } from 'native-base';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

export default ({
  roomList,
  onSelectRoom,
  user
}) => {

  const renderBadge = (room) => {
    const { last_message, not_view_count } = room;
    if (last_message.sender_id === user.id) return <></>
  
    const { views } = last_message;
    if (!views.includes(user.id)) return (
      <Badge style={{ backgroundColor: 'blue' }}>
        <Text style={{ color: '#fff' }}>{not_view_count}</Text>
      </Badge>
    )

    return <></>;
  }

  return (
    <List>
      {roomList.map(room => (
        <ListItem key={room.id} onPressOut={() => onSelectRoom(room.id)} avatar>
          <Left>
            {
              room.recipient.avatar
                ? <Thumbnail source={{ uri: 'Image URL' }} />
                : <EvilIcon name="user" size={40} />
            }
          </Left>
          <Body style={styles.body}>
            <Text style={styles.itemTitle}>{(room.recipient && room.recipient.name) || ''} {(room.recipient && room.recipient.lastname) || ''}</Text>
            <Text style={styles.itemDescription}>{(room.last_message && room.last_message.text) || ''}</Text>
          </Body>
          <Right>
            <Text style={{ marginBottom: 5 }} note>{room.last_message.created_time}</Text>
            {renderBadge(room)}
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
  body: {
    paddingBottom: 20
  }
})