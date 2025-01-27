import axios from 'axios'
import {
    FETCH_ADDRESS_FORM,
    FETCH_ADDRESS_FORM_SUCCESS,
    FETCH_ADDRESS_FORM_FAIL,
    CLEAR_ERRORS,
    FETCH_ALL_OPTIONS_REQUEST,
    FETCH_ALL_OPTIONS_SUCCESS,
    FETCH_ALL_OPTIONS_FAIL,
    FETCH_ALL_COUPONS_REQUEST,
    FETCH_ALL_COUPONS_SUCCESS,
    FETCH_ALL_COUPONS_FAIL,
} from '../const/common.const'
import { BASE_API_URL } from '../config'

export const fetchAddressForm = () => async (dispatch) => {
    try {

        dispatch({ type: FETCH_ADDRESS_FORM })
        // const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.get(`${BASE_API_URL}/api/common/website/address`);
        console.log("Fetch Form: ",data);
        dispatch({ type: FETCH_ADDRESS_FORM_SUCCESS, payload: data.result || []})
    } catch (error) {
        dispatch({ type: FETCH_ADDRESS_FORM_FAIL, payload: error.response.data.message })
    }
}
export const sendGetCoupon = ({fullName,email})=> async(dispatch)=>{
    try {
        const{data} = await axios.post(`${BASE_API_URL}/api/common/coupons/sendCoupon`,{fullName,email})
        if(data.success){
            console.log("Coupon Send: ",data);
            return data;
        }
        return data;

    } catch (error) {
        console.log('error sending: ',error);
        // dispatch({ type: GET_COUPON_FAIL, payload: error.response.data.message })
        return null;
    }
}

export const fetchAllOptions = ()=> async(dispatch)=>{
    try {
        dispatch({ type: FETCH_ALL_OPTIONS_REQUEST })
        const response = await axios.get(`${BASE_API_URL}/api/common/options/get/all`);
        console.log("All Options: ",response.data);
        dispatch({ type: FETCH_ALL_OPTIONS_SUCCESS, payload: response.data.result })
    } catch (error) {
        console.error("Error fetching all options: ",error);
        dispatch({ type: FETCH_ALL_OPTIONS_FAIL, payload: error?.response?.data?.message })
    }
}

export const fetchAllCoupons = (query)=> async(dispatch)=>{
    try {
        dispatch({ type: FETCH_ALL_COUPONS_REQUEST })
        const response = await axios.get(`${BASE_API_URL}/api/common/coupons/all?${query}`);
        console.log("All Coupons: ",response.data);
        dispatch({ type: FETCH_ALL_COUPONS_SUCCESS, payload: response.data.result })
    } catch (error) {
        console.error("Error fetching all Coupons: ",error);
        dispatch({ type: FETCH_ALL_COUPONS_FAIL, payload: error?.response?.data?.message })
    }
}
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}