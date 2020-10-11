import api from '../../Api';
import { SET_CHAT_ROOM } from '../types';

export const getChatRoomByUserId = (userId) => async (dispatch) => {
  try {
    const { data } = await api.get('/chat/with', {
      params: {
        userId
      }
    })
    const { result, error } = data;
    if (error) return { error }

    if (!result) {
      dispatch({
        type: SET_CHAT_ROOM,
        chatRoom: null,
      })
      return { room: null }
    }

    const { room, messageList } = result;
    dispatch({
      type: SET_CHAT_ROOM,
      chatRoom: room || null,
    })
    return { room, messageList }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const createChatRoom = (userId) => async(dispatch) => {
  try {
    const { data } = await api.put('/chat/new', { userId });
    const { result, error } = data;

    if (error) return { error }

    dispatch({
      type: SET_CHAT_ROOM,
      chatRoom: result || null,
    });
    return { room: result }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const sendMessage = (message) => async() => {
  try {
    const { data } = await api.put('/messsage/new', message);
    const { result, error } = data;

    if (error) return { error }

    return { message: result }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}
