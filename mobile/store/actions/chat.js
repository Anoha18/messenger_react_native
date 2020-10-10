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

    dispatch({
      type: SET_CHAT_ROOM,
      chatRoom: result
    })
    return { chatRoom: result }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}