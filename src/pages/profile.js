import React, { Component } from 'react';
import { withContext } from '../context'

class Profile extends Component {

  constructor(props){
    super(props);
  }

  render() {
    const { username, display_name, balance } = this.props.user;
    return (
      <div>
        Username: {username}<br/>
        Name: {display_name}<br/>
        Balance: {balance}<br/>
      </div>
    )
  }
}

export default withContext(Profile);