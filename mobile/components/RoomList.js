import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { List, ListItem, Thumbnail, Body, Left, Right, Badge } from 'native-base';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SERVER } from '../config';

export default ({
  roomList,
  onSelectRoom,
  user
}) => {

  const renderBadge = (room) => {
    const { last_message, not_view_count } = room;
    if (!last_message) return <></>
    if (last_message.sender_id === user.id) return <></>
    if (!+not_view_count) return <></>
  
    const { views } = last_message;
    if (!views.includes(user.id)) return (
      <Badge style={{ backgroundColor: 'blue', height: 20, width: 20 }}>
        <Text style={{ color: '#fff' }}>{not_view_count}</Text>
      </Badge>
    )

    return <></>;
  }

  const renderAvatar = (room) => {
    if (room.type_brief === 'PRIVATE') {
      return room.recipient.avatar && room.recipient.avatar.file_path
      ? <Thumbnail source={{ uri: `${SERVER.URL}${room.recipient.avatar.file_path}` }} style={{ width: 40, height: 40 }} />
      : <EvilIcon name="user" size={40} />
    }

    return <FontAwesome name="users" size={40} />
  }

  const renderRoomName = (room) => {
    if (room.type_brief === 'PRIVATE') {
      return `${(room.recipient && room.recipient.name) || ''} ${(room.recipient && room.recipient.lastname) || ''}`;
    }

    return room.name || '';
  }

  return (
    <List>
      {roomList.map(room => (
        <ListItem key={room.id} onPressOut={() => onSelectRoom(room.id)} avatar>
          <Left>
            {renderAvatar(room)}
          </Left>
          <Body style={styles.body}>
            <Text style={styles.itemTitle}>{renderRoomName(room)}</Text>
            <Text style={styles.itemDescription}>
              {(room.last_message && room.last_message.file && ((room.last_message.text && 'Фотография, ') || 'Фотография')) || ''}
              {(room.last_message && room.last_message.text) || ''}</Text>
          </Body>
          <Right>
            <Text style={{ marginBottom: 5 }} note>{(room.last_message && room.last_message.created_time) || ''}</Text>
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