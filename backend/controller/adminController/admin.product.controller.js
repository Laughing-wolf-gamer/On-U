import ProductModel from "../../model/productmodel.js";
import { handleImageUpload } from "../../utilis/cloudinaryUtils.js";

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
export const addNewProduct = async (req, res) => {
    try {
        const {
            title,
            size,
            color,
            description,
            material,
            bulletPoints,
            image,
            gender,
            category,
            subCategory,
            price,
            salePrice,
            quantity,
            totalStock,
        } = req.body;
        if(!title || !color || !description ||!size || !image || !quantity || !gender || !category || !subCategory || !totalStock){
            return res.status(400).json({Success:false,message:"All fields are required"});
        }
        console.log("All fields ",req.body);
        let imageArray = image.filter(i => i !== '')

        const newProduct = new ProductModel({
            title,
            color,
            size,
            description,
            bulletPoints,
            material,
            image: image.filter(i => i !== ''),
            gender,
            category,
            price,
            salePrice,
            quantity,
            totalStock,
            subCategory,
        });
        /* if(clothsize || footwearsize){
            newProduct.size = !clothsize || clothsize?.length <= 0 ? [...footwearsize]:[...clothsize];
        } */
        await newProduct.save();
        // console.log(newProduct);
        res.status(201).json({Success: true, message: 'Product added successfully!', result: newProduct});
    } catch (error) {
        console.error('Error while adding new product:', error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
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
            title,
            size,
            color,
            description,
            material,
            bulletPoints,
            image,
            gender,
            category,
            subCategory,
            price,
            salePrice,
            quantity,
            totalStock,
        } = req.body;
        // returngin....
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedProduct) res.status(404).json({Success:false,message:"Product Update Failed"});
        res.status(200).json({Success: true, message: 'Product updated successfully!', result: updatedProduct});
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