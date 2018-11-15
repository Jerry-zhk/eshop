import React, { Component } from 'react';
import { Switch, withRouter, Link } from 'react-router-dom';
import AppRoute from './AppRoute';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';


class App extends Component {

  render() {
    return (
      <div>
        <Link to='/'>Home</Link>  &nbsp;
        <Link to='/login'>Login</Link> &nbsp;
        <Link to='/register'>Register</Link>
        <Switch>
          <AppRoute exact path='/' component={Home} />
          <AppRoute path='/login' component={Login} />
          <AppRoute path='/register' component={Register} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
