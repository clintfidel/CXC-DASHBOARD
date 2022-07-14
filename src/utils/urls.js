import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const { NODE_ENV } = process.env;

export const distributorNet = axios.create({
  baseURL: "https://dmsprd20.azure-api.net/company/",
});

export const productNet = axios.create({
  baseURL: "https://dmsprd20.azure-api.net/product/api/v1/products/",
});



export const orderNet = axios.create({
  baseURL: "https://dmsprd20.azure-api.net/order/",
  // headers: { 'Authorization': `${process.env.REACT_APP_ORDER_TOKEN}` }
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoic2FsZXNmb3JjZV90b2tlbl9pZGVudGlmaWVyX2Rtc192Ml8weHNqdDNAMyEjJF45In0.PHCkrf6sPkoep7lF5X-SugN8-CVaJ5BEYa9hvSWLPMo",
  },
});

export const userNet = axios.create({
  baseURL: "https://dmsprd20.azure-api.net/user/",
});

export const openOrdersNet = axios.create({
  baseURL:
    "https://dmsprd20.azure-api.net/order/GetOrder/GetOpenOrderBySellerCompanyId/",
});

export const completedOrdersNet = axios.create({
  baseURL:
    "https://dmsprd20.azure-api.net/order/GetOrder/GetCompletedOrderBySellerCompanyId/",
});



const urls = {
  distributorNet,
  productNet,
  orderNet,
  userNet,
};

export default urls;
