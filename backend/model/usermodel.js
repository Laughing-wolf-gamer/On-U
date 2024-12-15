import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'


const userModelSchema = new mongoose.Schema({
    verify : {
        type: String,
        required: true,
        default: "unverified"
    },
    email:{
        type:String,
        validate:[validator.isEmail, 'Please enter valid Email ID ']
    },

    password:{
        type:String
    },

    otp:{
        type:Number,
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            index: { expires: '1m' }
          }
        
    },

    name:{
        type:String
    },
    gender:{
        type:String
    },
    DOB:{
        type:Date
    },
    address:{
        pincode:{
            type:Number
        },
        
        address1:{
            type:String
        },
        address2:{
            type:String
            },
            citystate:{
                type:String
            },  
    },
    TOA:{
        type:String
    },
    role:{
        type:String,
        default:'user'
    }
})

userModelSchema.methods.getJWTToken = function () {
    return jwt.sign({id:this._id}, process.env.SECRETID, {expiresIn: '2d'})
}

const User = mongoose.model('user', userModelSchema)
export default User;