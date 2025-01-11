import axios from 'axios'
import {
    FETCH_ADDRESS_FORM,
    FETCH_ADDRESS_FORM_SUCCESS,
    FETCH_ADDRESS_FORM_FAIL,
    CLEAR_ERRORS,
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


export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}