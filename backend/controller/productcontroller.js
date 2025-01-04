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
function sortProducts(sortby) {
  const sort = {};

  switch(sortby) {
      case "price-high-to-low":
          sort.price = -1;  // Sort by price descending
          break;
      case "price-low-to-high":
          sort.price = 1;   // Sort by price ascending
          break;
      case "title-a-2-z":
          sort.title = 1;   // Sort by title A-Z
          break;
      case "title-z-2-a":
          sort.title = -1;  // Sort by title Z-A
          break;
      case "rating-high-to-low":
          sort.rating = -1; // Sort by rating descending
          break;
      case "rating-low-to-high":
          sort.rating = 1;  // Sort by rating ascending
          break;
      case "newest-first":
          sort.date = -1;   // Sort by date descending (newest first)
          break;
      case "oldest-first":
          sort.date = 1;    // Sort by date ascending (oldest first)
          break;
      case "best-sellers":
          sort.sales = -1;  // Sort by best-selling (descending)
          break;
      case "most-popular":
          sort.popularity = -1; // Sort by popularity descending
          break;
      case "best-reviewed":
          sort.reviews = -1;  // Sort by reviews descending
          break;
      case "discount-high-to-low":
          sort.discount = -1; // Sort by discount percentage descending
          break;
      case "discount-low-to-high":
          sort.discount = 1;  // Sort by discount percentage ascending
          break;
      default:
          sort.price = 1;    // Default sort by price ascending
          break;
  }

  return sort;  // Return the sorting configuration object
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

 