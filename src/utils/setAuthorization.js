import axios from 'axios';
/**
 * @description - set token to request headers
 *
 * @param {string} token - Default application state
 *
 * @returns {void} no return or void
 */
export const  setAuthorizationToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
      delete axios.defaults.headers.common.Authorization; // eslint-disable-line
  }
}