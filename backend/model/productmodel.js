import mongoose from 'mongoose'

const productmodelSchema = new mongoose.Schema({
    brand:{
        type:String,

    },
    title:{
        type:String
    },
    sellingPrice:{
        type:Number
    },
    mrp:{
        type:Number
    },
    size:{
        type:String
    },
    bulletPoints:[
        {
            point:{
                type:String
            }
        }
    ],
    productDetails:{
        type:String
    },
    material:{
        type:String
    },
    specification:[
        {
            point:{
                type:String
        }
        }
    ],
    category:{
        type:String
    },
    style_no:{
        type:String
    },
    images:[
        {
            url:{
                type:String
            }
        }
           
    ],
    createDate:{
        type:Date,
        default: Date.now
    },
    color:{
        type:String
    },
    gender:{
        type:String
    },
    stock:{
        type:Number
    }


})

productmodelSchema.index({title: 1})

const ProductModel = mongoose.model('myntraproduct', productmodelSchema)
export default ProductModel;