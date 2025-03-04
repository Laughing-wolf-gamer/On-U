import express from 'express';
import { createorder, createwishlist, getwishlist, addItemsToBag, getbag, updateqtybag, deletebag, deletewish, getOrderById, getallOrders, createPaymentOrder, verifyPayment, applyCouponToBag, removeCouponToBag, addItemsArrayToBag, addItemsArrayToWishList } from "../controller/ordercontroller.js";
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.post('/orders/create_order',isAuthenticateuser, createorder)
route.post('/orders/create_cashFreeOrder',isAuthenticateuser,createPaymentOrder)
route.get('/orders/get_order/:orderId',isAuthenticateuser, getOrderById)
route.get('/orders/all',isAuthenticateuser,getallOrders)



route.post('/create_wishlist',isAuthenticateuser, createwishlist)
route.post('/create_wishlist_array',isAuthenticateuser, addItemsArrayToWishList)
route.get('/get_wishlist',isAuthenticateuser, getwishlist)
route.put('/delete_wishlist',isAuthenticateuser,deletewish)



route.post('/create_bag',isAuthenticateuser, addItemsToBag)
route.post('/bag/addItemArrayBag',isAuthenticateuser,addItemsArrayToBag)

route.put('/bag/applyCoupon/:bagId',isAuthenticateuser,applyCouponToBag);


route.patch('/bag/applyCoupon/:bagId',isAuthenticateuser,removeCouponToBag);
route.get('/bag/:userId',isAuthenticateuser, getbag)
route.put('/update_bag',isAuthenticateuser, updateqtybag)
route.put('/removeBagItem',isAuthenticateuser, deletebag)








export default route;