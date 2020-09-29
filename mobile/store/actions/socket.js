import io from 'socket.io-client';
import { SET_CONNECT_SOCKET } from '../types';
import { SERVER, SOCKET } from '../../config';

let socket = null;

export const connectSocket = () => {
  socket = io.connect(SERVER.URL, { path: SOCKET.PATH });
  const result = socket.on('connect');

  return {
    type: SET_CONNECT_SOCKET,
    connect: result.connected || false
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }

  return {
    type: SET_CONNECT_SOCKET,
    connect: false
  };
}