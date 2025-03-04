import express from 'express';
import { addHomeCarousal, 
    addHomeCarousalMultiple, 
    addOption, 
    createContactQuery, 
    FetchAllFilters, 
    getAboutData, 
    getAddressField, 
    getAllOptions, 
    getContactQuery, 
    getContactUsPageData, 
    getConvenienceFees, 
    getHomeBanners, 
    getOptions, 
    getPrivacyAndPolicy, 
    getTermsAndConditions,
    patchConvenienceOptions, 
    removeAddressFormField, 
    removeHomeCarousal, 
    removeOptionsByType, 
    sendMailToGetCoupon, 
    setAboutData, 
    setAddressField, 
    setContactUsePageData, 
    setPrivacyPolicy, 
    setTermsAndConditions
} from '../../controller/commonControllers/common.controller.js';

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

route.put('/website/terms-and-conditions',isAuthenticateuser,ProtectAdminRoute,setTermsAndConditions)
route.get('/website/terms-and-conditions',isAuthenticateuser,ProtectAdminRoute,getTermsAndConditions)

route.put('/website/privacy-and-policy',isAuthenticateuser,ProtectAdminRoute,setPrivacyPolicy)
route.get('/website/privacy-and-policy',isAuthenticateuser,ProtectAdminRoute,getPrivacyAndPolicy)


route.post('/website/send-contact-query',createContactQuery)
route.get('/website/get-contact-query',getContactQuery)
route.put('/website/address',isAuthenticateuser,ProtectAdminRoute,setAddressField);
route.patch('/website/address/remove',isAuthenticateuser,ProtectAdminRoute,removeAddressFormField);
route.get('/website/address',getAddressField);



route.get('/options/get/all',getAllOptions)
route.get('/options/getByType/:type', getOptions);

// Route to add a new option
route.post('/options/add',isAuthenticateuser,ProtectAdminRoute, addOption);

// Route to delete an option
route.post('/options/removeByType',isAuthenticateuser,ProtectAdminRoute,removeOptionsByType);

route.post('/coupons/sendCoupon',sendMailToGetCoupon)
export default route