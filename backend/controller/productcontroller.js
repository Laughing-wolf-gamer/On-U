import A from '../Middelwares/resolveandcatch.js'; 
import Product from '../model/productmodel.js';
import Errorhandler from '../utilis/errorhandel.js';
import ImageKit from "imagekit";
import Apifeature from '../utilis/Apifeatures.js';
import ProductModel from '../model/productmodel.js';

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
    // Build the query filter based on incoming request parameters
    const filter = {};

    // Color filter (match any of the colors in the list)
    if (req.query.color) {
      filter.color = { $in: req.query.color.split(',') }; // If multiple colors, expect them as a comma-separated string
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Gender filter
    if (req.query.gender) {
      filter.gender = req.query.gender;
    }

    // Selling price range filter
    if (req.query.sellingPrice) {
      const priceRange = req.query.sellingPrice.split('-');
      if (priceRange.length === 2) {
        filter.sellingPrice = {
          $gte: parseFloat(priceRange[0]),
          $lte: parseFloat(priceRange[1])
        };
      }
    }

    // Find products using the built query filter
    const products = await ProductModel.find(filter);
    /* const apifeature = new Apifeature(ProductModel.find({}), req.query).filter().sort(low, date).pagination(width).search()
    const apifeature1 = new Apifeature(ProductModel.find({}), req.query).search()
    const apifeature3 = new Apifeature(ProductModel.find({}), req.query).filter().sort(low, date).search()
    const products = await apifeature.Product_find;
    const pro = await apifeature1.Product_find;
    const productlength = await apifeature3.Product_find;
    let length = productlength.length
    */
   // console.log("Product length: " + productlength, "Products: " ,products," Pro: " ,pro,)
    res.status(200).json({
        products:products,
        pro:products,
        length:products.length,
    }) 
})

export const SendSingleProduct = A(async (req, res, next)=>{
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
        return next(new Errorhandler("product not found", 404));
    }
    
    const similar_product = await ProductModel.find({category: product.category, brand: product.brand}).limit(15)
    console.log("Product Single: ",product, "Similar Product: ",similar_product);
    
    res.status(200).json({
        success:true,
        product,
        similar_product
    })
})

 