import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import validatejs from 'validate.js';
import { withContext } from '../context';

import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        email: '',
        password: '',
        confirm_password: ''
      },
      agreed: false,
      errors: {}
    }
    this.handleCheck = this.handleCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleCheck(e){
    this.setState({ agreed: e.target.checked });
  }
  handleChange(e) {
    let data = this.state.data;
    data[e.target.name] = e.target.value
    this.setState({ data: data });
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('submit')
    this.setState({ errors: this.validate() }, this.proceed);
  }
  validate() {
    var constraints = {
      email: {
        presence: true,
        email: {
          message: "%{value} is not a valid email"
        }
      },
      password: {
        presence: true,
        length: {
          minimum: 6,
          message: "must be at least 6 characters"
        }
      },
      confirm_password: {
        equality: "password"
      }
    };
    let errors = validatejs(this.state.data, constraints);
    return errors === undefined ? {} : errors;
  }
  proceed() {
    const { errors } = this.state;
    if (errors.constructor === Object && Object.keys(errors).length === 0) {
      this.props.register();
    }
  }

  render() {
    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={6} md={5} lg={3}>
            {/* Card */}
            <Card>
              <CardHeader title="Create your account" subheader="Pay easy"  />
              <CardContent>
                {/* Form */}
                <form onSubmit={this.handleSubmit}>
                  <FormControl error={(this.state.errors.email !== undefined)} fullWidth>
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input id="email" name="email" type="email" 
                      value={this.state.data.email} onChange={this.handleChange}
                      endAdornment={<InputAdornment><Icon>account_circle</Icon></InputAdornment>} />
                    <FormHelperText>{this.state.errors.email}</FormHelperText>
                  </FormControl>
                  <FormControl error={(this.state.errors.password !== undefined)} fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" name="password" type="password" 
                      value={this.state.data.password} onChange={this.handleChange}
                      endAdornment={<InputAdornment><Icon>lock</Icon></InputAdornment>} />
                    <FormHelperText>{this.state.errors.password}</FormHelperText>
                  </FormControl>
                  <FormControl error={(this.state.errors.confirm_password !== undefined)} fullWidth>
                    <InputLabel htmlFor="confirm_password">Confirm Password</InputLabel>
                    <Input id="confirm_password" name="confirm_password" type="password" 
                      value={this.state.data.confirm_password} onChange={this.handleChange}
                      endAdornment={<InputAdornment><Icon>lock</Icon></InputAdornment>} />
                    <FormHelperText>{this.state.errors.confirm_password}</FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox name="agreed" color="primary" onChange={this.handleCheck} />
                      }
                      label={
                        <span>
                          I have agreed to the <a href="#">Terms of service</a>
                        </span>
                      } />
                  </FormControl>
                  <Button color="primary" variant="contained" type="submit" size="small" fullWidth disabled={!this.state.agreed}>Register</Button>
                </form>
                {/* End of form */}
              </CardContent>
            </Card>
            {/* End of card */}
          </Grid>
        </Grid>
      </div>
    );
  }
}


export default withContext(Register);