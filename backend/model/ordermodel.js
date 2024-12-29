import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        color:Object,
        size:Object,
        quantity:Number,
        required:true,
    }],
    paymentMode:{type:String,default:"PrePaid",required:true},
    paymentInfo:{
        status: { type: String, required: true },
    },
    

},{timeStamps:true,})

const OrderModel = mongoose.model('order', ordersSchema)

export default OrderModel