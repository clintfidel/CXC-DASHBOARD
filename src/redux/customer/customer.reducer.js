import {
  ALL_CUSTOMERS,
} from "./types";

const initial_state = {
  all_customers: [],
};

const customerReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ALL_CUSTOMERS: {
      return { ...state, all_customers: action.all_customers };
    }
    default:
      return state;
  }
}

export default customerReducer;


