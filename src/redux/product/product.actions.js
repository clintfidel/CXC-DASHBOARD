import { GET_SINGLE_PRODUCTS, VIEW_ALL_PRODUCTS } from './types';
import {productNet} from '../../utils/urls'

export const getSingleProduct = (id) => async(dispatch) => {
  productNet.get(id).then((response) => {
    const { data } = response
      return dispatch({
        type: GET_SINGLE_PRODUCTS,
        single_product: data,
      });
  })
}

export const getAllProducts = (country) => async (dispatch) => {
  productNet
    .get('?country=' + country)
    .then((response) => {
      const { data } = response.data
      return dispatch({
        type: VIEW_ALL_PRODUCTS,
        all_products: data,
      });
    })
    .catch((error) => {
      return;
    });
};