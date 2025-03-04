import {
    FETCH_ADDRESS_FORM,
    FETCH_ADDRESS_FORM_SUCCESS,
    FETCH_ADDRESS_FORM_FAIL,
    CLEAR_ERRORS,
    FETCH_ALL_OPTIONS_REQUEST,
    FETCH_ALL_OPTIONS_SUCCESS,
    FETCH_ALL_OPTIONS_FAIL
} from '../const/common.const'

export const fetch_form_banners = (state = {formData:[]}, action) =>{
    switch (action.type) {
        case FETCH_ADDRESS_FORM:
            return {
                loading: true,
            };
        case FETCH_ADDRESS_FORM_SUCCESS:
            return {
                loading: false,
                formData:action.payload,
            };
        case FETCH_ADDRESS_FORM_FAIL:
                return {
                    loading: false,
                    error:action.payload
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
        default:
            return state;
    }
}


export const fetch_All_Options = (state = {AllOptions:[]}, action) =>{
    switch (action.type) {
        case FETCH_ALL_OPTIONS_REQUEST:
            return {
                loading: true,
            };
        case FETCH_ALL_OPTIONS_SUCCESS:
            return {
                loading: false,
                AllOptions:action.payload,
            };
        case FETCH_ALL_OPTIONS_FAIL:
                return {
                    loading: false,
                    error:action.payload
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
        default:
            return state;
    }
}