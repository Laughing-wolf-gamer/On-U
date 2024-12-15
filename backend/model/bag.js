import mongoose from 'mongoose'

const BagSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MynUser",
        required:true
    },
    orderItems: [{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"myntraproduct",
            
            required:true,
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