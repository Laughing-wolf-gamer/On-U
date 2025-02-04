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
    brand:{
        type:String,
        default:'On-U'
    },
    salePrice:{
        type:Number,
        default:-1
    },
    price:{
        type:Number,
        default:0
    },
    DiscountedPercentage:{type:Number,default:0},
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
                    name:String,
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
    subCategory:{
        type:String,
    },
    specialCategory:{type:String},
    totalStock:{type: Number},
    Rating:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            rating:Number,
            comment:String
        }
    ],
    AppliedCoupon:{type:mongoose.Schema.Types.ObjectId,ref:'coupon'},
    width:{type:Number},
    height:{type:Number},
    length:{type:Number},
    weight:{type:Number},
    breadth:{type:Number},
},{timestamps:true})
productModelSchema.pre('save', function (next) {
    if (this.isModified('Rating')) {
        // Calculate the average rating
        if (this.Rating.length === 0) {
            this.averageRating = 0;
        } else {
            const total = this.Rating.reduce((acc, review) => acc + review.rating, 0);
            this.averageRating = total / this.Rating.length;
        }
    }
    if (this.isModified('price') || this.isModified('salePrice')) {
        if (this.salePrice && this.salePrice > 0) {
            // Calculate the discount amount
            const discountAmount = this.price - this.salePrice;
        
            // Calculate the discount percentage
            const discountPercentage = ((discountAmount / this.price) * 100).toFixed(0);
            this.discountedAmount = discountPercentage;
        } else {
            this.discountedAmount = 0;  // If there's no salePrice, no discount
        }
    }
    next();
});
productModelSchema.virtual('averageRating').get(function () {
    if (this.Rating.length === 0) return 0;
    const total = this.Rating.reduce((acc, review) => acc + review.rating, 0);
    return total / this.Rating.length;
});
productModelSchema.index({title: 1})

const ProductModel = mongoose.model('product', productModelSchema)
export default ProductModel;