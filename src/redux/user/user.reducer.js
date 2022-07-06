const INITIAL_STATE = {
  data: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        data: { ...action.payload }
      };

    case 'REMOVE_TOKEN':
      return {
        ...state,
        token: null,
        user: null
      };
    default:
      return state;
  }
};

export default userReducer;
