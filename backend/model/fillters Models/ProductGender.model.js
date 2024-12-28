import mongoose from 'mongoose'

const productGenderSchema = new mongoose.Schema({
    label:String,
},{timestamps:true})

const ProductGender = mongoose.model('productGender', productGenderSchema)
export default ProductGender;