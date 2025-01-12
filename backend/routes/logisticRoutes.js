import express from 'express';
import { checkAvailability, createNewWareHouse, fetchAllWareHouses, fetchWareHouseById, removeWareHouseById, updateOrderStatusFromShipRokcet } from '../controller/LogisticsControllers/shiprocketWeebhooksControler.js';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import ProtectAdminRoute from '../Middelwares/adminProtectRoute.js';

const route = express.Router();
route.post('/weebook/updateOrderStatus',updateOrderStatusFromShipRokcet)
route.post('/warehouse/create',isAuthenticateuser,ProtectAdminRoute,createNewWareHouse)
route.get('/warehouse',isAuthenticateuser,ProtectAdminRoute,fetchAllWareHouses);
route.get('/warehouse/:warehouseId',isAuthenticateuser,ProtectAdminRoute,fetchWareHouseById)
route.delete('/warehouse/:warehouseId',isAuthenticateuser,ProtectAdminRoute,removeWareHouseById)


route.get('/logistic/checkAvailability/:pincode/:productId',checkAvailability)
export default route