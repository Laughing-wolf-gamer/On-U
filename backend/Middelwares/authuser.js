import jwt from 'jsonwebtoken'
import ErrorHandler from '../utilis/errorhandel.js';
import User from '../model/usermodel.js'
import A from './resolveandcatch.js'

export const isAuthenticateuser = A(async(req, res, next)=>{
    // const { token } = req.cookies;
    const header = req.headers['authorization'];
    if(!header) return next(new Error('No Headers Found',401));
    const token = header && header.split(' ')[1];
    // if(!token) return res.status(401).json({Success:false,message: 'No token, authorization denied'});
    if (!token) {
       return next( new ErrorHandler('User token has been expired or not been generated', 400)) 
    }

    /* const verifytoken = jwt.verify(token, process.env.SECRETID)
    const user = await User.findById(verifytoken.id)
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    } */
    jwt.verify(token, process.env.SECRETID, (err, user) => {
        if(err) next(new ErrorHandler('User not found', 403))
		console.log(user.role);
        req.user = user;
        next();
    });
    // req.user = user;
    // next()
})