import axios, { AxiosRequestConfig } from 'axios';
import { SERVER } from './config';
import store from './store';
import { setUser, setAccessToken, setRefreshToken } from './store/actions/user';

class Api {
  url = null;
  token = null;
  timeout = 3000;
  refreshToken = null;

  constructor(url, path) {
    this.url = `${url || SERVER.URL}${path || SERVER.API_PATH}`;
  }

  checkServer() {
    return axios.get(`${SERVER.URL}/ping`, { timeout: this.timeout });
  }

  /**
   * @param {string} token 
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * @param {string} refreshToken 
   */
  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  // TODO: сделать метод обновления токена доступа
  async refresingToken() {
    try {
      const { data } = await axios.post(`${SERVER.URL}/auth/refresh_token`, {
        refreshToken: this.refreshToken
      });
      const { result, error } = data;
      if (error) {
        console.error('REFRESH TOKEN ERROR: ', error);
        store.dispatch(setUser(null));
        store.dispatch(setAccessToken(null));
        store.dispatch(setRefreshToken(null));
        return { error }
      }

      const { accessToken, refreshToken } = result;
      this.token = accessToken;
      this.refreshToken = refreshToken;
      return { result }
    } catch (error) {
      console.error('REFRESH TOKEN ERROR: ', error);
      return { error: error.message };
    }
  }

  /**
   * @param {string} path 
   * @param {AxiosRequestConfig} params 
   */
  async get(path, params) {
    try {
      const result = await axios.get(`${this.url}${path}`, {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : undefined,
        },
        ...params,
      });

      return result;
    } catch (error) {
      console.error('API METHOD GET ERROR: ', error);
      const { response } = error;
      const { status } = response;
      if (status !== 401) throw new Error(error.message);

      const { error: refreshingTokenError } = await this.refresingToken();
      if (refreshingTokenError) throw new Error(refreshingTokenError);

      return this.get(path, params);
    }
  }

  /**
   * @param {string} path
   * @param {any} data
   * @param {AxiosRequestConfig} params 
   */
  post(path, data, params) {
    return axios.post(`${this.url}${path}`, data, {
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : undefined
      },
      ...params
    })
  }

  /**
   * @param {string} path
   * @param {any} data
   * @param {AxiosRequestConfig} params
   */
  put(path, data, params) {
    return axios.put(`${this.url}${path}`, data, {
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : undefined
      },
      ...params
    })
  }

  getAxios() {
    return axios;
  }
}

const api = new Api();

export default api;
