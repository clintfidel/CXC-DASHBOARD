import { combineReducers } from 'redux';
// import bookingReducer from './booking/booking.reducer';
// import roomReducer from './room/room.reducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/user.reducer';
import orderReducer from './order/order.reducer'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'room', 'booking', 'order']
};

const rootReducer = combineReducers({
  user: userReducer,
  order: orderReducer
  // room: roomReducer,
  // booking: bookingReducer,
});

export default persistReducer(persistConfig, rootReducer);
