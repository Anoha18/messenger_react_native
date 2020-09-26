import io from 'socket.io-client';
import { SET_CONNECT_SOCKET } from '../types';
import { SERVER, SOCKET } from '../../config';

const socket = io.connect(SERVER.URL, { path: SOCKET.PATH });

export const connectSocket = () => {
  const result = socket.on('connect');
  return {
    type: SET_CONNECT_SOCKET,
    connect: result.connected || false
  };
};
