import mongoose from 'mongoose'

const wishlist = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MynUser",
        required:true
    },
    orderItems: [
        {
            product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"myntraproduct",
            required:true}
        }
    ],
   
})

const WhishList = mongoose.model('wishlist', wishlist)
export default WhishList;