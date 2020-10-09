import axios, { AxiosRequestConfig } from 'axios';
import { SERVER } from './config';

class Api {
  url = null;
  token = null;
  timeout = 3000;

  constructor(url, path) {
    this.url = `${url || SERVER.URL}${path || SERVER.API_PATH}`;
  }

  checkServer() {
    return axios.get(`${SERVER.URL}/ping`, { timeout: this.timeout });
  }

  setToken(token) {
    this.token = token;
  }

  /**
   * @param {string} path 
   * @param {AxiosRequestConfig} params 
   */
  get(path, params) {
    return axios.get(`${this.url}${path}`, {
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : undefined,
      },
      ...params,
    });
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
