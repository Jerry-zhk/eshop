import React, { Component } from 'react';
import validatejs from 'validate.js';
import { withContext } from '../context';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const styles = {
  paper: {
    marginTop: '20px',
    padding: '20px'
  }
};


class Register extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        username: '',
        display_name: '',
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
  handleCheck(e) {
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
      username: {
        presence: true,
        length: {
          minimum: 6,
          message: "must be at least 6 characters"
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
    console.log('what')
    const { errors, data } = this.state;
    if (errors.constructor === Object && Object.keys(errors).length === 0) {
      console.log('dsjadjs')
      this.props.register(data.username, data.password).then(err => {
        console.log(err)
        if (err)
          this.setState({ errors: err });
      });
    }
  }

  render() {
    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={6} md={5} lg={3}>
            <Paper className={this.props.classes.paper}>
              <Typography variant="h6">Reigster</Typography>
              <hr/>
              {/* Form */}
              <form onSubmit={this.handleSubmit}>
                <FormControl error={(this.state.errors.username !== undefined)} fullWidth>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input id="username" name="username" type="text"
                    value={this.state.data.username} onChange={this.handleChange}
                    endAdornment={<InputAdornment><Icon>account_circle</Icon></InputAdornment>} />
                  <FormHelperText>{this.state.errors.username}</FormHelperText>
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
            </Paper>

          </Grid>
        </Grid>
      </div>
    );
  }
}


export default withContext(withStyles(styles)(Register));