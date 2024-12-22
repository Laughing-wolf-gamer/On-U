import express from 'express';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import { registerUser, getuser, optverify, resendotp, updateuser, logout, updateuserdetails, logInUser, registermobile, loginMobileNumber } from '../controller/usercontroller.js';

const route = express.Router();
route.post('/register', registerUser)
route.post('/login', logInUser)
route.post('/registermobile',registermobile)
route.post('/loginmobile',loginMobileNumber)
route.get('/check-auth',isAuthenticateuser, getuser)
route.put('/otpverify/:id', optverify)
route.get('/resendotp/:id', resendotp)
route.put('/updateuser/:id',isAuthenticateuser, updateuser)
route.put('/user/:id',isAuthenticateuser, updateuserdetails)
route.get('/logout', logout)

export default route