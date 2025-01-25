import mongoose from 'mongoose'

const productSizeSchema = new mongoose.Schema({
    label:String,
},{timestamps:true})

const ProductSize = mongoose.model('productSize', productSizeSchema)
export default ProductSize;