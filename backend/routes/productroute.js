import express from 'express';
import { createProduct, imagekits, getallproducts, SendSingleProduct } from "../controller/productcontroller.js";
const route = express.Router();

route.get('/get', imagekits)
route.get('/products', getallproducts)
route.get('/products/get/:id',SendSingleProduct)

export default route;