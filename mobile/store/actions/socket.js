import io from 'socket.io-client';
import {
  SET_CONNECT_SOCKET,
  SET_CHAT_ROOM,
} from '../types';
import { SERVER, SOCKET } from '../../config';
import * as actionHandlers from './socketActionHandlers';

export let socket;

export const connectSocket = () => (dispatch, getState) => {
  const { user } = getState();
  console.log(user);
  if (!user) return { error: 'Not found user' }

  const { accessToken } = user;
  if (!accessToken) return { error: 'Not found acess token' }

  socket = io.connect(SERVER.URL, {
    query: {
      user_id: user.user.id
    },
    path: SOCKET.PATH,
    rejectUnauthorized: false,
    transportOptions: {
      polling: {
        extraHeaders: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    }
  });
  socket.on('connect', () => {
    console.log('CONNECT SOCKET');
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
  socket.on('event', (data) => {
    console.log('NEW EVENT: ', data);
    if (!data.action) {
      console.error('SOCKET EVENT WITHOUT ACTION');
      return dispatch({
        type: SET_SERVER_ERROR,
        error: 'SOCKET EVENT WITHOUT ACTION'
      })
    }
    if (!actionHandlers[data.action]) {
      console.error('NOT HANDLER ACTION')
      return dispatch({
        type: SET_SERVER_ERROR,
        error: 'NOT HANDLER ACTION'
      })
    };
    dispatch(actionHandlers[data.action](data.params));
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

export const getChatRoomList = () => {
  if (socket) {
    console.log('GET CHAT ROOM LIST');
    socket.emit('request', {
      action: 'getChatRoomList',
    })
  };

  return {
    type: ''
  }
}

export const connectToChatRoom = (roomId) => {
  try {
    socket.emit('request', {
      action: 'connectToChatRoom',
      params: {
        roomId,
      }
    })
    return { type: '' }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const sendNewMessage = (message) => {
  try {
    socket.emit('request', {
      action: 'newMessage',
      params: {
        ...message
      }
    })
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const viewMessages = (roomId) => {
  try {
    socket.emit('request', {
      action: 'viewMessages',
      params: {
        roomId
      }
    })
    return { type: '' }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}