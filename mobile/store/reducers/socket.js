import {SET_CONNECT_SOCKET} from '../types';

const handlers = {
  [SET_CONNECT_SOCKET]: (state, { connect }) => ({
    ...state,
    connect
  }),
  DEFAULT: (state) => ({
    ...state
  })
}

const initState = {
  connect: false
}

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);
