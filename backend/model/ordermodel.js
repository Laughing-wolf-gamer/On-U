import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    order_id:{type:String},
    shipment_id:{type:String},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        type:Object,
        required:true,
    }],
    razorpay_order_id:{type:String},
    paymentId:{type:String},
    TotalAmount:{type:Number,required:true},
    address:{type:Object,required:true},
	ConveenianceFees:{type:Number,default:0},
	channel_id:{type:Number,default:6217390},
    paymentMode:{type:String,default:"PrePaid",required:true},
    status: { type: String, default:"Processing", required: true },
    current_status: { type: String,default:"Processing"},
    current_timestamp:{type:String,},
    courier_name:{type:String,default:""},
    scans:[{type:Object,default:[]}],
},{timestamps:true})

const OrderModel = mongoose.model('order', ordersSchema)

export default OrderModel