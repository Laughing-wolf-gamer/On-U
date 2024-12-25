import express from 'express';
import { createorder, createwishlist, getwishlist, addItemsToBag, getbag, updateqtybag, deletebag, deletewish } from "../controller/ordercontroller.js";
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.post('/create_order', createorder)
route.post('/create_wishlist', createwishlist)
route.get('/get_wishlist/:id', getwishlist)
route.post('/create_bag',isAuthenticateuser, addItemsToBag)
route.get('/bag/:id',isAuthenticateuser, getbag)
route.put('/update_bag',isAuthenticateuser, updateqtybag)
route.put('/delete_bag',isAuthenticateuser, deletebag)
route.put('/delete_wish',isAuthenticateuser, deletewish)

export default route;