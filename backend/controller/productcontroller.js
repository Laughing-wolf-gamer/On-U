import A from '../Middelwares/resolveandcatch.js'; 
import Product from '../model/productmodel.js';
import Errorhandler from '../utilis/errorhandel.js';
import ImageKit from "imagekit";
import Apifeature from '../utilis/Apifeatures.js';
import ProductModel from '../model/productmodel.js';
import OrderModel from '../model/ordermodel.js';

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

export const getallproducts = A(async (req, res)=>{
    try {
        console.log("Query ", req.query);

        // Build the query filter based on incoming request parameters
        const filter = {};
        const sort = {};

        // Color filter (match any of the colors in the list)
        /* if (req.query.color) {
            const colorNames = req.query.color.split(','); // Split the color query into an array of color names
            filter.color = {
              $elemMatch: {
                id: { $in: colorNames } // Check if any object in the 'colors' array has a matching 'name' field
              }
            };
        } */
        if (req.query.color) {
            const colorNames = req.query.color.split(','); // Split the color query into an array of color names
            console.log("Color Names:", colorNames);

            // Filter for products that have at least one color in AllColors matching the query
            filter.AllColors = {
                $elemMatch: {
                    label: { $in: colorNames }  // Matching color labels in AllColors array
                }
            };
        }
        if (req.query.size) {
            let sizeQueryCheck = [];
            if(Array.isArray(req.query.size)){
                sizeQueryCheck = req.query.size;
            }else{
                sizeQueryCheck.push(req.query.size);
            }
            console.log("Size query check: ", sizeQueryCheck)
            // Filter based on matching any size.label in the req.query.size array
            filter.size = {
              $elemMatch: {
                label: { $in: sizeQueryCheck }  // Match any size.label from the query array
              }
            };
        }
        if(req.query.keyword){
            
            const regx = new RegExp(req.query.keyword, 'i');
            const createSearchQuery = {
                $or: [
                    { title: regx },
                    { description: regx },
                    { category: regx },
                    { subCategory: regx },
                    { material: regx },
                    { specification: regx },
                    { gender: regx },
                ]
            };
            Object.assign(filter, createSearchQuery);  // Merge search query with the filter
        }
        /* if(req.query.price){
            filter.price = req.query.price ? { $gte: req.query.price } : { $gte: 0 };
        } */

        // Category filter
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if(req.query.subcategory){
            filter.subCategory = req.query.subcategory;
        }
        if (req.query.price) {
            const priceRange = req.query.price.split(',');
            if (priceRange.length === 2) {
                filter.price = {
                    $gte: parseFloat(priceRange[0]),
                    $lte: parseFloat(priceRange[1])
                };
            }
        }
        /* // Sorting logic (price and date)
        if (req.query.price) {
            const queryPrice = req.query.price.split(':');
            // Parse the price range into numbers
            const minPrice = Number(queryPrice[0]);
            const maxPrice = Number(queryPrice[1]);

            console.log("Price Sort: ", minPrice, maxPrice);
            
            // Ensure that both minPrice and maxPrice are valid numbers before applying the filter
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                filter.salePrice = {
                    $gte: parseFloat(minPrice),  // Minimum price filter
                    $lte: parseFloat(maxPrice)   // Maximum price filter
                };
            } else {
                // Handle invalid price range (optional)
                console.error("Invalid price range values");
            }
        } */

        if (req.query.date) {
            sort.date = req.query.date === 'asc' ? 1 : -1; // Sort by date if specified
        }

        // Gender filter
        if (req.query.gender) {
            filter.gender = req.query.gender;
        }

        

        // Selling price range filter
        if (req.query.sellingPrice) {
            // const priceRange = req.query.sellingPrice.split(',');
            console.log("Price Range: ", req.query.sellingPrice);
            /* console.log("price:")
            if (priceRange.length === 2) {
                filter.price = {
                    $gte: parseFloat(priceRange[0]),
                    $lte: parseFloat(priceRange[1])
                };
            } */
           filter.price = req.query.sellingPrice;
        }
        

        // Date filter (if applicable)
        if (req.query.dateRange) {
            const dateRange = req.query.dateRange.split('-');
            if (dateRange.length === 2) {
                filter.date = {
                    $gte: new Date(dateRange[0]),
                    $lte: new Date(dateRange[1])
                };
            }
        }
        console.log("Filter: ", filter);
        // const { page = 1} = req.query; // Default to page 1 and limit 10
        const allProducts = await ProductModel.find({});
        const totalProducts = await ProductModel.countDocuments(filter);
        // Parse page and limit as integers
        if(Number(req.query.width) >= 1024){
            let itemsPerPage = 50;
            const currentPage = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided

            // Calculate the number of items to skip
            const skip = (currentPage - 1) * itemsPerPage;
            
            // Get total count of products matching the filter
            

            // Calculate total pages
            const totalPages = Math.ceil(totalProducts / itemsPerPage);
            console.log("Total Products: ", totalProducts,", Pages: ", totalPages);

            // Fetch paginated products
            const products = await ProductModel.find(filter)
                .sort(sort)
                .limit(itemsPerPage)
                .skip(skip);
            // console.log("Fetched Products: ", products);
            return res.status(200).json({
                products: allProducts,
                pro:products,
                length: totalProducts
            });
        }
        // Find products using the built query filter
        const products = await ProductModel.find(filter).sort(sort);
        // console.log("Fetched Products: ", products);
        return res.status(200).json({
            products: allProducts,
            pro:products,
            length: totalProducts
        });
    } catch (error) {
        console.error("Error Fetching Products: ",error);
        res.status(500).json({success:false,message:'Internal server Error',result:{
            products:[],
            pro:[],
            length:-1,
        }})
    }
})
export const checkUserPurchasedProduct = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user's ID
        if(!userId){
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const { productId } = req.params; // Get the product ID from the request parameters
        if(!productId){
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }
        const originalProduct = await ProductModel.findById(productId);
        if(!originalProduct){
            return res.status(400).json({
                success: false,
                message: 'Product not found'
            })
        }
        if(originalProduct.Rating.some(r => r.userId === userId)){

        }
        // Find orders for the user that have a "Delivered" status
        const orderPurchasedProductByUserId = await OrderModel.find({ 
            userId, 
            status: "Delivered" 
        });
        
        // If the user has orders
        if (orderPurchasedProductByUserId && orderPurchasedProductByUserId.length > 0) {
            // Check if any of the order items include the productId
            console.log("Product Id: ",productId);
            for (const order of orderPurchasedProductByUserId) {
                console.log("OrderPurchasedProductByUserId: ", order.orderItems)
                // Ensure orderItems is an array and contains the productId
                if (order.orderItems && order.orderItems.some(item => item.productId._id === productId)) {
                    
                    return res.status(200).json({
                        success: true,
                        message: 'User has purchased this product'
                    });
                }
            }
        }

        return res.status(200).json({
            success: false,
            message: 'User has not purchased this product'
        });
    } catch (error) {
        console.error("Error Checking User Purchased ", error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
}

export const setRating = async (req, res) => {
    try {
        const { productId } = req.params;
        const { comment, rating} = req.body;
        
        console.log("Posting Rating: ", req.body);

        // Validate rating
        if (rating) {
            if (Number(rating) <= 0 || Number(rating) > 5) {
                return res.status(400).json({ success: false, message: 'Rating should be between 1 and 5' });
            }
        }

        // Validate comment
        if (comment) {
            if (typeof comment !== 'string' || comment.trim() === '') {
                return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            }
        }

        console.log("Setting rating: ", productId);

        // Update product with new rating and comment
        const product = await ProductModel.findByIdAndUpdate(
            productId, 
            {
                $push: { 
                    Rating: {
                        userId: req.user.id,
                        rating: Number(rating),
                        comment: comment || ''
                    }
                }
            },
            { new: true } // Ensure that the updated document is returned
        );

        console.log("Updated Product: ", product);

        // Respond with success
        res.status(200).json({ success: true, message: 'Rating set successfully', result: product });
    } catch (error) {
        console.log("Error Posting Rating", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


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

 