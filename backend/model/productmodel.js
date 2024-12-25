import mongoose from 'mongoose'

const productModelSchema = new mongoose.Schema({
    title:{
        type:String
    },
    salePrice:{
        type:Number
    },
    price:{
        type:Number
    },
    size:[
        {type:Object,default:[]}
    ],
    bulletPoints:[
        {
            header:{type:String},
            body:{type:String},
        }
    ],
    description:{
        type:String
    },
    material:{
        type:String
    },
    specification:[
        {
            header:String,
            point:String
        }
    ],
    gender:{
        type:String
    },
    category:{
        type:String
    },
    style_no:{
        type:String,default:'1'
    },
    image:[{type:String,default:[]}],
    color:[
        {type:Object,default:[]}
    ],
    subCategory:{
        type:String,
    },
    // quantity:{type: Number, required: true},
    // totalStock:{type: Number, required: true},
    avgRating:Number,

},{timestamps:true})

productModelSchema.index({title: 1})

const ProductModel = mongoose.model('product', productModelSchema)
export default ProductModel;