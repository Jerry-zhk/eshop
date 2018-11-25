import React, { Component } from 'react';
import { withContext } from '../context'

class Home extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        {
          this.props.user ? 
          `Welcome ${this.props.user}`:
          'Home, not logged in'
        }
      </div>
    )
  }
}

export default withContext(Home);