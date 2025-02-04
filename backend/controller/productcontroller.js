import A from '../Middelwares/resolveandcatch.js'; 
import Product from '../model/productmodel.js';
import ImageKit from "imagekit";
import ProductModel from '../model/productmodel.js';
import OrderModel from '../model/ordermodel.js';
import logger from '../utilis/loggerUtils.js';

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


export const getallproducts = async (req, res) => {
    try {
        console.log("Product Query", req.query);
        const handleSort = (sortBy) => {
            // Create a default sort object
            let sort = {};
          
            switch (sortBy) {
                case "newest":
                    // Sort by creation date (newest first)
                    sort.createdAt = -1;
                    break;
                
                case "popularity":
                    // Assuming you want to sort by a custom popularity field
                    sort.averageRating = -1;  // Descending order for most popular
                    break;
            
                case "discount":
                    // Assuming you have a discount field, you can sort based on that
                    sort.salePrice = -1; // Descending order for higher discounts
                    break;  
                case "high-to-low":
                    // Sort by price in descending order
                    sort.price = -1;  // Highest price first
                    break;
            
                case "low-to-high":
                    // Sort by price in ascending order
                    sort.price = 1;   // Lowest price first
                    break;
                default:
                    // Default sorting (e.g., by price if no valid `sortBy` provided)
                    if (sortBy === "low-to-high") {
                        sort.price = 1;  // Default to ascending price sorting
                    } else {
                        // If no sortBy parameter is given or an unknown value, default to creation date
                        sort.createdAt = -1; // Newest first
                    }
                break;
            }
          
            return sort;
        };

        // Helper function to ensure filters are arrays
        const ensureArray = (value) => Array.isArray(value) ? value : [value];

        // Build the query filter based on incoming request parameters
        const filter = {};
        let sort = {};

        // Handle sorting
        if (req.query.sortBy) {
            sort = handleSort(req.query.sortBy);
        }

        // Color filter
        if (req.query.color) {
            const colorNames = req.query.color.split(',');
            filter.AllColors = {
                $elemMatch: {
                    label: { $in: colorNames }
                }
            };
        }
        if(req.query.discountedAmount){
            filter.discountedAmount = { $gte: parseFloat(req.query.discountedAmount) };
        }
        // Size filter
        if (req.query.size) {
            filter.size = {
                $elemMatch: {
                    label: { $in: ensureArray(req.query.size) }
                }
            };
        }

        // Special Category filter
        if (req.query.specialCategory) {
            filter.specialCategory = { $in: ensureArray(req.query.specialCategory) };
        }

        // Keyword search filter
        if (req.query.keyword) {
            const escapeRegex = (string) => string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const regx = new RegExp(escapeRegex(req.query.keyword), 'i');
            const keywordFilter = {
                $or: [
                    { title: regx },
                    { description: regx },
                    { category: regx },
                    { subCategory: regx },
                    { specialCategory: regx },
                    { material: regx },
                    { specification: regx },
                    { gender: regx },
                ]
            };

            // Include price and salePrice if keyword is numeric
            if (!isNaN(req.query.keyword)) {
                keywordFilter.$or.push(
                    { price: parseFloat(req.query.keyword) },
                    { salePrice: parseFloat(req.query.keyword) }
                );
            }

            Object.assign(filter, keywordFilter);
        }

        // Category filter
        if (req.query.category) {
            filter.category = { $in: ensureArray(req.query.category) };
        }

        // Subcategory filter
        if (req.query.subcategory) {
            filter.subCategory = { $in: ensureArray(req.query.subcategory) };
        }

        // Price filter
        if (req.query.price) {
            const priceRange = req.query.price.split(',');
            if (priceRange.length === 2) {
                filter.price = {
                    $gte: parseFloat(priceRange[0]),
                    $lte: parseFloat(priceRange[1])
                };
            }
        }

        // Gender filter
        if (req.query.gender) {
            filter.gender = req.query.gender;
        }

        // Selling price filter
        if (req.query.sellingPrice) {
            filter.price = req.query.sellingPrice;
        }

        // Date range filter
        if (req.query.dateRange) {
            const dateRange = req.query.dateRange.split('-');
            if (dateRange.length === 2) {
                filter.date = {
                    $gte: new Date(dateRange[0]),
                    $lte: new Date(dateRange[1])
                };
            }
        }
        const allProducts = await ProductModel.find({});
        // Paginate products
        const itemsPerPage = 20;
        const currentPage = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
        const skip = (currentPage - 1) * itemsPerPage;

        const totalProducts = await ProductModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        console.log("Total Products:", totalProducts, ", Pages:", totalPages);

        // Fetch products with pagination
        const productsPagination = await ProductModel.find(filter).sort(sort).limit(itemsPerPage).skip(skip);

        return res.status(200).json({
            products: allProducts,
            pro: productsPagination,  // Return only paginated products
            length: totalProducts,
            totalPages
        });
    } catch (error) {
        console.error("Error Fetching Products:", error);
        logger.error("Error Fetching Products: "+ error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            result: {
                products:[],
                pro:[],
                length:0,
                totalPages:1,
            }
        });
    }
}


export const getRandomProducts = async (req, res)=>{
    const { category } = req.body;  // Get category from request body
    try {
        const matchStage = category ? { $match: { category: category } } : {};  // Optional category filter
        
        // MongoDB aggregation pipeline
        const randomProducts = await ProductModel.aggregate([
            ...category ? [matchStage] : [],  // Only apply the category filter if it's provided
            { $sample: { size: 10 } }  // Randomly select 10 products
        ]);

        // Send response with random products
        res.status(200).json({
            success: true,
            message: "Products are available",
            result: randomProducts || []
        });

    } catch (error) {
        // Handle errors and send appropriate response
        console.error("Error fetching random products:", error);
        logger.error("Error fetching random products: "+ error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch random products",
            error: error.message
        });
    }

}
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
            // console.log("Product Id: ",productId);
            for (const order of orderPurchasedProductByUserId) {
                // console.log("OrderPurchasedProductByUserId: ", order.orderItems)
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
        logger.error("Error Checking User Purchased: "+ error.message);
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
        logger.error("Error Posting Rating: "+ error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const SendSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch the product by ID
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Fetch similar products, excluding the current product
        const similarProduct = await ProductModel.find({
            category: product.category,
            gender: product.gender,
            // subCategory: product.subCategory,
            _id: { $ne: id }  // Exclude the current product by its _id
        }).limit(20);  // Limit to 20 similar products

        console.log("Product Single: ", product, "Similar Product: ", similarProduct);

        res.status(200).json({
            success: true,
            message:"Product successfully Found!",
            product,
            similar_product: similarProduct || []
        });

    } catch (error) {
        console.error("Error Getting Products: ", error);
        logger.error("Error Getting Products: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

 