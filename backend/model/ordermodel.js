import mongoose from 'mongoose'

const ordersSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MynUser",
        required:true
    },
    orderItems: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"myntraproduct",
        qty:{type:Number},
        required:true
    }],
    createdAt:{
        type:Date,
        default: Date.now
    },
    paymentInfo:{
        status: { type: String, required: true },
    },
    

})

const Order = mongoose.model('MynOrder', ordersSchema)

export default Order