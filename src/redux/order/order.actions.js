import axios from 'axios';
import {
  VIEW_SINGLE_ORDER,
  VIEW_ORDERS_BY_BUYER_CODE,
  GET_ALL_ORDERS,
  GET_ALL_ORDERS_BY_DATE,
  DIST_COMPLETED_ORDERS,
  SORT_ORDERS_BY_DATE
} from './types';
import { completedOrdersNet, orderNet } from '../../utils/urls';

export const getAllCompletedOrdersByDistributor = (id) => async (dispatch) => {
  try {
    const response = await completedOrdersNet.get(id);
    const { data } = response;
    return dispatch({
      type: DIST_COMPLETED_ORDERS,
      dist_completed_orders: data.order
    });
  } catch (error) {
    return;
  }
};

export const getSingleOrder = (id) => async (dispatch) => {
  orderNet
    .get(`GetOrder/GetOrderByOrderId/${id}`)
    .then((response) => {
      const { data } = response;
      return dispatch({
        type: VIEW_SINGLE_ORDER,
        single_order: data && data.order[0]
      });
    })
    .catch((error) => {
      return;
    });
};

export const getSingleOrderByBuyerId = (code) => async (dispatch) => {
  orderNet
    .get(`GetOrder/GetOrderByBuyerCompanyId/${code}`)
    .then((response) => {
      return dispatch({
        type: VIEW_ORDERS_BY_BUYER_CODE,
        order: response.data.order
      });
    })
    .catch((error) => {
      return;
    });
};

export const getAllOrders = () => async (dispatch) => {
  orderNet
    .get(`GetOrder/GetAll`)
    .then((response) => {
      return dispatch({
        type: GET_ALL_ORDERS,
        all_system_orders: response.data.order
      });
    })
    .catch((error) => {
      return;
    });
};

export const sortOrderDate = (data) => async (dispatch) => {
  console.log(data);
  return dispatch({
    type: SORT_ORDERS_BY_DATE,
    payload: data
  });
};

export const getAllOrdersByDateRange = (startRange, stopRange) => async (dispatch) => {
  orderNet
    .get('GetOrder/GetAll/' + startRange + '/' + stopRange)
    .then((response) => {
      return dispatch({
        type: GET_ALL_ORDERS_BY_DATE,
        all_orders_by_date: response.data.order
      });
    })
    .catch((error) => {
      return;
    });
};

export const setLoadingToDefault = () => async (dispatch) => {
  return dispatch({
    type: GET_ALL_ORDERS_BY_DATE,
    loading: true
  });
};

export const getDistOrdersByDateRange = (startRange, stopRange, dist_code) => async (dispatch) => {
  orderNet
    .get('GetOrder/GetSellerCompanyDataForReport/' + dist_code + '/' + startRange + '/' + stopRange)
    .then((response) => {
      return dispatch({
        type: GET_ALL_ORDERS_BY_DATE,
        all_orders_by_date: response.data.order,
        loading: false
      });
    })
    .catch((error) => {
      return;
    });
};
