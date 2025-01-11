import express from 'express';
import { createOrder, paymentVerification } from '../utilis/razerPayGatewayHelper.js';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
const route = express.Router();

route.post("/order",isAuthenticateuser, createOrder);
route.post("/paymentVerification",isAuthenticateuser, paymentVerification);
export default route;