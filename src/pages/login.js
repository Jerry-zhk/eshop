import React, { Component } from 'react';
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
  }
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        username: '',
        password: ''
      },
      errors: {}
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
    e.preventDefault();
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
      }
    };
    let errors = validatejs(this.state.data, constraints);
    return errors === undefined ? {} : errors;
  }
  proceed() {
    const { errors, data } = this.state;
    if (errors.constructor === Object && Object.keys(errors).length === 0) {
      // submit form to login using email & password
      console.log(errors)
      this.props.login(data.username, data.password).then(err => {
        if (err)
          this.setState({ errors: err });
      });
    }
  }

  render() {
    return (
      <div>
        <Grid container justify="center" alignItems="center" className="parent-size">
          <Grid item xs={12} sm={6} md={5} lg={3}>
            <Paper className={this.props.classes.paper}>
              <Typography variant="h6">Log in</Typography>
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

                <Button color="primary" variant="contained" type="submit" size="medium" fullWidth>Log in</Button>
              </form>
              {/* End of form */}
            </Paper>

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withContext(withStyles(styles)(Login));