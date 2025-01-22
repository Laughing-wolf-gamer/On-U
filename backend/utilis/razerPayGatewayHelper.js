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
            receipt: `order_receipt_${Date.now()}`,
            payment_capture: 1, // auto-capture payment (1) or manual (0)
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
        const { id } = req.user;
        if (!id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, selectedAddress, orderDetails, totalAmount, bagId } = req.body;

        // Generate expected signature
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZER_PG_SECRETE)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment not authenticated',
            });
        }

        const bagData = await Bag.findById(bagId).populate('orderItems.productId');
        if (!bagData) {
            return res.status(404).json({ success: false, message: 'Bag not found' });
        }

        console.log('Bag Data:', bagData);

        // Generate random order ID for ShipRocket
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        const randomOrderShipRocketId = generateRandomId();
        const orderData = new OrderModel({
            ShipRocketOrderId: randomOrderShipRocketId,
            userId: req.user.id,
            orderItems: orderDetails,
            SelectedAddress: selectedAddress,
            TotalAmount: totalAmount,
            paymentMode: 'Prepaid',
            status: 'Order Confirmed',
        });

        await orderData.save();

        // Process product quantity updates concurrently
        const removingAmountPromise = orderDetails.map(async (item) => {
            try {
                console.log('All Order Items:', item.productId._id, item.color.label, item.size, item.quantity);
                await removeProduct(item.productId._id, item.color.label, item.size, item.quantity);
            } catch (err) {
                console.error(`Error removing product: ${item?.productId?._id}`, err);
            }
        });

        await Promise.all(removingAmountPromise);

        // Delete the bag after order creation
        await Bag.findByIdAndDelete(bagId);

        // Send confirmation email
        await sendOrderPlacedMail(req.user.id, orderData);

        // Respond with success message
        res.status(200).json({
            success: true,
            message: 'Order Created Successfully',
            result: 'SUCCESS',
            userId: req.user.id,
        });

    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}


const removeProduct = async (productId, color, size, quantity) => {
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            console.log("Product Not Found:", productId);
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Find the active size
        const activeSize = product.size.find(s => s?.label === size);
        if (!activeSize) {
            console.log("Size Not Found:", size);
            return res.status(404).json({ success: false, message: "Size not found" });
        }

        // Find the active color
        const activeColor = activeSize.colors.find(c => c?.label === color);
        if (!activeColor) {
            console.log("Color Not Found:", color);
            return res.status(404).json({ success: false, message: "Color not found" });
        }

        // Calculate the reduced amounts for color and size
        const colorReducedAmount = activeColor.quantity - quantity;
        const sizeReducedAmount = activeSize.quantity - quantity;

        // Check for insufficient stock
        if (colorReducedAmount < 0 || sizeReducedAmount < 0) {
            console.log("Insufficient stock for color or size");
            return res.status(400).json({ success: false, message: "Not enough stock to remove" });
        }

        // Update quantities
        activeColor.quantity = colorReducedAmount;
        activeSize.quantity = sizeReducedAmount;

        // Rebuild the AllColors array and calculate total stock in one loop
        let totalStock = 0;
        const AllColors = product.size.flatMap(s => {
            if (s.colors) {
                s.colors.forEach(c => totalStock += c.quantity); // Accumulate total stock
                return s.colors;
            }
            return [];
        });

        product.AllColors = AllColors;
        product.totalStock = totalStock > 0 ? totalStock : undefined;

        // Save the updated product
        await product.save();
        console.log("Product Updated:", product);

        // Respond with success
        res.status(200).json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Error Removing Product:", error);
        res.status(500).json({ success: false, message: "Error removing product", error: error.message });
    }
};



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