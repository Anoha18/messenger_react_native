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
      store.dispatch(setAccessToken(accessToken));
      store.dispatch(setRefreshToken(refreshToken));
      return { result }
    } catch (error) {
      console.error('REFRESH TOKEN ERROR: ', error);
      return { error: error.message };
    }
  }

  /**
   * @param {string} path 
   * @param {AxiosRequestConfig} params
   * @returns {Promise<import('axios').AxiosResponse>}
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
      console.log('API METHOD GET ERROR: ', error);
      const { response } = error;
      const { status } = response;
      if (+status !== 401) throw new Error(error.message);

      const { error: refreshingTokenError } = await this.refresingToken();
      if (refreshingTokenError) throw new Error(refreshingTokenError);

      return this.get(path, params);
    }
  }

  /**
   * @param {string} path
   * @param {any} data
   * @param {AxiosRequestConfig} params 
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async post(path, data, params) {
    const headers = {
      ...params.headers,
      ...{
        Authorization: this.token ? `Bearer ${this.token}` : undefined,
      }
    }
    console.log('HEADERS: ', headers);
    try {
      const result = await axios.post(`${this.url}${path}`, data, {
        ...params,
        headers,
      })
      return result;
    } catch (error) {
      console.log('API METHOD POST ERROR: ', error);
      console.log('QUERY CONFIG: ', error.config || '-');
      const { response } = error;
      const { status } = response;
      if (+status !== 401) throw new Error(error.message);

      const { error: refreshingTokenError } = await this.refresingToken();
      if (refreshingTokenError) throw new Error(refreshingTokenError);

      return this.post(path, data, params);
    }
  }

  /**
   * @param {string} path
   * @param {any} data
   * @param {AxiosRequestConfig} params
   * @returns {Promise<import('axios').AxiosResponse>}
   */
  async put(path, data, params) {
    try {
      const result = await axios.put(`${this.url}${path}`, data, {
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : undefined
        },
        ...params
      })
      return result;
    } catch (error) {
      console.log('API METHOD PUT ERROR: ', error);
      const { response } = error;
      const { status } = response;
      if (+status !== 401) throw new Error(error.message);

      const { error: refreshingTokenError } = await this.refresingToken();
      if (refreshingTokenError) throw new Error(refreshingTokenError);

      return this.put(path, data, params);
    }
  }

  getAxios() {
    return axios;
  }
}

const api = new Api();

export default api;
