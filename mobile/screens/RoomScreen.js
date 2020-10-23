import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { GiftedChat, Send, Actions, Avatar } from 'react-native-gifted-chat';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { RoomHeader } from '../headers';
import { connect } from 'react-redux';
import { getChatRoomByUserId, sendMessage, createChatRoom } from '../store/actions/chat';
import { connectToChatRoom, sendNewMessage, viewMessages } from '../store/actions/socket';
import { Toast, Thumbnail, ActionSheet } from 'native-base';
import moment from 'moment';
import 'moment/locale/ru';
import ImagePicker from 'react-native-image-picker';
import RoomImageViewer from '../components/RoomImageViewer';
import { SERVER } from '../config';

const RoomScreen = (props) => {
  const {
    route,
    navigation,
    chatRoom,
    getChatRoomByUserId,
    user,
    createChatRoom,
    connectToChatRoom,
    messageList,
    viewMessages,
  } = props;
  const { params } = route;
  const { chatRoomId, selectedUser } = params;
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  const pressSelectPhotoAction = () => {
    ImagePicker.showImagePicker({
      title: 'Выберите фото',
      storageOptions: {
        path: 'images',
        skipBackup: true
      },
      takePhotoButtonTitle: 'Сделать фото',
      chooseFromLibraryButtonTitle: 'Выбрать из галереи',
    }, (response) => {
      if (response.didCancel) {
        return console.log('User cancelled image picker');
      } else if (response.error) {
        return console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        return console.log('User tapped custom button: ', response.customButton);
      }

      console.log(response);
      setImage(response);
    })
  }

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

  useEffect(() => {
    const checkView = () => {
      if (!messageList || !messageList.length) return;

      for (const message of messageList) {
        if (!message.views.find(view => view.user_id === user.id)) {
          return viewMessages(chatRoomId);
        }
      }
    }

    checkView();
  }, [messageList])

  const roomHeaderParams = () => {
    if (!chatRoom && selectedUser) {
      return {
        title: `${selectedUser.name} ${selectedUser.lastname || ''}`,
        avatar: selectedUser.avatar && selectedUser.avatar.file_path
          ? `${SERVER.URL}${selectedUser.avatar.file_path}`
          : null
      }
    } else if (chatRoom) {
      const recipient = chatRoom.users.find(_user => _user.id !== user.id);
      return {
        title: `${recipient.name} ${recipient.lastname || ''}`,
        avatar: recipient.avatar && recipient.avatar.file_path
          ? `${SERVER.URL}${recipient.avatar.file_path}`
          : null
      }
    }

    return {
      title: '',
      avatar: null
    }
  }

  const sendMessage = async ([message]) => {
    const _message = {
      text: message.text,
      file_id: message.file_id || undefined,
      room_id: null
    }
    if (!chatRoomId) {
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
      _message.room_id = chatRoomId;
    }

    sendNewMessage(_message);
    setText('');
    setImage(null);
  }

  const renderChatEmpty = () => (
    <View style={styles.emptyChatContainer}>
      <Text style={{ color: 'gray' }}>Сообщений пока нет</Text>
    </View>
  )

  const ActionSheetButton = [
    { text: 'Фото', callback: pressSelectPhotoAction },
    { text: 'Отмена', callback() {} }
  ]

  const showActionSheet = () => {
    ActionSheet.show({
      options: ActionSheetButton.map(btn => btn.text),
      cancelButtonIndex: ActionSheetButton[ActionSheetButton.length]
    }, buttonIndex => {
      console.log(ActionSheetButton[buttonIndex]);
      ActionSheetButton[buttonIndex].callback();
    })
  }

  return (
    <>
      <StatusBar backgroundColor="#8E8E8F" />
      <RoomHeader
        params={roomHeaderParams()}
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
          image: (message.file && message.file.file_path && `${SERVER.URL}${message.file.file_path}`) || undefined,
          user: {
            _id: message.sender_id,
            name: `${(message.sender && message.sender.name) || ''} ${(message.sender && message.sender.lastname) || ''}`,
            avatar: message.sender.avatar && message.sender.avatar.file_path
              ? `${SERVER.URL}${message.sender.avatar.file_path}`
              : undefined
          },
          views: message.views
        }))}
        locale={'ru'}
        placeholder="Введите сообщение"
        renderChatEmpty={renderChatEmpty}
        messagesContainerStyle={!messageList.length ? { transform: [{ scaleY: -1 }] } : null}
        inverted={true}
        onInputTextChanged={(text) => setText(text)}
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
        renderTicks={(message) => {
          if (message.user._id !== user.id) {
            return (
              <Ionicon name={message.views.length > 1 ? 'checkmark-done' : 'checkmark' } color="blue" size={23} />
            )
          } else {
            return (
              <Ionicon name={message.views.length > 1 ? 'checkmark-done' : 'checkmark' } color="white" size={23} />
            )
          }
        }}
        onPressActionButton={() => showActionSheet()}
      />
      {image && <RoomImageViewer text={text} onSend={sendMessage} cancelView={() => setImage(null)} image={image} />}
    </>
  )
}

const styles = StyleSheet.create({
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    viewMessages,
  }
) (RoomScreen);
