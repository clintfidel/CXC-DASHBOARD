import axios from "axios";
import {
  VIEW_ALL_DISTRIBUTOR,
  VIEW_SINGLE_DISTRIBUTOR,
} from "./types";
import { distributorNet } from "../../utils/urls";


export const getAllDistributor = (country) => async (dispatch) => {
  try {
    const response = await distributorNet.get("company/companies/" + country);
    const { data } = response;
    return dispatch({
      type: VIEW_ALL_DISTRIBUTOR,
      all_distributors: data.result,
    });
  } catch (error) {
    return;
  }
};

export const getSingleDistributor = (code) => async (dispatch) => {
  distributorNet
    .get(`company/code/${code}`)
    .then((response) => {
      return dispatch({
        type: VIEW_SINGLE_DISTRIBUTOR,
        payload: response.data.result,
      });
    })
    .catch((error) => {
      return;
    });
};