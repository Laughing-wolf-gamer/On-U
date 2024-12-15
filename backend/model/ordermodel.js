import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        qty:Number,
        required:true
    }],
    
    paymentInfo:{
        status: { type: String, required: true },
    },
    

},{timeStamps:true,})

const Order = mongoose.model('MynOrder', ordersSchema)

export default Order