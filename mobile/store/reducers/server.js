import { SET_SERVER_STATUS, SET_SERVER_ERROR } from '../types';

const handlers = {
  [SET_SERVER_STATUS]: (state, { status }) => ({
    ...state,
    status
  }),
  [SET_SERVER_ERROR]: (state, { error }) => ({
    ...state,
    error
  }),
  DEFAULT: (state) => ({
    ...state
  })
};

const initState = {
  status: 0,
  error: null,
};

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);