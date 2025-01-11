import Razorpay from "razorpay";
import crypto from 'crypto';
import OrderModel from "../model/ordermodel.js";
import ProductModel from "../model/productmodel.js";
import Bag from "../model/bag.js";
import { generateOrderForShipment } from "../controller/LogisticsControllers/shiprocketLogisticController.js";
import { sendOrderPlacedMail } from "../controller/emailController.js";

export const instance = new Razorpay({
    key_id: process.env.RAZER_PG_ID,
    key_secret: process.env.RAZER_PG_SECRETE,
});

export const createOrder = async (req, res) => {
    try {
        console.log("Payment Amount:", req.body);
        const{amount} = req.body;
        const options = {
            amount: Number(amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log("Payment Order Created",order);
        res.status(200).json({ success: true, order,keyId:process.env.RAZER_PG_ID});
    } catch (error) {
        console.error("Payment Order Creation Error: ", error);
        res.status(404).json({success: false,message:"Internal Server Error",});
    }
};
export const paymentVerification = async (req, res) => {
    try {
        const{id} = req.user;
        if(!id){
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature ,selectedAddress,orderDetails,totalAmount,bagId} = req.body;
    
        const body = razorpay_order_id + "|" + razorpay_payment_id;
    
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZER_PG_SECRETE).update(body.toString()).digest("hex");
    
        const isAuthentic = expectedSignature === razorpay_signature;
    
        if (isAuthentic) {
            const bagData = await Bag.findById(bagId).populate('orderItems.productId');
            if(bagData){
                console.log("Bag Data: ",bagData);
                const generateRandomId = () => {
                    return Math.floor(10000000 + Math.random() * 90000000); // Generates a random 8-digit number
                };
                
                const randomOrderShipRocketId = generateRandomId();
                const orderData = new OrderModel({
                    ShipRocketOrderId:randomOrderShipRocketId,
                    userId: req?.user?.id,
                    orderItems:orderDetails,
                    SelectedAddress: selectedAddress,
                    TotalAmount:totalAmount,
                    paymentMode:"Prepaid",
                    status:'Order Confirmed',
                });
            
                await orderData.save();
                const createdShipRocketOrder = await generateOrderForShipment(orderData,randomOrderShipRocketId)
                if(!createdShipRocketOrder){
                    return res.status(500).json({ success: false, message: "Failed to create ShipRocket Order" });
                }
                const removingAmountPromise = orderDetails.map(async item => {
                    try {
                        console.log("All Orders Items: ", item.productId._id, item.color.label, item.size, item.quantity);
                        await removeProduct(item.productId._id, item.color.label, item.size, item.quantity);
                    } catch (err) {
                        console.error(`Error removing product: ${item?.productId?._id}`, err);
                    }
                });
            
                await Promise.all(removingAmountPromise);
            
                // Uncomment and handle bag removal if needed
                await Bag.findByIdAndDelete(bagId);
                // console.log("Bag Removed:", bagToRemove);
                sendOrderPlacedMail(req.user.id,orderData)// sending Message Mail....
                return res.status(200).json({ success: true, message: "Order Created Successfully", result: "SUCCESS",userId:req.user?.id });
            }
            res.status(200).jons({success: false, message: "Payment Not Successful"})
            // res.status(200).json({success:true,razorpayPaymentId:razorpay_payment_id})
        } else {
            res.status(200).json({success: false,message:"Payment Not Authenticated"});
        }
    } catch (error) {
        console.error("Payment Verification Error: ", error);
        res.status(404).json({success: false,message:"Internal Server Error",});
    }
};
const removeProduct = async(productId,color,size,quantity) => {
    try {
        const product = await ProductModel.findById(productId);
        if(!product) {
            console.log("Product Not Found: ",productId);
            return
        } ;
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
            // updateFields.size = activeSize
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
        };
        await product.save();
        console.log("Product Updated: ",product);
    } catch (error) {
        console.error("Error Removing Product: ",error)
    }
}


export const OnPaymentCallBack = async (req,res)=>{
    try {
        const SECREAT = 1234567890;
        console.dir(req.body, { depth: null});
        res.status(200).json({ success: true, message: 'Payment Successful' });
    } catch (error) {
        console.error("Error Removing OnPayment Call",error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}