import { BASE_API_URL, headerConfig } from '../config'
import {
    REQUEST_PRODUCTS,
    SUCCESS_PRODUCTS,
    FAIL_PRODUCTS,
    REQUEST_SINGLE_PRODUCTS,
    SUCCESS_SINGLE_PRODUCTS,
    FAIL_SINGLE_PRODUCTS,
    CLEAR_ERRORS,
    REQUEST_OPTIONS,
    SUCCESS_OPTIONS,
    FAIL_OPTIONS,
    SUCCESS_RANDOM_PRODUCT,
    FAIL_RANDOM_PRODUCT,
    REQUEST_RANDOM_PRODUCT
} from '../const/productconst'
import axios from 'axios'

export const Allproduct = (e=1) => async (dispatch) => {
    let url = window.location.href
   
    try {
        dispatch({ type: REQUEST_PRODUCTS })
        let link = url.includes('?') ? `?${url.split("?")[1]}&width=${window.screen.width}&page=${e}` : `?width=${window.screen.width}&page=${e}`
        //let link1 = link ? link +=  `&width=${window.screen.width}`;
        // const { data } = await axios.get(`http://localhost:8000/api/shop/products${link}`)
        const res = await axios.get(`${BASE_API_URL}/api/shop/products${link}`)
        // console.log("products: ", res.data);
        const data = res.data;
        dispatch({ type: SUCCESS_PRODUCTS, payload: data?.products, pro:data?.pro, length:data?.length })
    } catch (error) {
        dispatch({ type: FAIL_PRODUCTS, payload: error.response?.data?.message })
    }
}

export const getRandomArrayOfProducts = ()=>async(dispatch)=>{
    try {
        dispatch({ type: REQUEST_RANDOM_PRODUCT })
        const res = await axios.get(`${BASE_API_URL}/api/shop/products/random`)
        console.log("Random products: ", res.data);
        const data = res.data;
        dispatch({ type: SUCCESS_RANDOM_PRODUCT, payload: data?.result})
    } catch (error) {
        dispatch({ type: FAIL_RANDOM_PRODUCT, payload: error.response?.data?.message })
    }
}

export const singleProduct = (id) => async (dispatch) => {

    try {
        dispatch({ type: REQUEST_SINGLE_PRODUCTS })

        // const { data } = await axios.get(`/api/v1/products/${id}`)
        const res = await axios.get(`${BASE_API_URL}/api/shop/products/get/${id}`)
        const data = res?.data;
        console.log("Single Product: ", res);
        dispatch({ type: SUCCESS_SINGLE_PRODUCTS, payload: data?.product, similar: data?.similar_product})

    } catch (error) {

        dispatch({ type: FAIL_SINGLE_PRODUCTS, payload: error.response?.data?.message })
    }
}
export const fetchAllOptions = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_OPTIONS })
        // const { data } = await axios.get(`/api/v1/options`)
        const res = await axios.get(`${BASE_API_URL}/api/common/options/get/all`);
        const data = res?.data;
        console.log("Options: ", data.result);
        dispatch({ type: SUCCESS_OPTIONS, payload: data?.result })
    } catch (error) {
        dispatch({ type: FAIL_OPTIONS, payload: error.response?.data?.message })
    }
}
export const getOptionsByType = ({type}) => async () => {
    try {
        // dispatch({ type: REQUEST_OPTIONS })
        // const { data } = await axios.get(`/api/v1/options`)
        const res = await axios.get(`${BASE_API_URL}/api/common/options/getByType/${type}`);
        const data = res?.data;
        console.log("Single Options: ", data.result);
        return data.result || null;
        // dispatch({ type: SUCCESS_OPTIONS, payload: data?.result })
    } catch (error) {
        // dispatch({ type: FAIL_OPTIONS, payload: error.response?.data?.message })
        return null;
    }
}
export const postRating = ({productId,ratingData})=> async()=>{
    try {
        console.log("Post Rating: ",productId,ratingData)
        const res = await axios.put(`${BASE_API_URL}/api/shop/rating/${productId}`,ratingData,headerConfig());
        return res.data;
    } catch (error) {
        console.error("Failed to post: ",error);
        return null;
    }
}
export const checkPurchasesProductToRate = ({productId}) => async()=>{
    try {

        const res = await axios.get(`${BASE_API_URL}/api/shop/rating/checkPurchases/${productId}`,headerConfig());
        console.log("Check: ",res.data)
        return res.data;
    } catch (error) {
        console.error("Failed to check",error);
        return false;
    }
}
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}