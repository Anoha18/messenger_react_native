import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import { RoomHeader } from '../headers';
import { connect } from 'react-redux';
import { getChatRoomByUserId } from '../store/actions/chat';

const RoomScreen = (props) => {
  const { route, navigation, chatRoom, getChatRoomByUserId } = props;
  const { params } = route;
  const { id, selectedUser } = params;
  const [messageList, setMessageList] = useState([]);
  const { user } = useSelector(state => state.user);

  useEffect(async () => {
    console.log(selectedUser);
    await getChatRoomByUserId(selectedUser.id)
  }, [])

  const sendMessages = (messages) => {
    setMessageList(oldMessageList => [messages[0], ...oldMessageList])
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
        title={`${selectedUser.name} ${selectedUser.lastname || ''}`}
        onPressBack={() => navigation.goBack()}
      />
      <GiftedChat
        onSend={sendMessages}
        user={{
          name: `${user.name} ${user.lastname || ''}`,
          _id: user.id
        }}
        messages={messageList}
        placeholder="Введите сообщение"
        renderChatEmpty={renderChatEmpty}
        messagesContainerStyle={!messageList.length ? { transform: [{ scaleY: -1 }] } : null}
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
    chatRoom: state.chat.chatRoom
  }),
  {
    getChatRoomByUserId
  }
) (RoomScreen);
