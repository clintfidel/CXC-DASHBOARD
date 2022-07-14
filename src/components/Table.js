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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { CSVLink } from "react-csv";
import SearchInput from './SearchInput';
import RatingComp from './RatingComp';
import { LoadingButton } from '@mui/lab';
import Countdown from 'react-countdown';
import { getAllOrders, updatecomment, updateFollowUp } from '../redux/order/order.actions'
import { getAllDistributor } from '../redux/company/company.action'
import { getAllProducts } from '../redux/product/product.actions'
import { getAllCustomers } from '../redux/customer/customer.action'

import Pagination from "../components/Pagination";

const Row = ({ order, generateDitributorDetail, getProductDetails, generateCustomerDetail }) => {
  const [open, setOpen] = useState(false);
  const [textDisplayAccept, setTextDisplayAccept] = useState('');
  const [textDisplayDeliver, setTextDisplayDeliver] = useState('');
  const [milliseconds, setMilliseconds] = useState(0);
  const [milliseconds2, setMillisecond2s] = useState(0);
  const [acceptanceCountdown, setAcceptanceCountdown] = useState('');
  const [deliveryCountdown, setDeliveryCountdown] = useState('');


  const [cicStatus, setCicStatus] = useState(order?.CIC_Follow_Up? order?.CIC_Follow_Up : 'Open');
  const [agent, setAgent] = useState('')
  const [loader, setLoader] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [comment, setComment] = useState('')
  const dispatch = useDispatch();
  const date1 = new Date(order.datePlaced);
  const date2 = new Date();
  const millidif = Math.abs(date2 - date1);
  // const timeDiff = Math.abs(10 - Math.abs(date2 - date1) / 60000);
  // const timeDiff24hrs = Math.abs(60 - Math.abs(date2 - date1) / 60000);
  // const minutes = Number(timeDiff.toFixed(0)) * 60000;
  // const sixtyMinutes = Number(timeDiff24hrs.toFixed(0)) * 60000;
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const handleOpenView = () => setOpenViewModal(true)
  const handleCloseView = () => setOpenViewModal(false)
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  // const generateDitributorDetail = (sellerCompanyId) => {
  //   const x = distributors.find((company) => {
  //     if (company.SYS_Code === sellerCompanyId) {
  //       return company;
  //     }
  //   })
  //   return x;
  // }

  const startCountDown = () => {

    setInterval(() => {
      if (acceptanceCountdown && acceptanceCountdown !== 'Time Exceeded') {
        let newCountdown = acceptanceCountdown.split(':');

        if (Number.parseInt(newCountdown[0]) == 0 && Number.parseInt(newCountdown[1]) == 0) {
          setAcceptanceCountdown('Time Exceeded');
        }

        if (Number.parseInt(newCountdown[1]) == 0) {
          let min = Number.parseInt(newCountdown[0]) - 1;
          min = min < 10 ? `0${min}` : min;
          setAcceptanceCountdown(`${min}:59`);
        } else {
          let sec = Number.parseInt(newCountdown[1]) - 1;
          sec = sec < 10 ? `0${sec}` : sec;
          setAcceptanceCountdown(`${newCountdown[0]}:${sec}`);
        }
      }

      if (deliveryCountdown && deliveryCountdown !== 'Time Exceeded') {
        let newDeliveryCountdown = deliveryCountdown.split(':');


        if (Number.parseInt(newDeliveryCountdown[0]) == 0 && Number.parseInt(newDeliveryCountdown[1]) == 0 && Number.parseInt(newDeliveryCountdown[2]) == 0) {
          setDeliveryCountdown('Time Exceeded');
        }

        if (Number.parseInt(newDeliveryCountdown[2]) !== 0) {
          let sec = Number.parseInt(newDeliveryCountdown[2]) - 1;
          sec = sec < 10 ? `0${sec}` : sec;
          setDeliveryCountdown(`${deliveryCountdown[0]}:${deliveryCountdown[1]}:${sec}`)
        }

        if (Number.parseInt(newDeliveryCountdown[2]) === 0 && Number.parseInt(newDeliveryCountdown[1]) !== 0) {
          let min = Number.parseInt(newDeliveryCountdown[1]) - 1;
          min = min < 10 ? `0${min}` : min;
          setDeliveryCountdown(`${newDeliveryCountdown[0]}:${min}:59`);
        }

        if (Number.parseInt(newDeliveryCountdown[2]) === 0 && Number.parseInt(newDeliveryCountdown[1]) === 0) {
          let hr = Number.parseInt(newDeliveryCountdown[1]) - 1;
          hr = hr < 10 ? `0${hr}` : hr;
          setDeliveryCountdown(`${hr}:${59}:59`);
        }

      }
    }, 1000);
    return null;
  }

  const setCountDown = () => {

    // if (acceptanceCountdown === '' && deliveryCountdown === '') {
      const datePlaced = new Date((new Date()))
      const diff = Math.floor((new Date().getTime() - new Date(order.datePlaced).getTime()) / (60000));
      const minAcceptanceTime = 10; // In minutes
      const minDeliveryTime = 1440;
      if (diff < minAcceptanceTime) {
        let countDown = minAcceptanceTime - diff;
        countDown = countDown < 10 ? `0${countDown}` : countDown;
        setAcceptanceCountdown(`${countDown}:00`);
      } 
      // else if (diff < minAcceptanceTime && order?.staus === "Accepted") {
      //   setAcceptanceCountdown('Order Accepted on Time');
      // } 
      else {
        setAcceptanceCountdown('Time Exceeded');
      }

      if (diff < minDeliveryTime) {
        const countDown = minDeliveryTime - diff;
        let hr = Math.floor(countDown / 60);
        let min = countDown % 60;
        hr = hr < 10 ? `0${hr}` : `${hr}`;
        min = min < 10 ? `0${min}` : `${min}`;
        const deliveryCountDown = `${hr}:${min}:00`
        setDeliveryCountdown(deliveryCountDown);
      } 
      // else if (diff < minDeliveryTime && order?.staus === "Delivered") {
      //   setAcceptanceCountdown('Order Delivered on Time');
      // } 
      else {
        setDeliveryCountdown('Time Exceeded')
      }

    // }

    return null;
  }

  const handleSubmit = (orderId, agentName, cicStatus) => {
    console.log(cicStatus)
    const values = {
      agent: agentName,
      CIC_Follow_Up: cicStatus
    }
    dispatch(updateFollowUp(orderId, values))
    getAllOrders()
  }


  // const getProductDetails = (productId) => {
  //   const x = allProducts.find((product) => {
  //     if (product.productId === productId) {
  //       return product;
  //     }
  //   })
  //   return x;
  // }

  const clickAction = (orderId, agentName) => {
    console.log(orderId, 'orderId')
    handleOpen();
    setOrderId(orderId)
    setAgent(agentName)
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    const cicComment = {
      CIC_Comment: comment
    }
    await dispatch(updatecomment(orderId, cicComment))
    handleSubmit(orderId, agent, cicStatus)
    console.log(cicStatus, '-----cicStatus')
    dispatch(getAllOrders());
    setComment("");
    handleClose()
    window.location.reload();

  }

  const displayText = () => {
    if (acceptanceCountdown === 'Time Exceeded') {
      setTextDisplayAccept(<p style={{ color: 'red' }}>Time Exceeded</p>)
    } else if (acceptanceCountdown === 'Order Accepted on Time') {
      setTextDisplayAccept(<p style={{ color: 'green' }}>Order Accepted on Time</p>)
    } else {
      setTextDisplayAccept(acceptanceCountdown)
    }

    if (deliveryCountdown === 'Time Exceeded') {
      setTextDisplayDeliver(<p style={{ color: 'red' }}>Time Exceeded</p>)
    } else if (deliveryCountdown === 'Order Delivered on Time') {
      setTextDisplayDeliver(<p style={{ color: 'green' }}>Order Delivered on Time</p>)
    } else {
      setTextDisplayDeliver(deliveryCountdown)
    }
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  useEffect(() => {
    setCountDown()
    displayText()
    // startCountDown()
  }, [acceptanceCountdown, deliveryCountdown]);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell style={{ padding: "2px" }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <Icon icon="mdi:menu-down" /> : <Icon icon="mdi:menu-up" />}
          </IconButton>
        </TableCell>
        <TableCell style={{ padding: "2px" }} component="th" scope="row">
          {`${moment(order?.datePlaced).format('MMMM Do')}, ${moment(order?.datePlaced).format('hh:mm')}`}
        </TableCell>
        <TableCell style={{ padding: "2px", paddingLeft: '15px' }}>
          {textDisplayAccept}
        </TableCell>
        <TableCell style={{ padding: "2px" }}>
          {textDisplayDeliver}
        </TableCell>
        {/* <TableCell>
          {Math.abs(millidif) > 600000 ? (<p style={{ color: 'red'}}>Time Exceeded</p>) : (
            <Countdown date={Date.now() + sixtyMinutes} />
          )}
        </TableCell> */}
        <TableCell style={{ padding: "2px" }}>{order?.status}</TableCell>
        <TableCell style={{ padding: "2px" }}>{order?.buyerDetails[0]?.buyerName}</TableCell>
        <TableCell style={{ padding: "2px" }}>{generateCustomerDetail(order?.buyerCompanyId)?.BB_Code}</TableCell>
        <TableCell style={{ padding: "2px" }}>{order?.buyerDetails[0]?.buyerPhoneNumber}</TableCell>
        <TableCell style={{ padding: "2px" }}>{!generateDitributorDetail(order?.sellerCompanyId)?.company_name ? generateCustomerDetail(order?.sellerCompanyId, 'Bulkbreaker')?.CUST_Name : generateDitributorDetail(order?.sellerCompanyId)?.company_name}</TableCell>
        <TableCell style={{ padding: "2px" }}>{generateDitributorDetail(order?.sellerCompanyId)?.sap_code}</TableCell>
        <TableCell style={{ padding: "2px" }}>{generateDitributorDetail(order?.sellerCompanyId)?.Owner_Phone}</TableCell>
        <TableCell style={{ padding: "2px", textTransform: "lowercase" }}>{generateCustomerDetail(order?.buyerCompanyId).sales_rep_email}</TableCell>

        {/* <TableCell>
          <RatingComp />
        </TableCell> */}
        <TableCell style={{ padding: "2px" }}>{!generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name || generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name === "undefined" ? "Nil" : generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name}</TableCell>
        <TableCell style={{ padding: "2px" }}>{order?.CIC_Follow_Up}</TableCell>
        {/* <TableCell>{!order?.specificRouteName || order?.specificRouteName === "undefined"  ?  "Nil"  : order?.specificRouteName}</TableCell> */}
        <TableCell style={{ padding: "2px" }}>
          {order?.CIC_Comment ?
            (<div style={{ display: "flex" }}>
              <Button style={{ color: 'green' }} onClick={handleOpenView}>View Comment</Button>
              <Modal
                open={openViewModal}
                onClose={handleCloseView}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    CIC Comment
                </Typography>
                  <div style={{ minWidth: "100%", minHeight: "50%", marginTop: "2%", padding: "2%", outline: "none" }}>
                    {order?.CIC_Comment}
                  </div>
                </Box>
              </Modal>
              <p style={{ paddingTop: "6px" }}>|</p>
              <Button onClick={() => clickAction(order?.orderId, generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name)}>Edit Comment</Button>
              <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Edit CIC Agent Follow Up
                </Typography>
                  <Box sx={{ width: 130 }} style={{ paddingTop: "10px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">CIC Status</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={cicStatus}
                        label="CIC Status"
                        onChange={(e) => setCicStatus(e.target.value)}
                      >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="Closed">Closed</MenuItem>
                        <MenuItem value="Follow Up">Follow Up</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingTop: "10px" }}>
                    Add Comment
                </Typography>
                  <textarea placeholder={order?.CIC_Comment} onChange={(e) => setComment(e.target.value)} className="form-control" style={{ minWidth: "100%", minHeight: "50%", marginTop: "2%", padding: "2%", outline: "none" }} />
                  <div style={{ display: "flex", justifyContent: "end", marginTop: "3%" }}>
                    <button onClick={handleClose} style={{ cursor: "pointer", backgroundColor: "gray", color: "lightgray", padding: "2% 3%", marginRight: "2%", border: "none", outline: "none", borderRadius: "5px" }}>cancel</button>
                    <button onClick={onSubmit} style={{ cursor: "pointer", backgroundColor: "#6B0101", color: "#fff", padding: "2% 3%", border: "none", outline: "none", borderRadius: "5px" }}>save</button>
                  </div>
                </Box>
              </Modal>
            </div>) :
            (<>
              <div>
                <Button onClick={() => clickAction(order?.orderId, generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name)}>Add Comment</Button>
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Edit CIC Agent Follow Up
                </Typography>
                    <Box sx={{ width: 130 }} style={{ paddingTop: "10px" }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">CIC Status</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={cicStatus}
                          label="CIC Status"
                          onChange={(e) => setCicStatus(e.target.value)}
                        >
                          <MenuItem value="Open">Open</MenuItem>
                          <MenuItem value="Closed">Closed</MenuItem>
                          <MenuItem value="Follow Up">Follow Up</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingTop: "10px" }}>
                      Add Comment
                </Typography>
                    <textarea onChange={(e) => setComment(e.target.value)} className="form-control" style={{ minWidth: "100%", minHeight: "50%", marginTop: "2%", padding: "2%", outline: "none" }} />
                    <div style={{ display: "flex", justifyContent: "end", marginTop: "3%" }}>
                      <button onClick={handleClose} style={{ cursor: "pointer", backgroundColor: "gray", color: "lightgray", padding: "2% 3%", marginRight: "2%", border: "none", outline: "none", borderRadius: "5px" }}>cancel</button>
                      <button onClick={onSubmit} style={{ cursor: "pointer", backgroundColor: "#6B0101", color: "#fff", padding: "2% 3%", border: "none", outline: "none", borderRadius: "5px" }}>save</button>
                    </div>
                  </Box>
                </Modal>
              </div>
            </>)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Table size="small" sx={{ boxShadow: 'none', minWidth: 1000, }} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Customer Code</TableCell>
                    {/* <TableCell align="left">Quantity</TableCell> */}
                    <TableCell align="left">Total price (#)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.orderItems.map((orderData) => (
                    <TableRow key={orderData?.orderItemsId}>
                      <TableCell component="th" scope="row">
                        {moment(order?.datePlaced).format('MMMM Do YYYY')}
                      </TableCell>
                      <TableCell>
                        <div className="" style={{ display: "flex", alignItems: "center" }}>
                          <div className="w-10">
                            <img
                              className="rounded-full"
                              style={{ width: "50%" }}
                              src={
                                getProductDetails(orderData?.productId)
                                  ?.imageUrl
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-base my-1 font-semibold mb-3">
                              {getProductDetails(orderData?.productId)?.brand}{" "}
                              {getProductDetails(orderData?.productId)?.sku}
                            </div>

                            <div className="flex gap-2 items-center">
                              <div
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
                                style={{
                                  color: "white",
                                  backgroundColor: "rgb(244, 156, 0)",
                                  width: "20%",
                                  textAlign: 'center',
                                  borderRadius: '11px',
                                }}
                              >
                                {
                                  getProductDetails(orderData?.productId)
                                    ?.productType
                                }
                              </div>
                              <p className="" style={{ fontWeight: "bold" }}>
                                Qty:{" "}{orderData.quantity}
                              </p>
                            </div>
                            {/* {orderData?.comboID  && <div className="flex mt-2 gap-2 items-center">
															<div
																className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-white"
																style={{ backgroundColor: "green" }}
															>
																Combo:
															</div>
															<p className="font-customGilroy text-sm font-medium not-italic text-grey-40">
															{ orderData?.comboID }
															</p>
														</div>} */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order?.buyerDetails[0]?.buyerName}</TableCell>
                      <TableCell>{order?.buyerCompanyId}</TableCell>
                      {/* <TableCell align="left">{orderData?.quantity}</TableCell> */}
                      <TableCell align="left">
                        {orderData?.price * orderData?.quantity}
                      </TableCell>
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
  let PageSize = 15;
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState('');
  const [sellerId, setSellerId] = useState('');

  const orders = useSelector((state) => state.order.all_system_orders);
  const distributors = useSelector((state) => state.distributor.all_distributors);
  const allProducts = useSelector((state) => state.product.allProducts);
  const allCustomers = useSelector((state) => state.customer.all_customers);

  // const { sort_date_value } = useSelector((state) => state.order);

  const generateDitributorDetail = (sellerCompanyId) => {
    const x = distributors.find((company) => {
      if (company.SYS_Code === sellerCompanyId) {
        return company;
      }
    })
    return x;
  }

  const generateCustomerDetail = (buyerCompanyId, type) => {
    const x = allCustomers.find((buyer) => {
      if (buyer.SF_Code === buyerCompanyId && !type) {
        return buyer;
      }
      else if(buyer.SF_Code === buyerCompanyId && buyer?.CUST_Type === type) {
        return buyer
      }
    })
    return x;
  }

  const getProductDetails = (productId) => {
    const x = allProducts.find((product) => {
      if (product.productId === productId) {
        return product;
      }
    })
    return x;
  }

  const getOrderByRouteName = () => {
    const mainOrders = orders.filter((order) => order.routeName === 'ShopDC');
    const sorted = mainOrders.sort((a, b) => new Date(b.datePlaced) - new Date(a.datePlaced));
    return sorted;
  };


  useEffect(() => {
    console.log(allCustomers,orders, '------->');
    
    dispatch(getAllOrders());
    dispatch(getAllDistributor('Nigeria'))
    dispatch(getAllProducts('Nigeria'))
    dispatch(getAllCustomers('Nigeria'))

  }, []);


  const sortOrder = () => {

    return (
      orders &&
      getOrderByRouteName().filter((data) => {
        return (
          data?.status !== null && String(data?.status).toLowerCase().includes(`${orderData.toLowerCase()}`) ||
          data?.CIC_Follow_Up !== null && String(data?.CIC_Follow_Up).toLowerCase().includes(`${orderData.toLowerCase()}`) ||
          (data?.buyerDetails[0]?.buyerName !== null &&
            String(data?.buyerDetails[0]?.buyerName)
              .toLowerCase()
              .includes(`${orderData.toLowerCase()}`)) ||
          (data?.orderId !== null &&
            String(data?.orderId).toLowerCase().includes(`${orderData.toLowerCase()}`)) ||
          (data?.routeName !== null &&
            String(data?.routeName).toLowerCase().includes(`${orderData.toLowerCase()}`))
        );
      })
    );
  };

  let data = [];
  orders.sort((a, b) => new Date(b.datePlaced) - new Date(a.datePlaced)).map((order) => {
    data.push({
      "Date of Order": moment(order?.datePlaced).format('MMMM Do YYYY'),
      "Time of Order": moment(order?.datePlaced).format('h:m:s a'),
      "Date And Time Accepted": order?.orderStatus[0].dateAccepted !== null ? moment(order?.orderStatus[0].dateAccepted).format('MMMM Do YYYY h:m:s a') : "Not Available",
      "Date And Time Delivered": order?.orderStatus[0].dateDelivered !== null ? moment(order?.orderStatus[0].dateDelivered).format('MMMM Do YYYY h:m:s a') : "Not Available",
      "Date And Time Completed": order?.orderStatus[0].dateCompleted !== null ? moment(order?.orderStatus[0].dateCompleted).format('MMMM Do YYYY h:m:s a') : "Not Available",
      "Order Status": order?.status,
      "Buyer's Name": order?.buyerDetails[0]?.buyerName,
      "Buyer's Code": generateCustomerDetail(order?.buyerCompanyId).BB_Code,
      "Buyer's Phone": order?.buyerDetails[0]?.buyerPhoneNumber,
      "BDR Email": generateCustomerDetail(order?.buyerCompanyId).sales_rep_email,
      "Total Amount": order?.totalPrice,
      "Quantity": order?.noOfProduct,
      "Seller's Name": generateDitributorDetail(order?.sellerCompanyId)?.company_name,
      "Seller's Code": order?.sellerCompanyId,
      "Seller's Phone": generateDitributorDetail(order?.sellerCompanyId)?.Owner_Phone,
      "CIC Agent": generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name,
      "CIC Agent Status": order?.CIC_Follow_Up,
      "CIC Comment": order?.CIC_Comment
    })

  })
  const currentTableData = () => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return orders && sortOrder().slice(firstPageIndex, lastPageIndex);
  };

  useEffect(() => {
    currentTableData();
  }, [currentPage]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box width={190}>
            <CSVLink
              data={data}
              filename="order-report.csv"
              style={{ textDecoration: "none" }}
            >
              <LoadingButton fullWidth size="large" variant="outlined">
                Download-Report
              </LoadingButton>
            </CSVLink>
          </Box>
        </Box>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{
              display: 'flex',
              marginTop: '1%',
              height: '70%',
              width: '100%',
              justifyContent: 'end'
            }}
          >
            <p style={{ marginTop: '5px' }}>Filter By CIC Status: </p>
            <p
              className=""
              onClick={(e) => {
                setOrderData('Open');
              }}
              style={{
                background: "#008000",
                color: "white",
                padding: "5px 8px",
                textAlign: "center",
                borderRadius: "20px",
                marginRight: "1%",
                marginLeft: '1%',
                width: "auto",
                cursor: "pointer"
              }}
            >
              Open
          </p>
            <p
              className=""
              onClick={(e) => {
                setOrderData('Closed');
              }}
              style={{
                background: "#800000",
                color: "white",
                padding: "5px 8px",
                textAlign: "center",
                borderRadius: "20px",
                marginRight: "1%",
                width: "auto",
                cursor: "pointer"
              }}
            >
              Closed
          </p>
            <p
              className=""
              onClick={(e) => {
                setOrderData('Follow Up');
              }}
              style={{
                background: "#FFA500",
                color: "white",
                padding: "5px 8px",
                textAlign: "center",
                borderRadius: "20px",
                marginRight: "2%",
                width: "auto",
                cursor: "pointer"
              }}
            >
              Follow Up
          </p>
          </div>
        </div>
      </Box>
      <Box
        sx={{
          background: '#fff',
          height: '70px',
          display: 'flex',
          justifyContent: 'space-between',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          p: '10px 0px'
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
              background: "#6B0101",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              marginLeft: "1%",
              width: "auto",
              cursor: "pointer"
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
              background: "gray",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              width: "auto",
              cursor: "pointer"
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
              background: "#FF8C00",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              width: "auto",
              cursor: "pointer"
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
              background: "#F06105",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              width: "auto",
              cursor: "pointer"
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
              background: "#32CD32",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              width: "auto",
              cursor: "pointer"
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
              background: "#568203",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              width: "auto",
              cursor: "pointer"
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
              background: "red",
              color: "white",
              padding: "5px 8px",
              textAlign: "center",
              borderRadius: "20px",
              marginRight: "2%",
              width: "auto",
              cursor: "pointer"
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
            minWidth: 1800,
            boxShadow: '0px 7px 100px rgba(9, 11, 23, 0.18)'
          }}
          aria-label="collapsible table"
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: 'primary.dark',
                height: '40px'
              }}
            >
              <TableCell style={{padding: "1px 5px"}} />
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Date of Order</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Acceptance Countdown</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Delivery Countdown</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Order Status</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Buyer's Name</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Buyer's Code</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Buyer's Phone</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Seller's Name</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Seller's Code</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Seller's Phone</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>BDR Email</TableCell>

              {/* <TableCell sx={{ color: '#ffff' }}>Rating</TableCell> */}
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>CIC Agent</TableCell>
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Agent Status</TableCell>
              {/* <TableCell sx={{ color: '#ffff' }}>Buyer's BDR</TableCell> */}
              <TableCell style={{padding: "1px 5px"}} sx={{ color: '#ffff' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {sortOrder().length === 0 ? (
              <tr className="" style={{ textAlign: "center", margin: "2% auto" }}>
                <td colSpan={6}>
                  <p style={{ textAlign: "center", paddingLeft: "80%", paddingTop: "5px", paddingBottom: "5px" }} className="m-auto">Fetching Orders...</p>
                </td>
              </tr>
            ) : orders && currentTableData().map((row) => (
              <Row key={row.orderId} order={row} generateDitributorDetail={generateDitributorDetail} getProductDetails={getProductDetails} generateCustomerDetail={generateCustomerDetail} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="" style={{ display: "flex", justifyContent: "end", margin: "1%" }}>
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={sortOrder().length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
};

export default CollapsibleTable;
