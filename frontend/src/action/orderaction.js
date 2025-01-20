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

export const createwishlist = ({productId}) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_CREATE_WISHLIST })
        const res = await axios.post(`${BASE_API_URL}/api/shop/create_wishlist`,{productId}, headerConfig());
        // console.log("Wishlist created: ",res?.data);
        dispatch({ type: SUCCESS_CREATE_WISHLIST, payload: res.data.success})
    } catch (error) {
        dispatch({ type: FAIL_CREATE_WISHLIST, payload: error.response.data.message })
    }
}
export const createAndSendProductsArrayWishList = (productIdArray) => async()=>{
    try {
        const res = await axios.post(`${BASE_API_URL}/api/shop/create_wishlist_array`,{productIdArray}, headerConfig());
        console.log("Wishlist created: ",res?.data);
        return res?.data;
        // dispatch({ type: SUCCESS_CREATE_WISHLIST, payload: res.data.success})
    } catch (error) {
        // dispatch({ type: FAIL_CREATE_WISHLIST, payload: error.response.data.message })
        return error?.response?.data;
    }
}


export const getwishlist = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_GET_WISHLIST })
        const { data } = await axios.get(`${BASE_API_URL}/api/shop/get_wishlist`,headerConfig())
        dispatch({ type: SUCCESS_GET_WISHLIST, payload: data.wishlist})
    } catch (error) {
        dispatch({ type: FAIL_GET_WISHLIST, payload: error?.response?.data?.message })
    }
}
export const addItemArrayBag = (options) => async()=>{
    // console.log("Bag Items Array",options)
    try {
        const token = sessionStorage.getItem('token');
        const { data } = await axios.post(`${BASE_API_URL}/api/shop/bag/addItemArrayBag`,options, {
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        })
        // console.log("successfully: ",data);
        // dispatch({ type: SUCCESS_CREATE_BAG, payload: data?.success,})
        return data;

    } catch (error) {
        return error?.response?.data?.success;
        // dispatch({ type: FAIL_CREATE_BAG, payload: error?.response?.data?.message })

    }
}
export const createbag = (option) => async (dispatch) => {
    console.log(option)
    try {
        const token = sessionStorage.getItem('token');
        // console.log(token);
        // console.log(option)
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
export const applyCouponToBag = ({bagId,couponCode}) => async()=>{
    try {
        console.log("applyCoupon: ", bagId, couponCode);
        const res = await axios.put(`${BASE_API_URL}/api/shop/bag/applyCoupon/${bagId}`,{couponCode},headerConfig())
        console.log("applyCoupon: ", res.data);
    } catch (error) {
        console.error("Error applying coupon: ",error);
    }
}
export const removeCouponFromBag = ({bagId,couponCode}) => async()=>{
    try {
        console.log("remove Coupon: ", bagId, couponCode);
        const res = await axios.patch(`${BASE_API_URL}/api/shop/bag/applyCoupon/${bagId}`,{couponCode},headerConfig())
        console.log("Remove Coupon: ", res.data);
    } catch (error) {
        console.error("Error applying coupon: ",error);
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
        dispatch({ type: REQUEST_UPDATE_QTY_BAG })
        const token = sessionStorage.getItem('token');
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

export const deleteBag = (deletingProductData) => async (dispatch) => {
    try {
        const token = sessionStorage.getItem('token');
        dispatch({ type: SUCCESS_DELETE_BAG })
        const res = await axios.put(`${BASE_API_URL}/api/shop/removeBagItem`,deletingProductData,headerConfig());
        console.log("Delete Bag: ",res)
        dispatch({ type: REQUEST_DELETE_BAG, payload: res?.data?.success || false})
    } catch (error) {
        dispatch({ type: FAIL_DELETE_BAG, payload: error?.response?.data?.message || "Failed To Delete BAg" })
    }
}

export const deletewish = ({deletingProductId}) => async (dispatch) => {
    try {
        console.log("Deleting WishList...",deletingProductId)
        dispatch({ type: SUCCESS_DELETE_WISH })
        const { data } = await axios.put(`${BASE_API_URL}/api/shop/delete_wishlist`,{deletingProductId}, headerConfig());
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
export const createPaymentOrder = (orderdata) => async (dispatch) => {
    try {
        // const token = sessionStorage.getItem('token');
        console.log("Payment Order Data: ",orderdata);
        const res = await axios.post(`${BASE_API_URL}/api/payment/create_cashFreeOrder`, orderdata, headerConfig())
        console.log("Payment Order Data: ",res.data)
        return res.data;
    } catch (error) {
        console.error("Error: ",error);
        return null;
        // dispatch({ type: FAIL_CREATE_ORDER, payload: error.response.data.message })

    }
}
export const verifyingOrder = (orderdata) => async (dispatch) => {
    try {
        // const token = sessionStorage.getItem('token');
        console.log("Payment Order Data: ",orderdata);
        const res = await axios.post(`${BASE_API_URL}/api/payment/verify_payment`, orderdata, headerConfig())
        console.log("Payment Order Data: ",res.data)
        return res.data;
    } catch (error) {
        console.error("Error: ",error);
        return null;
        // dispatch({ type: FAIL_CREATE_ORDER, payload: error.response.data.message })

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