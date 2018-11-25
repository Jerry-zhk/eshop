import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withContext } from '../context';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggleDrawer = (open) => () => {
    this.setState({ open: open });
  };


  render() {
    const { user, logout } = this.props;
    return (
      <React.Fragment>
        <AppBar position="static" color="default">
          <Toolbar>
            <Hidden mdUp implementation="css" key="2">
              <IconButton onClick={this.toggleDrawer(true)} aria-label="Delete" color="inherit">
                <Icon>menu</Icon>
              </IconButton>
            </Hidden>
            <Button component={Link} to="/">Secure pay</Button>
            <div style={{ flex: '1 1 auto' }}></div>
            <Hidden smDown implementation="css" key="1">
              {
                user ?
                  <React.Fragment>
                    <Button component={Link} to="/profile">Profile</Button>
                    <Button component={Link} to="/transaction">Transactions</Button>
                    <Button component={Link} to="/payment">Payments</Button>
                    <Button onClick={logout}>Logout</Button>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Button component={Link} to="/login">Login</Button>
                    <Button component={Link} to="/register">Register</Button>
                  </React.Fragment>
              }
            </Hidden>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.open} onClose={this.toggleDrawer(false)} >
          <div tabIndex={0} role="button" onClick={this.toggleDrawer(false)}>
            {
              user ?
                <React.Fragment>
                  <List component="nav" key="list1">
                    <ListItem button component={Link} to="/profile" key="1">
                      <ListItemIcon>
                        <Icon>account_box</Icon>
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button component={Link} to="/transaction" key="2">
                      <ListItemIcon>
                        <Icon>history</Icon>
                      </ListItemIcon>
                      <ListItemText primary="Transactions" />
                    </ListItem>
                    <ListItem button component={Link} to="/payment" key="3">
                      <ListItemIcon>
                        <Icon>payment</Icon>
                      </ListItemIcon>
                      <ListItemText primary="Payments" />
                    </ListItem>
                  </List>
                  <Divider />
                  <List component="nav" key="list2">
                    <ListItem button onClick={logout} key="1">
                      <ListItemIcon>
                        <Icon>exit_to_app</Icon>
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </React.Fragment>
                :
                <React.Fragment>
                  <List component="nav" key="list1">
                    <ListItem button component={Link} to="/login" key="1">
                      <ListItemText primary="Login" />
                    </ListItem>
                    <ListItem button component={Link} to="/register" key="2">
                      <ListItemText primary="Register" />
                    </ListItem>
                  </List>
                </React.Fragment>
            }

          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}




export default withContext(Header);