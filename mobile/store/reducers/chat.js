import {
  SET_CHAT_ROOM_LIST,
  SET_CHAT_ROOM,
  SET_MESSAGE_LIST,
  SET_MESSAGE,
  SET_VIEWED_MESSAGES,
  LOGOUT_USER,
} from '../types';

const handlers = {
  [SET_CHAT_ROOM_LIST]: (state, { chatRoomList }) => ({
    ...state,
    chatRoomList
  }),
  [SET_CHAT_ROOM]: (state, { chatRoom }) => ({
    ...state,
    chatRoom
  }),
  [SET_MESSAGE_LIST]: (state, { messageList }) => ({
    ...state,
    messageList
  }),
  [SET_MESSAGE]: (state, { message }) => ({
    ...state,
    messageList: (state.chatRoom && +message.room_id === +state.chatRoom.id && [message, ...state.messageList]) || state.messageList
  }),
  [SET_VIEWED_MESSAGES]: (state, { viewedMessages }) => ({
    ...state,
    messageList: state.messageList.map(message => {
      const viewedMessage = viewedMessages.find(_viewedMessage => +_viewedMessage.message_id === +message.id)
      if (viewedMessage) {
        const { views } = message;
        views.push({
          id: viewedMessage.id,
          user_id: viewedMessage.user_id
        })
        const _message = {
          ...message,
          ...{
            views: views
          }
        }
        return _message;
      }

      return message;
    })
  }),
  [LOGOUT_USER]: (state) => ({
    ...state,
    ...initState,
  }),
  DEFAULT: (state) => ({
    ...state
  })
}

const initState = {
  chatRoomList: [],
  chatRoom: null,
  messageList: []
}

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);