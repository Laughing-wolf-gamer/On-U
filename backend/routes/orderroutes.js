import express from 'express';
import { createorder, createwishlist, getwishlist, addItemsToBag, getbag, updateqtybag, deletebag, deletewish, getOrderById, getallOrders, createPaymentOrder, verifyPayment } from "../controller/ordercontroller.js";
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.post('/orders/create_order',isAuthenticateuser, createorder)
route.post('/orders/createPaymentOrder',isAuthenticateuser,createPaymentOrder)
route.get('/orders/get_order/:orderId',isAuthenticateuser, getOrderById)
route.get('/orders/all',isAuthenticateuser,getallOrders)



route.post('/create_wishlist', createwishlist)
route.get('/get_wishlist/:id', getwishlist)



route.post('/create_bag',isAuthenticateuser, addItemsToBag)
route.get('/bag/:userId',isAuthenticateuser, getbag)
route.put('/update_bag',isAuthenticateuser, updateqtybag)
route.put('/removeBagItem',isAuthenticateuser, deletebag)



export default route;