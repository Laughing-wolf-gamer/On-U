import jwt from 'jsonwebtoken'
import ErrorHandler from '../utilis/errorhandel.js';
import User from '../model/usermodel.js'
import A from './resolveandcatch.js'

const ProtectAdminRoute = A(async(req, res, next)=>{
    const header = req.headers['authorization'];
    // if(!header) return res.status(401).json({Success:false,message: 'No Headers Found!'});
    if(!header) return next(new Error('No Headers Found',401));
    const token = header && header.split(' ')[1];
    // if(!token) return res.status(402).json({Success:false,message: 'No token, authorization denied'});
    if (!token) {
       return next( new ErrorHandler('User token has been expired or not been generated', 400)) 
    }

    const verifytoken = jwt.verify(token, process.env.SECRETID)
    if(!verifytoken) return next(new Error('User not found', 403));
    const user = await User.findById(verifytoken.id)
	if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }
	if(user.role === 'user') {
        return next(new ErrorHandler('Unauthorized to access this route', 401))
    }
    console.log("Admin User: ",user);
	req.user = user;
    next()
})

export default ProtectAdminRoute;