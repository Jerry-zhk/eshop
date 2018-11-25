import React, { Component } from 'react';

class EShop extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      order_items: [],
      checkingOut: false,
      pay_url: ''
    }
  }

  componentWillMount() {
    fetch('http://localhost:3300/eshop/items')
      .then(res => res.json())
      .then(items => {
        this.setState({ items });
        console.log(this.state.items)
      })
  }

  handleChange = (id) => (e) => {
    let order_items = this.state.order_items;
    const index = order_items.findIndex((item) => item.id === id)
    const value = parseInt(e.target.value)
    if (index >= 0) {
      order_items[index] = { id: id, qty: value };
    } else {
      order_items.push({ id: id, qty: value })
    }
    this.setState({ order_items: order_items });
  }

  checkout = (e) => {
    e.preventDefault();
    let order_items = this.state.order_items.filter((item) => item.qty > 0);
    console.log(order_items)
    if (order_items.length === 0) {
      alert('Checkout nothing');
      return
    }
    fetch('http://localhost:3300/eshop/checkout', {
      method: 'POST', headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({ order_items: order_items })
    }).then(res => res.json())
      .then(res => {

        this.setState({ checkingOut: true, pay_url: res.url })
        console.log('checkout')
        console.log(res)
      })
  }

  getItemById = (id) => {
    return this.state.items.find(item => item.id === id);
  }

  render() {
    const { items, order_items, checkingOut, pay_url } = this.state;


    return (
      <div>
        <h1>eshop!!</h1><br />
        {
          checkingOut ?
            (
              <div style={{ padding: '20px' }}>
                <strong>Checking out</strong> <br />
                {order_items.map((item, index) => {
                  const fullItem = this.getItemById(item.id);
                  if(!fullItem) return null;
                  return (
                    <div key={index}>
                      {fullItem.name}(${fullItem.price}) * {item.qty} <br />
                    </div>
                  )
                }
                  
                )}
                <a href={pay_url} target="_blank">Pay</a>
              </div>
            )
            :
            (
              <form onSubmit={this.checkout} style={{ padding: '20px' }}>
                <strong>Items</strong> <br />
                {items.map((item, index) =>
                  (
                    <div key={index} style={{ display: 'inline-block', wordWrap: 'break-word', margin: '10px' }}>
                      <img src={item.img} alt={item.name} width="150" height="150" style={{ border: '1px black solid' }} /> <br />
                      {item.name}, ${item.price} <br />
                      <input type="number" onChange={this.handleChange(item.id)} />
                    </div>
                  )
                )}
                <br />
                <button>Checkout</button>

              </form>
            )
        }

      </div>
    )
  }
}

export default EShop;