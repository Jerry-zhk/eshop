import React, { Component } from 'react';
import { withContext } from '../context'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = {
  paper: {
    padding: '20px'
  }
};

class Profile extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { username, display_name, balance } = this.props.user;
    const { classes } = this.props;
    return (

      <Grid container justify="center" alignItems="center" className="parent-size">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Profile</Typography>
            <hr/>
            Username: {username}<br />
            Name: {display_name}<br />
            Balance: {balance}<br />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withContext(withStyles(styles)(Profile));