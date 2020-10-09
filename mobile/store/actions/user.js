import {
  SET_USER,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN
} from '../types';
import { SERVER } from '../../config';
import axios from 'axios';
// import { connectSocket, disconnectSocket } from './socket';
import api from '../../Api';

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
    // dispatch(connectSocket());
    api.setToken(accessToken);
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const logoutUser = () => async(dispatch, getState) => {
  const { user } = getState();
  if (!user) return { error: 'Not found user' };

  try {
    const { data } = await api.get('/logout');

    dispatch({ type: SET_USER, user: null });
    dispatch({ type: SET_ACCESS_TOKEN, accessToken: null });
    dispatch({ type: SET_REFRESH_TOKEN, refreshToken: null });
    // dispatch(disconnectSocket());
  } catch (error) {
    console.error('ERROR LOGOUT: ', error);
  }
}

export const searchUsers = ({ searchText, offset, limit }) => async(dispatch) => {
  try {
    const { data } = await api.get('/user/by', {
      params: {
        searchText,
        offset,
        limit
      }
    });

    const { result, error } = data;
    if (error) return { error }

    return {
      userList: result
    }
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const registerUser = (params) => async(dispatch) => {
  try {
    const { data } = await axios.post(`${SERVER.URL}/auth/registration`, params);
    const { error } = data;
    
    if (error) return { error }

    await dispatch(await authUser({
      login: params.login,
      password: params.password
    }));
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}