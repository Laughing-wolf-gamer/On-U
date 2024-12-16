import { BASE_URL } from '../config'
import {
    REQUEST_PRODUCTS,
    SUCCESS_PRODUCTS,
    FAIL_PRODUCTS,
    REQUEST_SINGLE_PRODUCTS,
    SUCCESS_SINGLE_PRODUCTS,
    FAIL_SINGLE_PRODUCTS,
    CLEAR_ERRORS
} from '../const/productconst'
import axios from 'axios'

export const Allproduct = (e=1) => async (dispatch) => {
    let url = window.location.href
   
    try {
        dispatch({ type: REQUEST_PRODUCTS })
        let link = url.includes('?') ? `?${url.split("?")[1]}&width=${window.screen.width}&page=${e}` : `?width=${window.screen.width}&page=${e}`
        //let link1 = link ? link +=  `&width=${window.screen.width}`;
        // const { data } = await axios.get(`http://localhost:8000/api/shop/products${link}`)
        const res = await axios.get(`${BASE_URL}/api/shop/products${link}`)
        console.log("products: ", res.data);
        const data = res.data;
        dispatch({ type: SUCCESS_PRODUCTS, payload: data?.products, pro:data?.pro, length:data?.length })
    } catch (error) {
        dispatch({ type: FAIL_PRODUCTS, payload: error.response?.data?.message })
    }
}

export const singleProduct = (id) => async (dispatch) => {

    try {
        dispatch({ type: REQUEST_SINGLE_PRODUCTS })

        // const { data } = await axios.get(`/api/v1/products/${id}`)
        const res = await axios.get(`${BASE_URL}/api/shop/products/get/${id}`)
        const data = res?.data;
        console.log("Single Product: ", res);
        dispatch({ type: SUCCESS_SINGLE_PRODUCTS, payload: data?.product, similar: data?.similar_product})

    } catch (error) {

        dispatch({ type: FAIL_SINGLE_PRODUCTS, payload: error.response?.data?.message })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}