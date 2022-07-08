import React, { useState, useEffect } from 'react';
import moment from "moment"
import { useDispatch, useSelector } from 'react-redux'
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
import { Input } from '@mui/material';
import SearchInput from './SearchInput';
import RatingComp from './RatingComp';
import { getAllOrders, updatecomment, updateFollowUp } from '../redux/order/order.actions'
import { getAllDistributor } from '../redux/company/company.action'
import { getAllProducts } from '../redux/product/product.actions'

import Pagination from "../components/Pagination";
import Countdown from 'react-countdown';



const Row = ({ order, distributors, allProducts }) => {
  console.log(order, '------order')
  const [open, setOpen] = useState(false);
  const [cicStatus, setCicStatus] = useState('Open');
  const [orderId2, setOrderId2] = useState('')
  const [agent, setAgent] = useState('')
  const [loader, setLoader] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [comment, setComment] = useState('')
  const dispatch = useDispatch();
  const date1 = new Date(order.datePlaced);
  const date2 = new Date();
  const millidif = Math.abs(date2 - date1);
  const timeDiff = Math.abs(10 - Math.abs(date2 - date1) / 60000);
  // const timeDiff24hrs = Math.abs(60 - Math.abs(date2 - date1) / 60000);
  const minutes = Number(timeDiff.toFixed(0)) * 60000;
  // const sixtyMinutes = Number(timeDiff24hrs.toFixed(0)) * 60000;
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const handleOpenView = () => setOpenViewModal(true)
  const handleCloseView = () => setOpenViewModal(false)
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  useState(() => {

  }, [cicStatus]);
  const generateDitributorDetail = (sellerCompanyId) => {
    const x = distributors.find((company) => {
      if (company.SYS_Code === sellerCompanyId) {
        return company;
      }
    })
    return x;
  }

  const handleSubmit = (orderId, agentName, cicStatus) => {
    console.log(cicStatus)
    const values = {
      agent: agentName,
      CIC_Follow_Up: cicStatus
    }
    dispatch(updateFollowUp(orderId, values))
    getAllOrders()
    window.location.reload();
  }


  const getProductDetails = (productId) => {
    const x = allProducts.find((product) => {
      if (product.productId === productId) {
        return product;
      }
    })
    return x;
  }

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
    dispatch(getAllOrders());
    handleSubmit(orderId, agent, cicStatus)
    setComment("");
    handleClose()
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
    p: 4,
  };
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
          {Math.abs(millidif) > 600000 ? (<p style={{ color: 'red' }}>Time Exceeded</p>) : (
            <Countdown date={Date.now() + minutes} />
          )}
        </TableCell>
        {/* <TableCell>
          {Math.abs(millidif) > 600000 ? (<p style={{ color: 'red'}}>Time Exceeded</p>) : (
            <Countdown date={Date.now() + sixtyMinutes} />
          )}
        </TableCell> */}
        <TableCell>{order?.status}</TableCell>
        <TableCell>{order?.buyerDetails[0]?.buyerName}</TableCell>
        <TableCell>{order?.buyerCompanyId}</TableCell>
        <TableCell>{order?.buyerDetails[0]?.buyerPhoneNumber}</TableCell>
        <TableCell>{generateDitributorDetail(order?.sellerCompanyId)?.company_name}</TableCell>
        <TableCell>{order.sellerCompanyId}</TableCell>
        <TableCell>{generateDitributorDetail(order?.sellerCompanyId)?.Owner_Phone}</TableCell>
        {/* <TableCell>
          <RatingComp />
        </TableCell> */}
        <TableCell>{!generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name || generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name === "undefined" ? "Nil" : generateDitributorDetail(order?.sellerCompanyId)?.cxc_agent_name}</TableCell>
        <TableCell>{order?.CIC_Follow_Up}</TableCell>
        {/* <TableCell>{!order?.specificRouteName || order?.specificRouteName === "undefined"  ?  "Nil"  : order?.specificRouteName}</TableCell> */}
        <TableCell>
          {order?.CIC_Comment ?
            (<div style={{ display: "flex"}}>
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
              <p style={{ paddingTop: "6px"}}>|</p>
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
                <Box sx={{ width: 130 }} style={{ paddingTop: "10px"}}>
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
                      <MenuItem value="Call_Back">Follow Up</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingTop: "10px"}}>
                  Add Comment
                </Typography>
                  <textarea onChange={(e) => setComment(e.target.value)} className="form-control" style={{ minWidth: "100%", minHeight: "50%", marginTop: "2%", padding: "2%", outline: "none" }} />
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
                <Box sx={{ width: 130 }} style={{ paddingTop: "10px"}}>
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
                      <MenuItem value="Call_Back">Follow Up</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ paddingTop: "10px"}}>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Table size="small" sx={{ boxShadow: 'none' }} aria-label="purchases">
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
    overflowX: "initial"
  }
});

const CollapsibleTable = () => {
  let PageSize = 9;
  const [orderData, setOrderData] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState('')
  const [sellerId, setSellerId] = useState('')

  const orders = useSelector((state) => state.order.all_system_orders);
  const distributors = useSelector((state) => state.distributor.all_distributors);
  const allProducts = useSelector((state) => state.product.allProducts);



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

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAllDistributor('Nigeria'))
    dispatch(getAllProducts('Nigeria'))


  }, []);
  return (
    <>
      <Box
        sx={{
          background: '#fff',
          height: '110px',
          display: "flex",
          justifyContent: "space-between",
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          p: '30px 5px',
        }}
      >
        <SearchInput
          setOrderData={setOrderData}
        />
        <div style={{ display: "flex", marginTop: "1%", height: "70%", width: "100%", justifyContent: "end" }}>
          <p style={{ marginTop: "5px" }}>Filter By Status:</p>
          <p
            className=""
            onClick={(e) => {
              setOrderData("");
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
              setOrderData("Placed");
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
              setOrderData("Assigned");
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
              setOrderData("Accepted");
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
              setOrderData("Delivered");
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
              setOrderData("Completed");
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
              setOrderData("Rejected");
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
              {/* <TableCell sx={{ color: '#ffff' }}>Delivery Countdown</TableCell> */}
              <TableCell sx={{ color: '#ffff' }}>Order Status</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's Name</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's Code</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Buyer's Phone</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Seller's Name</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Seller's Code</TableCell>
              <TableCell sx={{ color: '#ffff' }}>Seller's Phone</TableCell>
              {/* <TableCell sx={{ color: '#ffff' }}>Rating</TableCell> */}
              <TableCell sx={{ color: '#ffff' }}>CIC Agent</TableCell>
              <TableCell sx={{ color: '#ffff' }}>CIC Agent Status</TableCell>
              {/* <TableCell sx={{ color: '#ffff' }}>Buyer's BDR</TableCell> */}
              <TableCell sx={{ color: '#ffff' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {sortOrder().length === 0 ? (
              <tr className="" style={{ textAlign: "center", margin: "2% auto" }}>
                <td colSpan={6}>
                  <p style={{ textAlign: "center", paddingLeft: "13%", paddingTop: "5px", paddingBottom: "5px" }} className="m-auto">Fetching Orders...</p>
                </td>
              </tr>
            ) : currentTableData().map((row) => (
              <Row key={row.orderId} order={row} distributors={distributors} allProducts={allProducts} />
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
