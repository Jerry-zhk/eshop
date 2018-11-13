import React, { Component } from 'react';
import SecuredConnect from './SecuredConnection';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      val: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.connection = new SecuredConnect('http://localhost:3300');
    this.connection.onStateChange(state => {
      this.forceUpdate();
    });
    this.connection.start();
  }

  click = () => {
    this.connection.fetch('pay', {name: this.state.val});
  }
  
  handleChange(event) {
    this.setState({val: event.target.value});
  }


  render() {
    return this.connection && this.connection.state === SecuredConnect.State.CONNECTED ? (
      <div>
        Hi, your session_id is {this.connection.session_id}
        <br/>
        <input type="text" value={this.state.val} onChange={this.handleChange} />
        <button onClick={this.click}>click</button>
      </div>
      
    ):(
      <div>Loading</div>
    );
  }
}

export default App;
