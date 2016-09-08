import { createStore, applyMiddleware } from 'redux';
import { AppContainer } from 'react-hot-loader';
import messageApp from './reducers';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {openSocket} from './actions';


const loggerMiddleware = createLogger();

var store = createStore(messageApp, applyMiddleware(thunkMiddleware, loggerMiddleware));

render(
    <AppContainer>
        <Provider store = {store}>
            <App/>
        </Provider>
    </AppContainer>,
   document.getElementById('container')
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./components/App').default;
    ReactDOM.render(
      <AppContainer>
      <Provider store = {store}>
         <NextApp />
     </Provider>
      </AppContainer>,
      document.getElementById('container')
    );
  });
}

store.dispatch(openSocket());