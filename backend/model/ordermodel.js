import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    ShipRocketOrderId:{type:String,required:true},
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
    status: { type: String, default:"Processing", required: true },
    current_status: { type: String,default:"Processing"},
    current_timestamp:{type:String,},
    courier_name:{type:String,default:""},
    scans:[{type:Object,default:[]}],
},{timestamps:true})

const OrderModel = mongoose.model('order', ordersSchema)

export default OrderModel