import React, { Component } from 'react'
import { Provider as SessionProvider } from './context';
import SecuredConnect from './SecuredConnection';

class ContextComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    this.connection = new SecuredConnect('http://localhost:3300');
    this.connection.onStateChange(state => {
      if(state == SecuredConnect.State.CONNECTED){
        this.getProfile(() => {
          this.forceUpdate();
        });
      }
    });
    this.connection.start();
  }

  // Authentication
  register = () => {
    console.log('register')
  }

  login = (username, password) => {
    console.log('login');
    return this.connection.fetch('/auth/login', {username: username, pw: password})
      .then(res => {
        this.setState({ user: res.user_id });
      })
  }

  getProfile = (callback) => {
    return this.connection.fetch('/auth/my-profile', {a:1, b:2})
    .then(res => {
      if(!res.hasOwnProperty('failure')){
        this.setState({ user: res.user_id }, callback);
      }else{
        callback();
      }
    })

  }

  logout = () => {
    console.log('logout')
    return this.connection.fetch('/auth/logout', {})
      .then(res => {
        this.setState({ user: null });
      })
  }

  register = () => {
    console.log('register')
  }

  render() {
    return (
      <SessionProvider value={{
        // Secured Connection
        connection: this.connection,
        
        // Authentication
        user: this.state.user,
        register: this.register,
        login: this.login,
        logout: this.logout,
      }}>
        {
          this.connection && this.connection.state === SecuredConnect.State.CONNECTED ? (
            this.props.children
          ):(
            <div>Loading</div>
          )
        }
      </SessionProvider>
    )
  }
}

export default ContextComponent;