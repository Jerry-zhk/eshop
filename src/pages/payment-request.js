import React, { Component } from 'react';
import { withContext } from '../context'

class PaymentRequest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      requests: []
    }
  }

  componentWillMount() {
    const { connection } = this.props;
    connection.fetch('/payment-requests')
      .then(res => {
        console.log(res)
        if (res.error) return;
        this.setState({
          requests: res.requests
        })
      })
  }


  render() {
    const { requests } = this.state;
    return (
      <div>
        Create request:
        <form>
          Amount: <input  type="number" min="0" required/><br/>
          Description: <br/>
          <textarea placeholder="Details of the payment..."></textarea>
          <button>Create</button>
        </form>


        My requests<br/>
        {
          requests.length === 0 ?
            'No requests'
            :
            requests.map((r, index) =>
              (
                <div key={index}>
                  #{r.requst_id}<br />
                  Amount: ${r.amount}<br />
                  Status: true <br />
                  Created at: {r.created_at}<br />
                  Description: <br />
                  {r.description}<br />
                </div>
              )
            )
        }

      </div>
    )
  }
}

export default withContext(PaymentRequest);