import jwt from 'jsonwebtoken'
import ErrorHandler from '../utilis/errorhandel.js';
import User from '../model/usermodel.js'
import A from './resolveandcatch.js'

export const isAuthenticateuser = A(async(req, res, next)=>{
    const { token } = req.cookies;

    if (!token) {
       return next( new ErrorHandler('User token has been expired or not been genrated', 400)) 
    }

    const verifytoken = jwt.verify(token, process.env.SECRETID)
    req.user = await User.findById(verifytoken.id)
    next()
})