import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { 
  registeruser, 
  getuser, 
  resendotp, 
  updateuser, 
  otpverifie, 
  updatedetailsuserreducer, 
  loginuser, 
  addressupdate, 
  getAddress 
} from './Reducer/userreducer';
import { allOptions, Allproducts, randomProducts, singleProduct } from './Reducer/productreducer';
import { 
  create_bag_reducer, 
  create_order_reducer, 
  create_wishlist_reducer, 
  delete_bag_reducer, 
  delete_wish_reducer, 
  get_all_order_reducer, 
  get_bag_reducer, 
  get_order_by_id_reducer, 
  get_wishlist_reducer, 
  update_qty_bag_reducer 
} from './Reducer/orderreducer';
import { fetch_banners_reducer } from './Reducer/bannerreducer';
import { fetch_All_Options, fetch_form_banners } from './Reducer/common.reducer';
import { thunk } from 'redux-thunk';

const reducer = combineReducers({
  Registeruser: registeruser,
  loginuser: loginuser,
  user: getuser,
  updateAddress: addressupdate,
  resendotp: resendotp,
  updateuser: updateuser,
  userdetails: otpverifie,
  Allproducts: Allproducts,
  AllOptions: allOptions,
  Sproduct: singleProduct,
  getAllAddress: getAddress,
  banners: fetch_banners_reducer,
  wishlist: create_wishlist_reducer,
  wishlist_data: get_wishlist_reducer,
  bag: create_bag_reducer,
  bag_data: get_bag_reducer,
  update_bag: update_qty_bag_reducer,
  updateuser2: updatedetailsuserreducer,
  deletebagReducer: delete_bag_reducer,
  deletewish: delete_wish_reducer,
  createOrder: create_order_reducer,
  getOrderById: get_order_by_id_reducer,
  getallOrders: get_all_order_reducer,
  RandomProducts: randomProducts,
  fetchFormBanners: fetch_form_banners,
  allOptions: fetch_All_Options,
});

const initialState = {};

const middleware = [thunk];  // Use the named 'thunk' export

// Only enable DevTools in development mode
const store = createStore(
  reducer,
  initialState,
  process.env.REACT_APP_NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(...middleware))  // Enable DevTools if in development mode
    : applyMiddleware(...middleware)  // Apply middleware normally otherwise
);

export default store;
