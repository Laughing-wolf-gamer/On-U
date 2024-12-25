import mongoose from 'mongoose'

const BagSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    orderItems: [{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true,
        },
        color:Object,
        size:Object,
        quantity:Number,
    }],
   
})

const Bag = mongoose.model('Bag', BagSchema)

export default Bag