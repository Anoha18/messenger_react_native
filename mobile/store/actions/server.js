import api from '../../Api';
import { SET_SERVER_STATUS, SET_SERVER_ERROR } from '../types';

export const checkServer = () => async (dispatch) => {
  try {
    const { status } = await api.checkServer();

    console.log('STATUS RESPONSE SERVER: ', status);
    if (status >= 200 && status <= 300) {
      dispatch({
        type: SET_SERVER_STATUS,
        status: 1
      })
    }

    dispatch({
      type: SET_SERVER_STATUS,
      status: 0
    })
    dispatch({
      type: SET_SERVER_ERROR,
      error: 'Server not working'
    })
  } catch (error) {
    dispatch({
      type: SET_SERVER_ERROR,
      error: error.message
    })
  }
}