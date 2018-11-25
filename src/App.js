import React, { Component } from 'react';
import { Switch, withRouter, Link } from 'react-router-dom';
import AppRoute from './AppRoute';
import { withContext } from './context';
import Home from './pages/home';
import Pay from './pages/pay';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Transaction from './pages/transaction';
import PaymentRequest from './pages/payment-request';
import Error404 from './pages/error404';

import EShop from './pages/eshop';



function App(props) {
  const { user, logout } = props;
  return (
    <div>
      <Link to='/'>Home</Link>  &nbsp;
      {
        user ?
        <React.Fragment>
          <Link to='/profile'>Profile</Link> &nbsp;
          <Link to='/transaction'>Transaction</Link> &nbsp;
          <Link to='/payment-request'>Payment request</Link> &nbsp;
          <a href="javascript:void(0)" onClick={logout}>Logout</a>
        </React.Fragment>
        :
        <React.Fragment>
          <Link to='/login'>Login</Link> &nbsp; 
          <Link to='/register'>Register</Link>
        </React.Fragment>
      }
      <Switch>
        <AppRoute exact path='/' component={Home} />
        <AppRoute exact path='/eshop' component={EShop} />
        <AppRoute path='/pay/:requestId' component={Pay} />
        <AppRoute path='/login' component={Login} authorized={user == null} redirectTo='/' />
        <AppRoute path='/register' component={Register} authorized={user == null} redirectTo='/' />
        <AppRoute path='/profile' component={Profile} authorized={user != null} redirectTo='/login' />
        <AppRoute path='/transaction' component={Transaction} authorized={user != null} redirectTo='/login' />
        <AppRoute path='/payment-request' component={PaymentRequest} authorized={user != null} redirectTo='/login' />
        <AppRoute component={Error404}/>
      </Switch>
    </div>
  );
}


export default withRouter(withContext(App));
