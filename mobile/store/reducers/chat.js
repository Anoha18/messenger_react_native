import { SET_CHAT_ROOM_LIST } from '../types';

const handlers = {
  [SET_CHAT_ROOM_LIST]: (state, { chatRoomList }) => ({
    ...state,
    chatRoomList
  }),
  DEFAULT: (state) => ({
    ...state
  })
}

const initState = {
  chatRoomList: [],
  currentChat: null,
}

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);