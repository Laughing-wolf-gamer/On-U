import express from 'express';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import { registerUser, getuser, optverify, resendotp, updateuser, logout, updateuserdetails, logInUser } from '../controller/usercontroller.js';

const route = express.Router();
route.post('/register', registerUser)
route.post('/login', logInUser)
route.get('/check-auth',isAuthenticateuser, getuser)
route.put('/otpverify/:id', optverify)
route.get('/resendotp/:id', resendotp)
route.put('/updateuser/:id', updateuser)
route.put('/user/:id', updateuserdetails)
route.get('/logout', logout)

export default route