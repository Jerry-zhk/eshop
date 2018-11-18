import React, { Component } from 'react';
import { Switch, withRouter, Link } from 'react-router-dom';
import AppRoute from './AppRoute';
import { withContext } from './context';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';



function App(props) {
  const { user, logout } = props;
  console.log(user)
  return (
    <div>
      <Link to='/'>Home</Link>  &nbsp;
      {
        user ?
        <React.Fragment>
        <Link to='/profile'>Profile</Link> &nbsp;
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
        <AppRoute path='/login' component={Login} authorized={user == null} redirectTo='/' />
        <AppRoute path='/register' component={Register} authorized={user == null} redirectTo='/' />
        <AppRoute path='/profile' component={Profile} authorized={user != null} redirectTo='/' />
      </Switch>
    </div>
  );
}


export default withContext(withRouter(App));
