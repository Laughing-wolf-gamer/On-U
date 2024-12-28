import express from 'express';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import { registerUser, getuser, optverify, resendotp, updateuser, logout, updateuserdetails, logInUser, registermobile, loginMobileNumber, updateAddress, getAllAddress, getAboutData } from '../controller/usercontroller.js';

const route = express.Router();
route.post('/register', registerUser)
route.post('/login', logInUser)
route.post('/registermobile',registermobile)
route.post('/loginmobile',loginMobileNumber)
route.get('/check-auth',isAuthenticateuser, getuser)
route.post('/otpverify/:id/:otp', optverify)
route.get('/resendotp/:id', resendotp)


route.put('/updateAddress',isAuthenticateuser,updateAddress);
route.get('/getAddress',isAuthenticateuser,getAllAddress);
// route.put('/updateuser/:id',isAuthenticateuser, updateuser)
route.get('/logout', logout)

route.get('/website/about',getAboutData)


export default route