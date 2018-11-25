import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import { withContext } from '../context'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
  paper: {
    padding: '20px'
  }
};

class Pay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      paymentInfo: null,
      paymentCompleted: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { connection, user } = this.props;
    connection.fetch('/payment-info', { requestId: this.props.match.params.requestId })
      .then(res => {
        if (res.error) {
          this.setState({ error: res.error })
        } else {
          this.setState({ paymentInfo: res.request })
          if (res.request.recipient === user.user_id)
            this.setState({ error: 'This payment was created by you...' })
          else
            this.setState({ paymentInfo: res.request })

        }
      })
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      const {paymentCompleted} = this.state;
      if (window.paymentCompletedOrCancelled) {
        window.paymentCompletedOrCancelled(paymentCompleted, 'closetap')
      }
    });
  }

  componentWillUnmount() {
    const { paymentCompleted } = this.state;
    if (!paymentCompleted && window.paymentCompletedOrCancelled) {
      window.paymentCompletedOrCancelled(paymentCompleted, 'unmount')
    }
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
    if (!paymentInfo) {
      alert('Invalid payment request');
      return;
    }
    connection.fetch('/pay-with-account-balance', { requestId: paymentInfo.request_id })
      .then(res => {
        if (res.error) {
          alert(res.error)
        } else {
          console.log('paid', res)
          this.setState({ paymentCompleted: true }, () => {
            alert('Payment completed.');
            if (window.paymentCompletedOrCancelled) {
              window.close();
            }
          })
        }
      })

  }

  render() {
    const { paymentCompleted, error, paymentInfo } = this.state;
    if (paymentCompleted)
      return (<Redirect to="/home" />);

    const { classes } = this.props;
    return (

      <Grid container justify="center" alignItems="center" className="parent-size">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Payment</Typography>
            <hr />
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
          </Paper>


        </Grid>
      </Grid>
    )
  }
}

export default withRouter(withContext(withStyles(styles)(Pay)));