
import jwtDecode from 'jwt-decode';
import { userNet } from '../../utils/urls';
import { setAuthorizationToken } from '../../utils/setAuthorization';
import {SET_CURRENT_USER, USER_LOGOUT} from './types'

export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    user,
    authenticated: true
  };
}

export const login = (userValue) => async (dispatch) => {
  try {
    const response = await userNet
    .post( "/shopdc/login", userValue);
    if(response) {
      console.log(response, 'response');
      
      const { token } = response.data;
      setAuthorizationToken(token);
      localStorage.setItem('token', token);
      const currentUser = jwtDecode(token);
      return dispatch(setCurrentUser(currentUser))
    }
    return response.data.msg
  } catch (error) {
    console.log(error);
  
  } 
};

export const logoutAction = () => (dispatch) => {
  localStorage.removeItem('token');
  setAuthorizationToken(false);
  dispatch({
    type: USER_LOGOUT,
    user: {},
    authenticated: false
  });
};
