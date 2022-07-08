import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
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
import { makeStyles } from '@mui/styles';
import { Icon } from '@iconify/react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import SearchInput from './SearchInput';
import RatingComp from './RatingComp';
import { getAllOrders } from '../redux/order/order.actions';
import { getSingleDistributor } from '../redux/company/company.action';
import Pagination from '../components/Pagination';
import Countdown from 'react-countdown';

const Row = ({ order }) => {
  const [open, setOpen] = useState(false);
  const [deliveryTimer, setDeliveryTimer] = useState(0);
  const [minutesTimer, setMinutesTimer] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [milliseconds2, setMillisecond2s] = useState(0);

  // const [timeMessage, setTimeMessage] = useState({
  //   delivery: "",
  //   acceep
  // })

  const getMinuteTime = () => {
    const date1 = new Date(order.datePlaced);
    const date2 = new Date();

    setMilliseconds(Math.abs(date2 - date1));
    const timeDiff = Math.abs(10 - Math.abs(date2 - date1) / 60000);
    setMinutesTimer(Number(timeDiff.toFixed(0)) * 60000);
  };

  const getDeliveryTime = () => {
    const date1 = new Date(order.datePlaced);
    const date2 = new Date();

    setMillisecond2s(Math.abs(date2 - date1));
    const timeDiff = Math.abs(24 - Math.abs(date2 - date1) / 3600000);
    setDeliveryTimer(Number(timeDiff.toFixed(0)) * 3600000);

    // console.log(Number(timeDiff.toFixed(0)) * 3600000);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 250,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  useEffect(() => {
    getDeliveryTime();
    getMinuteTime();
  }, []);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <Icon icon="mdi:menu-down" /> : <Icon icon="mdi:menu-up" />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(order?.datePlaced).format('MMMM Do YYYY h:m:s a')}
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(order?.datePlaced).format('h:m:s a')}
        </TableCell>
        <TableCell>
          {Math.abs(milliseconds) > 600000 ? (
            <p style={{ color: 'red' }}>Time Exceeded</p>
          ) : (
            <Countdown date={Date.now() + minutesTimer} />
          )}
        </TableCell>
        <TableCell>
          {Math.abs(milliseconds2) > 86400000 ? (
            <p style={{ color: 'red' }}>Time Exceeded</p>
          ) : (
            <Countdown date={Date.now() + deliveryTimer} />
          )}
        </TableCell>
        <TableCell>{order?.status}</TableCell>
        <TableCell>{order?.buyerDetails[0]?.buyerName}</TableCell>
        <TableCell>{order?.buyerCompanyId}</TableCell>
        <TableCell>{order?.buyerDetails[0]?.buyerPhoneNumber}</TableCell>
        <TableCell>{getSingleDistributor(order.sellerCompanyId)?.Owner_Name}</TableCell>
        <TableCell>{order.sellerCompanyId}</TableCell>
        <TableCell>{getSingleDistributor(order.sellerCompanyId)?.Owner_Phone}</TableCell>
        {/* <TableCell>
          <RatingComp />
        </TableCell> */}
        <TableCell>
          {!order?.agent || order?.agent === 'undefined' ? 'Nil' : order?.agent}
        </TableCell>
        <TableCell></TableCell>
        <TableCell>
          {!order?.specificRouteName || order?.specificRouteName === 'undefined'
            ? 'Nil'
            : order?.specificRouteName}
        </TableCell>
        <TableCell>
          <div>
            <Button onClick={handleOpen}>Add Comment</Button>
            <Modal
              open={openModal}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Add Comment
                </Typography>
                <textarea
                  class="form-control"
                  style={{
                    minWidth: '100%',
                    minHeight: '50%',
                    marginTop: '2%',
                    padding: '2%',
                    outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: '3%' }}>
                  <button
                    onClick={handleClose}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'gray',
                      color: 'lightgray',
                      padding: '2% 3%',
                      marginRight: '2%',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '5px'
                    }}
                  >
                    cancel
                  </button>
                  <button
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#6B0101',
                      color: '#fff',
                      padding: '2% 3%',
                      border: 'none',
                      outline: 'none',
                      borderRadius: '5px'
                    }}
                  >
                    save
                  </button>
                </div>
              </Box>
            </Modal>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Table size="small" sx={{ boxShadow: 'none' }} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Customer Code</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.orderItems.map((orderData) => (
                    <TableRow key={orderData?.orderItemsId}>
                      <TableCell component="th" scope="row">
                        {moment(order?.datePlaced).format('MMMM Do YYYY')}
                      </TableCell>
                      <TableCell>{order?.buyerDetails[0]?.buyerName}</TableCell>
                      <TableCell>{order?.buyerCompanyId}</TableCell>
                      <TableCell align="right">{orderData?.quantity}</TableCell>
                      <TableCell align="right">{orderData?.price * orderData?.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const useStyles = makeStyles({
  customTableContainer: {
    overflowX: 'initial'
  }
});

const CollapsibleTable = () => {
  let PageSize = 9;
  const [orderData, setOrderData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState('');
  const [sellerId, setSellerId] = useState('');

  const orders = useSelector((state) => state.order.all_system_orders);
  const { sort_date_value } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const getOrderByRouteName = () => {
    const mainOrders = orders.filter((order) => order.routeName === 'ShopDC');
    const sorted = mainOrders.sort((a, b) => new Date(b.datePlaced) - new Date(a.datePlaced));
    return sorted;
  };

  const currentTableData = useCallback(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return sortOrder().slice(firstPageIndex, lastPageIndex);
  }, [sort_date_value, currentPage]);

  useEffect(() => {
    currentTableData();
  }, [sort_date_value, currentTableData]);

  const sortOrder = () => {
    return (
      orders &&
      getOrderByRouteName().filter((data) => {
        console.log(new Date(data.datePlaced));
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
    <>
      <Box
        sx={{
          background: '#fff',
          height: '110px',
          display: 'flex',
          justifyContent: 'space-between',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          p: '30px 5px'
        }}
      >
        <SearchInput setOrderData={setOrderData} />
        <div
          style={{
            display: 'flex',
            marginTop: '1%',
            height: '70%',
            width: '100%',
            justifyContent: 'end'
          }}
        >
          <p style={{ marginTop: '5px' }}>Filter By Status:</p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              marginLeft: '1%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            All Orders
          </p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('Placed');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            Placed
          </p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('Assigned');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            Assigned
          </p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('Accepted');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            Accepted
          </p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('Delivered');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            Delivered
          </p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('Completed');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            Completed
          </p>
          <p
            className=""
            onClick={(e) => {
              setOrderData('Rejected');
            }}
            style={{
              background: 'orange',
              color: 'white',
              padding: '5px',
              textAlign: 'center',
              borderRadius: '20px',
              marginRight: '2%',
              width: 'auto',
              cursor: 'pointer'
            }}
          >
            Rejected
          </p>
        </div>
      </Box>
      <TableContainer
        sx={{
          boxShadow: '0px 7px 100px rgba(9, 11, 23, 0.18)'
        }}
        component={Paper}
      >
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
              <TableCell sx={{ color: '#ffff' }}>Time of Order</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Acceptance Countdown</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Delivery Countdown</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Order Status</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's Name</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's Code</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's Phone</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Seller's Name</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Seller's Code</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Seller's Phone</TableCell>
              {/* <TableCell sx={{ color: '#ffff' }}>Rating</TableCell> */}
              <TableCell sx={{ color: '#ffff' }}>CIC Agent</TableCell>
              <TableCell sx={{ color: '#ffff' }}>CIC Agent Follow Up Status</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's BDR</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortOrder().length === 0 ? (
              <tr className="" style={{ textAlign: 'center', margin: '2% auto' }}>
                <td colSpan={6}>
                  <p
                    style={{
                      textAlign: 'center',
                      paddingLeft: '13%',
                      paddingTop: '5px',
                      paddingBottom: '5px'
                    }}
                    className="m-auto"
                  >
                    Fetching Orders...
                  </p>
                </td>
              </tr>
            ) : (
              currentTableData().map((row) => <Row key={row.orderId} order={row} />)
            )}
          </TableBody>
        </Table>
        <div className="" style={{ display: 'flex', justifyContent: 'end', margin: '1%' }}>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={sortOrder().length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </TableContainer>
    </>
  );
};

export default CollapsibleTable;
