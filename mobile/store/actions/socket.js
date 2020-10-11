import io from 'socket.io-client';
import {
  SET_CONNECT_SOCKET,
  SET_CHAT_ROOM_LIST,
  SET_MESSAGE_LIST,
  SET_MESSAGE
} from '../types';
import { SERVER, SOCKET } from '../../config';

export let socket;

const actionHandlers = {
  chatRoomList: (chatRoomList) => ({ type: SET_CHAT_ROOM_LIST, chatRoomList }),
  connectedToChatRoom: ({ messageList }) => ({ type: SET_MESSAGE_LIST, messageList }),
  addedNewMessage: ({ message }) => ({ type: SET_MESSAGE, message })
}

export const connectSocket = () => (dispatch, getState) => {
  const { user } = getState();
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
  console.log('HERE SOCKET');
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
    if (!data.action) return console.error('SOCKET EVENT WITHOUT ACTION');
    if (!actionHandlers[data.action]) return console.error('NOT HANDLER ACTION');
    const dispatchParams = actionHandlers[data.action](data.params);
    dispatch(dispatchParams);
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