import Razorpay from "razorpay";
import crypto from 'crypto';
import OrderModel from "../model/ordermodel.js";
import ProductModel from "../model/productmodel.js";
import Bag from "../model/bag.js";
import { generateOrderForShipment } from "../controller/LogisticsControllers/shiprocketLogisticController.js";
import { sendMainifestMail, sendOrderPlacedMail } from "../controller/emailController.js";
import WebSiteModel from "../model/websiteData.model.js";

export const instance = new Razorpay({
    key_id: process.env.RAZER_PG_ID,
    key_secret: process.env.RAZER_PG_SECRETE,
});

export const createOrder = async (req, res) => {
    try {
        console.log("Payment Amount:", req.body);
        const { amount ,selectedAddress, orderDetails, totalAmount, bagId } = req.body;
        const options = {
            amount: Number(Math.round(amount) * 100),
            currency: "INR",
            receipt: `order_receipt_${Date.now()}`,
            payment_capture: 1, // auto-capture payment (1) or manual (0)
        };
        const order = await instance.orders.create(options);
        console.log("Payment Order Created",order);
        if(!order){
            order
        }
        res.status(200).json({ success: true, order,keyId:process.env.RAZER_PG_ID});
    } catch (error) {
        console.error("Payment Order Creation Error: ", error);
        res.status(404).json({success: false,message:"Internal Server Error",});
    }
};

export const paymentVerification = async (req, res) => {
    try {
        const { id } = req.user;
		console.log("Checking Payment: ",req.body);
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
			console.error("Payment Signature Mismatch");
            return res.status(400).json({
                success: false,
                message: 'Payment not authenticated',
            });
        }
		const proccessingProducts = orderDetails.filter((item) => item?.isChecked);
		console.log("Order Data: ",proccessingProducts);
		if(!proccessingProducts || proccessingProducts.length <= 0){
			return res.status(400).json({ success: false, message: "Please select at least one product" });
		}
        const bagData = await Bag.findById(bagId).populate('orderItems.productId');
        if (!bagData) {
            return res.status(404).json({ success: false, message: 'Bag not found' });
        }

        console.log('Bag Data:', bagData);

        // Generate random order ID for ShipRocket
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        const randomOrderShipRocketId = generateRandomId();
		const randomShipmentId = generateRandomId();
		const alreadyPresentConvenenceFees = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
		let manifest = null;
		try {
			const createdShipRocketOrder = await generateOrderForShipment(req.user.id,{
				order_id: randomOrderShipRocketId,
				userId: id,
				razorpay_order_id:razorpay_order_id,
				ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
				orderItems:proccessingProducts,
				address: selectedAddress,
				TotalAmount:totalAmount,
				paymentMode:"prepaid",
				status: 'Confirmed',
			},randomOrderShipRocketId,randomShipmentId)
			console.log("Shipment Data: ",createdShipRocketOrder);
			manifest = createdShipRocketOrder?.manifest
		} catch (error) {
			console.error("Error while creating shipRocket order: ", error);
		}
		const orderData = new OrderModel({
            order_id: randomOrderShipRocketId,
            userId: id,
			shipment_id:randomShipmentId,
			razorpay_order_id:razorpay_order_id,
			ConveenianceFees: alreadyPresentConvenenceFees?.ConvenienceFees || 0,
            orderItems:proccessingProducts,
            address: selectedAddress,
            TotalAmount:totalAmount,
            paymentMode:"prepaid",
            status: 'Confirmed',
			manifest:manifest,
        });

        await orderData.save();
		if(manifest){
			if(manifest?.is_invoice_created){
				try {
					const sentInvoiceTouser = await sendMainifestMail(id,manifest?.invoice_url);
				} catch (error) {
					console.error(`Error while sending invoice: ${error}`);
				}
			}
		}
        // Process product quantity updates concurrently
        const removingAmountPromise = proccessingProducts.map(async (item) => {
            try {
                console.log('All Order Items:', item.productId._id, item.color.label, item.size, item.quantity);
                await removeProduct(item?.productId?._id, item?.color?.label, item?.size, item?.quantity);
            } catch (err) {
                console.error(`Error removing product: ${item?.productId?._id}`, err);
            }
        });

        await Promise.all(removingAmountPromise);

        // Delete the bag after order creation
		const activeBag = await Bag.findById(bagId);
        if(activeBag){
			proccessingProducts.map((item) => {
				// const isInRemovingItems = activeBag.orderItems.find((bI) => bI?.productId.toString() === item?.productId?._id.toString());
				const findIndex = activeBag.orderItems.findIndex((bI) => bI?.productId.toString() === item?.productId?._id.toString());
				if(findIndex !== -1){
					activeBag.orderItems.splice(findIndex,1);
				}
			})
			if(activeBag.orderItems.length <= 0){
				await Bag.findByIdAndDelete(bagId);
			}else{
				await activeBag.save();
			}
        }

        // Send confirmation email
        await sendOrderPlacedMail(id, orderData);

        // Respond with success message
        res.status(200).json({
            success: true,
            message: 'Order Created Successfully',
            result: 'SUCCESS',
            userId: id,
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
		product.TotalSoldAmount = product?.TotalSoldAmount + quantity;
        // Save the updated product
        await product.save();
        console.log("Product Updated:", product);

        // Respond with success
        // res.status(200).json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.error("Error Removing Product:", error);
        // res.status(500).json({ success: false, message: "Error removing product", error: error.message });
    }
};



export const OnPaymentCallBack = async (req,res)=>{
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const receivedSignature = req.headers['x-razorpay-signature'];
        const payload = JSON.stringify(req.body);
        const SECREAT = 1234567890;
        console.dir(req.body, { depth: null});
        res.status(200).json({ success: true, message: 'Payment Successful' });
    } catch (error) {
        console.error("Error Removing OnPayment Call",error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}