import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withContext } from '../context'

import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class Pay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      paymentInfo: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { connection } = this.props;
    connection.fetch('/payment-info', { requestId: this.props.match.params.requestId })
      .then(res => {
        console.log(res)
        if (res.error) {
          this.setState({ error: res.error })
        } else {
          this.setState({ paymentInfo: res.request })
        }
      })
  }

  handleChange(e) {
    let data = this.state.data;
    data[e.target.name] = e.target.value
    this.setState({ data: data });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { paymentInfo } = this.state;
    const { connection } = this.props;
    if(!paymentInfo) {
      console.log('invalid payment request', paymentInfo);
      return;
    }
    connection.fetch('/pay-with-account-balance', { requestId: paymentInfo.request_id})
      .then(res => {
        if(res.error){
          console.log(res.error)
        }else{
          console.log('paid', res)
        }
      })

  }

  render() {
    const { error, paymentInfo } = this.state;
    return (

      <Grid container justify="center" alignItems="center" className="parent-size">
        <Grid item xs={12} sm={6} md={5} lg={4}>
          {
            error &&
            <div>{error}</div>
          }

          {
            (paymentInfo && !error) &&
            (

              <form onSubmit={this.handleSubmit}>
                Payment #{paymentInfo.request_id}<br />
                Recipient: {paymentInfo.display_name}<br />
                Amount: ${paymentInfo.amount}<br />
                Description: {paymentInfo.description} <br />
                <hr />
                <Button color="primary" variant="contained" type="submit" size="small">Pay</Button>
              </form>
            )
          }

        </Grid>
      </Grid>
    )
  }
}

export default withRouter(withContext(Pay));