import A from '../Middelwares/resolveandcatch.js'
import WhishList from '../model/wishlist.js'
import Bag from '../model/bag.js'
import OrderModel from '../model/ordermodel.js'
import ProductModel from '../model/productmodel.js'
import { fetchPayments, generateOrderRequest } from '../utilis/paymentGatwayHelper.js'
import Coupon from '../model/Coupon.model.js'
import WebSiteModel from '../model/websiteData.model.js'
import { generateOrderForShipment } from './LogisticsControllers/shiprocketLogisticController.js'
import { sendOrderPlacedMail } from './emailController.js'
import mongoose from 'mongoose'
import logger from '../utilis/loggerUtils.js'

export const createPaymentOrder = async (req, res, next) => {
    try {
        console.log("Order User ID:", req.user?.id);
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }
        
        const { bagId, orderItems, totalAmount,address, paymentMode, orderStatus } = req.body;
        const orderData = await generateOrderRequest(totalAmount,req.user.id,orderItems,req.user.user.phoneNumber)
        
        console.log("orderRecept Data: ", orderData);
        if (!orderData) {
            return res.status(400).json({ success: false, message: "Please Provide All the Data" });
        }
        res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

    } catch (error) {
        console.error("Error creating Order:", error);
        res.status(500).json({ success: false, message: "Internal server Error" });
    }
}

export const verifyPayment = async (req, res, next) => {
    try {
        // Check for user existence
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        const { paymentData, SelectedAddress, orderDetails, totalAmount, bagId } = req.body;

        console.log("Payment Verification Request: ", req.body);

        // Validate if paymentData exists
        if (!paymentData) {
            return res.status(400).json({ success: false, message: "All Fields are required" });
        }

        // Fetch payment status
        const paymentStatus = await fetchPayments(paymentData.order_id);
        console.log("Payment Status: ", paymentStatus);

        // If no payment status found
        if (!paymentStatus || paymentStatus.length === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        // Check if the payment status is "SUCCESS"
        if (paymentStatus[0].payment_status === "SUCCESS") {
            const bagData = await Bag.findById(bagId).populate('orderItems.productId');

            // If bag data exists
            if (bagData) {
                console.log("Bag Data: ", bagData);

                // Create new order
                const orderData = new OrderModel({
                    userId: req.user.id,
                    orderItems: orderDetails,
                    SelectedAddress: SelectedAddress,
                    TotalAmount: totalAmount,
                    paymentMode: paymentStatus[0].payment_group,
                    status: 'Order Confirmed',
                });

                await orderData.save();
                console.log("Order Created Successfully: ", orderData);

                // Handle product removal in parallel
                const removeProductPromises = orderDetails.map(async (item) => {
                    try {
                        console.log(`Removing Product: ${item.productId._id}, Color: ${item.color.label}, Size: ${item.size}, Quantity: ${item.quantity}`);
                        await removeProduct(item.productId._id, item.color.label, item.size, item.quantity);
                    } catch (err) {
                        console.error(`Error removing product: ${item.productId._id}`, err);
                    }
                });

                await Promise.all(removeProductPromises);

                // Remove the bag from the database
                await Bag.findByIdAndDelete(bagId);
                console.log("Bag Removed: ", bagId);

                return res.status(200).json({
                    success: true,
                    message: "Order Created Successfully",
                    result: "SUCCESS",
                    userId: req.user.id
                });
            }
        }

        // Handle case where payment is not successful
        return res.status(200).json({
            success: true,
            message: 'Payment Not Completed!',
            result: "FAILED",
            userId: req.user.id
        });

    } catch (error) {
        console.error('Error while verifying payment request:', error);

        // Avoid sending multiple responses if headers already sent
        if (res.headersSent) return;

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            userId: req.user?.id
        });
    }
};



export const createorder = async (req, res, next) => {
    try {
        // Validate user
        if (!req.user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        // Destructure and validate the required fields from the body
        const { orderItems, Address, bagId, TotalAmount, paymentMode, status } = req.body;

        if (!orderItems || !Address || !bagId || !TotalAmount || !paymentMode || !status) {
            return res.status(400).json({ success: false, message: "Please Provide All the Data" });
        }

        // Helper function to generate a random order ID
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        const randomOrderShipRocketId = generateRandomId();

        // Create a new order entry
        const orderData = new OrderModel({
            ShipRocketOrderId: randomOrderShipRocketId,
            userId: req.user.id,
            orderItems,
            SelectedAddress: Address,
            TotalAmount,
            paymentMode,
            status: 'Processing',
        });

        // Save the order data to the database
        await orderData.save();

        // Perform the item removal asynchronously (parallelize them)
        const removingAmountPromises = orderItems.map(item => 
            removeProduct(item.productId._id, item.color.label, item.size, item.quantity).catch(err => {
                console.error(`Error removing product: ${item?.productId?._id}`, err);
            })
        );

        // Wait for all removal operations to complete
        await Promise.all(removingAmountPromises);

        // Handle bag removal if applicable
        await Bag.findByIdAndDelete(bagId);

        // Send order confirmation email
        await sendOrderPlacedMail(req.user.id, orderData);

        // Respond with success message
        res.status(200).json({ success: true, message: "Order Created Successfully", result: orderData });

    } catch (error) {
        // Log the error and ensure the response is only sent once
        console.error("Error creating Order: ", error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
};


const removeProduct = async(productId,color,size,quantity) => {
    try {
        const product = await ProductModel.findById(productId);
        if(!product) {
            console.log("Product Not Found: ",productId);
            return
        };
        const activeSize = product.size.find(s => s?.label == size);
        if(!activeSize) {
            console.log("Size Not Found: ",size);
            return
        }
        const activeColor = activeSize.colors.find(c => c?.label == color);
        if(!activeColor) {
            console.log("Color Not Found: ",color);
            return
        }
        const colorReducedAmount = activeColor.quantity - quantity
        const sizeReducedAmount = activeSize.quantity - quantity
        console.log("Reduced Amount: ",colorReducedAmount,sizeReducedAmount);
        activeColor.quantity = colorReducedAmount;
        activeSize.quantity = sizeReducedAmount;
        const AllColors = []
        product.size.forEach(s => {
            if(s.colors){
                s.colors.forEach(c => {
                    AllColors.push(c);
                });
            }
        });
        product.AllColors = AllColors;
        if (product.size && product.size.length > 0) {
            let totalStock = 0;
            product.size.forEach(s => {
                let sizeStock = 0;
                if(s.colors){
                    s.colors.forEach(c => {
                        sizeStock += c.quantity;
                    });
                }
                totalStock += sizeStock;
            })
            if(totalStock > 0) product.totalStock = totalStock;
        };
        await product.save();
        console.log("Product Updated: ",product);
    } catch (error) {
        console.error("Error Removing Product: ",error)
    }
}
export const getallOrders = A(async (req, res, next) => {
    try {
        console.log("Order User",req.user);  
        if(!req.user){
            return res.status(400).json({success:false,message:"No User Found!",result:[]});
        }
        const orders = await OrderModel.find({userId:req.user.id});
        
        res.status(200).json({success:true,message:"Successfully Fetched Orders",result:orders || []})

    } catch (error) {
        console.error("Error Fetching Orders...",error)
        res.status(500).json({success:false,message:"Internal server Error"});
    }
})


export const getOrderById = async (req, res, next) => {
    try {
        const{orderId} = req.params
        if(!orderId){
            return res.status(404).json({success:false,message:"Please Provide OrderId: ",result:null})
        }
        if(!req.user){
            return res.status(404).json({success:false,message:"Please Provide User: ",result:null})
        }
        const order = await OrderModel.findById(orderId);
        if(order.userId.toString() !== req.user.id){
            return res.status(400).json({success:false,message:`Not the User Order ${req.user.id}`});
        }
        res.status(200).json({success:true,message:"Found Order",result:order});
        
    } catch (error) {
        console.error("Error Getting Order Details: ",error);
        res.status(500).json({success:false,message:"Internal server Error"});
    }
}

export const createwishlist = async (req, res, next) => {
    try {
        const id = req.user.id;
        const{productId} = req.body;
        console.log("Creating Wish List: ",req.body);
        if(!id){
            return res.status(200).json({success:false,message: "user Is Not Logged In"})
        }
        if(!productId) {
            return res.status(200).json({success:false,message: "Product id Required"});
        }
        let previousWishList = await WhishList.findOne({userId:id})
        // console.log("Creating Wish List: ",previousWishList);
        if(previousWishList){
            const isAlreadyPresent = previousWishList.orderItems.find(item => item.productId.toString() === productId);
            if (isAlreadyPresent) {
                console.log("Product already present",isAlreadyPresent);
                // return res.status(409).json({ success: false, message: "Product already in wishlist" });
                const index = previousWishList.orderItems.findIndex(item => item.productId.toString() === productId)
                previousWishList.orderItems.splice(index, 1);
                await previousWishList.save();
                return res.status(200).json({success:false,message: "Product removed from wishlist"})
            }
            previousWishList.orderItems.push({productId: mongoose.Types.ObjectId(productId)});
            await previousWishList.save();
            return res.status(200).json({success:true,message: "Product added to wishlist"})
        }
        previousWishList = new WhishList({userId:id, orderItems:[{
            productId: mongoose.Types.ObjectId(productId),  // Ensure productId is cast to ObjectId
        }]})
        await previousWishList.save();
        // previousWishList = await WhishList.findOne({userId:id}).populate('orderItems.productId')
        res.status(200).json({success:true,message: "Product added to wishlist"})
    } catch (error) {
        console.error("Error creating wishlist: ",error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getwishlist = async (req, res) => {
    try {
        // console.log("Get wishlist: ",req.user.id)
        const userId = req.user.id;
        if(!userId) return res.status(404).json({success:false,message: "No WishList Found!",wishlist:[]}); //
        const wishlist = await WhishList.findOne({userId: req.user.id}).populate('orderItems.productId')
        console.log("All Wishlist: ", wishlist);
        res.status(200).json({
            success:true,
            wishlist: wishlist || []
        })
        
    } catch (error) {
        console.error("Error getting: ",error);
        res.status(500).json({message: "Internal server error"});  
    }
}

export const applyCouponToBag = async(req,res)=>{
    try {
        const{id} = req.user;
        const{bagId} = req.params;
        const{couponCode} = req.body;
        
        const coupon = await Coupon.findOne({CouponCode: couponCode});
        console.log("Coupon Code: ",coupon)
        if(!coupon){
            return res.status(404).json({message: "Coupon Not Found"})
        }
        if (coupon.ValidDate < Date.now()) {
            return res.status(400).json({ message: "Coupon is expired" });
        }
        const bag = await  Bag.findById(bagId);
        console.error("Coupon bag",bag);
        if(!bag){
            return res.status(404).json({message: "Bag Not Found"})
        }
        if(bag.Coupon){
            return res.status(400).json({message: "Bag already has a coupon"})
        }
        if(bag.userId.toString() !== id){
            return res.status(400).json({message: "Coupon cannot be applied to this bag"})
        }
        bag.Coupon = coupon._id;
        coupon.Status = "Inactive";
        
        await Promise.all([
            coupon.save(),
            bag.save()
        ])
        res.status(200).json({success:true,message: "Coupon Applied Successfully"})
    } catch (error) {
        console.error("Failed to apply coupon: ",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }

}
export const removeCouponToBag = async(req,res)=>{
    try {
        const{id} = req.user;
        const{bagId} = req.params;
        const{couponCode} = req.body;
        const bag = await Bag.findById(bagId).populate("Coupon");
        // console.error("Coupon bag",bag);
        if(!bag){
            return res.status(404).json({message: "Bag Not Found"})
        }
        
        const coupon = await Coupon.findOne({CouponCode: couponCode});
        console.log("Coupon Code: ",coupon)
        if(!coupon){
            return res.status(404).json({message: "Coupon Not Found"})
        }
        if(!bag.Coupon){
            return res.status(400).json({message: "No Coupon Found"})
        }
        if(bag.userId.toString() !== id){
            return res.status(400).json({message: "Coupon cannot be applied to this bag"})
        }
        bag.Coupon = null;
        coupon.Status = "Active";
        
        await Promise.all([
            coupon.save(),
            bag.save()
        ])
        res.status(200).json({success:true,message: "Coupon Removed Successfully"})
    } catch (error) {
        console.error("Failed to apply coupon: ",error);
        res.status(500).json({success:false,message:"Internal server error"});
    }

}

export const addItemsArrayToBag = async(req,res)=>{
    try {
        console.log("Bag Array: ",req.body);
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message: "User Not Logged In"})
        }
        const convenienceFees = await WebSiteModel.findOne({tag:'ConvenienceFees'});
        const FindUserBag = await Bag.findOne({userId}).populate('orderItems.productId');
        if(!FindUserBag){
            const bag = new Bag({userId,ConvenienceFees:convenienceFees?.ConvenienceFees || 0,orderItems:req.body.map(p => ({productId:p.productId,quantity:p.quantity,color:p.color,size:p.size}))})
            const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(bag);
            if(totalProductSellingPrice && totalProductSellingPrice !== 0) bag.totalProductSellingPrice = totalProductSellingPrice;
            if(totalSP && totalSP !== 0) bag.totalSP = totalSP;
            if(totalDiscount && totalDiscount !== 0) bag.totalDiscount = totalDiscount;
            if(totalMRP && totalMRP !== 0) bag.totalMRP = totalMRP;
            await bag.save();
            // console.log("User Bag: ",bag);
        }else{
            const emittingResponse = req.body.map(async (p)=>{
                const product = FindUserBag.orderItems.find(p => p.productId._id.toString() == p.productId)
                if(product){
                    if(product.quantity !== p.quantity){
                        product.quantity = product.quantity + p.quantity
                    }
                }else{
                    FindUserBag.orderItems.push({productId:p.productId,quantity:p.quantity,color:p.color,size:p.size})
                }
                const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(FindUserBag);

                if(totalProductSellingPrice && totalProductSellingPrice !== 0) FindUserBag.totalProductSellingPrice = totalProductSellingPrice;
                if(totalSP && totalSP !== 0) FindUserBag.totalSP = totalSP;
                if(totalDiscount && totalDiscount !== 0) FindUserBag.totalDiscount = totalDiscount;
                if(totalMRP && totalMRP !== 0) FindUserBag.totalMRP = totalMRP;
            })
            await Promise.all(emittingResponse)
            await FindUserBag.save()
        }
        // const bag = await Bag.findOne({userId}).populate('orderItems.productId orderItems.color orderItems.size orderItems.quantity')
        console.log("User Bag: ",FindUserBag);
        res.status(200).json({success:true,message: "Items added to bag"})
    } catch (error) {
        console.error("Failed to add items array: ",error);
        res.status(500).json({success:false,message:"Internal server error",});
    }
}
export const addItemsArrayToWishList = async(req,res)=>{
    try {
        const userId = req.user.id;
        const{productIdArray} = req.body;
        console.log("Wish list Array: ",productIdArray);
        if(!productIdArray){
            return res.status(200).json({success:false,message: "Product Array Not Found"})
        }
        let previousWishList = await WhishList.findOne({userId:userId})
        const allArray = productIdArray.map((p => p.productId._id));
        console.log("Saved wishList: ",allArray.map(p => ({
            productId: mongoose.Types.ObjectId(p),  // Ensure productId is cast to ObjectId
        })));
        if(previousWishList){
            const emitPromise = allArray.map(async(productId) =>{
                const isAlreadyPresent = previousWishList.orderItems.find(item => item.productId.toString() === productId);
                if (!isAlreadyPresent) {
                    previousWishList.orderItems.push({productId: mongoose.Types.ObjectId(productId)});
                }
            })
            await Promise.all(emitPromise)
            await previousWishList.save();
            res.status(200).json({success:true,message: "Items added to Wish List"})
            return;
        }
        previousWishList = new WhishList({userId:userId, orderItems:allArray.map(p => ({
            productId: mongoose.Types.ObjectId(p),  // Ensure productId is cast to ObjectId
        }))})
        await previousWishList.save();
        res.status(200).json({success:true,message: "Items added to Wish List"})
    } catch (error) {
        console.error("Failed to add items array: ",error);
        res.status(500).json({success:false,message:"Internal server error",});
    }
}

export const addItemsToBag = async (req, res) => {
    try {
        console.log("Bag Body",req.body)
        const {userId,productId,quantity,color,size} = req.body
        if(!userId || !productId || !quantity || !color || !size){
            return res.status(400).json({message: "Please provide all the required fields"})
        }
        
        const FindUserBag = await Bag.findOne({userId}).populate('orderItems.productId');
        if(!FindUserBag){
            const convenienceFees = await WebSiteModel.findOne({tag:'ConvenienceFees'});
            const bag = new Bag({userId,ConvenienceFees:convenienceFees?.ConvenienceFees || 0,orderItems:[{productId,quantity,color,size}]})
            const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(bag);
            if(totalProductSellingPrice && totalProductSellingPrice !== 0) bag.totalProductSellingPrice = totalProductSellingPrice;
            if(totalSP && totalSP !== 0) bag.totalSP = totalSP;
            if(totalDiscount && totalDiscount !== 0) bag.totalDiscount = totalDiscount;
            if(totalMRP && totalMRP !== 0) bag.totalMRP = totalMRP;
            
            await bag.save();
        }else{
            const product = FindUserBag.orderItems.find(p => p.productId._id == productId)
            if(product){
                product.quantity = product.quantity + quantity
            }else{
                FindUserBag.orderItems.push({productId,quantity,color,size})
            }
            const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(FindUserBag);
            console.log("Total Product Selling Price: ", totalProductSellingPrice, totalSP, totalDiscount, totalMRP)
            if(totalProductSellingPrice && totalProductSellingPrice !== 0) FindUserBag.totalProductSellingPrice = totalProductSellingPrice;
            if(totalSP && totalSP !== 0) FindUserBag.totalSP = totalSP;
            if(totalDiscount && totalDiscount !== 0) FindUserBag.totalDiscount = totalDiscount;
            if(totalMRP && totalMRP !== 0) FindUserBag.totalMRP = totalMRP;
            await FindUserBag.save()
        }
        const bag = await Bag.findOne({userId}).populate('orderItems.productId orderItems.color orderItems.size orderItems.quantity')
        // console.log("Bag Items: ",bag)
        res.status(200).json({success:true,message:"Successfully added Items to Bag",bag})
    } catch (error) {
        console.error("Error Occurred during creating bag: ", error)
        res.status(500).json({success:false,message: "Internal Server Error"})
    }

}
const getItemsData = async (bag) => {
    console.log("getItemsData Bag Items: ",bag.orderItems)
    let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
    let totalMRP = 0;

    // Use for...of to handle async properly
    for (const item of bag.orderItems) {
        const { productId, quantity } = item;

        // Await the database query
        const productData = await ProductModel.findById(productId?._id || productId);
        const { salePrice, price } = productData;

        // Calculate item totals
        const productSellingPrice = salePrice || price;
        const itemTotalPrice = (salePrice && salePrice > 0 ? salePrice : price) * quantity;
        totalSP += itemTotalPrice;

        // Calculate discount if both salePrice and price are valid
        if (salePrice && price && price > 0) {
            const discount = price - salePrice;
            totalDiscount += discount * quantity;
        }

        // Add to the product selling price
        totalProductSellingPrice += (productSellingPrice * quantity);

        // Add to MRP
        totalMRP += price * quantity;
    }

    // If coupon logic is required:
    if (bag.Coupon) {
        const coupon = bag.Coupon;
        const { CouponType, Discount, MinOrderAmount } = coupon;

        const applyCouponDiscount = () => {
            if (CouponType === "Percentage") {
                totalProductSellingPrice -= totalProductSellingPrice * (Discount / 100);
            } else {
                totalProductSellingPrice -= Discount;
            }
        };

        // Apply coupon discount only if applicable
        if (MinOrderAmount > 0) {
            if (totalProductSellingPrice >= MinOrderAmount) {
                applyCouponDiscount();
            }
        } else {
            applyCouponDiscount();
        }

        // Apply free shipping discount
        if (bag.Coupon.FreeShipping) {
            totalProductSellingPrice -= bag?.ConvenienceFees || 0; // Remove convenience fees if no minimum order amount
        }
    }

    // Optionally, if convenience fee is applied once:
    totalProductSellingPrice += bag?.ConvenienceFees || 0;

    return { totalProductSellingPrice, totalSP, totalDiscount, totalMRP };
};

function calculateTotalAmount(products) {
    // console.log("Total Bag Orders: ",products);
    return products.reduce((total, product) => {
        // Choose the salePrice if it exists, otherwise use the regular price
        const priceToUse = product.productId.salePrice || product.productId.price;
        return total + (product.quantity * priceToUse);
    }, 0) || 0;
}

export const getbag = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch the bag with populated orderItems.productId in one query
        const bag = await Bag.findOne({ userId }).populate('orderItems.productId Coupon').exec();

        if (!bag) {
            return res.status(404).json({ success:false,message: "Bag not found" });
        }

        
        // Fetch all products from the bag's orderItems at once (reduce redundant DB calls)
        const productIds = bag.orderItems.map(o => o.productId?._id.toString() || o.productId.toString());// returns an array;
        console.log("Bag Items: ", productIds);
        const products = await ProductModel.find({ _id: { $in: productIds } });

        // Create a map for fast lookup of product sizes
        const productMap = products.reduce((acc, product) => {
            acc[product._id.toString()] = product;
            return acc;
        }, {});

        // Update size quantities based on original product data
        for (let o of bag.orderItems) {
            const originalProductData = productMap[o.productId?._id.toString()];

            if (!originalProductData) {
                console.error(`Product with ID ${o.productId?._id} not found`);
                continue;
            }

            // Find the corresponding size for the order item
            const originalProductSize = originalProductData.size.find(s => s._id.toString() === o.size?._id);

            if (!originalProductSize) {
                console.error(`Size with ID ${o.size?._id} not found for product ${o.productId?._id}`);
                continue;
            }

            console.log("Bag Order Items size Quantity: ", o?.size?.quantity);

            // Update the size quantity if it doesn't match the original
            if (o?.size?.quantity !== originalProductSize?.quantity) {
                console.log("Updating size quantity");
                o.size.quantity = originalProductSize.quantity;
            }

            console.log("Original Product Size Quantity: ", originalProductSize.quantity);
        }

        // Save the updated bag
        await bag.save();

        res.status(200).json({
            success: true,
            bag
        });

    } catch (error) {
        console.error("Error Occurred during getting bag: ", error);
        res.status(500).json({ success:true, message: "Internal Server Error" });
    }
};



export const updateqtybag = async (req, res, next) => {
    try {
        // Destructure the request body to get the product ID and quantity
        const { id, qty } = req.body;

        // Find the original product from the database
        const originalProductData = await ProductModel.findById(id);
        if (!originalProductData) {
            return res.status(400).json({ message: "Product Not Found" });
        }

        // Find the user's shopping bag
        const bag = await Bag.findOne({ userId: req.user.id }).populate('orderItems.productId');;
        if (!bag) {
            return res.status(400).json({ message: "Bag Not Found" });
        }

        // Find the specific product in the user's bag
        const product = bag.orderItems.find(p => p.productId._id.toString() === id);
        if (!product) {
            return res.status(400).json({ message: "Product not found in bag" });
        }

        // Check if the product has a size and find the size data
        const originalProductDataSize = originalProductData.size.find(s => s._id.toString() === product.size._id.toString());
        if (!originalProductDataSize) {
            return res.status(400).json({ message: "Product size not found" });
        }

        // Log the original and updated product details for debugging
        // console.log("Original Product:", product);
        // console.log("Original Product Size:", originalProductDataSize);

        // If the size quantity in the bag doesn't match the original product size, update it
        if (product.size.quantity !== originalProductDataSize.quantity) {
            // console.log("Updating size quantity");
            product.size.quantity = originalProductDataSize.quantity; // Sync with original product size quantity
        }
        // Update the quantity in the bag
        product.quantity = qty;
        const TotalBagAmount = calculateTotalAmount(bag.orderItems);
        bag.TotalBagAmount = TotalBagAmount;
        // console.log("Updated Bag:", bag);
        const {totalProductSellingPrice, totalSP, totalDiscount, totalMRP } = await getItemsData(bag);
        console.log("Update Bag New Data ",totalProductSellingPrice, totalSP, totalDiscount, totalMRP);
        if(totalProductSellingPrice && totalProductSellingPrice !== 0) bag.totalProductSellingPrice = totalProductSellingPrice;
        if(totalSP && totalSP !== 0) bag.totalSP = totalSP;
        if(totalDiscount && totalDiscount !== 0) bag.totalDiscount = totalDiscount;
        if(totalMRP && totalMRP !== 0) bag.totalMRP = totalMRP;
        // Save the updated bag
        await bag.save();

        // Return a success response
        res.status(200).json({
            success: true,
            message: "Successfully updated Bag",
            bag
        });

    } catch (error) {
        console.error("Error Occurred during updating bag:", error.message);
        logger.error("Error occured during updating bag", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const deletebag = async (req, res) => {
    try {
        const {productId} = req.body
        const bag = await Bag.findOne({userId: req.user.id});
        bag.orderItems = bag.orderItems.filter(p => p.productId != productId)
        if(bag.orderItems.length === 0){
            await Bag.findOneAndDelete({userId: req.user.id})
            return res.status(200).json({success:true,message:"Successfully deleted Bag"})
        }
        console.log("Bag Items: ",bag)
        await bag.save()
        res.status(200).json({success:true,message:"Successfully deleted Bag",bag})
        
    } catch (error) {
        console.error("Error Occurred during deleting bag ", error.message);
        logger.error("Error occured during deleting bag", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const deletewish = async (req, res) => {
    try {
        const { deletingProductId } = req.body;

        // Find the wishlist of the user
        const wishlist = await WhishList.findOne({ userId: req.user.id });
        
        // If the wishlist is not found, return a 404 error
        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }

        // Ensure the deletingProductId is treated as an ObjectId for proper comparison
        const deletingProductIdObjectId = mongoose.Types.ObjectId(deletingProductId);

        // Remove the item from the wishlist's orderItems
        wishlist.orderItems = wishlist.orderItems.filter(p => 
            !p.productId.equals(deletingProductIdObjectId)  // Using `.equals` for ObjectId comparison
        );

        console.log("Deleting Wishlist Items: ", deletingProductId, wishlist.orderItems.map(p => p.productId));

        // If no items are left in the wishlist, delete the wishlist entirely
        if (wishlist.orderItems.length === 0) {
            await WhishList.findOneAndDelete({ userId: req.user.id });
            return res.status(200).json({ success: true, message: "Successfully deleted Wishlist" });
        }

        // Save the updated wishlist
        await wishlist.save();

        // Return success response
        res.status(200).json({
            success: true,
            message: "Successfully deleted Wishlist item",
            result: wishlist,
        });
    } catch (error) {
        console.error("Error: ", error);
        // Return a generic error response if an exception occurs
        res.status(500).json({ success: false, message: "An error occurred while deleting wishlist item", error: error.message });
    }
};
