import { SET_USER } from '../types';

const handlers = {
  [SET_USER]: (state, { user }) => ({
    ...state,
    user
  }),
  DEFAULT: (state) => ({
    state
  })
}

const initState = {
  user: null
}

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);