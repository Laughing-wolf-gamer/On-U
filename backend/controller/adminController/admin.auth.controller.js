import User from "../../model/usermodel.js";
import bcrypt from 'bcryptjs';
import sendtoken from "../../utilis/sendtoken.js";
import WebSiteModel from "../../model/websiteData.model.js";
import ProductModel from "../../model/productmodel.js";
import OrderModel from "../../model/ordermodel.js";
export const registerNewAdmin = async(req,res)=>{
    try {
        const {userName,email,password,phoneNumber} = req.body;
        console.log("Authenticating with: ",userName,email,password,phoneNumber )
        let user = await User.findOne({email: email});
        if(user){
          return res.status(401).json({Success:false,message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password,12);
        user = new User({userName,email,password:hashedPassword,role:'admin'});
        await user.save();
        res.status(200).json({Success:true,message: 'User registered successfully'});
    } catch (error) {
        console.error(`Error registering user `,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const logInUser = async (req,res) =>{
    try {
        const {email,password} = req.body;
        if(!email) return res.status(401).json({Success:false,message: 'Please enter a valid email'});
        if(!password) return res.status(401).json({Success:false,message: 'Please enter a valid password'});
        const user = await User.findOne({email});
        if(!user){
          return res.status(404).json({Success:false,message: 'User not found'});
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


export const UpdateSizeStock = async (req,res)=>{
  try {
    const {productId,sizeId,updatedAmount} = req.body;
    const product = await ProductModel.findById(productId);
    if(!product) return res.status(404).json({Success:false,message: 'Product not found'});
    const size = product?.size?.find(size => size._id == sizeId);
    if(!size) return res.status(404).json({Success:false,message: 'Size not found'});
    size.quantity = updatedAmount;
    if (size && size.length > 0) {
      let totalStock = -1;
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
      if(totalStock > 0) product.totalStock = totalStock;
    };
    await product.save();
    res.status(200).json({Success:true,message: 'Size Stock Updated Successfully'});
  } catch (error) {
    console.log("Error Updating Size Stock: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
}
export const addNewSizeToProduct = async (req,res)=>{
  try {
    const {productId,size} = req.body;
    const product = await ProductModel.findById(productId);
    if(!product) return res.status(404).json({Success:false,message: 'Product not found'});
    product.size.push(size);
    let totalStock = -1;
    if (product.size && product.size.length > 0) {
      product.size.forEach(s => {
          let sizeStock = 0;
          if(s.colors){
              s.colors.forEach(c => {
                  sizeStock += c.quantity;
              });
          }
          totalStock += sizeStock;
      })
      // console.log("Colors: ",AllColors);
      if(totalStock > 0) product.totalStock = totalStock;
    }
    await product.save();
    res.status(200).json({Success:true,message: 'Size Added Successfully'});
  }catch (error) {
    console.log("Error Adding Size: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
}
export const addNewColorToSize = async (req,res)=>{
  try {
    const {productId,sizeId,color} = req.body;
    const product = await ProductModel.findById(productId);
    if(!product) return res.status(404).json({Success:false,message: 'Product not found'});
    const size = product?.size?.find(size => size._id == sizeId);
    if(!size) return res.status(404).json({Success:false,message: 'Size not found'});
    size.colors.push(color);
    let totalStock = -1;
    if (size && size.length > 0) {
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
      if(totalStock > 0) product.totalStock = totalStock;
    };
    await product.save();
    res.status(200).json({Success:true,message: 'Color Added Successfully'});
  } catch (error) {
    console.log("Error Adding Color: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
}
export const UpdateColorStock = async (req,res)=>{
  try {
    const {productId,sizeId,colorId,updatedAmount} = req.body;
    const product = await ProductModel.findById(productId);
    if(!product) return res.status(404).json({Success:false,message: 'Product not found'});
    const size = product?.size?.find(size => size._id == sizeId);
    if(!size) return res.status(404).json({Success:false,message: 'Size not found'});
    const color = size?.colors?.find(color => color._id == colorId);
    if(!color) return res.status(404).json({Success:false,message: 'Color not found'});
    color.quantity = updatedAmount;
    if (size && size.length > 0) {
      let totalStock = -1;
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
      if(totalStock > 0) product.totalStock = totalStock;
    };
    if(totalStock > 0) product.totalStock = totalStock;
    await product.save();
    res.status(200).json({Success:true,message: 'Color Stock Updated Successfully'});
  }catch (error) {
    console.log("Error Updating Color Stock: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error'});
  }
}


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
export const getAllProducts = async (req,res)=>{
  try {
    const products = await ProductModel.find({});

    res.status(200).json({Success:true,message: 'All Products',result:products?.length || 0});
  } catch (error) {
    console.error("Error getting all products: ",error);
    res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
  }
}