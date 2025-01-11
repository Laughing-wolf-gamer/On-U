import express from 'express';
import { updateOrderStatusFromShipRokcet } from '../controller/LogisticsControllers/shiprocketWeebhooksControler.js';

const route = express.Router();
route.post('/weebook/updateOrderStatus',updateOrderStatusFromShipRokcet)
export default route