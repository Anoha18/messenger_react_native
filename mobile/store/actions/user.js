import {
  SET_USER,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN
} from '../types';
import { SERVER } from '../../config';
import axios from 'axios';
import { connectSocket } from './socket';

export const authUser = (loginData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${SERVER.URL}/auth/login`, loginData);
    const { error, result } = data;

    if (error) { return { error } }

    if (!result) { return { error: 'Result not found' } }

    const { user, accessToken, refreshToken } = result;
    dispatch({ type: SET_USER, user });
    dispatch({ type: SET_ACCESS_TOKEN, accessToken });
    dispatch({ type: SET_REFRESH_TOKEN, refreshToken });
    dispatch(connectSocket(user));
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}
