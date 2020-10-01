import {
  SET_USER,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN
} from '../types';

const handlers = {
  [SET_USER]: (state, { user }) => ({
    ...state,
    user
  }),
  [SET_ACCESS_TOKEN]: (state, { accessToken }) => ({
    ...state,
    accessToken
  }),
  [SET_REFRESH_TOKEN]: (state, { refreshToken }) => ({
    ...state,
    refreshToken
  }),
  DEFAULT: (state) => ({
    ...state
  })
}

const initState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export default (state = initState, action) => (handlers[action.type] && handlers[action.type](state, action)) || handlers.DEFAULT(state);