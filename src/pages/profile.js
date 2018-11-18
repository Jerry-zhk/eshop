import React, { Component } from 'react';
import { withContext } from '../context'

class Profile extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div>
        User: 
        {
          this.props.user
        }
      </div>
    )
  }
}

export default withContext(Profile);