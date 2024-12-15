import A from '../Middelwares/resolveandcatch.js'; 
import Product from '../model/productmodel.js';
import Errorhandler from '../utilis/errorhandel.js';
import ImageKit from "imagekit";
import Apifeature from '../utilis/Apifeatures.js';

export const createProduct = A( async(req, res, next)=>{
    const product = await Product.create(req.body)

    res.status(200).json({
        success:true,
        product
    })
})

export const imagekits = A(async (req, res, next)=>{
    var imagekit = new ImageKit();
    imagekit.listFiles({}, function(error, result) { 
        if(error) console.log(error);
        else {
            res.status(200).json({
                result
            })
        }
    });
})

export const getallproducts = A(async (req, res, next)=>{
    const {low,date, width} = req.query
    const apifeature = new Apifeature(find(), req.query).filter().sort(low, date).pagination(width).search()
    const apifeature1 = new Apifeature(find(), req.query).search()
    const apifeature3 = new Apifeature(find(), req.query).filter().sort(low, date).search()
    const products = await apifeature.Product_find;
    const pro = await apifeature1.Product_find;
    const productlength = await apifeature3.Product_find;
    let length = productlength.length
    // console.log("Product length: " + productlength, "Pro: " ,pro,"Products: " ,products)
    res.status(200).json({
        products,
        pro,
        length
    })
})

export const SendSingleProduct = A(async (req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new Errorhandler("product not found", 404));
    }
    
    const similar_product = await find({category: product.category, brand: product.brand}).limit(15)
    
    res.status(200).json({
        success:true,
        product,
        similar_product
    })
})

 