import {
  VIEW_ALL_DISTRIBUTOR,
  VIEW_SINGLE_DISTRIBUTOR,
} from "./types";

const initial_state = {
  distributor: {},
  all_distributors: [],
};

const addDistributorReducer = (state = initial_state, action) => {
  switch (action.type) {
   
    case VIEW_ALL_DISTRIBUTOR: {
      return { ...state, all_distributors: action.all_distributors };
    }
    case VIEW_SINGLE_DISTRIBUTOR: {
      return { ...state, distributor: action.payload };
    }
    default:
      return state;
  }
};

export default addDistributorReducer;
