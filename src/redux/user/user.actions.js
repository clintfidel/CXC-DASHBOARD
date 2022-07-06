// import AppRoutes from '../../Services/axios/Requests';
// const { signUpRequest, logInRequest } = AppRoutes();
import axios from 'axios';

// const baseUrl =http://ec2-18-191-87-10.us-east-2.compute.amazonaws.com/v1/profile/988a1523-64ff-4f8f-bede-999318397946';

// const baseUrl = 'https://5b25-41-58-194-145.ngrok.io';
const baseUrl = 'http://ec2-18-191-87-10.us-east-2.compute.amazonaws.com';

// export const addUser = (user) => {
//   return async (dispatch) => {
//     return true;
//   };
// };
const options = {
  headers: {
    auth_key: 'agsgbfh1235gdgdhejjwjz',
    accept: 'application/json',
    'content-type': 'application/json'
  },
  withCredentials: true,
  mode: 'cors'
};

export const login = (user) => async (dispatch) => {
  const response = await axios
    .post(
      `${baseUrl}/v1/auth/login`,
      {
        email: user.email,
        password: user.password
      },
      {
        ...options
      }
    )
    .catch((error) => {
      if (error.response) {
        return error.response.data;
      }
      return {
        errors: true,
        message: 'Somthing went wrong, try again later'
      };
    });

  if (!response.errors && response.data.success) {
    if (response.data.data.role !== 'ADMIN') {
      return {
        errors: true,
        message: 'Unauthorized'
      };
    }
    if (response.data.success) {
      const { data } = response;
      dispatch({
        type: 'ADD_USER',
        payload: data.data
      });
    }
    console.log(response);
  }

  return response;
};
