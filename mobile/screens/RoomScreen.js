import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import { RoomHeader } from '../headers';
import { connect } from 'react-redux';
import { getChatRoomByUserId, sendMessage, createChatRoom } from '../store/actions/chat';
import { connectToChatRoom, sendNewMessage } from '../store/actions/socket';
import { Toast, Thumbnail } from 'native-base';
import moment from 'moment';
import ru from 'moment/locale/ru';
moment.locale('ru')

const RoomScreen = (props) => {
  const {
    route,
    navigation,
    chatRoom,
    getChatRoomByUserId,
    user,
    createChatRoom,
    connectToChatRoom,
    messageList
  } = props;
  const { params } = route;
  const { chatRoomId, selectedUser } = params;

  useEffect(() => {
    const loadRoom = async () => {
      if (!chatRoomId) {
        const { room, error } = await getChatRoomByUserId(selectedUser.id)
        if (error) {
          Toast.show({
            text: error,
            buttonText: 'OK',
            duration: 10000,
            type: 'danger'
          })
        }
        
        if (room) connectToChatRoom(room.id);
      } else {
        await connectToChatRoom(chatRoomId);
      }
    }
    loadRoom();
  }, [])

  const roomTitle = () => {
    if (!chatRoomId)
  }

  const sendMessage = async ([message]) => {
    const _message = {
      text: message.text,
      room_id: null
    }
    if (!chatRoom) {
      const { room, error } = await createChatRoom(selectedUser.id);
      if (error) {
        Toast.show({
          text: error,
          buttonText: 'OK',
          duration: 5000,
          type: 'danger'
        })
        return;
      }

      connectToChatRoom(room.id)
      _message.room_id = room.id;
    } else {
      _message.room_id = chatRoom.id;
    }

    sendNewMessage(_message);
  }

  const renderChatEmpty = () => (
    <View style={styles.emptyChatContainer}>
      <Text style={{ color: 'gray' }}>Сообщений пока нет</Text>
    </View>
  )

  return (
    <>
      <StatusBar backgroundColor="#8E8E8F" />
      <RoomHeader
        title={roomTitle()}
        onPressBack={() => navigation.goBack()}
      />
      <GiftedChat
        onSend={sendMessage}
        user={{
          name: `${user.name} ${user.lastname || ''}`,
          _id: user.id,
          id: user.id
        }}
        messages={messageList.map(message => ({
          _id: message.id,
          text: message.text,
          createdAt: new Date(moment(message.created_at, 'DD-MM-YYYY HH:mm:ss')),
          user: {
            _id: message.sender_id,
            name: `${(message.sender && message.sender.name) || ''} ${(message.sender && message.sender.lastname) || ''}`
          }
        }))}
        locale={'ru'}
        placeholder="Введите сообщение"
        renderChatEmpty={renderChatEmpty}
        messagesContainerStyle={!messageList.length ? { transform: [{ scaleY: -1 }] } : null}
        inverted={true}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              flexDirection: 'column',
              justifyContent: 'center',
              paddingRight: 18
            }}
          >
            <IconAwesome size={23} name="send" color="dodgerblue" />
          </Send>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default connect(
  state => ({
    chatRoom: state.chat.chatRoom,
    user: state.user.user,
    messageList: state.chat.messageList
  }),
  {
    getChatRoomByUserId,
    sendMessage,
    createChatRoom,
    connectToChatRoom,
  }
) (RoomScreen);
