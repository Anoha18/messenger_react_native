import {
  SET_USER,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN
} from '../types';
import { SERVER } from '../../config';
import axios from 'axios';
import api from '../../Api';
import AsyncStorage from '@react-native-community/async-storage';

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
    await dispatch(await saveToAsyncStorageUserData({
      id: user.id,
      accessToken,
      refreshToken
    }));
    api.setToken(accessToken);
    api.setRefreshToken(refreshToken);
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const logoutUser = () => async(dispatch, getState) => {
  const { user } = getState();
  if (!user) return { error: 'Not found user' };

  try {
    const { data } = await api.get('/user/logout');
    const { result } = data;

    if (!result) { return }

    await dispatch(await clearAsyncStorageUserData());
    dispatch({ type: SET_USER, user: null });
    dispatch({ type: SET_ACCESS_TOKEN, accessToken: null });
    dispatch({ type: SET_REFRESH_TOKEN, refreshToken: null });
    api.setToken(null);
    api.setRefreshToken(null);
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

export const saveToAsyncStorageUserData = (userData) => async() => {
  const { id, accessToken, refreshToken } = userData;
  try {
    await AsyncStorage.setItem('userId', id.toString());
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const clearAsyncStorageUserData = () => async() => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const autoLogin = () => async(dispatch) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const userId = await AsyncStorage.getItem('userId');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    dispatch(setAccessToken(accessToken));
    dispatch(setRefreshToken(refreshToken));
    api.setToken(accessToken);
    api.setRefreshToken(refreshToken);
    const { user, error } = await dispatch(await getUserById(userId));

    if (error) {
      dispatch(setUser(null));
      dispatch(setAccessToken(null));
      dispatch(setRefreshToken(null));
      api.setToken(null);
      api.setRefreshToken(null);
      return { error }
    }

    dispatch(setUser(user));
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const getUserById = (userId) => async() => {
  try {
    const { data } = await api.get(`/user/${userId}`);
    const { result, error } = data;
    if (error) return { error }

    return { user: result };
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

export const setUser = (user) => ({
  type: SET_USER,
  user
})

export const setAccessToken = (accessToken) => ({
  type: SET_ACCESS_TOKEN,
  accessToken
});

export const setRefreshToken = (refreshToken) => ({
  type: SET_REFRESH_TOKEN,
  refreshToken
});