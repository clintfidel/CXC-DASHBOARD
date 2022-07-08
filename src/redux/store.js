
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { routerReducer, routerMiddleware } from "react-router-redux"
import userReducer from '../redux/user/user.reducer'
import orderReducer from '../redux/order/order.reducer'
import companyReducer from '../redux/company/company.reducer'
import productReducer from '../redux/product/product.reducer'


export default function configureStore(history, initialState) {
  const reducers = {
    user: userReducer,
    order: orderReducer, 
    distributor: companyReducer,
    product: productReducer
  };

  const middleware = [thunk, routerMiddleware(history)];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === "development";
  if (
    isDevelopment &&
    typeof window !== "undefined" &&
    window.devToolsExtension
  ) {
    enhancers.push(window.devToolsExtension());
  }

  const allReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  const store = createStore(
    allReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  return store;
}

