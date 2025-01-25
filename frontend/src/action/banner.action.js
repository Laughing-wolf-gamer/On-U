import axios from 'axios'
import {
    REQUEST_FEATCH_BANNERS,
    SUCCESS_FEATCH_BANNERS,
    FAIL_FEATCH_BANNERS,
    CLEAR_ERRORS
} from '../const/bannerconst'
import { BASE_API_URL } from '../config'

export const featchallbanners = () => async (dispatch) => {
    try {

        dispatch({ type: REQUEST_FEATCH_BANNERS })
        console.log("Fetching Banners...");
        // const config = { headers: { "Content-Type": "application/json" } }
        const res = await axios.get(`${BASE_API_URL}/api/common/fetch/all`)
        const data = res?.data;
        console.log("Fetch Banners Response: ",data);
        dispatch({ type: SUCCESS_FEATCH_BANNERS, payload: data?.result || []})
    } catch (error) {
        dispatch({ type: FAIL_FEATCH_BANNERS, payload: error?.response?.data?.message || "Failed Fetching Banners" })
    }
}



export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}