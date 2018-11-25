import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const LoadingOverlay = (props) => {
  const { classes } = props;
  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} size={50} />
      <Typography variant="body2">Loading</Typography>
    </div>
  )
}

export default withStyles(styles)(LoadingOverlay);