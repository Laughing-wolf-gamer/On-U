import A from '../Middelwares/resolveandcatch.js';
import User from '../model/usermodel.js';
import { sendMessage } from 'fast-two-sms';
import Errorhandler from '../utilis/errorhandel.js';
import sendtoken from '../utilis/sendtoken.js';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from './emailController.js';
import { sendOTP } from '../utilis/smsAuthentication.js';
import logger from '../utilis/loggerUtils.js';
import { CheckIsPhoneNumber, removeSpaces } from '../utilis/basicUtils.js';

export const registermobile = async (req, res) => {
    try {
        const {email,name,gender, phonenumber } = req.body
    
        console.log("Authenticating with: ",req.body )
        const existingUser = await User.findOne({phoneNumber:phonenumber})
        if(existingUser){
            console.log("Existing: ",existingUser)
            if(existingUser.verify === 'verified'){
                return res.status(200).json({success:true,message:"User Already Exists",result:{user:existingUser,token:sendtoken(existingUser)}})
            }
            return res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp:existingUser.otp,user:existingUser}})
        }
        const otp = Math.floor((1 + Math.random()) * 90000)
        await sendVerificationEmail(email, otp)
		// https://avatar-placeholder.iran.liara.run/
		const profilePic = `https://avatar.iran.liara.run/public/${gender === 'men' ? "boy":'girl'}?username=${removeSpaces(name)}`
        const user = await User.create({
            name,
			profilePic,
            email,
            phoneNumber:phonenumber,
            gender,
            otp:otp.toString(),
            role:'user',
        })
        console.log("New User: ",user)
        // logger.info("New User: " + user?.name)
        res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp,user}})
    } catch (error) {
        console.log("Error Registering User: ",error)
        logger.error("Error registering User: " + error.message)
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
}
export const loginMobileNumber = async(req, res) => {
    try {
		const { logInData} = req.body;
		const isPhoneNumber = CheckIsPhoneNumber(logInData);
		console.log("Login Type: ",isPhoneNumber);
		let phoneNumber = null;
		let email = null;
		let user = null;
		if(isPhoneNumber === 'invalid'){
			return res.status(400).json({ success: false, message: 'Invalid LogIn Data' });
		}
		if(isPhoneNumber === 'phone'){
			phoneNumber = logInData;
			user = await User.findOne({phoneNumber:logInData});
		}else{
			email = logInData;
			user = await User.findOne({email:logInData});
		}
		if(!user){
			return res.status(200).json({success:false,message: 'No User Found ',result:null})
		}
		if(user.verify !== 'verified'){
			return res.status(200).json({success:false,message: 'User Not Verified',result:null})
		}
		function generateOTP() {
			return Math.floor((1 + Math.random()) * 90000) // 6-digit OTP
		}
		let otp = generateOTP();
		try {
			if(phoneNumber){
				await sendOTP(user.phoneNumber,otp);
			}
		} catch (error) {
			console.error("Error Sending otp");
		}
		sendVerificationEmail(user.email, otp);
		if(user.profilePic === ''){
			const profilePic = `https://avatar.iran.liara.run/public/${user.gender}?${user.name}`
			user.profilePic = profilePic;
		}
		console.log("Loging In User: ",user);
		user.otp = otp;
		await user.save();
		return res.status(200).json({success:true,message: 'OTP Sent Successfully',result:{otp,phoneNumber:user.phoneNumber,email:user.email}})
	} catch (error) {
		console.error("Error Login User: ",error);
		logger.error(`Error Login User: ${error.message}`);
		res.status(500).json({success:false,message: "Internal server error"});
		
	}
}

export const updateProfilePic = async(req,res)=>{
	try {
		const id = req.user.id;
		const {profilePic} = req.body;
		console.log("Updateing Profile Pic: ",req.body);
		const user = await User.findByIdAndUpdate(id, {profilePic: profilePic}, {new: true});
		console.log("Updated User: ",user);
		if(!user){
            return res.status(404).json({message: "User not found"});
        }
		res.status(200).json({message: "Profile Pic Updated Successfully", result:user,token:sendtoken(user)})
	} catch (error) {
		console.error("Error getting user id",error);
		logger.error("Error getting user id: " + error.message);
		res.status(500).json({success:false,message: "Internal server error"});

	}
}
export const loginOtpCheck = async(req,res)=>{
	try {
		const{otp,phoneNumber,email} = req.body;
		let user = await User.findOne({phoneNumber:phoneNumber});
		if(!user){
			// return next( new Errorhandler('Mobile Number not found', 404))
			user = await User.findOne({email:email});
			if(!user){
				return res.status(404).json({error: 'Mobile Number not found'});
			}
		}
		console.log("user: ",user);
		if(!user.otp){
			return res.status(404).json({error: 'OTP Not found!'});
		}
		console.log("otp Verify Data: ",req.body)
		console.log("otp Verify: ",user.otp);
		if(user.otp.toString() !== otp){
			return res.status(200).json({success:false, message:"OTP Do not Match"});
		}
		user.otp = null
		await user.save();
		const token = sendtoken(user);
		return res.status(200).json({success:true,message: 'Mobile Number Found',result:{user,token}})
		
	} catch (error) {
		console.error(`Error Login Otp Check: ${error.message}`);
		logger.error("Error Login Otp Check " + error.message);
		res.status(500).json({success:false,message: "Internal server error"});
	}

}




export const registerUser = A(async (req, res) => {
    
    const { userName,email,password,phonenumber } = req.body

    console.log("Authenticating with: ",userName,email,password,phonenumber )
    const existingUser = await User.findOne({phonenumber})

    if (!existingUser) {
    
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

export const getuser = async(req, res)=>{
	try {
		const user = req.user;
		return res.status(200).json({Success:true,message: 'User is Authenticated',user});
	} catch (error) {
		console.error("OTP Error while getting user", error);
		logger.error(`Error OTP Error while getting user: ${error.message}`);
		res.status(500).json({Success:false,message: "Internal server error"});
	}
}

export const optverify = async (req, res)=>{
    try {
		// const {otp} = req.body
		const{id,otp} = req.params;
		const user = await User.findOne({phoneNumber: id})
		console.log("OTP: ",user);
		if (!user.otp) {
			// return next( new Errorhandler("Your OTP has been expired or not has been genrated pls regenrate OTP", 400))
			return res.status(400).json({success:false,message: 'OTP not found'});
		}
		if (user.otp.toString() !== otp) {
			// return next( new Errorhandler("You entered expire or wrong OTP", 400))
			res.status(200).json({success:false,message: 'OTP Do not Match'});
		}
		user.otp = null;
		user.verify = 'verified';
		await user.save()
		res.status(200).json({success:true,message: 'OTP Verified Successfully',result:user,token:sendtoken(user)});
	} catch (error) {
		console.error("Error getting user id",error);
		logger.error("Error getting user id: " + error.message);
		if(!res.headersSent){
			res.status(500).json({message: "Internal server error"});
		}
	}

}

export const resendotp = async (req, res)=>{
	try {
		// console.log(req.params.id)
		const{email} = req.query;
		// console.log("Resend Otp Email: ",req.query)
		if(!email) return res.status(401).json({success:false,message: 'Email is Required!',result:null});
		const existingUser = await User.findOne({email:email})
		if(!existingUser){
			return res.status(401).json({success:true,message:"OTP Sent Successfully",result:null})
		}
		console.log("Existing: ",existingUser)
		if(existingUser.verify === 'verified'){
			return res.status(200).json({success:true,message:"User Already Exists",result:{user:existingUser,token:sendtoken(existingUser)}})
		}
		const otp = Math.floor((1 + Math.random()) * 90000)
		await sendVerificationEmail(email, otp)
		existingUser.otp = otp;
		await existingUser.save();
		return res.status(200).json({success:true,message:"OTP Sent Successfully",result:{otp:otp,user:existingUser}})
	} catch (error) {
		console.error(`Error resending OTP request to server:`,error.message)
		logger.error(`Error resending OTP request to server: ${error.message}`)
		res.status(500).json({success:false,message: 'Internal server error'});
	}
}
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
		logger.error(`Error Logging in user ${error.message}`);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}

export const updateuser = async(req,res)=>{
	try {
		console.log("User: ",req.user);
		console.log("Updating User: ",req.body)
		const{ name, gender,dob,profilePic} = req.body
		const user = await User.findByIdAndUpdate(req.user.id,{$set:{name:name,DOB:dob,gender:gender,profilePic:profilePic}},{new:true})
		if(!user){
			return res.status(303).json({success:false,message: 'User not found'});
		}
		return res.status(200).json({success:true,message: 'User Updated Successfully',result:user,token:sendtoken(user)})
	} catch (error) {
		console.error(`Error Logging in user ${error.message}`);
		logger.error(`Error Logging in user ${error.message}`);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
}

export const updateuserdetails =A( async(req,res)=>{
    console.log(req.body)
    const {name, pincode, address1, address2, citystate, phonenumber} = req.body
    
    res.status(200).json({
        success:'Addres Update Successfully'
    })
  
})
export const removeAddress = async(req, res) => {
    try {
        const user = req.user;
        
        if(!user) return res.status(403).json({success:false,message:'User not found'});
        const userToUpdate = await User.findById(user.id);
        if(!userToUpdate) return res.status(404).json({success:false,message:'User not found'});
        const { addressId } = req.body;
        console.log("Removing Address: ",req.body)
        userToUpdate.addresses.splice(addressId, 1);
        await userToUpdate.save();
        res.status(200).json({success:true,message: 'Address Removed Successfully', user: userToUpdate});
    } catch (error) {
        console.error(`Error removing address `,error);
        res.status(500).json({success:false,message: `Internal Server Error ${error.message}`});
    }
}
export const updateAddress = A(async(req, res, next) => {
    try {
        const user = req.user;
        console.log("Updating Address: ",user)
        if(!user) return next(new Errorhandler('User not found', 404));
        if(!req.body) return next(new Errorhandler('Address not found', 404));
        // const { name, phonenumber, pincode, address1, address2, citystate } = req.body;
        const userToUpdate = await User.findById(user.id);
        if(!userToUpdate) return next(new Errorhandler('User not found', 500));
        userToUpdate.addresses.push({ ...req.body});
        await userToUpdate.save();
        res.status(200).json({success:true,message: 'Address Updated Successfully', user: userToUpdate});
    } catch (error) {
        console.error(`Error updating address `,error);
        res.status(500).json({success:false,message: `Internal Server Error ${error.message}`});
    }
})
export const getAllAddress = A(async(req, res, next) => {
    try {
        const user = req.user;
        if(!user) return next(new Errorhandler('User not found', 404));
        const userAddresses = await User.findById(user.id);
        if(!userAddresses) return next(new Errorhandler('User not found', 500));
        res.status(200).json({success:true,message: 'Address Found Successfully',allAddresses: userAddresses.addresses || []});
    } catch (error) {
        console.error("Error getting all address ", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
})


export const logout = A( async(req, res)=>{
    res.cookie('token', null,{
        expire:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Log Out sucessfully"
    })
})

