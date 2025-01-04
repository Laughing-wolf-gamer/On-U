import User from "../../model/usermodel.js";
import bcrypt from 'bcryptjs';
import sendtoken from "../../utilis/sendtoken.js";
import ProductModel from "../../model/productmodel.js";
import OrderModel from "../../model/ordermodel.js";
export const registerNewAdmin = async(req,res)=>{
    try {
        const {name,email,password,phoneNumber,role} = req.body;
        console.log("Authenticating with: ",name,email,password,phoneNumber)
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

    // Update the total stock of the product directly
    const UpdateProduct = await ProductModel.updateOne(
      { _id: productId },
      { $set: { totalStock: totalStock } },
      { new: true }
    );

    res.status(200).json({ Success: true, message: 'Size Stock Updated Successfully' ,result:UpdateProduct});
  } catch (error) {
    console.log("Error Updating Size Stock: ", error);
    res.status(500).json({ Success: false, message: 'Internal Server Error' });
  }
};


export const addNewSizeToProduct = async (req, res) => {
  try {
    const { productId, size } = req.body;
    console.log("Adding Size: ", productId, size);
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
    /* const alreadyPresetSize = alreadyPresetProduct.size.find(s => s.label === size.label);
    if(alreadyPresetSize){
      return res.status(400).json({Success:false,message: 'Size already exists'});
    } */
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
    res.status(500).json({ Success: false, message: 'Internal Server Error' });
  }
};

export const removeSizeFromProduct = async (req, res) => {
  try {
    const { productId, sizeId } = req.body;
    const product = await ProductModel.findOneAndUpdate({ _id: productId }, { $pull: { size: { _id: sizeId } } }, { new: true });
    if (!product) {
      return res.status(404).json({ Success: false, message: 'Product or Size not found' });
    }
    res.status(200).json({ Success: true, message: 'Size Removed Successfully' ,result:product});
  } catch (error) {
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

    // Update the total stock of the product
    const UpdatedProduct = await ProductModel.updateOne(
      { _id: productId },
      { $set: { totalStock: totalStock } },
      {new:true}
    );

    res.status(200).json({ Success: true, message: 'Color Removed Successfully' ,result:UpdatedProduct});
  } catch (error) {
    console.log("Error Removing Color: ", error);
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
    size.colors.push(...colors); // Using spread to push multiple colors at once
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
    /* if(!alreadyPresetProduct.size){
      return res.status(404).json({ Success: false, message: 'Size not found' });
    }
    if(!alreadyPresetProduct.size.colors){
      return res.status(404).json({ Success: false, message: 'Color not found' });
    } */
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
    res.status(500).json({Success:false,message: 'Internal Server Error'});

  }
}
export const getOrderDeliveredGraphData = async (req,res) => {
  try {
    // Perform aggregation on the OrderModel
    const result = await OrderModel.aggregate([
      // Match orders where status is 'Delivered'
      { $match: { status: 'Delivered' } },

      // Add fields for the month and year based on the 'createdAt' field (or the field that holds the date)
      {
        $addFields: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        }
      },

      // Group orders by year and month, counting the number of orders
      {
        $group: {
          _id: { year: "$year", month: "$month" },  // Group by year and month
          totalOrders: { $sum: 1 },  // Count orders in each group
        }
      },

      // Sort by year and month
      { 
        $sort: { "_id.year": 1, "_id.month": 1 } 
      }
    ]);
    if(!result || result.length === 0){
      return res.status(200).json({Success:true,message: 'No Orders by Month and Year',result:[]});
    }

    console.log(result);
    res.status(200).json({Success:true,message: 'Orders by Month and Year',result});
  } catch (err) {
    console.error("Error fetching orders: ", err);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
};
export const getCustomerGraphData = async (req, res) => {
  try {
    // Group customers by month (or year) based on the 'createdAt' field
    const result = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },  // Extract month from 'createdAt'
          year: { $year: "$createdAt" },    // Extract year from 'createdAt'
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          count: { $sum: 1 } // Count customers for each month/year
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
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

    // Map the result to a format that can be sent to the frontend
    console.log("Item: ",result);
    const formattedResult = result.map((item) => ({
      month: `${item._id.month < 10 ? `0${item._id.month}` : item._id.month}-${item._id.year}`,
      count: item.count
    }));

    console.log("Customer Growth Data: ", formattedResult);

    res.status(200).json({ Success: true, message: 'Customer Growth Data', result: formattedResult });
  } catch (error) {
    console.error("Error fetching customer growth data: ", error);
    res.status(500).json({ Success: false, message: 'Internal Server Error' });
  }
};

export const getOrdersGraphData = async (req, res) => {
  try {
    // Group orders by month (or year) based on the 'createdAt' field
    const result = await OrderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },  // Extract month from 'createdAt'
          year: { $year: "$createdAt" },    // Extract year from 'createdAt'
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          count: { $sum: 1 } // Count orders for each month/year
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
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

    // Map the result to a format that can be sent to the frontend
    const formattedResult = result.map((item) => ({
      month: `${item._id.month < 10 ? `0${item._id.month}` : item._id.month}-${item._id.year}`,
      count: item.count
    }));

    res.status(200).json({ Success: true, message: 'Order Growth Data', result: formattedResult });
  } catch (error) {
    console.error("Error fetching order growth data: ", error);
    res.status(500).json({ Success: false, message: 'Internal Server Error' });
  }
}

export const getTotalUsers = async (req,res)=>{
  try {
    const users = await User.find({role: 'user'});
    console.log("Users: ",users)
    res.status(200).json({Success:true,message: 'All Users',result:users?.length || -1});
  } catch (error) {
    console.error("Error getting all users: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
}
export const getMaxDeliveredOrders = async (req,res)=>{
  try {
    const orders = await OrderModel.find({status: 'Delivered'});
    res.status(200).json({Success:true,message: 'All Delivered Orders',result:orders?.length || -1});
  } catch (error) {
    console.error("Error getting all delivered orders: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
}
export const getAllProducts = async (req,res)=>{
  try {
    const products = await ProductModel.find({});

    res.status(200).json({Success:true,message: 'All Products',result:products?.length || 0});
  } catch (error) {
    console.error("Error getting all products: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
  }
}