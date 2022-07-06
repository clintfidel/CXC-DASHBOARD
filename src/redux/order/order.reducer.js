import {
  VIEW_ALL_ORDERS,
  VIEW_SINGLE_ORDER,
  VIEW_ORDERS_BY_BUYER_CODE,
  GET_ALL_ORDERS,
  DIST_COMPLETED_ORDERS,
  GET_ALL_ORDERS_BY_DATE,
} from "./types";

const initial_state = {
  order: {},
  all_orders: [],
  buyer_orders: [],
  all_system_orders: [],
  all_orders_by_date: [],
  dist_completed_orders: [],
  loading: true,
};

const orderReducer = (state = initial_state, action) => {
  switch (action.type) {
    case VIEW_ALL_ORDERS: {
      return { ...state, all_orders: action.all_orders };
    }
    case VIEW_SINGLE_ORDER: {
      return {
        ...state,
        order: action.single_order,
        loadingsales: false,
        loading: false,
      };
    }
    case VIEW_ORDERS_BY_BUYER_CODE: {
      return { ...state, buyer_orders: action.order };
    }
    case GET_ALL_ORDERS: {
      return { ...state, all_system_orders: action.all_system_orders };
    }
    case GET_ALL_ORDERS_BY_DATE: {
      return { ...state, all_orders_by_date: action.all_orders_by_date, loading:action.loading };
    }
    case DIST_COMPLETED_ORDERS: {
      return { ...state, dist_completed_orders: action.dist_completed_orders };
    }
    default:
      return state;
  }
};

export default orderReducer;
