import Coupon from "../../model/Coupon.model.js";
import OrderModel from "../../model/ordermodel.js";
import logger from "../../utilis/loggerUtils.js";
import ProductModel from "../../model/productmodel.js";
import { handleImageUpload, handleMultipleImageUpload } from "../../utilis/cloudinaryUtils.js";
import { sendUpdateOrderStatus } from "../emailController.js";
import { calculateDiscountPercentage, calculateGst, getStatusDescription, getStringFromObject } from "../../utilis/basicUtils.js";
import { getShipmentTrackingStatus } from "../LogisticsControllers/shiprocketLogisticController.js";

export const uploadImage = async (req, res) =>{
    try {
        // Convert the buffer into a base64 string
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const fileData = `data:${req.file.mimetype};base64,${b64}`;

        // Upload image to Cloudinary
        const result = await handleImageUpload(fileData);
        if(!result) {
            logger.warn("Image upload failed");
            return res.status(401).json({Success:false, Message:"Failed to upload image"});
        }
        // console.log("Uploaded Image URL:", result.secure_url);
        if(result.error){
            console.error("Error while uploading image:", result.error);
            return res.status(500).json({
                Success: false,
                message: result.error
            });
        }

        // Return the uploaded image URL
        res.status(200).json({
            Success: true,
            message: 'Image uploaded successfully!',
            result: result.secure_url
        });
    } catch (error) {
        console.error('Error while uploading Single image:', error);
        logger.error('Error while Uploading Single image: ' + error.message);
        res.status(500).json({
            Success: false,
            message: 'Internal Server Error'
        });
    }
}
export const uploadMultipleImages = async (req, res) => {
    try {
        const files = req.files.map(file => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            return `data:${file.mimetype};base64,${b64}`;
        });
        // Upload multiple images to Cloudinary
        const results = await handleMultipleImageUpload(files);
        // console.log("Uploaded Images:", results.map(result => result.secure_url));
        if(!results || results.length <= 0) {
            logger.warn("No images were uploaded");
            return res.status(400).json({Success: true,message:"No images were uploaded!"});
        }
        // Return the uploaded image URLs
        res.status(200).json({
            Success: true,
            message: 'Images uploaded successfully!',
            results: results.map(result => result.secure_url)
        });
    } catch (error) {
        console.error('Error while uploading images:', error);
        logger.error('Error while uploading images: ' + error.message);
        res.status(500).json({
            Success: false,
            message: 'Internal Server Error'
        });
    }
};

export const createNewCoupon = async(req,res)=>{
    try {
        const {
            couponName,
            couponCode,
            couponDescription,
            couponType,
            discount,
            minOrderAmount,
            customerLogin,
            freeShipping,
            productId,
            category,
            status,
            validDate,
        } = req.body;
        // console.log("Creating new coupon: ",req.body);
        const newCoupon = new Coupon({
            CouponName:couponName,
            CouponCode:couponCode,
            CouponType:couponType,
            Description:couponDescription,
            Discount:discount,
            MinOrderAmount:minOrderAmount,
            CustomerLogin:customerLogin,
            FreeShipping:freeShipping,
            ProductId:productId,
            Category:category,
            Status:status,
            ValidDate:validDate,
        });
        await newCoupon.save();
        res.status(201).json({message: "Coupon created successfully", newCoupon});
    } catch (error) {
        console.error("Error creating new coupon: ",error);
        logger.error("Error creating new coupon: " + error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const removeCoupon = async(req,res)=>{
    try {
        const{couponId} = req.params;
        const removed = await Coupon.findByIdAndDelete(couponId);
        if (!removed) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json({ message: "Coupon removed successfully", removed });
    } catch (error) {
        console.error("Error removing coupon: ",error);
        logger.error("Error removing coupon: " + error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const editCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const {
            couponName,
            couponDescription,
            couponCode,
            couponType,
            discount,
            minOrderAmount,
            customerLogin,
            freeShipping,
            productId,
            category,
            status,
            validDate,
        } = req.body;

        // Initialize updateFields object
        const updateFields = {};

        // Function to conditionally add fields to the updateFields object
        const addFieldIfValid = (field, value) => {
            if (value !== undefined) {
                updateFields[field] = value;
            }
        };

        // Log the request body for debugging purposes
        console.log("Editing coupon: ", req.body);

        // Add fields to updateFields
        addFieldIfValid('CouponName', couponName);
        addFieldIfValid('Description', couponDescription);
        addFieldIfValid('CouponCode', couponCode);
        addFieldIfValid('CouponType', couponType);
        addFieldIfValid('Discount', discount);
        addFieldIfValid('MinOrderAmount', minOrderAmount);
        addFieldIfValid('CustomerLogin', customerLogin);
        addFieldIfValid('FreeShipping', freeShipping);
        // updateFields.FreeShipping = freeShipping ? freeShipping : false; // Special case for freeShipping (numeric)
        // updateFields.FreeShipping = freeShipping ? freeShipping : false; // Special case for freeShipping (numeric)
        if (productId) updateFields.ProductId = productId; // ProductId is required, no need for length check
        if (category && category !== 'none') updateFields.Category = category; // Ensure 'none' is handled
        if (status && ["Active", "Inactive"].includes(status)) updateFields.Status = status;
        if (validDate) updateFields.ValidDate = validDate;

        // Log the fields being updated
        console.log("Updating Coupon Fields: ", updateFields);

        // Check if any fields were provided for update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                Success: false,
                message: "No fields provided for update",
            });
        }

        // Find the coupon and update it
        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateFields, { new: true });

        // If coupon is not found, return 404
        if (!updatedCoupon) {
            return res.status(404).json({
                Success: false,
                message: "Coupon Update Failed: Coupon not found",
            });
        }

        // Return the updated coupon
        return res.status(200).json({
            Success: true,
            message: 'Coupon updated successfully!',
            result: updatedCoupon,
        });
    } catch (error) {
        console.log("Error Editing coupon: ", error);
        logger.error("Error Editing coupon: " + error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const fetchAllCoupons = async(req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.status(200).json({message: "All coupons fetched successfully", result: coupons || []});
    } catch (error) {
        console.error("Error fetching all coupon",error);
        res.status(500).json({message: "Internal Server Error",result:[]});
    }
}
const isFormValid =(formData) => {
    // console.log("Check Form: ",formData);
    const reasons = [];
	if(!formData){
		reasons.push("Form data is required.");
		return {
			isValid:reasons.length === 0,
			reasons
		}
	}
    if(!formData.productId){
        reasons.push("Product ID is required.");
    }
    // Title check
    if (!formData.title) {
        reasons.push("Title is required.");
    }
    // Title check
    if (!formData.shortTitle) {
        reasons.push("Short Title is required.");
    }

    // Description check
    if (!formData.description) {
        reasons.push("Description is required.");
    }

    // Price check
    if (!formData.price) {
        reasons.push("Price is required.");
    } else if (isNaN(formData.price) || formData.price <= 0) {
        reasons.push("Price must be a positive number.");
    }
    // Size check
    if (!formData.size || formData.size.length === 0) {
        reasons.push("At least one size is required.");
    }
    // Material check
    if (!formData.material) {
        reasons.push("Material is required.");
    }

    // Gender check
    if (!formData.gender) {
        reasons.push("Gender is required.");
    }

    // Subcategory check
    if (!formData.subCategory) {
        reasons.push("Subcategory is required.");
    }

    // Category check
    if (formData.Width === undefined) {
        reasons.push("width is required.");
    }
    if (formData.Height === undefined) {
        reasons.push("height is required.");
    }
    if (formData.Length === undefined) {
        reasons.push("length is required.");
    }
    if (formData.Weight === undefined) {
        reasons.push("weight is required.");
    }
    if (formData.Breadth === undefined) {
        reasons.push("breadth is required.");
    }
    // Quantity check

    // Bullet points check
    if (!formData.bulletPoints || formData.bulletPoints.length === 0) {
        reasons.push("At least one bullet point is required.");
    }

    // If there are no reasons, the form is valid

    return {
        isValid:reasons.length === 0,
        reasons
    }
}
export const addNewProduct = async (req, res) => {
    try {
        const {
            productId,
            title,
            shortTitle,
            size,
			gst,
            description,
            specification,
            careInstructions,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            specialCategory,
            price,
            salePrice,
            Rating,
            Width,
            Height,
            Length,
            Weight,
            Breadth,
        } = req.body;
        // Log incoming data for debugging
        console.log("Adding Products fields ", isFormValid(req.body));
        console.log("Adding Products fields ",typeof productId);

        // Check if form data is valid
        const isValid = isFormValid(req.body)
		
        if (!isValid || !isValid.isValid) {
			throw new Error(`Missing Fields: ${getStringFromObject(isFormValid(req.body))}`);
        }

        // Handle colors
        const AllColors = [];
        size.forEach(s => {
            if (s.colors && s.colors.length > 0) {
                s.colors.forEach(c => {
					if(c.images && c.images.length > 0){
						const colorsImageArray = c.images.filter(c => c !== "");
						c.images = colorsImageArray;
						AllColors.push(c);
					}else{
						throw new Error(`Missing Images for Color: ${c?.name}`);
					}
                });
            }
        });

        // Calculate total stock
        let totalStock = 0;
        size.forEach(s => {
            let sizeStock = 0;
            if (s.colors) {
                s.colors.forEach(c => {
                    sizeStock += c?.quantity;
                });
            }
            totalStock += sizeStock;
        });
        console.log("Total Stock: ", totalStock);

        // Calculate discounted percentage
        let DiscountedPercentage = 0;
        if (price && salePrice && salePrice > 0) {
            // const discountAmount = price - salePrice;
            // const discountPercentage = ((discountAmount / price) * 100).toFixed(0);
            DiscountedPercentage = calculateDiscountPercentage(price,salePrice);
        } /* else {
            const currentProduct = await ProductModel.findById(productId);
            const p = currentProduct.price;
            const sp = currentProduct.salePrice;
            const discountAmount = p - sp;
            const discountPercentage = ((discountAmount / p) * 100).toFixed(0);
            DiscountedPercentage = calculateDiscountPercentage(p,sp);
        } */

        // Apply GST to price and salePrice
        // const priceWithGST = price + (price * gst / 100);
        // const salePriceWithGST = salePrice && salePrice > 0 ? salePrice + (salePrice * gst / 100) : null;
        // priceWithGST = gst / (1 - (100 / (100 + gst)));
        //originalPrice * (1 + (gstPercent / 100));
        /* const priceWithGST = calculateGst(price,gst);
        const salePriceWithGST = salePrice && salePrice > 0 ? calculateGst(salePrice,gst) : null; */

        // Create new product
        const newProduct = new ProductModel({
            productId:productId?.toString(),
            title,
            shortTitle,
            size,
            // gst,
            description,
            careInstructions: careInstructions ? careInstructions : '',
            bulletPoints,
            material,
            gender,
            category,
            specification,
            subCategory,
            specialCategory: specialCategory,
            price: price, // Price after applying GST
            salePrice: salePrice !== null && salePrice > 0 ? salePrice : 0, // SalePrice after applying GST (if applicable)
            DiscountedPercentage: DiscountedPercentage,
            totalStock,
            AllColors: AllColors,
            Rating: Rating && Rating.length > 0 ? [Rating] : [],
            width:Width,
            height:Height,
            length:Length,
            weight:Weight,
            breadth:Breadth,
        });

        if (!newProduct) return res.status(400).json({ Success: false, message: "Product not created", result: null });

        // Save the new product
        await newProduct.save();

        console.log("New Products Data: ", newProduct);
        res.status(201).json({ Success: true, message: 'Product added successfully!', result: newProduct });

    } catch (error) {
        console.error('Error while adding new product:', error);
        logger.error("Error while creating new Product: " + error.message);
        res.status(201).json({ Success: false, message: 'Internal Server Error' ,reasons:error.message})
    }
};



export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ Success: false, message: "Product ID is required" });
        }

        const {
            productId,
            title,
            size,
			gst,
            description,
            specification,
            careInstructions,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            specialCategory,
            price,
            salePrice,
            width,
            height,
            length,
            weight,
            breadth,
        } = req.body;
        console.log("Editing: ", req.body);

        // Initialize updateFields object
        const updateFields = {};

        // Helper function to conditionally add fields to updateFields
        const addToUpdate = (field, value) => {
			
			// console.log("Updating: ",field,Array.isArray(value));
            if (value && (!Array.isArray(value) ? value.length > 0 : value.length > 0)) {
                updateFields[field] = value;
            }
        };

        // Add basic fields to updateFields
        addToUpdate('productId', productId);
        addToUpdate('title', title);
        addToUpdate('description', description);
        // addToUpdate('gst', gst);
        addToUpdate('specification', specification);
        addToUpdate('careInstructions', careInstructions);
        addToUpdate('material', material);
        addToUpdate('bulletPoints', bulletPoints);
        addToUpdate('gender', gender);
        addToUpdate('category', category);
        addToUpdate('subCategory', subCategory);
        addToUpdate('specialCategory', specialCategory);
        addToUpdate('width', width);
        addToUpdate('height', height);
        addToUpdate('length', length);
        addToUpdate('weight', weight);
        addToUpdate('breadth', breadth);

        // Handle 'size' field separately (calculate totalStock)
        if (size && size.length > 0) {
            let totalStock = 0;
            size.forEach(s => {
                if (s.colors) {
                    s.colors.forEach(c => {
                        totalStock += c.quantity || 0;
                    });
                }
            });
            if (totalStock > 0) updateFields.size = size;
            updateFields.totalStock = totalStock;
        }
        // Recalculate price and salePrice with GST
        // [Value of supply x {100/ (100+GST%)}]
        /* let priceWithGST = price * (100 / (100 + gst));
        let salePriceWithGST = salePrice && salePrice > 0 ? salePrice * (100 / (100 + gst)) : null; */
        let priceWithGST = calculateGst(price,gst);
        let salePriceWithGST = salePrice && salePrice > 0 ? calculateGst(salePrice,gst) : null;
        // Add the recalculated price and salePrice to the updateFields
        if (price && price > 0) updateFields.price = price;
        if (salePrice && salePrice > 0) {
			updateFields.salePrice = salePrice
		}else{
			updateFields.salePrice = null; // If no salePrice, set salePrice to null in the updateFields object.
		}

        // Calculate and set the DiscountedPercentage field if salePrice exists
        if (price && salePrice && salePrice > 0) {
            const discountAmount = price - salePrice;
            const discountPercentage = ((discountAmount / salePrice) * 100).toFixed(0);
            updateFields.DiscountedPercentage = discountPercentage;
        } else {
            const currentProduct = await ProductModel.findById(id);
            const p = currentProduct.price;
            const sp = currentProduct.salePrice;
            const discountAmount = p - sp;
            const discountPercentage = ((discountAmount / p) * 100).toFixed(0);
            // If no salePrice, set DiscountedPercentage to 0
            updateFields.DiscountedPercentage = discountPercentage;
        }

        console.log("Updating Product Fields: ", updateFields);

        // If no fields to update, return early
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ Success: false, message: "No fields provided for update" });
        }

        // Update product in the database
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateFields, { new: true });

        // Check if update was successful
        if (!updatedProduct) {
            return res.status(404).json({ Success: false, message: "Product Update Failed" });
        }

        return res.status(200).json({
            Success: true,
            message: 'Product updated successfully!',
            result: updatedProduct,
        });
    } catch (error) {
        console.error('Error while editing a product:', error);
        logger.error('Product Update Failed: ' + error.message);
        return res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};


export const addCustomProductsRating = async (req, res) => {
    try {
        const { productId, ratingData } = req.body;

        // Find and update the product with the new rating
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            { $push: { Rating: ratingData } }, 
            { new: true }
        );

        // Check if the product was found
        if (!product) {
            return res.status(404).json({ Success: false, message: "Product not found" });
        }

        // Calculate the average rating after updating
        const total = product.Rating.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = total / product.Rating.length;

        // Update the product's average rating field
        product.averageRating = averageRating;

        // Save the updated product with the new average rating
        await product.save();

        console.log("Updated Product with Average Rating: ", product);
        
        res.status(200).json({
            Success: true, 
            message: "Custom Rating Added Successfully", 
            result: product
        });

    } catch (error) {
        console.error('Product Update Failed: ', error);
        logger.error('Product Add Custom Rating Failed: ' + error.message);
        return res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

export const fetchAllRatingProducts = async(req,res)=>{
    try {
        const{productId} = req.params;
        const product = await ProductModel.findById(productId);
        // console.log("allProducts: ",product);
        if(!product) {
            return res.status(404).json({Success: false, message: "Product not found"});
        }
        res.status(200).json({Success:true, message: "All Products Rating Found",result:product.Rating || []})
    } catch (error) {
        console.error('Product Fetch Custom Rating Failed: ', error);
        logger.error('Product Fetch Custom Rating Failed: '+ error.message);
        return res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}
export const removeCustomProductsRating = async(req,res)=>{
    try {
        const {productId,ratingId} = req.body;
        console.log("Adding Custom Rating: ", productId, ratingId);
        const product = await ProductModel.findByIdAndUpdate(productId, {$pull: {Rating: {_id: ratingId}}}, {new: true});
        res.status(200).json({Success:true,message:"Successfully Remove Rating Data"})
    } catch (error) {
        console.error('Product Update Failed: ', error);
        logger.error('Product Add Custom Rating Failed: '+ error.message);
        return res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const fetchAllProducts = async (req, res) => {
    try {
        const{page} = req.query;
        const allProducts = await ProductModel.find({});
        // console.log("allProducts: ",allProducts);
        const totalProducts = await ProductModel.countDocuments();
        const itemsPerPage = 10;
        const currentPage = parseInt(page, 10) || 1; // Default to page 1 if not provided

        // Calculate the number of items to skip
        const skip = (currentPage - 1) * itemsPerPage;
        
        // Get total count of products matching the filter
        

        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        console.log("Total Products: ", totalProducts,", Pages: ", totalPages);

        // Fetch paginated products
        const productsPagination = await ProductModel.find({}).populate('Rating.userId').limit(itemsPerPage).skip(skip);
        // if(!allProducts) res.status(404).json({Success:false,message:"No products found"});
        res.status(200).json({Success: true, message: 'All products fetched successfully!', result: {
            productsPagination:productsPagination,
            allProducts:allProducts,
            totalProducts:totalProducts
        }});
    } catch (error) {
        console.error('Error while Fetching all product:', error);
        logger.error("Error while Fetching all products: " + error.message);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}
export const getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({Success:false,message:"Product ID is required"});
        const product = await ProductModel.findById(id);
        if(!product) res.status(404).json({Success:false,message:"Product not found"});
        res.status(200).json({Success: true, message: 'Product fetched successfully!', result: product});
    } catch (error) {
        console.error('Error while Fetching a product:', error);
        logger.error("Error while Fetching a product: " + error.message);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}



    

export const deleteProduct = async (req, res) => {
    try {
        const{id} = req.params;
        if(!id) return res.status(400).json({Success:false,message:"Product ID is required"});
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if(!deletedProduct) res.status(404).json({Success:false,message:"Product not found"});
        res.status(200).json({Success: true, message: 'Product deleted successfully!', result: deletedProduct});
    } catch (error) {
        console.error('Error deleting the Product', error);
        logger.error('Error deleting the Product'+ error.message);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const getOrderById = async(req,res)=>{
    try {
        const{orderId} = req.params;
        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(200).json({Success:true,message:"NO Orders Found Yet",order:{}})
        }
        res.status(200).json({Success:true,message:'Fetched All Orders',result:order})
    } catch (error) {
        console.error("Error getting orders by Id: ",error);
        logger.error("Error getting orders: " + error.message);
        res.status(500).json({Success:false,message:"Internal Server Error",result:null});
    }
}
export const updateOrderStatus = async(req,res)=>{
    try {
        const {id} = req.user;
        const{orderId} = req.params;
        const{status} = req.body;
        if(!orderId || !status){
            return res.status(400).json({Success:false,message:"Order Id and Status are required"});
        }
        const order = await OrderModel.findByIdAndUpdate(orderId,{status:status},{new:true});
        if(!order){
            return res.status(404).json({Success:false,message:"Order not found"});
        }
        // const updateMailSent = await
        const updateOrderStatusMailSent = await sendUpdateOrderStatus(id,order);
        if(updateOrderStatusMailSent){
            return res.status(200).json({Success:true,message:"Order Status Updated",result:order});
        }
        res.status(200).json({Success:false,message:"Failed to update order status"});
    } catch (error) {
        console.error("Error updating order status: ",error);
        logger.error("Error updating order status: " + error.message);
        res.status(500).json({Success:false,message:"Internal Server Error",result:null});
    }
}

export const getallOrders = async (req, res) => {
    try {
        const allOrders = await OrderModel.find({});

        // Check if there are no orders found
        if (!allOrders || allOrders.length === 0) {
            return res.status(200).json({ Success: true, message: "No Orders Found Yet", result: [] });
        }

        // Fetch order status for each order and update the order with the new status
        const orderStatus = await Promise.all(allOrders.map(async (order) => {
            const status = await getShipmentTrackingStatus(order?.shipment_id);
			// console.log("Shipment Tracking Status: ",order?.shipment_id, status);
			const statusSimplified = getStatusDescription(status?.shipment_status);
            return {
				...order.toObject(),
				current_status:statusSimplified || order?.current_status,
				shipment_status:status?.shipment_status,
				scans:status?.shipment_track,
			};
        }));
		console.log("order Status Updated: ", orderStatus);

        // Send the updated orders with current status
        res.status(200).json({ Success: true, message: "All Orders", result: orderStatus || [] });

    } catch (error) {
        console.error("Error Getting All Orders", error);
        logger.error("Error Getting All Orders: " + error.message);
        res.status(500).json({ Success: false, message: "Internal Server Error" });
    }
};


