import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withContext } from '../context'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

const styles = {
  paper: {
    padding: '20px'
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    marginTop: '10px'
  },
  control: {
    marginRight: '10px'
  },
  url_button: {
    width: '35px',
    height: '35px'
  }
};

class Payment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      page: 0,
      rowsPerPage: 5,
      amount: 0,
      description: '',
      // type: 'one-time',
      lifetime: 1
    }
  }

  componentWillMount() {
    const { connection } = this.props;
    connection.fetch('/payment-requests')
      .then(res => {
        console.log(res)
        if (res.error) return;
        this.setState({
          requests: res.requests
        })
      })
  }

  handleCreate = (e) => {
    e.preventDefault();
    const { connection } = this.props;
    const { amount, description, lifetime } = this.state;
    console.log(amount, description, lifetime);
    connection.fetch('/create-request', { amount, description, lifetime })
      .then(res => {
        if (res.error) {
          alert(res.error);
        } else {
          let requests = this.state.requests;
          requests.unshift(res.request);
          this.setState({ requests });
        }
      })

  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };


  render() {
    const { requests, page, rowsPerPage } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h6">Create a payment request</Typography>
          <hr />
          <form onSubmit={this.handleCreate}>
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
            </FormControl>

            {/* <FormControl className={classes.control}>
              <InputLabel shrink htmlFor="type-label-placeholder">Type</InputLabel>
              <Select
                value={this.state.type}
                onChange={this.handleChange}
                input={<Input name="type" id="type-label-placeholder" />}
                name="type"
              >
                <MenuItem value='one-time'>One-time</MenuItem>
                <MenuItem value='donation'>Donation</MenuItem>
              </Select>
            </FormControl> */}

            <FormControl>
              <InputLabel htmlFor="lifetime">Expired in</InputLabel>
              <Input
                id="lifetime"
                type="number"
                name="lifetime"
                value={this.state.lifetime}
                onChange={this.handleChange}
                endAdornment={<InputAdornment position="end">hour(s)</InputAdornment>}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="description">Description</InputLabel>
              <Input
                id="description"
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
              />
            </FormControl>

            <br />
            <Button variant="contained" color="primary" type="submit" classes={{ root: classes.button }}>Create</Button>
          </form>
        </Paper>

        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h6">My requests</Typography>
          <hr />
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell numeric>Amount($)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  requests.length === 0 ?
                    (
                      <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'center' }}>No record</TableCell>
                      </TableRow>
                    )
                    :
                    requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row =>
                      (
                        <TableRow key={row.request_id}>
                          <TableCell component="th" scope="row">
                            <Link to={`/pay/${row.request_id}`}>{row.request_id}</Link>
                          </TableCell>
                          <TableCell numeric>{row.amount}</TableCell>
                          <TableCell>True</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.created_at}</TableCell>
                        </TableRow>
                      )
                    )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={requests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>

      </div>
    )
  }
}

export default withContext(withStyles(styles)(Payment));