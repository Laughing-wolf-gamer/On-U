import express from 'express';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import { 
    createorder, 
    createwishlist, 
    getwishlist, 
    addItemsToBag, 
    getbag, 
    updateqtybag, 
    deletebag, 
    deletewish, 
    getOrderById, 
    getallOrders, 
    createPaymentOrder, 
    verifyPayment, 
    applyCouponToBag, 
    removeCouponToBag, 
    addItemsArrayToBag, 
    addItemsArrayToWishList, 
	updateItemCheckedInBag
} from "../controller/ordercontroller.js";


const route = express.Router();

route.post('/orders/create_order',isAuthenticateuser, createorder)
route.post('/orders/create_cashFreeOrder',isAuthenticateuser,createPaymentOrder)
route.get('/orders/get_order/:orderId',isAuthenticateuser, getOrderById)
route.get('/orders/all',isAuthenticateuser,getallOrders)



route.post('/create_wishlist',isAuthenticateuser, createwishlist)
route.post('/create_wishlist_array',isAuthenticateuser, addItemsArrayToWishList)
route.get('/get_wishlist',isAuthenticateuser, getwishlist)
route.put('/delete_wishlist',isAuthenticateuser,deletewish)





/// bag routes...
route.post('/bag/create_bag',isAuthenticateuser, addItemsToBag)// creating a bag

route.post('/bag/addItemArrayBag',isAuthenticateuser,addItemsArrayToBag) // get set Local saved Items in bag 

route.put('/bag/applyCoupon/:bagId',isAuthenticateuser,applyCouponToBag);

route.patch('/bag/removeCoupon/:bagId',isAuthenticateuser,removeCouponToBag);

route.get('/bag/:userId',isAuthenticateuser, getbag)
route.put('/bag/update_bag',isAuthenticateuser, updateqtybag)
route.put('/bag/update_bagItemChecked',isAuthenticateuser, updateItemCheckedInBag)
route.put('/bag/removeBagItem',isAuthenticateuser, deletebag)








export default route;