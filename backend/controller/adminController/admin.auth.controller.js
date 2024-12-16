import User from "../../model/usermodel.js";
import bcrypt from 'bcryptjs';
import sendtoken from "../../utilis/sendtoken.js";
export const registerNewAdmin = async(req,res)=>{
    try {
        const {userName,email,password,phoneNumber} = req.body;
        console.log("Authenticating with: ",userName,email,password,phoneNumber )
        let user = await User.findOne({email: email});
        if(user){
          return res.status(401).json({Success:false,message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password,12);
        user = new User({userName,email,password:hashedPassword,role:'admin'});
        await user.save();
        res.status(200).json({Success:true,message: 'User registered successfully'});
    } catch (error) {
        console.error(`Error registering user `,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const logInUser = async (req,res) =>{
    try {
        const {email,password} = req.body;
        if(!email) return res.status(401).json({Success:false,message: 'Please enter a valid email'});
        if(!password) return res.status(401).json({Success:false,message: 'Please enter a valid password'});
        const user = await User.findOne({email});
        if(!user){
          return res.status(404).json({Success:false,message: 'User not found'});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || '');
        if(!isPasswordCorrect){
          return res.status(401).json({Success:false,message: 'Incorrect Password'});
        }
        const token = sendtoken(user);
        res.status(200).json({Success:true,message: 'User logged in successfully',user:{
            userName:user.userName,
            email:user.email,
            role: user.role,
            id: user._id,
            
        },token})
    } catch (error) {
        console.error(`Error Logging in user ${error.message}`);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const getuser = (async(req, res, next)=>{
  const user = req.user;
  console.log("user",user);
  res.status(200).json({Success:true,message: 'User is Authenticated',user});
})