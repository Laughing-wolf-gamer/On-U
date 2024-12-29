import axios from 'axios'
import {
    REQUEST_CREATE_WISHLIST,
    SUCCESS_CREATE_WISHLIST,
    FAIL_CREATE_WISHLIST,
    REQUEST_GET_WISHLIST,
    SUCCESS_GET_WISHLIST,
    FAIL_GET_WISHLIST,
    REQUEST_CREATE_BAG,
    SUCCESS_CREATE_BAG,
    FAIL_CREATE_BAG,
    REQUEST_GET_BAG,
    SUCCESS_GET_BAG,
    FAIL_GET_BAG,
    SUCCESS_UPDATE_QTY_BAG,
    REQUEST_UPDATE_QTY_BAG,
    FAIL_UPDATE_QTY_BAG,
    SUCCESS_DELETE_BAG,
    REQUEST_DELETE_BAG,
    FAIL_DELETE_BAG,
    SUCCESS_DELETE_WISH,
    REQUEST_DELETE_WISH,
    FAIL_DELETE_WISH,
    CLEAR_ERRORS,
    REQUEST_CREATE_ORDER,
    SUCCESS_CREATE_ORDER,
    FAIL_CREATE_ORDER,
    REQUEST_GET_ORDER,
    SUCCESS_GET_ORDER,
    FAIL_GET_ORDER,
    REQUEST_GET_ALL_ORDER,
    SUCCESS_GET_ALL_ORDER,
    FAIL_GET_ALL_ORDER
} from '../const/orderconst'
import { BASE_API_URL, headerConfig } from '../config'

export const createwishlist = (option) => async (dispatch) => {
    console.log(option)
    try {

        dispatch({ type: REQUEST_CREATE_WISHLIST })
        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post(`${BASE_API_URL}/api/create_wishlist`, option, config)

        dispatch({ type: SUCCESS_CREATE_WISHLIST, payload: data.success,})

    } catch (error) {

        dispatch({ type: FAIL_CREATE_WISHLIST, payload: error.response.data.message })

    }
}

export const getwishlist = (userid) => async (dispatch) => {

    try {
        dispatch({ type: REQUEST_GET_WISHLIST })
        const { data } = await axios.get(`${BASE_API_URL}/api/get_wishlist/${userid}`)
        dispatch({ type: SUCCESS_GET_WISHLIST, payload: data.wishlist,})
    } catch (error) {
        dispatch({ type: FAIL_GET_WISHLIST, payload: error.response.data.message })
    }
}

export const createbag = (option) => async (dispatch) => {
    console.log(option)
    try {
        const token = sessionStorage.getItem('token');
        // console.log(token);
        console.log(option)
        dispatch({ type: REQUEST_CREATE_BAG })
        const { data } = await axios.post(`${BASE_API_URL}/api/shop/create_bag`,option, {
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        })

        dispatch({ type: SUCCESS_CREATE_BAG, payload: data?.success,})

    } catch (error) {

        dispatch({ type: FAIL_CREATE_BAG, payload: error?.response?.data?.message })

    }
}

export const getbag = ({userId}) => async (dispatch) => {

    try {
        const token = sessionStorage.getItem('token');
        dispatch({ type: REQUEST_GET_BAG })
        // console.log("Asking Bag: ",userId);
        const res = await axios.get(`${BASE_API_URL}/api/shop/bag/${userId}`,{
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        });
        // console.log("Bag Data: ",res.data);
        dispatch({ type: SUCCESS_GET_BAG, payload: res.data.bag,})
    } catch (error) {
        console.error("error: ",error);
        dispatch({ type: FAIL_GET_BAG, payload: error.message})
    }
}

export const getqtyupdate = (qtydata) => async (dispatch) => {

    try {
        const token = sessionStorage.getItem('token');
        dispatch({ type: REQUEST_UPDATE_QTY_BAG })
        // const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.put(`${BASE_API_URL}/api/shop/update_bag`,qtydata, {
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        });
        console.log("Update Bag: ",data)
        dispatch({ type: SUCCESS_UPDATE_QTY_BAG, payload: data.success,})
    } catch (error) {
        dispatch({ type: FAIL_UPDATE_QTY_BAG, payload: error.response.data.message })
    }
}

export const deletebag = (fdata) => async (dispatch) => {

    try {
        const token = sessionStorage.getItem('token');
        dispatch({ type: SUCCESS_DELETE_BAG })
        // const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.put(`${BASE_API_URL}api/shop/delete_bag`,fdata,{
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        });
        dispatch({ type: REQUEST_DELETE_BAG, payload: data.success,})
    } catch (error) {
        dispatch({ type: FAIL_DELETE_BAG, payload: error.response.data.message })
    }
}

export const deletewish = (fdata) => async (dispatch) => {

    try {
        dispatch({ type: SUCCESS_DELETE_WISH })
        const config = { headers: { "Content-Type": "application/json" } }
        const { data } = await axios.put(`${BASE_API_URL}/api/delete_wish`,fdata, config )
        dispatch({ type: REQUEST_DELETE_WISH, payload: data.success,})
    } catch (error) {
        dispatch({ type: FAIL_DELETE_WISH, payload: error.response.data.message })
    }
}




export const create_order = (orderdata) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_CREATE_ORDER })
        // const token = sessionStorage.getItem('token');
        console.log("Order Data: ",orderdata);
        const { data } = await axios.post(`${BASE_API_URL}/api/shop/orders/create_order`, orderdata, headerConfig())
        console.log("Order Data: ",data)
        dispatch({ type: SUCCESS_CREATE_ORDER, payload: data.result})

    } catch (error) {

        dispatch({ type: FAIL_CREATE_ORDER, payload: error.response.data.message })

    }
}
export const fetchAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_GET_ALL_ORDER })
        const { data } = await axios.get(`${BASE_API_URL}/api/shop/orders/all`, headerConfig())
        console.log("Orders: ",data);
        dispatch({ type: SUCCESS_GET_ALL_ORDER, payload: data.result})
    } catch (error) {
        dispatch({ type: FAIL_GET_ALL_ORDER, payload: error.response.data.message })
    }
}
export const fetchOrderById = (id) => async (dispatch) => {
    try {
        // console.log("Fetch Order:  ",headerConfig());
        
        dispatch({ type: REQUEST_GET_ORDER })
        const { data } = await axios.get(`${BASE_API_URL}/api/shop/orders/get_order/${id}`, headerConfig())
        // console.log("Order: ",data);
        dispatch({ type: SUCCESS_GET_ORDER, payload: data.result})
    } catch (error) {
        dispatch({ type: FAIL_GET_ORDER, payload: error.response.data.message })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}