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
    FETCH_DISCLAIMERS_REQUEST,
    FETCH_DISCLAIMERS_SUCCESS,
    FETCH_DISCLAIMERS_FAIL,
	FETCH_TERMS_AND_CONDITIONS,
	FETCH_TERMS_AND_CONDITIONS_SUCCESS,
	FETCH_TERMS_AND_CONDITIONS_FAIL,
	FETCH_PRIVACY_AND_POLICY_FAIL,
	FETCH_PRIVACY_AND_POLICY_SUCCESS,
	FETCH_PRIVACY_AND_POLICY,
	FETCH_FAQS_SUCCESS,
	FETCH_FAQS_FAIL,
	FETCH_FAQS,
} from '../const/common.const'
import { BASE_API_URL } from '../config'

export const fetchAddressForm = () => async (dispatch) => {
    try {

        dispatch({ type: FETCH_ADDRESS_FORM })
        const { data } = await axios.get(`${BASE_API_URL}/api/common/website/address`);
        console.log("Fetch Form: ",data);
        dispatch({ type: FETCH_ADDRESS_FORM_SUCCESS, payload: data.result || []})
    } catch (error) {
        dispatch({ type: FETCH_ADDRESS_FORM_FAIL, payload: error.response.data.message })
    }
}
export const fetchWebsiteDisclaimer = () => async (dispatch) => {
    try {
        dispatch({ type: FETCH_DISCLAIMERS_REQUEST })
        const { data } = await axios.get(`${BASE_API_URL}/api/common/website/disclaimer`);
        // console.log("Website Disclaimer: ",data);
        dispatch({ type: FETCH_DISCLAIMERS_SUCCESS, payload: data.result })
        return data;
    } catch (error) {
        console.error("Error fetching website disclaimer: ",error);
        dispatch({ type: FETCH_DISCLAIMERS_FAIL, payload: error.response.data.message })
    }
}
export const fetchTermsAndCondition = ()=> async(dispatch)=>{
	try {
        dispatch({ type: FETCH_TERMS_AND_CONDITIONS })
        const { data } = await axios.get(`${BASE_API_URL}/api/common/website/terms-and-condition`);
        console.log("Terms and Condition: ",data);
        dispatch({ type: FETCH_TERMS_AND_CONDITIONS_SUCCESS, payload: data.result})
    } catch (error) {
        console.error("Error fetching terms and conditions: ",error);
        dispatch({ type: FETCH_TERMS_AND_CONDITIONS_FAIL, payload: error.response.data.message })
    }
}

export const fetchPrivacyAndPolicy = ()=> async(dispatch)=>{
	try {
		dispatch({ type: FETCH_PRIVACY_AND_POLICY })
        const { data } = await axios.get(`${BASE_API_URL}/api/common/website/privacy-policy`);
        console.log("Privacy and Policy: ",data);
        dispatch({ type: FETCH_PRIVACY_AND_POLICY_SUCCESS, payload: data.result})
    } catch (error) {
        console.error("Error fetching privacy and policy: ",error);
        dispatch({ type: FETCH_PRIVACY_AND_POLICY_FAIL, payload: error.response.data.message })
    }
}
export const fetchFAQ = ()=> async(dispatch)=>{
	try {
		dispatch({ type: FETCH_FAQS })
        const { data } = await axios.get(`${BASE_API_URL}/api/common/website/faqs`);
        console.log("FAQs: ",data);
        dispatch({ type: FETCH_FAQS_SUCCESS, payload: data.result })
    } catch (error) {
        console.error("Error fetching FAQs: ",error);
        dispatch({ type: FETCH_FAQS_FAIL, payload: error.response.data.message })
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