import express from 'express';
import { createProduct, imagekits, getallproducts, SendSingleProduct, setRating, checkUserPurchasedProduct, getRandomProducts } from "../controller/productcontroller.js";
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.get('/get', imagekits)
route.get('/products', getallproducts)
route.get('/products/random',getRandomProducts)
route.put('/rating/:productId',isAuthenticateuser, setRating),
route.get('/rating/checkPurchases/:productId', isAuthenticateuser,checkUserPurchasedProduct)
route.get('/products/get/:id',SendSingleProduct)
export default route;