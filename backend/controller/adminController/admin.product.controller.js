import ProductCategory from "../../model/fillters Models/ProductCategory.model.js";
import ProductGender from "../../model/fillters Models/ProductGender.model.js";
import ProductSubCategory from "../../model/fillters Models/ProductSubCategory.js";
import OrderModel from "../../model/ordermodel.js";
import ProductModel from "../../model/productmodel.js";
import { handleImageUpload, handleMultipleImageUpload } from "../../utilis/cloudinaryUtils.js";

export const uploadImage = async (req, res) =>{
    try {
        // Convert the buffer into a base64 string
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const fileData = `data:${req.file.mimetype};base64,${b64}`;

        // Upload image to Cloudinary
        const result = await handleImageUpload(fileData);
        console.log("Uploaded Image URL:", result.secure_url);

        // Return the uploaded image URL
        res.status(200).json({
            Success: true,
            message: 'Image uploaded successfully!',
            result: result.secure_url
        });
    } catch (error) {
        console.error('Error while uploading image:', error);
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
        // console.log("Files: ",files);

        // Upload multiple images to Cloudinary
        const results = await handleMultipleImageUpload(files);
        console.log("Uploaded Images:", results.map(result => result.secure_url));

        // Return the uploaded image URLs
        res.status(200).json({
            Success: true,
            message: 'Images uploaded successfully!',
            results: results.map(result => result.secure_url)
        });
    } catch (error) {
        console.error('Error while uploading images:', error);
        res.status(500).json({
            Success: false,
            message: 'Internal Server Error'
        });
    }
};
export const addNewProduct = async (req, res) => {
    try {
        const {
            productId,
            title,
            shortTitle,
            size,
            description,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            price,
            salePrice,
        } = req.body;
        console.log("All fields ",req.body);
        
        if(!isFormValid(req.body).isValid){
            return res.status(400).json({Success:false,message:"All fields are required ",reasons:isFormValid(req.body).reasons});
        }
        const AllColors = []
        size.forEach(s => {
            if(s.colors){
                s.colors.forEach(c => {
                    const colorsImageArray = c.images.filter(c => c !== "");
                    c.images = colorsImageArray;
                    AllColors.push(c);
                });
            }
        });
        let totalStock = 0;
        size.forEach(s => {
            let sizeStock = 0;
            if(s.colors){
                s.colors.forEach(c => {
                    sizeStock += c.quantity;
                });
            }
            totalStock += sizeStock;
        })
        console.log("Total Stock: ",totalStock);
        const newProduct = new ProductModel({
            productId,
            title,
            shortTitle,
            size,
            description,
            bulletPoints,
            material,
            gender,
            category,
            subCategory,
            price,
            salePrice,
            totalStock,
            AllColors:AllColors,
        });
        if(!newProduct) return res.status(400).json({Success:false,message:"Product not created",result:null});
        await newProduct.save();

        console.log("New Products Data: ",newProduct);
        res.status(201).json({Success: true, message: 'Product added successfully!', result: newProduct});
        
    } catch (error) {
        console.error('Error while adding new product:', error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

function isFormValid(formData) {
    const reasons = [];
    if(!formData.productId){
        reasons.push("Product ID is required.");
        return;
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
    if (!formData.category) {
        reasons.push("Category is required.");
    }

    // Quantity check

    // Bullet points check
    if (!formData.bulletPoints || formData.bulletPoints.length === 0) {
        reasons.push("At least one bullet point is required.");
    }

    // If there are no reasons, the form is valid
    const isValid = reasons.length === 0;

    return {
        isValid,
        reasons
    };
}
export const fetchAllProducts = async (req, res) => {
    try {
        const allProducts = await ProductModel.find({});
        if(!allProducts) res.status(404).json({Success:false,message:"No products found"});
        res.status(200).json({Success: true, message: 'All products fetched successfully!', result: allProducts});
    } catch (error) {
        console.error('Error while Fetching all product:', error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}
export const editProduct = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({Success:false,message:"Product ID is required"});
        const {
            productId,
            title,
            size,
            description,
            material,
            bulletPoints,
            gender,
            category,
            subCategory,
            price,
            salePrice,
        } = req.body;
        console.log("Editing: ",req.body);
        // Define an object to store fields that need updating
        const updateFields = {};

        // Check each property and add it to the updateFields object if it exists in req.body
        if(productId && productId.length > 0) updateFields.productId = productId;
        if (title && title.length > 0) updateFields.title = title;
        if (size && size.length > 0) {
            let totalStock = -1;
            updateFields.size = size
            size.forEach(s => {
                let sizeStock = 0;
                if(s.colors){
                    s.colors.forEach(c => {
                        sizeStock += c.quantity;
                    });
                }
                totalStock += sizeStock;
            })
            // console.log("Colors: ",AllColors);
            if(totalStock > 0) updateFields.totalStock = totalStock;
        };
        if (description && description.length > 0) updateFields.description = description;
        if (material && material.length > 0) updateFields.material = material;
        if (bulletPoints && bulletPoints.length > 0) updateFields.bulletPoints = bulletPoints;
        if (gender && gender.length > 0) updateFields.gender = gender;
        if (category && category.length > 0) updateFields.category = category;
        if (subCategory && subCategory.length > 0) updateFields.subCategory = subCategory;
        if (price >= 0) updateFields.price = price;
        if (salePrice) updateFields.salePrice = salePrice;
        console.log("Updating : ",updateFields);
        if (Object.keys(updateFields).length > 0) {
            const updatedProduct = await ProductModel.findByIdAndUpdate(
                id, 
                updateFields, 
                { new: true }
            );
            if(!updatedProduct) res.status(404).json({Success:false,message:"Product Update Failed"});
            return res.status(200).json({Success: true, message: 'Product updated successfully!', result: updatedProduct});
        }
        return res.status(400).json({
            success: false,
            message: "No fields provided for update"
        });
    } catch (error) {
        console.error('Error while Editing a product:', error);
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
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const getOrderById = async(req,res)=>{
    try {
        const{orderId} = req.params;
        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(200).json({Success:true,message:"NO Orders Found Yet",order:[]})
        }
        res.status(200).json({Success:true,message:'Fetched All Orders',result:order})
    } catch (error) {
        console.error("Error getting orders by Id: ",error);
        res.status(500).json({Success:false,message:"Internal Server Error",result:null});
    }
}
export const updateOrderStatus = async(req,res)=>{
    try {
        const{orderId} = req.params;
        const{status} = req.body;
        if(!orderId || !status){
            return res.status(400).json({Success:false,message:"Order Id and Status are required"});
        }
        const order = await OrderModel.findByIdAndUpdate(orderId,{status:status},{new:true});
        if(!order){
            return res.status(404).json({Success:false,message:"Order not found"});
        }
        res.status(200).json({Success:true,message:"Order Status Updated",result:order});
    } catch (error) {
        console.error("Error updating order status: ",error);
        res.status(500).json({Success:false,message:"Internal Server Error",result:null});
    }
}

export const getallOrders = async(req,res)=>{
    try {
        const allOrders = await OrderModel.find({});
        console.log("Order: ",allOrders);
        res.status(200).json({Success:true,message:"All Orders",result:allOrders || []});
    } catch (error) {
        console.error("Error Getting All Orders ",error);
        res.status(500).json({Success:false,message:"Internal Server Error"});
    }
}

