import mongoose from 'mongoose'

const productColorSchema = new mongoose.Schema({
    label:String,
},{timestamps:true})

const ProductColor = mongoose.model('productColor', productColorSchema)
export default ProductColor;