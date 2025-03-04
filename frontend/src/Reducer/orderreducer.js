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

export const create_wishlist_reducer = (state = {wishlist:[]}, action) =>{
    switch (action.type) {
        case REQUEST_CREATE_WISHLIST:
            return {
                loading: true,
            };
        case SUCCESS_CREATE_WISHLIST:
            return {
                loading: false,
                wishlist:action.payload || [],
            };
        case FAIL_CREATE_WISHLIST:
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

export const get_wishlist_reducer = (state = {wishlist:[]}, action) =>{
    switch (action.type) {
        case REQUEST_GET_WISHLIST:
            return {
                loading: true,
            };
        case SUCCESS_GET_WISHLIST:
            return {
                loading: false,
                wishlist:action.payload || [],
            };
        case FAIL_GET_WISHLIST:
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

export const create_bag_reducer = (state = {bag:{}}, action) =>{
    switch (action.type) {
        case REQUEST_CREATE_BAG:
            return {
                loading: true,
            };
        case SUCCESS_CREATE_BAG:
            return {
                loading: false,
                bag:action.payload,
            };
        case FAIL_CREATE_BAG:
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

export const get_bag_reducer = (state = {bag:null}, action) =>{
    switch (action.type) {
        case REQUEST_GET_BAG:
            return {
                loading: true,
            };
        case SUCCESS_GET_BAG:
            return {
                loading: false,
                bag:action.payload,
            };
        case FAIL_GET_BAG:
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

export const update_qty_bag_reducer = (state = {updatebag:{}}, action) =>{
    switch (action.type) {
        case REQUEST_UPDATE_QTY_BAG:
            return {
                loading: true,
            };
        case SUCCESS_UPDATE_QTY_BAG:
            return {
                loading: false,
                updatebag:action.payload,
            };
        case FAIL_UPDATE_QTY_BAG:
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

export const delete_bag_reducer = (state = {deleteBagResult:false}, action) =>{
    switch (action.type) {
        case SUCCESS_DELETE_BAG:
            return {
                loading: true,
            };
        case REQUEST_DELETE_BAG:
            return {
                loading: false,
                deleteBagResult:action.payload,
            };
        case FAIL_DELETE_BAG:
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


export const create_order_reducer = (state = {order:{}}, action) =>{
    switch (action.type) {
        case REQUEST_CREATE_ORDER:
            return {
                loading: true,
            };
        case SUCCESS_CREATE_ORDER:
            return {
                loading: false,
                order:action.payload,
            };
        case FAIL_CREATE_ORDER:
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
export const get_all_order_reducer = (state = {allorder:[]}, action) =>{
    switch (action.type) {
        case REQUEST_GET_ALL_ORDER:
            return {
                loading: true,
            };
        case SUCCESS_GET_ALL_ORDER:
            return {
                loading: false,
                allorder:action.payload || [],
            };
        case FAIL_GET_ALL_ORDER:
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
export const get_order_by_id_reducer = (state = {orderbyid:null}, action) =>{
    switch (action.type) {
        case REQUEST_GET_ORDER:
            return {
                loading: true,
            };
        case SUCCESS_GET_ORDER:
            return {
                loading: false,
                orderbyid:action.payload || null,
            };
        case FAIL_GET_ORDER:
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

export const delete_wish_reducer = (state = {deletewish:{}}, action) =>{
    switch (action.type) {
        case SUCCESS_DELETE_WISH:
            return {
                loading: true,
            };
        case REQUEST_DELETE_WISH:
            return {
                loading: false,
                deletewish:action.payload,
            };
        case FAIL_DELETE_WISH:
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