import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Context from './ContextContainer';
import EShop from './pages/eshop';

function AppWrapper() {
  return (
    <Context>
      <App />
    </Context>
  )
}

function EShopOrNot() {
  return (
    <Switch>
      <Route path='/eshop' component={EShop} />
      <Route path='/' component={AppWrapper} />
    </Switch>
  )
}


ReactDOM.render(
  <BrowserRouter>
    <EShopOrNot/>
  </BrowserRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
