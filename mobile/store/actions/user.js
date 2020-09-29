import { SET_USER } from '../types';
import { SERVER } from '../../config';
import axios from 'axios';

export const setUser = (user) => {
  return {
    type: SET_USER,
    user
  }
}

export const authUser = (loginData) => async (dispatch) => {
  try {
    // const { data } = await axios.post(`${SERVER.URL}${SERVER.API_PATH}/auth/login`, loginData);
    // const { error, result } = data;

    // if (error) { return { error } }

    dispatch(setUser({ id: 1, ...loginData }));
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}
