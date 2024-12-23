import mongoose from 'mongoose'

const BagSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true,
        },
        color:{
            type:String,
        },
        size:{
            type:String,
        },
        qty:{
            type:Number, 
            default: 1, 
            required:true
        },
    }],
   
})

const Bag = mongoose.model('Bag', BagSchema)

export default Bag