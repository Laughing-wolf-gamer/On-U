import express from 'express';
import { addHomeCarousal, addHomeCarousalMultiple, addOption, createContactQuery, editDisclaimers, FetchAllFilters, fetchCouponsByQuery, getAboutData, getAddressField, getAllOptions, getContactQuery, getContactUsPageData, getConvenienceFees, getHomeBanners, getOptions, getWebsiteDisclaimers, patchConvenienceOptions, removeAddressFormField, removeHomeCarousal, removeOptionsByType, removeWebsiteDisclaimers, sendMailToGetCoupon, setAboutData, setAddressField, setContactUsePageData, setWebsiteDisclaimers, updateColorName, updateIsActive } from '../../controller/commonControllers/common.controller.js';
import { isAuthenticateuser } from '../../Middelwares/authuser.js';
import ProtectAdminRoute from '../../Middelwares/adminProtectRoute.js';

const route = express.Router();

route.post('/create/home/carousal',isAuthenticateuser,ProtectAdminRoute,addHomeCarousal)
route.post('/create/home/carousal/multiple',isAuthenticateuser,ProtectAdminRoute,addHomeCarousalMultiple)
route.get('/fetch/all/:CategoryType',getHomeBanners)
route.get('/fetch/all',getHomeBanners)
route.delete('/del/:id/:imageIndex',isAuthenticateuser,ProtectAdminRoute,removeHomeCarousal)
route.get('/product/filters',FetchAllFilters);
route.put('/website/about',isAuthenticateuser,ProtectAdminRoute,setAboutData);
route.put('/website/convenienceFees',isAuthenticateuser,ProtectAdminRoute,patchConvenienceOptions)
route.get('/website/about',getAboutData);
route.get('/website/convenienceFees',getConvenienceFees)

route.put('/website/contact-us',isAuthenticateuser,ProtectAdminRoute,setContactUsePageData)
route.get('/website/contact-us',getContactUsPageData)



route.post('/website/send-contact-query',createContactQuery)
route.get('/website/get-contact-query',getContactQuery)
route.put('/website/address',isAuthenticateuser,ProtectAdminRoute,setAddressField);
route.patch('/website/address/remove',isAuthenticateuser,ProtectAdminRoute,removeAddressFormField);
route.get('/website/address',getAddressField);

route.put('/website/disclaimer',isAuthenticateuser,ProtectAdminRoute,setWebsiteDisclaimers);
route.patch('/website/disclaimer/edit/:disclaimersId',isAuthenticateuser,ProtectAdminRoute,editDisclaimers);
route.patch('/website/disclaimer/remove/:disclaimersId',isAuthenticateuser,ProtectAdminRoute,removeWebsiteDisclaimers);
route.get('/website/disclaimer',getWebsiteDisclaimers);

route.get('/options/get/all',getAllOptions)
route.get('/options/getByType/:type', getOptions);

// Route to add a new option
route.post('/options/add',isAuthenticateuser,ProtectAdminRoute, addOption);

// Route to delete an option
route.post('/options/removeByType',isAuthenticateuser,ProtectAdminRoute,removeOptionsByType);
route.post('/options/updateActiveState',isAuthenticateuser,ProtectAdminRoute,updateIsActive);
route.post('/options/updateColorName',isAuthenticateuser,ProtectAdminRoute,updateColorName);

route.post('/coupons/sendCoupon',sendMailToGetCoupon)



route.get('/coupons/all',fetchCouponsByQuery);
export default route