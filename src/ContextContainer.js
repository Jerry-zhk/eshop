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
      this.forceUpdate();
    });
    this.connection.start();
  }

  register = () => {
    console.log('register')
  }

  login = () => {
    console.log('login')
  }

  logout = () => {
    console.log('logout')
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