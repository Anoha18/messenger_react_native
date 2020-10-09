import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import IconAwesome from 'react-native-vector-icons/FontAwesome';

export default ({ route }) => {
  const { params } = route;
  const { id, selectedUser } = params;
  const [messageList, setMessageList] = useState([]);
  const { user } = useSelector(state => state.user);

  const sendMessages = (messages) => {
    setMessageList(oldMessageList => [messages[0], ...oldMessageList])
  }

  const renderEmptyChat = (
    <Text>сообщений нет</Text>
  )

  return (
    <GiftedChat
      onSend={sendMessages}
      user={{
        name: `${user.name} ${user.lastname || ''}`,
        _id: user.id
      }}
      messages={messageList}
      placeholder="Введите сообщение"
      renderChatEmpty={renderEmptyChat}
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
  )
}
