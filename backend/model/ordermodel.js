import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        type:Object,
        required:true,
    }],
    TotalAmount:{type:Number,required:true},
    SelectedAddress:{type:Object,required:true},
    paymentMode:{type:String,default:"PrePaid",required:true},
    status: { type: String, default:"Processing",enum: ["Processing", "Order Confirmed", "Order Shipped", "Out for Delivery", "Delivered"], required: true },
    

},{timeStamps:true,})

const OrderModel = mongoose.model('order', ordersSchema)

export default OrderModel