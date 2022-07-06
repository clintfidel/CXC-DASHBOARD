import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Icon } from '@iconify/react';
import { Input } from '@mui/material';
import SearchInput from './SearchInput';
import RatingComp from './RatingComp';
import { getAllOrders } from '../redux/order/order.actions';
import Countdown from 'react-countdown';

function createData(
  date,
  delivery,
  buyerName,
  buyerCode,
  buyerNum,
  sellerName,
  sellerCode,
  sellerNum,
  orderStatus,
  lastUpdated,
  rating,
  cicAgent,
  cicAgentFollow,
  buyerBdr,
  action
) {
  return {
    date,
    delivery,
    buyerName,
    buyerNum,
    buyerCode,
    sellerNum,
    sellerCode,
    sellerName,
    orderStatus,
    lastUpdated,
    rating,
    cicAgent,
    cicAgentFollow,
    buyerBdr,
    action,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  };
}

const Row = ({ order }) => {
  const [open, setOpen] = useState(false);

  const date1 = new Date(order.datePlaced);
  const date2 = new Date();
  const millidif = Math.abs(date2 - date1);
  const timeDiff = Math.abs(10 - Math.abs(date2 - date1) / 60000);
  const minutes = Number(timeDiff.toFixed(0)) * 60000;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <Icon icon="mdi:menu-down" /> : <Icon icon="mdi:menu-up" />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          11-12-2022
        </TableCell>
        <TableCell>
          {Math.abs(millidif) > 600000 ? (
            'Time Exceeded'
          ) : (
            <Countdown date={Date.now() + minutes} />
          )}
        </TableCell>
        <TableCell>{order?.status}</TableCell>
        <TableCell>{order?.buyerDetails[0]?.buyerName}</TableCell>
        <TableCell>{order?.buyerCompanyId}</TableCell>
        <TableCell>{order?.buyerDetails[0]?.buyerPhoneNumber}</TableCell>
        <TableCell>{order.sellerName}</TableCell>
        <TableCell>{order.sellerCode}</TableCell>
        <TableCell>{order.sellerNum}</TableCell>
        <TableCell>{order.lastUpdated}</TableCell>
        <TableCell>
          <RatingComp />
        </TableCell>
        <TableCell>{order?.agent}</TableCell>
        <TableCell></TableCell>
        <TableCell>{order?.specificRouteName}</TableCell>
        <TableCell></TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Table size="small" sx={{ boxShadow: 'none' }} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </>
  );
};

// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired
//       })
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired
//   }).isRequired
// };

const CollapsibleTable = () => {
  let PageSize = 20;
  const [orderData, setOrderData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const orders = useSelector((state) => state.order.all_system_orders);
  const dispatch = useDispatch();

  const getOrderByRouteName = () => {
    const mainOrders = orders.filter((order) => order.routeName === 'ShopDC');
    const sorted = mainOrders.sort((a, b) => new Date(b.datePlaced) - new Date(a.datePlaced));
    return sorted;
  };

  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return sortOrder().slice(firstPageIndex, lastPageIndex);
  };

  const sortOrder = () => {
    return (
      orders &&
      getOrderByRouteName().filter((data) => {
        return (
          data?.status?.startsWith(`${orderData}`) ||
          (data?.buyerDetails[0]?.buyerName !== null &&
            data?.buyerDetails[0]?.buyerName
              .toLowerCase()
              .includes(`${orderData.toLowerCase()}`)) ||
          (data?.orderId !== null &&
            String(data?.orderId).toLowerCase().includes(`${orderData.toLowerCase()}`)) ||
          (data?.routeName !== null &&
            data?.routeName.toLowerCase().includes(`${orderData.toLowerCase()}`))
        );
      })
    );
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, []);
  return (
    <TableContainer
      sx={{
        boxShadow: '0px 7px 100px rgba(9, 11, 23, 0.18)'
      }}
      component={Paper}
    >
      <Box
        sx={{
          background: '#fff',
          height: '110px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          p: '30px 35px'
        }}
      >
        <SearchInput />
      </Box>
      <Table
        sx={{
          minWidth: 3000,
          boxShadow: '0px 7px 100px rgba(9, 11, 23, 0.18)'
        }}
        aria-label="collapsible table"
      >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'primary.dark',
              height: '70px'
            }}
          >
            <TableCell />
            <TableCell sx={{ color: '#ffff' }}>Date of Order</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Delivery Countdown</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Order Status</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Buyer's Name</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Buyer's Code</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Buyer's Phone</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Seller's Name</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Seller's Code</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Seller's Phone</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Last Updated</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Rating</TableCell>
            <TableCell sx={{ color: '#ffff' }}>CIC Agent</TableCell>
            <TableCell sx={{ color: '#ffff' }}>CIC Agent Follow Up Status</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Buyer's BDR</TableCell>
            <TableCell sx={{ color: '#ffff' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortOrder().map((row) => {
            return <Row key={row.orderId} order={row} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleTable;
