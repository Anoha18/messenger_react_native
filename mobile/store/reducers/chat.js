import {
  SET_CHAT_ROOM_LIST,
  SET_CHAT_ROOM
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
  DEFAULT: (state) => ({
    ...state
  })
}

const initState = {
  chatRoomList: [],
  chatRoom: null,
}

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);