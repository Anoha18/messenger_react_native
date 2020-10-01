import io from 'socket.io-client';
import { SET_CONNECT_SOCKET } from '../types';
import { SERVER, SOCKET } from '../../config';

let socket = null;

export const connectSocket = (user) => (dispatch, getState) => {
  const { user } = getState();
  if (!user) return { error: 'Not found user' }

  const { accessToken } = user;
  if (!accessToken) return { error: 'Not found acess token' }

  socket = io.connect(SERVER.URL, {
    path: SOCKET.PATH,
    rejectUnauthorized: false,
    transportOptions: {
      polling: {
        extraHeaders: {
          'Authorization': accessToken
        }
      }
    }
  });
  socket.on('connect', () => {
    dispatch({
      type: SET_CONNECT_SOCKET,
      connect: true
    });
  });
  socket.on('connect_error', (error) => {
    console.error('SOCKET CONNECT ERROR: ', error);
    dispatch({
      type: SET_CONNECT_SOCKET,
      connect: false
    });
  })
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }

  return {
    type: SET_CONNECT_SOCKET,
    connect: false,
  };
}