import mongoose from 'mongoose'

const productCategorySchema = new mongoose.Schema({
    label:String,
},{timestamps:true})

const ProductCategory = mongoose.model('productCategory', productCategorySchema)
export default ProductCategory;