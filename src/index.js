// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserHistory } from "history";
import jwtDecode from 'jwt-decode';
import { Provider } from 'react-redux';
import configureStore from './redux/store'
import {setAuthorizationToken} from './utils/setAuthorization';
import { SET_CURRENT_USER } from './redux/user/types';
import App from './App';
import './assets/style.scss';


import * as serviceWorker from './serviceWorker';

import reportWebVitals from './reportWebVitals';

const baseUrl = 'http://localhost:3000';
const history = createBrowserHistory({ basename: baseUrl });
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

const token = localStorage.getItem('token');

if (token) {
  setAuthorizationToken(token);
  store.dispatch({
    type: SET_CURRENT_USER,
    user: jwtDecode(token),
    authenticated: true
  });
}
// ----------------------------------------------------------------------

ReactDOM.render(
  <HelmetProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
