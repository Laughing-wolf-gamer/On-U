import { BASE_API_URL, headerConfig } from '../config'
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
    CLEAR_ERRORS,
    REGISTER_USER_DATA,
    SUCCESS_REGISTER_USER,
    FAIL_REGISTER_USER,
    LOGIN_USER_DATA,
    SUCCESS_LOGIN_USER,
    FAIL_LOGIN_USER,
    REQUEST_UPDATE_ADDRESS,
    SUCCESS_UPDATE_ADDRESS,
    FAIL_UPDATE_ADDRESS,
    REQUEST_ALL_ADDRESS,
    FAIL_ALL_ADDRESS,
    SUCCESS_ALL_ADDRESS
} from '../const/userconst'
import axios from 'axios'

export const loginmobile = ({phonenumber}) => async (dispatch) => {
    try {
        console.log("logIn Data: ", phonenumber)
        dispatch({ type: LOGIN_USER_DATA })
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/loginmobile`, {phonenumber})
        const token = data?.result?.token
        sessionStorage.setItem('token', token)
        dispatch({ type: SUCCESS_LOGIN_USER, payload: data?.result, message: data?.message })
    } catch (error) {
        dispatch({ type: FAIL_LOGIN_USER, payload: error.response?.data?.message })
    }
}
export const registerUser = (userData) => async (dispatch) => {
    try {
        console.log("registermobile Data: ", userData)
        dispatch({ type: REGISTER_USER_DATA })
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/registermobile`, userData)
        dispatch({ type: SUCCESS_REGISTER_USER, payload: data?.result, message: data?.message })
    } catch (error) {
        dispatch({ type: FAIL_REGISTER_USER, payload: null ,message: "Error Occurred"})
    }
}

export const getuser = () => async (dispatch) => {
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        dispatch({ type: REQUEST_USER })
        if(!token){
            dispatch({ type: FAIL_USER, payload: null})
            return;
        }
        const { data } = await axios.get(`${BASE_API_URL}/api/auth/check-auth`,{
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        })
        console.log("Check-Auth Data: ", data)
        dispatch({ type: SUCCESS_USER, payload: data.user })
    } catch (error) {
        dispatch({ type: FAIL_USER, payload: error.response?.data?.message })
    }
}
export const updateAddress = (address) => async (dispatch) => {
    try {
        const token = sessionStorage.getItem('token');
        console.log("Address Data: ", address)
        dispatch({ type: REQUEST_UPDATE_ADDRESS })
        const { data } = await axios.put(`${BASE_API_URL}/api/auth/updateAddress`,address,{
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        })
        console.log("Updated Data: ", data)
        dispatch({ type: SUCCESS_UPDATE_ADDRESS, payload: data.success })
    } catch (error) {
        dispatch({ type: FAIL_UPDATE_ADDRESS, payload: error.message })
    }
}
export const removeAddress = (addressIndex) => async (dispatch) => {
    try {
        // const token = sessionStorage.getItem('token');
        console.log("Address Index: ", addressIndex)
        dispatch({ type: REQUEST_UPDATE_ADDRESS })
        const { data } = await axios.patch(`${BASE_API_URL}/api/auth/removeAddress`,{addressId:addressIndex},headerConfig())
        console.log("Updated Data: ", data)
        dispatch({ type: SUCCESS_UPDATE_ADDRESS, payload: data.success })
    } catch (error) {
        dispatch({ type: FAIL_UPDATE_ADDRESS, payload: error.message })
    }
}
export const getAddress = () => async (dispatch) => {
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        dispatch({ type: REQUEST_ALL_ADDRESS })
        if(!token){
            dispatch({ type: FAIL_ALL_ADDRESS, payload: null})
            return;
        }
        const { data } = await axios.get(`${BASE_API_URL}/api/auth/getAddress`,headerConfig())
        dispatch({ type: SUCCESS_ALL_ADDRESS, payload: data.allAddresses})
    } catch (error) {
        dispatch({ type: FAIL_ALL_ADDRESS, payload: error.response?.data?.message })
    }
}

export const otpverifie = ({otp,mobileno}) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_VERIFY_OTP })
        console.log("Otp: ",otp, "MobileNo. ",mobileno)
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/otpverify/${mobileno}/${otp}`)
        console.log("Data: ", data)
        if(data.result.verify === 'verified'){
            const token = data?.token
            console.log("Token: ", token)
            if(token){
                sessionStorage.setItem('token', token)
            }
        }
        dispatch({ type: SUCCESS_VERIFY_OTP, payload: data?.result })
    } catch (Error) {
        dispatch({ type: FAIL_VERIFY_OTP, payload: Error.response.data.message })
    }
}

export const resendotp = () => async (dispatch) => {

    /* try {

        dispatch({ type: REQUEST_RESEND_OTP })
        // const mobile = JSON.parse(localStorage.getItem('mobileno'))
        // const mobileno = Number(mobile.phonenumber)

        const { data } = await axios.get(`${BASE_API_URL}/api/auth/resendotp/${mobileno}`)

        dispatch({ type: SUCCESS_RESEND_OTP, payload: data.success })

    } catch (Error) {
    
        dispatch({ type: FAIL_RESEND_OTP, payload: Error.response.data.message })

    } */
}

export const updateuser = (userdata) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_UPDATE_USER })
        // console.log("Update User Data: ", userdata)
        // const mobile = JSON.parse(localStorage.getItem('mobileno'))
        // const mobileno = Number(mobile.phonenumber)
        // const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.put(`${BASE_API_URL}/api/auth/updateuser`, userdata,headerConfig())
        console.log("Update User Data: ", data.result)
        if(data.token){
            const token = data?.token
            console.log("Token: ", token)
            sessionStorage.removeItem('token');
            sessionStorage.setItem('token', data.token)

        }
        dispatch({ type: SUCCESS_UPDATE_USER, payload: data.result })

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

        const { data } = await axios.get(`${BASE_API_URL}/api/auth/user/logout` )
        sessionStorage.clear();
        dispatch({ type: SUCCESS_LOGOUT, payload: null })

    } catch (Error) {
    
        dispatch({ type: FAIL_LOGOUT, payload: Error.response.data.message })

    }
}




export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}