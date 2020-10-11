import {
  SET_CHAT_ROOM_LIST,
  SET_CHAT_ROOM,
  SET_MESSAGE_LIST,
  SET_MESSAGE,
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
    messageList: [message, ...state.messageList]
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