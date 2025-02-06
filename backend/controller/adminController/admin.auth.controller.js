import User from "../../model/usermodel.js";
import bcrypt from 'bcryptjs';
import sendtoken from "../../utilis/sendtoken.js";
import ProductModel from "../../model/productmodel.js";
import OrderModel from "../../model/ordermodel.js";
import Bag from "../../model/bag.js";
import WhishList from "../../model/wishlist.js";
import logger from "../../utilis/loggerUtils.js";
export const registerNewAdmin = async(req,res)=>{
    try {
        const {name,email,password,phoneNumber,role} = req.body;
        // console.log("Authenticating with: ",name,email,password,phoneNumber)
        if(role){
            if(role !== 'admin' && role !== 'superAdmin'){
                return res.status(401).json({Success:false,message: 'Invalid Role'});
            }
        }else{
            return res.status(401).json({Success:false,message: 'Please enter a valid role'});
        }
        let user = await User.findOne({email: email});
        if(user){
            return res.status(401).json({Success:false,message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password,12);
        user = new User({name,phoneNumber,email,password:hashedPassword,role:role});
        await user.save();
        res.status(200).json({Success:true,message: 'User registered successfully'});
    } catch (error) {
        console.error(`Error registering user `,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const logInUser = async (req,res) =>{
    try {
        const {email,password,role} = req.body;
        if(!email) return res.status(401).json({Success:false,message: 'Please enter a valid email'});
        if(!password) return res.status(401).json({Success:false,message: 'Please enter a valid password'});
        if(!role) return res.status(401).json({Success:false,message: 'Please enter a valid role'});

        if(role){
            if(role !== 'admin' && role !== 'superAdmin'){
                return res.status(401).json({Success:false,message: 'Invalid Role'});
            }
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({Success:false,message: 'User not found'});
        }
        if(user.role !== role){
            return res.status(401).json({Success:false,message: 'Unauthorized to access this route'});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || '');
        if(!isPasswordCorrect){
            return res.status(401).json({Success:false,message: 'Incorrect Password'});
        }
        const token = sendtoken(user);
        res.status(200).json({Success:true,message: 'User logged in successfully',user:{
            userName:user.userName,
            email:user.email,
            role: user.role,
            id: user._id,
        },token})
    } catch (error) {
        console.error(`Error Logging in user ${error.message}`);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const getuser = (async(req, res, next)=>{
    const user = req.user;
    console.log("user",user);
    res.status(200).json({Success:true,message: 'User is Authenticated',user});
})
export const getTotalOrders = async (req,res)=>{
    try {
        const orders = await OrderModel.find({});
        res.status(200).json({Success:true,message: 'All Orders',result:orders?.length || 0});
    } catch (error) {
        console.error("Error getting all orders: ",error);
    }
}


export const UpdateSizeStock = async (req, res) => {
    try {
        const { productId, sizeId, updatedAmount } = req.body;
        console.log("Updating Size Stock: ", productId, sizeId, updatedAmount);
        
        // Update the size quantity directly in the database
        const result = await ProductModel.updateOne(
            { _id: productId, "size._id": sizeId }, // Find the product by productId and sizeId
            {
                $set: { "size.$.quantity": updatedAmount }, // Update the quantity of the specific size
            }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ Success: false, message: 'Product or Size not found' });
        }

        // Now calculate the total stock for the product, based on all sizes and colors
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product not found' });
        }

        // Calculate the new total stock
        const AllColors = []
        let totalStock = 0;
        product.size.forEach(s => {
            if (s.colors) {
                let sizeStock = s.quantity; // Start with the size's own quantity
                s.colors.forEach(color => {
                    sizeStock += color.quantity; // Add color quantities to size stock
                });
                totalStock += sizeStock;
            }
        });
        product.size.forEach(s => {
            if(s.colors){
                s.colors.forEach(c => {
                    const colorsImageArray = c.images.filter(c => c !== "");
                    c.images = colorsImageArray;
                    AllColors.push(c);
                });
            }
        });

        // Update the total stock of the product directly
        const UpdateProduct = await ProductModel.updateOne(
            { _id: productId },
            { $set: { totalStock: totalStock ,AllColors:AllColors} },
            { new: true }
        );

        res.status(200).json({ Success: true, message: 'Size Stock Updated Successfully' ,result:UpdateProduct});
    } catch (error) {
        console.log("Error Updating Size Stock: ", error);
        logger.error("Error Updating Size: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};


export const addNewSizeToProduct = async (req, res) => {
    try {
        const { productId, size } = req.body;
        // console.log("Adding Size: ", productId, size);
        // Check if the size already exists in the product
        const alreadyPresetProduct = await ProductModel.findById(productId);
        if (alreadyPresetProduct) {
            for (const newSize of size) {
                const size = alreadyPresetProduct.size.find(s => s.label === newSize.label);
                if(size){
                    return res.status(400).json({Success:false,message: 'Size already exists'});
                }
            }
        }

        // Add the new size to the product's sizes array
        const product = await ProductModel.findOneAndUpdate(
            { _id: productId }, // Find the product by productId
            { $push: { size } }, // Push the new size to the size array
            { new: true } // Return the updated document
        );

        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product not found' });
        }

        // Calculate the total stock based on all sizes and their colors
        let totalStock = 0;
        product.size.forEach(s => {
            if (s.colors) {
                let sizeStock = s.quantity; // Start with the size's own quantity
                s.colors.forEach(color => {
                    sizeStock += color.quantity; // Add color quantities to size stock
                });
                totalStock += sizeStock;
            }
        });

        // Update the total stock of the product
        const UpdatedProduct = await ProductModel.updateOne(
            { _id: productId },
            { $set: { totalStock: totalStock } }
        );
        res.status(200).json({ Success: true, message: 'Size Added Successfully' ,result:UpdatedProduct});
    } catch (error) {
        console.log("Error Adding Size: ", error);
        logger.error("Error Adding Size: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};
export const updateImages = async(req,res)=>{
    try {
        const { productId, sizeId, colorId, images } = req.body;
        console.log("Updating Images For: ", productId, sizeId, colorId, images);
        const alreadyPresetProduct = await ProductModel.findById(productId);
        if(!alreadyPresetProduct){
            return res.status(404).json({ Success: false, message: 'Product not found' });
        }
        // Update the color quantity directly within the product document
        const product = await ProductModel.findOneAndUpdate(
            { _id: productId, "size._id": sizeId, "size.colors._id": colorId }, // Find product, size, and color by IDs
            { 
                $set: { 
                "size.$[size].colors.$[color].images": images // Update color quantity in the specified size
                }
            },
            {
                arrayFilters: [
                    { "size._id": sizeId }, // Array filter to match the size
                    { "color._id": colorId } // Array filter to match the color within the size
                ],
                new: true // Return the updated document
            }
        );

        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product, Size, or Color not found' });
        }

        // Recalculate the total stock for the entire product
        let totalStock = 0;
        product.size.forEach(size => {
            if (size.colors) {
                let sizeStock = size.quantity; // Start with the size's own quantity
                size.colors.forEach(color => {
                    sizeStock += color.quantity; // Add color quantities to the size stock
                });
                totalStock += sizeStock;
            }
        });
        const AllColors = [];
        product.size.forEach(s => {
            if (s.colors) {
                s.colors.forEach(c => {
                    const colorsImageArray = c.images.filter(image => image !== "");
                    c.images = colorsImageArray; // Remove empty image entries
                    AllColors.push(c);
                });
            }
        });
        // Update the total stock of the product
        const UpdatedProduct = await ProductModel.updateOne(
            { _id: productId },
            { $set: { totalStock: totalStock,AllColors:AllColors } }
        );

        res.status(200).json({ Success: true, message: 'Images Updated Successfully' ,result:images});
    } catch (error) {
        console.log("Error Updating Color Stock: ", error);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}

export const removeSizeFromProduct = async (req, res) => {
    try {
        const { productId, sizeId } = req.body;
        const product = await ProductModel.findOneAndUpdate({ _id: productId }, { $pull: { size: { _id: sizeId } } }, { new: true });
        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product or Size not found' });
        }
        res.status(200).json({ Success: true, message: 'Size Removed Successfully' ,result:product});
    } catch (error) {
        logger.error("Error Removing Size From Product" + error.message);
        console.error('Error Removing Size: ',error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const removeColorFromSize = async (req, res) => {
    try {
        const { productId, sizeId, colorId } = req.body;
        console.log("Removing Color: ", productId, sizeId, colorId);
        // Remove the color from the specified size in the product document
        const product = await ProductModel.findOneAndUpdate(
            { _id: productId, "size._id": sizeId }, // Find the product and the specific size
            { $pull: { "size.$.colors": { _id: colorId } } }, // Pull the color from the size.colors array
            { new: true } // Return the updated product document
        );
        console.log("Product: ",product);
        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product, Size, or Color not found' });
        }

        // Calculate the total stock based on all sizes and their colors
        let totalStock = 0;
        product.size.forEach(s => {
            if (s.colors) {
                let sizeStock = s.quantity; // Start with the size's own quantity
                s.colors.forEach(color => {
                    sizeStock += color.quantity; // Add color quantities to size stock
                });
                totalStock += sizeStock;
            }
        });
        const AllColors = [];
        product.size.forEach(s => {
            if(s.colors){
                s.colors.forEach(c => {
                    const colorsImageArray = c.images.filter(c => c !== "");
                    c.images = colorsImageArray;
                    AllColors.push(c);
                });
            }
        });

        // Update the total stock of the product
        const UpdatedProduct = await ProductModel.updateOne(
            { _id: productId },
            { $set: { totalStock: totalStock ,AllColors:AllColors} },
            {new:true}
        );

        res.status(200).json({ Success: true, message: 'Color Removed Successfully' ,result:UpdatedProduct});
    } catch (error) {
        console.log("Error Removing Color: ", error);
        logger.error("Error Removing Color: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
}
export const addNewColorToSize = async (req, res) => {
    try {
        const { productId, sizeId, colors } = req.body;
        console.log("Adding Color: ", productId, sizeId, colors);
        console.log("Colors: ",colors.map(c => c.quantity));
        // Find the product by ID
        const alreadyPresetProduct = await ProductModel.findById(productId);
        if (!alreadyPresetProduct) {
            console.log("Product not found: ", productId);
            return res.status(404).json({ Success: false, message: 'Product not found' });
        }

        // Check if the size exists in the product
        const size = alreadyPresetProduct.size.find(s => s._id.toString() === sizeId);
        if (!size) {
            console.error("Size not found: ", sizeId);
            return res.status(404).json({ Success: false, message: 'Size not found' });
        }

        // Check for existing colors before adding
        for (const color of colors) {
            const alreadyColorExist = size.colors.find(c => c.label === color.label);
            if (alreadyColorExist) {
                console.log("Color already exists: ", color);
                return res.status(400).json({ Success: false, message: 'Color already exists' });
            }
        }

        // Push new colors to the size
        colors.map((c)=>{
            console.log("Colors: ",c);
            size.colors.push(c); // Using spread to push multiple colors at once
        })
        console.log("Size Colors: ",size.colors);
        // Update the product document with new colors
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: { "size.$[size].colors": size.colors } },
            {
                arrayFilters: [{ "size._id": sizeId }], // Use arrayFilters for modifying the nested array
                new: true // Return the updated document
            }
        );

        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product or Size not found' });
        }

        // Recalculate total stock based on all sizes and their colors
        let totalStock = 0;
        product.size.forEach(s => {
            if (s.colors) {
                let sizeStock = s.quantity; // Start with the size's own quantity
                s.colors.forEach(color => {
                    sizeStock += color.quantity; // Add color quantities to size stock
                });
                totalStock += sizeStock;
            }
        });

        // Collect all colors for the updated product
        const AllColors = [];
        product.size.forEach(s => {
            if (s.colors) {
                s.colors.forEach(c => {
                    const colorsImageArray = c.images.filter(image => image !== "");
                    c.images = colorsImageArray; // Remove empty image entries
                    AllColors.push(c);
                });
            }
        });

        // Update the total stock and AllColors array in the product document
        await ProductModel.updateOne(
            { _id: productId },
            { $set: { totalStock, AllColors } },
            { new: true }
        );

        // Send the success response after everything is done
        res.status(200).json({ Success: true, message: 'Color Added Successfully' });
    } catch (error) {
        console.log("Error Adding Color: ", error);
        logger.error("Error Adding Color: " + error.message);
        // Ensure a single response is sent
        if (!res.headersSent) {
            res.status(500).json({ Success: false, message: 'Internal Server Error' });
        }
    }
};



export const UpdateColorStock = async (req, res) => {
    try {
        const { productId, sizeId, colorId, updatedAmount } = req.body;
        const alreadyPresetProduct = await ProductModel.findById(productId);
        if(!alreadyPresetProduct){
            return res.status(404).json({ Success: false, message: 'Product not found' });
        }
        // Update the color quantity directly within the product document
        const product = await ProductModel.findOneAndUpdate(
            { _id: productId, "size._id": sizeId, "size.colors._id": colorId }, // Find product, size, and color by IDs
            { 
                $set: { 
                    "size.$[size].colors.$[color].quantity": updatedAmount // Update color quantity in the specified size
                }
            },
            {
                arrayFilters: [
                    { "size._id": sizeId }, // Array filter to match the size
                    { "color._id": colorId } // Array filter to match the color within the size
                ],
                new: true // Return the updated document
            }
        );

        if (!product) {
            return res.status(404).json({ Success: false, message: 'Product, Size, or Color not found' });
        }

        // Recalculate the total stock for the entire product
        let totalStock = 0;
        product.size.forEach(size => {
            if (size.colors) {
                let sizeStock = size.quantity; // Start with the size's own quantity
                size.colors.forEach(color => {
                    sizeStock += color.quantity; // Add color quantities to the size stock
                });
                totalStock += sizeStock;
            }
        });
        
        // Update the total stock of the product
        const UpdatedProduct = await ProductModel.updateOne(
            { _id: productId },
            { $set: { totalStock: totalStock } }
        );

        res.status(200).json({ Success: true, message: 'Color Stock Updated Successfully' ,result:UpdatedProduct});
    } catch (error) {
        console.log("Error Updating Color Stock: ", error);
        logger.error("Error Updating Color Stock: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};



export const getProductTotalStocks = async (req,res)=>{
    try {
        const products = await ProductModel.find({});
        let totalStock = 0;
        products.forEach(product => {
            totalStock += product?.totalStock;
        });
        res.status(200).json({Success:true,message: 'All Stocks',result:totalStock || -1});
    } catch (error) {
        console.error("Error getting all stocks: ",error);
        logger.error("Error getting all stocks: " + error.message);
        res.status(500).json({Success:false,message: 'Internal Server Error',result:-1});

    }
}
export const getTotalProductStocks = async (req,res)=>{
    try {
        const products = await ProductModel.find({});
        let totalStock = 0;
        products.forEach(product => {
            totalStock += product?.totalStock;
        });
        res.status(200).json({Success:true,message: 'All Products',result:totalStock});
    } catch (error) {
        console.error("Error getting all products: ",error);
        logger.error("Error getting all products: " + error.message);
        res.status(500).json({Success:false,message: 'Internal Server Error'});

    }
}


export const getOrderDeliveredGraphData = async (req, res) => { 
    try {
        // Get the startDate, endDate, and period from query parameters, or default to a wide range
        const { startDate, endDate, period } = req.query;
        console.log("reqQuery: ", req.query);

        // Convert the startDate and endDate to Date objects, if provided
        const start = startDate ? new Date(startDate) : new Date('2000-01-01'); // Default to a wide range if not provided
        const end = endDate ? new Date(endDate) : new Date(); // Default to the current date if not provided

        // Initialize the match stage
        let matchStage = {
            $match: {
                status: 'Delivered', // Filter orders where status is 'Delivered'
                createdAt: { $gte: start, $lte: end }, // Filter orders created within the date range
            },
        };

        // Adding projection stage to extract date (day, month, year) from 'createdAt' field
        const projectStage = {
            $project: {
                day: { $dayOfMonth: "$createdAt" },    // Extract day from 'createdAt'
                month: { $month: "$createdAt" },       // Extract month from 'createdAt'
                year: { $year: "$createdAt" },         // Extract year from 'createdAt'
                createdAt: 1                           // Retain the createdAt field for matching date range
            },
        };

        // Perform the aggregation to get daily delivered order count
        const result = await OrderModel.aggregate([
            matchStage,      // Match orders based on the provided date range and status
            projectStage,    // Project day, month, and year from createdAt
            {
                $group: {
                _id: { day: "$day", month: "$month", year: "$year" }, // Group by day, month, and year
                count: { $sum: 1 }  // Count delivered orders for each day
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day
            }
        ]);

        // If there is no data
        if (!result || result.length === 0) {
            return res.status(200).json({
                Success: true,
                message: 'No delivered order growth data available',
                result: []
            });
        }

        // Format the result for frontend display (YYYY-MM-DD)
        const formattedResult = result.map((item) => ({
            date: `${item._id.year}-${item._id.month < 10 ? `0${item._id.month}` : item._id.month}-${item._id.day < 10 ? `0${item._id.day}` : item._id.day}`,
            count: item.count
        }));

        console.log("Formatted result: ", formattedResult);

        res.status(200).json({
            Success: true,
            message: 'Delivered Order Growth Data',
            result: formattedResult
        });
    } catch (error) {
        console.error("Error fetching delivered order growth data: ", error);
        logger.error("Error fetching: delivered order growth data" + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};



export const getCustomerGraphData = async (req, res) => {
    try {
        // Get the startDate and endDate from query parameters, or default to a wide range
        const { startDate, endDate, period } = req.query;
        console.log("reqQuery: ", req.query);

        // Convert the startDate and endDate to Date objects, if provided
        const start = startDate ? new Date(startDate) : new Date('2000-01-01'); // Default to a wide range if not provided
        const end = endDate ? new Date(endDate) : new Date(); // Default to the current date if not provided

        // Initialize the match stage
        let matchStage = {
            $match: {
                createdAt: { $gte: start, $lte: end }, // Filter customers created within the date range
            },
        };

        // Adding projection stage to extract date (day, month, year) from 'createdAt' field
        const projectStage = {
            $project: {
                day: { $dayOfMonth: "$createdAt" },    // Extract day from 'createdAt'
                month: { $month: "$createdAt" },       // Extract month from 'createdAt'
                year: { $year: "$createdAt" },         // Extract year from 'createdAt'
                createdAt: 1                           // Retain the createdAt field for matching date range
            },
        };

        // Perform the aggregation to get daily customer count
        const result = await User.aggregate([
            matchStage,      // Match customers based on the provided date range
            projectStage,    // Project day, month, and year from createdAt
            {
                $group: {
                _id: { day: "$day", month: "$month", year: "$year" }, // Group by day, month, and year
                count: { $sum: 1 }  // Count customers for each day
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day
            }
        ]);

        // If there is no data
        if (!result || result.length === 0) {
            return res.status(200).json({
                Success: true,
                message: 'No customer growth data available',
                result: []
            });
        }

        // Format the result for frontend display
        const formattedResult = result.map((item) => ({
            date: `${item._id.year}-${item._id.month < 10 ? `0${item._id.month}` : item._id.month}-${item._id.day < 10 ? `0${item._id.day}` : item._id.day}`,
            count: item.count
        }));

        console.log("Formatted result: ", formattedResult);

        res.status(200).json({
            Success: true,
            message: 'Customer Growth Data',
            result: formattedResult
        });
    } catch (error) {
        console.error("Error fetching customer growth data: ", error);
        logger.error("Error fetching customer growth data: "+ error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};



export const getOrdersGraphData = async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query; // Get query parameters

        // Convert startDate and endDate to Date objects
        const start = startDate ? new Date(startDate) : new Date('2000-01-01'); // Default to a wide range if not provided
        const end = endDate ? new Date(endDate) : new Date(); // Default to the current date if not provided

        // Initialize the match stage to filter orders based on startDate and endDate
        const matchStage = {
            $match: {
                createdAt: { $gte: start, $lte: end }, // Filter orders created within the date range
            },
        };

        // Initialize the groupBy structure and projection
        let groupBy = {};
        let projectStage = {};

        // Grouping based on 'period' query parameter
        if (period === 'monthly') {
            // For monthly period: Group by month and year
            projectStage = {
                $project: {
                    month: { $month: "$createdAt" },  // Extract month from 'createdAt'
                    year: { $year: "$createdAt" },    // Extract year from 'createdAt'
                },
            };
            groupBy = { month: "$month", year: "$year" }; // Group by month and year
        } else if (period === 'yearly') {
            // For yearly period: Group by year only
            projectStage = {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from 'createdAt'
                },
            };
            groupBy = { year: "$year" }; // Group by year
        } else {
            // Default to monthly if no valid period is provided
            projectStage = {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
            };
            groupBy = { month: "$month", year: "$year" }; // Default group by month and year
        }

        // Perform the aggregation based on the selected period
        const result = await OrderModel.aggregate([
            matchStage,  // Filter by date range
            projectStage, // Extract month and year from 'createdAt'
            {
                $group: {
                    _id: groupBy,  // Group by month/year based on period
                    count: { $sum: 1 } // Count the number of orders in each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month (for monthly data)
            }
        ]);

        // If there is no data
        if (!result || result.length === 0) {
            return res.status(200).json({
                Success: true,
                message: 'No order growth data available',
                result: []
            });
        }

        // Format the result for frontend display
        const formattedResult = result.map((item) => {
            let formattedDate = '';
            if (item._id.month && item._id.year) {
                // For monthly data, return the first day of the month in "DD-MM-YYYY" format
                formattedDate = new Date(item._id.year, item._id.month - 1, 1); // Month is 0-indexed
                formattedDate = `${formattedDate.getDate().toString().padStart(2, '0')}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-${formattedDate.getFullYear()}`;
            } else if (item._id.year) {
                // For yearly data, return just the year
                formattedDate = item._id.year.toString();
            }

            return {
                date: formattedDate,  // Formatted date (01-MM-YYYY or YYYY)
                count: item.count
            };
        });

        res.status(200).json({
            Success: true,
            message: 'Order Growth Data',
            result: formattedResult
        });
    } catch (error) {
        console.error("Error fetching order growth data: ", error);
        logger.error("Error fetching order growth data: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};



export const getTotalUsers = async (req,res)=>{
    try {
        const users = await User.find({role: 'user'});
        console.log("Users: ",users)
        res.status(200).json({Success:true,message: 'All Users',result:users?.length || -1});
    } catch (error) {
        console.error("Error getting all users: ",error);
        logger.error("Error getting all users: " + error.message);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const fetchAllCustomerUsers = async (req, res) => {
    try {
        // Fetch all users with the 'user' role
        const users = await User.find({ role: 'user' });

        // Fetch the cart details for each user
        const allCarForUser = await Promise.all(
            users.map(async (u) => {
                let userNew = {
                    _id: u._id,
                    name: u.name,
                    email: u.email,
                    phoneNumber: u.phoneNumber,
                    address: u.addresses,
                    gender:u.gender,
                    DOB:u.DOB,
                    createdAt: u.createdAt,
                    role: u.role,
                    totalPurchases:0,
                    cart: [],
                    orders: [],
                    wishList: [],
                };
                try {
                    // Fetch the cart items for each user and populate the product details
                    const cart = await Bag.findOne({ userId: u._id }).populate("orderItems.productId");
                    // const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(cart);
                    const orders = await OrderModel.find({userId: u._id});
                    const wishList = await WhishList.findOne({userId: u._id.toString()}).populate("orderItems.productId");
                    // console.log("Found wishList:",u.name,u._id,wishList?.orderItems);
                    // Calculate the total amount spent by the user
                    // You can modify the user object by appending the cart data to it
                    const totalAmount = orders.reduce((accumulator, order) => {
                        return accumulator + order.TotalAmount;
                    }, 0);
                    userNew.totalPurchases = orders.length > 0 ? totalAmount : 0;
                    userNew.cart = cart?.orderItems || []; // Attach cart data to the user object
                    userNew.orders = orders; // Attach order data to the user object
                    userNew.wishList = wishList?.orderItems || []; // Attach wish list data to the
                } catch (error) {
                    console.error(`Error getting cart for user ${u._id}:`, error);
                    logger.error(`Error getting cart for user ${u._id}: ` + error.message);
                }
                return userNew; // Return the user object even if there is an error fetching cart
            })
        );
        // console.log("All Customer Dat: ",allCarForUser);
        // Respond with the modified user objects including cart data
        res.status(200).json({
            Success: true,
            message: 'All Customer Users with their Cart Data',
            result: allCarForUser || [],
        });
    } catch (error) {
        console.error("Error getting all customer users: ", error);
        logger.error("Error getting all customer users: " + error.message);
        res.status(500).json({ Success: false, message: 'Internal Server Error' });
    }
};

export const getMaxDeliveredOrders = async (req,res)=>{
    try {
        const orders = await OrderModel.find({status: 'Delivered'});
        res.status(200).json({Success:true,message: 'All Delivered Orders',result:orders?.length || 0});
    } catch (error) {
        console.error("Error getting all delivered orders: ",error);
        logger.error("Error getting all delivered orders: "+ error.message)
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const getRecentOrders = async (req,res)=>{
    try {
        const recentOrders = await OrderModel.find().populate('userId')
        .sort({ createdAt: -1 })  // Sort by createdAt in descending order (latest first)
        .limit(10);  // Limit the results to 10 most recent orders
        res.status(200).json({Success:true,message: 'All Recent Orders',result:recentOrders || []});
    } catch (error) {
        console.error("Error getting all delivered orders: ",error);
        logger.error("Error getting Recent orders: "+ error.message)
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
async function TopSellingProducts(limit = 10) {
    try {
         // Aggregate to find top-selling products
        const topSelling = await OrderModel.aggregate([
            { $unwind: "$orderItems" },  // Flatten the 'orderItems' array to access individual products
            { $group: {
                _id: "$orderItems.productId._id",  // Group by productId (referencing the Product collection)
                totalQuantitySold: { $sum: "$orderItems.productId.quantity" },  // Sum the quantities sold for each product
            }
            },
            { $sort: { totalQuantitySold: -1 } },  // Sort by quantity sold (descending)
            { $limit: limit },  // Limit to the top N products (default is 10)
            { $lookup: {
                from: "product",  // Look up product details from the 'products' collection
                localField: "_id",  // Field from the aggregation result (productId)
                foreignField: "_id",  // Field in the 'products' collection to match
                as: "productDetails",  // Field to hold the matched product details
            }
            },
            { $unwind: "$productDetails" },  // Unwind the productDetails array to get a single product object
            { $project: {
                _id: 0,  // Exclude the _id field from the final result
                productId: "$_id",  // The productId
                name: "$productDetails.title",  // Product name from the Product collection
                price: "$productDetails.price",  // Product price from the Product collection
                totalQuantitySold: 1,  // Include total quantity sold
            }
            }
        ]);
    
        return topSelling;
    } catch (error) {
        console.error('Error fetching top-selling products: ', error);
        logger.error('Error fetching top-selling products: ' + error.message);
        throw new Error('Failed to retrieve top-selling products');
    }
}
export const getTopSellingProducts = async (req,res)=>{
    try {
        // Step 1: Find all orders with status 'Delivered'
        const orders = await OrderModel.find({ status: 'Delivered' }).select('orderItems');

        // Step 2: Create a map to store frequency of productIds
        const productCountMap = {};

        // Loop through all orders and their orderItems to count productId frequency
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const productId = item.productId._id; // Assuming productId is an object with _id
                if (productId) {
                    productCountMap[productId] = (productCountMap[productId] || 0) + 1;
                }
            });
        });

        // Step 3: Convert productCountMap into an array of { productId, count }
        const productCountArray = Object.entries(productCountMap).map(([productId, count]) => ({
            productId,
            count,
        }));

        // Step 4: Sort by count in descending order to get the most sold products first
        productCountArray.sort((a, b) => b.count - a.count);

        // Step 5: Get top-selling productIds (for example, top 5 products)
        const topSellingProductIds = productCountArray.slice(0, 5).map(item => item.productId);

        // Step 6: Query the Products collection to get the details of the top-selling products
        const topSellingProducts = await ProductModel.find({
            _id: { $in: topSellingProductIds }
        });

        // console.log("Got top-selling products: ",topSelling);
        res.status(200).json({Success:true,message: 'All Top Selling Orders',result:topSellingProducts || []});
    } catch (error) {
        console.error("Error getting all delivered orders: ",error);
        logger.error("Error getting Top Selling Products orders: "+ error.message)
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const getAllProducts = async (req,res)=>{
    try {
        const products = await ProductModel.find({});
        res.status(200).json({Success:true,message: 'All Products',result:products?.length || 0});
    } catch (error) {
        console.error("Error getting all products: ",error);
        logger.error("Error getting all products: "+ error.message)
        res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
    }
}