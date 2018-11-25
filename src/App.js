import React, { Component } from 'react';
import { Switch, withRouter, Link } from 'react-router-dom';
import AppRoute from './AppRoute';
import { withContext } from './context';
import Header from './components/header';
import Home from './pages/home';
import Pay from './pages/pay';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Transaction from './pages/transaction';
import Payment from './pages/payment';
import Error404 from './pages/error404';

import EShop from './pages/eshop';


function Layout(props) {
  return (
    <main>
      <Header />
      <div style={{ padding: '10px' }}>
        {props.children}
      </div>
    </main>
  )
}


function App(props) {
  const { user } = props;
  return (
    <Layout>
      <Switch>
        <AppRoute exact path='/' component={Home} />
        <AppRoute path='/pay/:requestId' component={Pay} />
        <AppRoute path='/login' component={Login} authorized={user == null} redirectTo='/' />
        <AppRoute path='/register' component={Register} authorized={user == null} redirectTo='/' />
        <AppRoute path='/profile' component={Profile} authorized={user != null} redirectTo='/login' />
        <AppRoute path='/transaction' component={Transaction} authorized={user != null} redirectTo='/login' />
        <AppRoute path='/payment' component={Payment} authorized={user != null} redirectTo='/login' />
        <AppRoute component={Error404} />
      </Switch>
    </Layout>
  );
}


export default withRouter(withContext(App));
