import A from '../Middelwares/resolveandcatch.js';
import User from '../model/usermodel.js';
import { sendMessage } from 'fast-two-sms';
import Errorhandler from '../utilis/errorhandel.js';
import sendtoken from '../utilis/sendtoken.js';
import bcrypt from 'bcryptjs';

export const registermobile = A(async (req, res, next) => {
  try {
    const {email,name,address,gender, phonenumber } = req.body
  
    console.log("Authenticating with: ",req.body )
    const existingUser = await User.findOne({phoneNumber:phonenumber})
    if(existingUser){
      console.log("Existing: ",existingUser)
      return res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp:existingUser.otp,user:existingUser}})
    }
    const otp = Math.floor((1 + Math.random()) * 90000)
    const user = await User.create({
      name,
      email,
      phoneNumber:phonenumber,
      addresses:[address],
      gender,
      otp:otp.toString(),
      role:'user',
    })
    console.log("New User: ",user)
    res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp,user}})
  } catch (error) {
    console.log(error)
    res.status(500).json({success:true,message:"Internal server Error"})
  }

})
export const loginMobileNumber = A(async(req, res, next) => {
  const { phonenumber } = req.body
  const user = await User.findOne({phoneNumber:phonenumber});
  if(!user){
    return next( new Errorhandler('Mobile Number not found', 404))
  }
  return res.status(200).json({success:true,message: 'Mobile Number Found',result:user})
})
export const registerUser = A(async (req, res, next) => {
  
  const { userName,email,password,phonenumber } = req.body

  console.log("Authenticating with: ",userName,email,password,phonenumber )
  const existingUser = await User.findOne({phonenumber})

  if (!existingUser) {
    const user = await User.create({
      userName,
      email,
      password,
      phonenumber,
    })
   
  }

  const user = await User.findOne({phonenumber})

  let otp = Math.floor((1 + Math.random()) * 90000)

  let options = { authorization: process.env.YOUR_API_KEY, message: `This Website is made by Abhishek Thank You to use my Website Your OTP: is ${otp}`, numbers: [phonenumber] }
 
  sendMessage(options).then(response => {
  
    if (response.return === true) {
      
      async function fun() {
        user.otp = otp;
        await user.save({ validateBeforeSave: false })
      }
      fun()
     
      res.status(200).json({
        success: true,
        user,
        message:`OTP Sent on ${user.phonenumber} Successfully`
      })
      
    } else {
      console.log(response)
      res.status(400).json({
        success: false,
        
      })
      
    }
  })
})

export const getuser = A(async(req, res, next)=>{
    const user = req.user;
    res.status(200).json({Success:true,message: 'User is Authenticated',user});
})

export const optverify = A(async (req, res, next)=>{
    // const {otp} = req.body
    const{id,otp} = req.params;
    console.log("OTP: ",otp,id)
    const user = await User.findOne({phoneNumber: id})
    if (!user.otp) {
      return next( new Errorhandler("Your OTP has been expired or not has been genrated pls regenrate OTP", 400))
    }
    if (user.otp.toString() !== otp) {
      return next( new Errorhandler("You entered expire or wrong OTP", 400))
    }
    user.otp = null;
    user.verify = 'verified';
    await user.save()
    res.status(200).json({success:true,message: 'OTP Verified Successfully',result:user})

})

export const resendotp = A(async (req, res, next)=>{
  console.log(req.params.id)
  const user = await User.findOne({"phonenumber": req.params.id})
  let otp = Math.floor((1 + Math.random()) * 90000)
  console.log(user, otp)
  let options = { authorization: process.env.YOUR_API_KEY, message: `This website is made my Vikas Verma Thank You to use my Website Your OTP: is ${otp}`, numbers: [req.params.id] }

  sendMessage(options).then(response => {
    if (response.return === true) {
      async function fun() {
        user.otp = otp;
        await user.save({ validateBeforeSave: false })
      }
      fun()
      setInterval(async function () {
        user.otp = null;
        await user.save({ validateBeforeSave: false })
      }, 60000 * 10);
     
    } else {
      console.log(response)
   
    }
  })

  res.status(200).json({
    success:true
  })

})
export const logInUser = async (req,res) =>{
  try {
      const {phonenumber} = req.body;
      if(!phonenumber) return res.status(401).json({Success:false,message: 'Please enter a valid Phone Number'});
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

export const updateuser =A( async(req,res,next)=>{
  console.log(req.body)

  const users = await User.updateOne({phonenumber: req.params.id}, req.body)
  const user = await User.findOne({phonenumber: req.params.id})

  if(!user){
    return next( new Errorhandler('mobile incorrect', 400))
  }
  
  sendtoken(user, 200, res)
  
})

export const updateuserdetails =A( async(req,res,next)=>{
  console.log(req.body)
  const {name, pincode, address1, address2, citystate, phonenumber} = req.body
  
  const user = await User.updateOne({_id: req.params.id}, 
    {
      name,
      phonenumber,
      'address.address1':address1,
      'address.address2':address2,
      'address.pincode':pincode,
      'address.citystate':citystate,
    })


  res.status(200).json({
    success:'Addres Update Successfully'
  })
  
})


export const logout = A( async(req, res, next)=>{
  
  res.cookie('token', null,{
    expire:new Date(Date.now()),
    httpOnly:true
});
res.status(200).json({
    success:true,
    message:"Log Out sucessfully"
})
})

