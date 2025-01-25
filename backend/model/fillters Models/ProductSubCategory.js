import mongoose from 'mongoose'

const productSubCategorySchema = new mongoose.Schema({
    label:String,
},{timestamps:true})

const ProductSubCategory = mongoose.model('productSubCategory', productSubCategorySchema)
export default ProductSubCategory;