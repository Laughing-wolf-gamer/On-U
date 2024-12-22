import jwt from 'jsonwebtoken'
const sendtoken = (user) =>{
    
    /* const token = user.getJWTToken();
    const option = {
        expire: new Date(
            Date.now() + 5 * 24*60*60*1000
        ),
        httpOnly:true
    }
    
    res.status(statuscode).cookie('token', token, option).json({
        success: true,
        user,
        token
    }) */
    const token = jwt.sign({
        id:user._id,
        role:user.role,
        user:user,        
    },process.env.SECRETID,{
        expiresIn: '1h',
    })
    return token;
}

export default sendtoken