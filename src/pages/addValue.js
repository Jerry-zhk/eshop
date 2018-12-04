import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import validatejs from 'validate.js';
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { withContext } from '../context';


const styles = {
  paper: {
    marginTop: '20px',
    padding: '20px'
  },
  button: {
    marginTop: '10px'
  }
};

class AddValue extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        code: '',
        amount: 0
      },
      errors: {},
      redirect: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    let data = this.state.data;
    data[e.target.name] = e.target.value
    this.setState({ data: data });
  }
  handleSubmit(e) {
    console.log('submmit')
    e.preventDefault();
    this.setState({ errors: this.validate() }, this.proceed);
  }
  validate() {
    var constraints = {
      code: {
        presence: true,
        length: {
          is: 64,
          message: "must be 64 characters"
        }
      },
      amount: {
        presence: true
      }
    };
    let errors = validatejs(this.state.data, constraints);
    return errors === undefined ? {} : errors;
  }
  proceed() {
    const { connection, user, getProfile } = this.props;
    const { errors, data } = this.state;
    console.log(this.state)
    if (errors.constructor === Object && Object.keys(errors).length === 0) {
      // submit form to login using email & password
      connection.fetch('/add-value', { csrf_token: user.csrf_token, amount: data.amount, code: data.code })
        .then(res => {
          if (res.error) {
            alert(res.error);
          } else {
            getProfile(() => {
              this.setState({redirect: true})
            });

          }
        })

      
    }
  }

  render() {
    if(this.state.redirect){
      return (<Redirect to="/profile"/>);
    }
    const {classes} = this.props;
    return (
      <div>
        <Grid container justify="center" alignItems="center" className="parent-size">
          <Grid item xs={12} sm={6} md={5} lg={3}>
            <Paper className={this.props.classes.paper}>
              <Typography variant="h6">Gift Card - add value</Typography>
              <hr />
              {/* Form */}
              <form onSubmit={this.handleSubmit}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="code">code</InputLabel>
                  <Input
                    id="code"
                    name="code"
                    value={this.state.code}
                    onChange={this.handleChange}
                  />
                  <FormHelperText>{this.state.errors.code}</FormHelperText>
                </FormControl>
                <FormControl className={classes.control}>
                  <InputLabel htmlFor="amount">Amount</InputLabel>
                  <Input
                    id="amount"
                    type="number"
                    name="amount"
                    value={this.state.amount}
                    onChange={this.handleChange}
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  />
                  <FormHelperText>{this.state.errors.amount}</FormHelperText>
                </FormControl>

                <Button className={classes.button} color="primary" variant="contained" type="submit" size="medium" fullWidth>Submit</Button>
              </form>
              {/* End of form */}
            </Paper>

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withContext(withStyles(styles)(AddValue));