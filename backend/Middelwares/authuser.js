import jwt from 'jsonwebtoken'
import ErrorHandler from '../utilis/errorhandel.js';
import A from './resolveandcatch.js'

export const isAuthenticateuser = A(async(req, res, next)=>{
    const header = req.headers['authorization'];
    if(!header) return next(new Error('No Headers Found',401));
    const token = header && header.split(' ')[1];
    if (!token) {
       return next( new ErrorHandler('User token has been expired or not been generated', 400)) 
    }
    jwt.verify(token, process.env.SECRETID,(err, user) => {
        if(err) next(new ErrorHandler('User not found', 403))
		console.log("Auth: User: ",user);
        req.user = user;
        next();
    });
})