import mongoose from 'mongoose'

const productModelSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:[true,'Please enter product id'],
    },
    brand:String,
    title:{
        type:String,
        required:[true,'Please enter product title'],
    },
    shortTitle:String,
    salePrice:{
        type:Number,
        default:-1
    },
    brand:{
        type:String,
        default:'On-U'
    },

    price:{
        type:Number,
        default:0
    },
    size:[
        {
            id:Number,
            label:String,
            quantity:Number,
            colors:[
                {
                    id:Number,
                    label:String,
                    quantity:Number,
                    images:[],
                }
            ]
        }
    ],
    AllColors:[{
        type:Object,default:[],required:true
    }],
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
    // image:[{type:String,default:[]}],
    /* color:[
        {type:Object,default:[]}
    ], */
    subCategory:{
        type:String,
    },
    // quantity:{type: Number, required: true},
    totalStock:{type: Number},
    avgRating:Number,

},{timestamps:true})

productModelSchema.index({title: 1})

const ProductModel = mongoose.model('product', productModelSchema)
export default ProductModel;