import { Router } from 'express';
import { isAuthenticateuser } from '../Middelwares/authuser.js';
import { registermobile, getuser, optverify, resendotp, updateuser, logout, updateuserdetails } from '../controller/usercontroller.js';

const route = Router();
route.post('/registermobile', registermobile)
route.get('/user/:id',isAuthenticateuser, getuser)
route.put('/otpverify/:id', optverify)
route.get('/resendotp/:id', resendotp)
route.put('/updateuser/:id', updateuser)
route.put('/user/:id', updateuserdetails)
route.get('/logout', logout)

export default route