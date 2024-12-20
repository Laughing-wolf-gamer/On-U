import { BASE_API_URL } from '../config'
import {
    REQUEST_USER_NO,
    SUCCESS_USER_NO,
    FAIL_USER_NO,
    REQUEST_USER,
    SUCCESS_USER,
    FAIL_USER,
    REQUEST_VERIFY_OTP,
    SUCCESS_VERIFY_OTP,
    FAIL_VERIFY_OTP,
    REQUEST_RESEND_OTP,
    SUCCESS_RESEND_OTP,
    FAIL_RESEND_OTP,
    REQUEST_UPDATE_USER,
    SUCCESS_UPDATE_USER,
    FAIL_UPDATE_USER,
    SUCCESS_LOGOUT,
    FAIL_LOGOUT,
    REQUEST_UPDATE_DETAILS_USER,
    SUCCESS_UPDATE_DETAILS_USER,
    FAIL_UPDATE_DETAILS_USER,
    CLEAR_ERRORS
} from '../const/userconst'
import axios from 'axios'

export const registermobile = (userData) => async (dispatch) => {

    try {

        dispatch({ type: REQUEST_USER_NO })

        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/registermobile`, userData, config)
        
        dispatch({ type: SUCCESS_USER_NO, payload: data?.user, message: data?.message })

    } catch (error) {

        dispatch({ type: FAIL_USER_NO, payload: error.response?.data?.message })

    }
}

export const getuser = () => async (dispatch) => {

    try {

        dispatch({ type: REQUEST_USER })
        const mobile = JSON.parse(localStorage.getItem('mobileno'))
        const mobileno = Number(mobile.phonenumber)

        const { data } = await axios.get(`${BASE_API_URL}/api/auth/user/${mobileno}`)

        dispatch({ type: SUCCESS_USER, payload: data.user })

    } catch (error) {

        dispatch({ type: FAIL_USER, payload: error.response?.data?.message })

    }
}

export const otpverifie = (otp) => async (dispatch) => {

    try {

        dispatch({ type: REQUEST_VERIFY_OTP })
        const mobile = JSON.parse(localStorage.getItem('mobileno'))
        const mobileno = Number(mobile.phonenumber)


        const { data } = await axios.put(`${BASE_API_URL}/api/auth/otpverify/${mobileno}`, otp)
        console.log(data)

        dispatch({ type: SUCCESS_VERIFY_OTP, payload: data.user })

    } catch (Error) {
      
        dispatch({ type: FAIL_VERIFY_OTP, payload: Error.response.data.message })

    }
}

export const resendotp = () => async (dispatch) => {

    try {

        dispatch({ type: REQUEST_RESEND_OTP })
        const mobile = JSON.parse(localStorage.getItem('mobileno'))
        const mobileno = Number(mobile.phonenumber)

        const { data } = await axios.get(`${BASE_API_URL}/api/auth/resendotp/${mobileno}`)

        dispatch({ type: SUCCESS_RESEND_OTP, payload: data.success })

    } catch (Error) {
    
        dispatch({ type: FAIL_RESEND_OTP, payload: Error.response.data.message })

    }
}

export const updateuser = (userdata) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_UPDATE_USER })
        const mobile = JSON.parse(localStorage.getItem('mobileno'))
        const mobileno = Number(mobile.phonenumber)
        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.put(`${BASE_API_URL}/api/auth/updateuser/${mobileno}`, userdata,config )

        dispatch({ type: SUCCESS_UPDATE_USER, payload: data.user })

    } catch (Error) {
    
        dispatch({ type: FAIL_UPDATE_USER, payload: Error.response.data.message })

    }
}

export const updatedetailsuser = (userdata, id) => async (dispatch) => {
   
    try {

        dispatch({ type: REQUEST_UPDATE_DETAILS_USER })
        
        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.put(`${BASE_API_URL}/api/auth/user/${id}`, userdata,config )

        dispatch({ type: SUCCESS_UPDATE_DETAILS_USER, payload: data.success })

    } catch (Error) {
    
        dispatch({ type: FAIL_UPDATE_DETAILS_USER, payload: Error.response.data.message })

    }
}


export const logout = () => async (dispatch) => {
   
    try {
        console.log("logout")

        const { data } = await axios.get(`${BASE_API_URL}/api/v1/logout` )

        dispatch({ type: SUCCESS_LOGOUT, payload: data.success })

    } catch (Error) {
    
        dispatch({ type: FAIL_LOGOUT, payload: Error.response.data.message })

    }
}




export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}