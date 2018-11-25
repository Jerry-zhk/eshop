import React, { Component } from 'react';
import { withContext } from '../context';
import Table from '@material-ui/core/Table';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';


const styles = {
  paper: {
    padding: '20px'
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  }
};

class Transaction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      page: 0,
      rowsPerPage: 5,
    }
  }

  componentWillMount() {
    const { connection } = this.props;
    connection.fetch('/transactions')
      .then(res => {
        if (res.error) return;
        this.setState({
          transactions: res.transactions
        })
      })
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { transactions, page, rowsPerPage } = this.state;
    const { classes } = this.props;
    return (
      <div>

        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h6">Transaction</Typography>
          <hr />
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell numeric>Amount ($)</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Paid at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  transactions.length === 0 ?
                    (
                      <TableRow>
                        <TableCell colSpan={5} style={{textAlign: 'center'}}>No record</TableCell>
                      </TableRow>
                    )
                    :
                    transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row =>
                      (
                        <TableRow key={row.transaction_id}>
                          <TableCell component="th" scope="row">
                            {row.transaction_id}
                          </TableCell>
                          <TableCell>{row.recipient_name}</TableCell>
                          <TableCell numeric>{row.amount}</TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.paid_at}</TableCell>
                        </TableRow>
                      )
                    )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={transactions.length}
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

export default withContext(withStyles(styles)(Transaction));