import { customerNet, customerNetBase } from "../../utils/urls";
import { ALL_CUSTOMERS } from './types'

export const getAllCustomers = (country) => async (dispatch) => {
  try {
    const response = await customerNetBase.get(`/getbycountry/` + country);
    const { data } = response;
    console.log(data, 'data');
    
    return dispatch({
      type: ALL_CUSTOMERS,
      all_customers: data.result,
    });
  } catch (error) {
    return;
  }
};