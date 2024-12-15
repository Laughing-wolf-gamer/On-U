import A from '../Middelwares/resolveandcatch.js';
import User from '../model/usermodel.js';
import { sendMessage } from 'fast-two-sms';
import Errorhandler from '../utilis/errorhandel.js';
import sendtoken from '../utilis/sendtoken.js';

export const registermobile = A(async (req, res, next) => {
  
  const { phonenumber } = req.body

  console.log(phonenumber)
  const userr = await findOne({"phonenumber": phonenumber})

  if (!userr) {
    const user = await User.create({
      phonenumber,
    })
   
  }

  const user = await findOne({"phonenumber": phonenumber})

  let otp = Math.floor((1 + Math.random()) * 90000)

  let options = { authorization: process.env.YOUR_API_KEY, message: `This Website is made by Vikas Verma Thank You to use my Website Your OTP: is ${otp}`, numbers: [phonenumber] }
 
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
      const user = await User.findOne({"phonenumber": req.params.id})
      
      res.status(200).json({
        success:true,
        user
      })
})

export const optverify = A(async (req, res, next)=>{
  console.log(req.body)
  
    const {otp} = req.body
    const user = await User.findOne({"phonenumber": req.params.id})
    if (!user.otp) {
      return next( new Errorhandler("Your OTP has been expired or not has been genrated pls regenrate OTP", 400))
    }
    if (user.otp !== otp) {
      return next( new Errorhandler("You entered expire or wrong OTP", 400))
    }
    if(otp === user.otp){
      user.verify = 'verified'
      user.otp =null
      await user.save({ validateBeforeSave: false })
      if (user.name) {
        sendtoken(user, 200, res)
      }else{
        console.log('yes')
        res.status(200).json({
          success:true,
          user
        })
      }
    }

})

export const resendotp = A(async (req, res, next)=>{
  console.log(req.params.id)
  const user = await findOne({"phonenumber": req.params.id})
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

export const updateuser =A( async(req,res,next)=>{
  console.log(req.body)

  const users = await updateOne({phonenumber: req.params.id}, req.body)
  const user = await findOne({phonenumber: req.params.id})

  if(!user){
    return next( new Errorhandler('mobile incorrect', 400))
  }
  
  sendtoken(user, 200, res)
  
})

export const updateuserdetails =A( async(req,res,next)=>{
  console.log(req.body)
const {name, pincode, address1, address2, citystate, phonenumber} = req.body
  
  const user = await updateOne({_id: req.params.id}, 
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

