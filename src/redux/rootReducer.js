import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/user.reducer';
import orderReducer from './order/order.reducer'
import productReducer from './product/product.reducer'


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'room', 'booking', 'order', 'product']
};

const rootReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
  product: productReducer
});

export default persistReducer(persistConfig, rootReducer);
