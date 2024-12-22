import express from 'express';
import { addHomeCarousal, getHomeBanners, removeHomeCarousal } from '../../controller/commonControllers/common.controller.js';
import { isAuthenticateuser } from '../../Middelwares/authuser.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';

const route = express.Router();

route.post('/create/home',isAuthenticateuser,ProtectAdminRoute,addHomeCarousal)
route.get('/fetch/all/:CategoryType',getHomeBanners)
route.get('/fetch/all',getHomeBanners)
route.delete('/del/:id/:imageIndex',isAuthenticateuser,ProtectAdminRoute,removeHomeCarousal)
export default route