import React, { Component } from 'react';
import { withContext } from '../context'

class Home extends Component {
  constructor(props){
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        {
          user ? 
          `Welcome ${user.display_name}`:
          'Home, not logged in'
        }
      </div>
    )
  }
}

export default withContext(Home);