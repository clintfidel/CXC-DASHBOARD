import {
  SET_CURRENT_USER
} from './types';

const INITIAL_STATE = {
  user: {}
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return { ...state, user: action.user, authenticated: action.authenticated };
  }
};

export default userReducer;
