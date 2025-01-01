import express from 'express';
import { addHomeCarousal, addOption, FetchAllFilters, getAboutData, getAddressField, getAllOptions, getHomeBanners, getOptions, removeAddressFormField, removeHomeCarousal, removeOptionsByType, setAboutData, setAddressField } from '../../controller/commonControllers/common.controller.js';
import { isAuthenticateuser } from '../../Middelwares/authuser.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';

const route = express.Router();

route.post('/create/home',isAuthenticateuser,ProtectAdminRoute,addHomeCarousal)
route.get('/fetch/all/:CategoryType',getHomeBanners)
route.get('/fetch/all',getHomeBanners)
route.delete('/del/:id/:imageIndex',isAuthenticateuser,ProtectAdminRoute,removeHomeCarousal)
route.get('/product/filters',FetchAllFilters);
route.put('/website/about',isAuthenticateuser,ProtectAdminRoute,setAboutData);
route.get('/website/about',getAboutData);

route.put('/website/address',isAuthenticateuser,ProtectAdminRoute,setAddressField);
route.patch('/website/address/remove',isAuthenticateuser,ProtectAdminRoute,removeAddressFormField);
route.get('/website/address',getAddressField);

route.get('/options/get/all',getAllOptions)
route.get('/options/getByType/:type', getOptions);

// Route to add a new option
route.post('/options/add',isAuthenticateuser,ProtectAdminRoute, addOption);

// Route to delete an option
route.post('/options/removeByType',isAuthenticateuser,ProtectAdminRoute,removeOptionsByType);
export default route