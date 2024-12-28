import ProductCategory from "../../model/fillters Models/ProductCategory.model.js";
import ProductGender from "../../model/fillters Models/ProductGender.model.js";
import ProductSubCategory from "../../model/fillters Models/ProductSubCategory.js";
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
        console.log("Colors: ",AllColors);
        const newProduct = new ProductModel({
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
            AllColors:AllColors,
        });
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
    /* if (!formData.quantity) {
        reasons.push("Quantity is required.");
    } else if (isNaN(formData.quantity) || formData.quantity <= 0) {
        reasons.push("Quantity must be a positive number.");
    }

    // Total stock check
    if (!formData.totalStock) {
        reasons.push("Total stock is required.");
    } else if (isNaN(formData.totalStock) || formData.totalStock <= 0) {
        reasons.push("Total stock must be a positive number.");
    } */

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
        
        if (title && title.length > 0) updateFields.title = title;
        if (size && size.length > 0) updateFields.size = size;
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

/// Filters...

export const SetGenderFilter = async (req, res) => {
    try {
        const{label} = req.params
        const productGenderOptions = await ProductGender.findOne({label:gender});
        if(!productGenderOptions){
            const newGender = new ProductGender({label});
            await newGender.save();
            res.status(201).json({Success:true,message:"Successful Set New Gender"})
        }

    } catch (error) {
        console.error("Error Setting New Gender",error);
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}
export const DeleteGenderFilter = async (req, res) => {
    try {
        const{label} = req.params;
        const deletedGender = await ProductGender.findOneAndDelete({label});
        if(!deletedGender) res.status(404).json({Success:false})
        res.status(200).json({Success:true,message:"Deleted"})
    }catch(error){
        console.error("Error")
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}
export const FetchGenderFilter = async (req, res) => {
    try {
        const allGenderOptions = await ProductGender.find({});
        if(!allGenderOptions) res.status(404).json({Success:false,message:"No Gender Filters Found"});
        res.status(200).json({Success:true,message:"Fetch All Genders: ",result:allGenderOptions})
    }
    catch (error) {
        console.error('Error Fetching', error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}


export const SetCategoryFilter = async (req, res) => {
    try {
        const{label} = req.params
        const productCategoryOptions = await ProductCategory.findOne({label:category});
        if(!productCategoryOptions){
            const newCategory = new ProductCategory({label});
            await newCategory.save();
            res.status(201).json({Success:true,message:"Successful Set New Category"})
        }
    } catch (error) {
        console.error("Error Setting New Category",error);
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}

export const DeleteCategoryFilter = async (req, res) => {
    try {
        const{label} = req.params;
        const deletedCategory = await ProductCategory.findOneAndDelete({label});
        if(!deletedCategory) res.status(404).json({Success:false})
        res.status(200).json({Success:true,message:"Deleted"})
    }catch(error){
        console.error("Error")
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}

export const FetchCategoryFilter = async (req, res) => {
    try {
        const allCategoryOptions = await ProductCategory.find({});
        if(!allCategoryOptions) res.status(404).json({Success:false,message:"No Category Filters Found"});
        res.status(200).json({Success:true,message:"Fetch All Categories: ",result:allCategoryOptions})
    }
    catch (error) {
        console.error('Error Fetching', error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}



export const SetSubCategoryFilter = async (req, res) => {
    try {
        const{label} = req.params
        const productSubCategoryOptions = await ProductSubCategory.findOne({label:subCategory});
        if(!productSubCategoryOptions){
            const newSubCategory = new ProductSubCategory({label});
            await newSubCategory.save();
            res.status(201).json({Success:true,message:"Successful Set New SubCategory"})
        }
    } catch (error) {
        console.error("Error Setting New SubCategory",error);
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}
export const DeleteSubCategoryFilter = async (req, res) => {
    try {
        const{label} = req.params;
        const deletedSubCategory = await ProductSubCategory.findOneAndDelete({label});
        if(!deletedSubCategory) res.status(404).json({Success:false})
        res.status(200).json({Success:true,message:"Deleted"})
    }catch(error){
        console.error("Error")
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}


export const FetchSubCategoryFilter = async (req, res) => {
    try {
        const allSubCategoryOptions = await ProductSubCategory.find({});
        if(!allSubCategoryOptions) res.status(404).json({Success:false,message:"No SubCategory Filters Found"});
        res.status(200).json({Success:true,message:"Fetch All SubCategories: ",result:allSubCategoryOptions})
    }
    catch (error) {
        console.error('Error Fetching', error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const FetchAllFilters  = async (req, res) => {
    try {
        const filters = await ProductModel.find({})
        .select('category subCategory gender AllColors -_id')  // Select only the category field and exclude _id
        console.log("All Filters: ",filters);
        const categoryValues = filters.map(item => item.category);
        const genderValues = filters.map(item => item.gender);
        const subCategoryValues = filters.map(item => item.subCategory);
        res.status(200).json({Success:true,message:"All Filters",result:{AllCategory:categoryValues || [],AllGenders:genderValues || [],AllSubCategory:subCategoryValues || []}})
    } catch (error) {
        console.error("Error Fetching Fillters",error);
        res.status(500).json({Success:false,message:"Internal Server Error"})
    }
}