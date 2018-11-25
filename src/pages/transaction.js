import React, { Component } from 'react';
import { withContext } from '../context'

class Transaction extends Component {

  constructor(props){
    super(props);
    this.state = {
      transactions: []
    }
  }

  componentWillMount(){
    const { connection } = this.props;
    connection.fetch('/transactions')
      .then(res => {
        if(res.error) return;
        this.setState({
          transactions: res.transactions
        })
      })
  }


  render() {
    const {transactions} = this.state;
    return (
      <div>
        Transaction
        {transactions.map((t, index) => 
          (
          <div key={index}>
            #{t.transaction_id}<br/> 
            Account name: {t.recipient_name}<br/> 
            Amount: ${t.amount}<br/> 
            Description: <br/>
            {t.description}<br/>
            paid at {t.paid_at}
          </div>
          )
        )}
      </div>
    )
  }
}

export default withContext(Transaction);