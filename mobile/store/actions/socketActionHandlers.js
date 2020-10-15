import {
  SET_CHAT_ROOM_LIST,
  SET_MESSAGE_LIST,
  SET_MESSAGE,
  SET_SERVER_ERROR,
  SET_CHAT_ROOM,
  SET_VIEWED_MESSAGES,
} from '../types';

export const connectedToChatRoom = ({ messageList, chatRoom }) => (dispatch) => {
  dispatch({ type: SET_MESSAGE_LIST, messageList });
  dispatch({ type: SET_CHAT_ROOM, chatRoom });
}

export const addedNewMessage = ({ message }) => ({ type: SET_MESSAGE, message })
export const updateChatRoomList = ({ chatRoomList }) => ({ type: SET_CHAT_ROOM_LIST, chatRoomList: chatRoomList || [] })
export const serverError = ({ error }) => ({ type: SET_SERVER_ERROR, error })
export const viewedMessages = ({ viewedMessages }) => ({ type: SET_VIEWED_MESSAGES, viewedMessages })