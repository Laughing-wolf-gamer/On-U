import {
    REQUEST_FEATCH_BANNERS,
    SUCCESS_FEATCH_BANNERS,
    FAIL_FEATCH_BANNERS,
    CLEAR_ERRORS
} from '../const/bannerconst'

export const fetch_banners_reducer = (state = {banners:[]}, action) =>{
    switch (action.type) {
        case REQUEST_FEATCH_BANNERS:
            return {
                loading: true,
            };
        case SUCCESS_FEATCH_BANNERS:
            return {
                loading: false,
                banners:action.payload,
            };
        case FAIL_FEATCH_BANNERS:
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