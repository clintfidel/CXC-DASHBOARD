import { GET_SINGLE_PRODUCTS, VIEW_ALL_PRODUCTS } from './types';

const initial_state = {
  product: {},
  loading: false,
  allProducts: []
};

const productReducer = (state = initial_state, action) => {
  switch (action.type) {
    case GET_SINGLE_PRODUCTS: {
      return {
        ...state,
        product: action.single_product,
        loading: false,
      };
    }
    case VIEW_ALL_PRODUCTS: {
      return { ...state, allProducts: action.all_products };
    }
    default:
      return state;
  }
}

export default productReducer;