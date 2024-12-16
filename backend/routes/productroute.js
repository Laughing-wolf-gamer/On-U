import express from 'express';
import { createProduct, imagekits, getallproducts, SendSingleProduct } from "../controller/productcontroller.js";
const route = express.Router();

// route.post('/create_product', createProduct)
route.get('/get', imagekits)
route.get('/products', getallproducts)
route.get('/products/get/:id',SendSingleProduct)

// module.exports = route
export default route;