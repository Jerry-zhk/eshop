import React, { Component } from 'react'
import { Provider as SessionProvider } from './context';
import SecuredConnect from './SecuredConnection';
import Loading from './components/loading';

class ContextComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }

  componentWillMount() {
    this.connection = new SecuredConnect('http://localhost:3300/client');
    this.connection.onStateChange(state => {
      if (state === SecuredConnect.State.CONNECTED) {
        this.getProfile(() => {
          this.forceUpdate();
        });
      }
    });
    this.connection.start();
  }

  // Authentication
  register = (username, password, display_name) => {
    console.log('register')
    return this.connection.fetch('/register', { username: username, password: password, display_name: display_name })
      .then(res => {
        if (res.error) return res.error;
        this.setState({ user: res.user });
      })
  }

  login = (username, password) => {
    console.log('login');
    return this.connection.fetch('/login', { username: username, password: password })
      .then(res => {
        console.log(res)
        if (res.error) return res.error;
        this.setState({ user: res.user });
      })
  }

  getProfile = (callback) => {
    return this.connection.fetch('/my-profile')
      .then(res => {
        console.log(res)
        if (res.no_credentials) {
          callback();
        } else {
          this.setState({ user: res.user }, callback);
        }
      }).catch(err => {
        console.log(err)
      })
  }

  logout = () => {
    console.log('logout')
    return this.connection.fetch('/logout', {csrf_token: this.state.user.csrf_token})
      .then(res => {
        console.log(res)
        this.setState({ user: null });
      })
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
        getProfile: this.getProfile
      }}>
        {
          this.connection && this.connection.state === SecuredConnect.State.CONNECTED ? (
            this.props.children
          ) : (
              <Loading />
            )
        }
      </SessionProvider>
    )
  }
}

export default ContextComponent;