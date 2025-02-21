import OrderModel from "../../model/ordermodel.js";
import ProductModel from "../../model/productmodel.js";
import WareHouseModel from "../../model/WareHosue.mode.js";
import logger from "../../utilis/loggerUtils.js";
import { addNewPicketUpLocation, checkShipmentAvailability, getAuthToken } from "./shiprocketLogisticController.js";

export const updateOrderStatusFromShipRokcet = async (req,res)=>{
    try {
        console.log("Shiprocket order Status Update Receving Data: ",req.body);
        const { order_id, current_status } = req.body;
        // console.log(`Order ID: ${order_id}, Status: ${current_status}`);
        const dbOrder = await OrderModel.findOne({ShipRocketOrderId:order_id});
        if(dbOrder){
            console.error(`No order found with ShipRocket Order ID: ${order_id}`);
			// Update the order status in the database
			dbOrder.status = current_status;
			await dbOrder.save();
			console.log(`Order status updated to ${current_status} for ShipRocket Order ID: ${order_id}`);
        }
        // Send a webhook to ShipRocket to notify about the status change
        // sendWebhookToShipRocket(dbOrder);

        // Send email to the customer about the order status change
        // sendEmailToCustomer(dbOrder);

        // Return a success response to ShipRocket
        res.status(200).send('Webhook received');
    } catch (error) {
        console.error("Error updating order status: ",error);
		logger.error(`Error occured during updating order status ${error.message}`);
    }
}

export const createNewWareHouse = async(req,res)=>{
    try {
        const{
			_id,
			pickup_location,
			name,
			email,
			phone,
			country,
			state,
			pin_code,
			address,
			address_2,
			city,
		} = req.body;
        console.log("Warehouse: ",req.body);
        if(_id){
            const updateFields = {};
            if(pickup_location) updateFields.pickup_location = pickup_location;
            if(pin_code) updateFields.pin_code = pin_code;
            if(name)updateFields.name = name;
            if(email)updateFields.email = email;
            if(phone)updateFields.phone = phone;
            if(country)updateFields.country = country
            if(state)updateFields.state = state
            if(address)updateFields.address = address
            if(address_2)updateFields.address_2 = address_2
            if(city)updateFields.city = city
            console.log(`Ware House with ID ${_id} already exists`);
            if(Object.keys(updateFields).length > 0){
                const UpdateProduct = await WareHouseModel.findByIdAndUpdate(_id,updateFields,{new:true});
                if(!UpdateProduct){
                    console.error("Error updating Ware House");
                    return res.status(400).json({Success:false, message: 'Error updating Ware House'});
                }
                return res.status(201).json({Success: true, message: 'New Ware House created successfully'});
            }
        }
        const newWareHouse = new WareHouseModel({
            pickup_location,
			name,
			email,
			phone,
			pin_code,
			country,
			state,
			address,
			address_2,
			city,
			state,
			country,
        })
        if(!newWareHouse){
            console.error("Error creating new Ware House");
            return res.status(400).json({Success:false, message: 'Error creating new Ware House'});
        }
        await newWareHouse.save();
		await addNewPicketUpLocation({
			pickup_location,
			name,
			email,
			phone,
			pin_code,
			country,
			state,
			address,
			address_2,
			city,
			state,
			country,
		})
        res.status(201).json({Success: true, message: 'New Ware House created successfully', result: newWareHouse});
    } catch (error) {
        console.error("Error Creating Ware House: ",error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}
export const fetchAllWareHouses= async (req, res) => {
    try {
        const wareHouse = await WareHouseModel.find({});
        if(!wareHouse){
            return res.status(404).json({Success: false, message: 'No Ware House found'});
        }
        res.status(200).json({Success: true, message: 'Ware House found', result: wareHouse});
    } catch (error) {
        console.error("Error fetching Ware House: ",error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const fetchWareHouseById = async(req,res)=>{
    try {
        const {warehouseId} = req.params;
        if(!warehouseId){
            console.error("Warehouse ID is required");
            return res.status(400).json({Success: false, message: 'Warehouse ID is required'});
        }
        const wareHouse = await WareHouseModel.findById(warehouseId);
        if(!wareHouse){
            console.error(`No Ware House found with id: ${warehouseId}`);
            return res.status(404).json({Success: false, message: 'No Ware House found'});
        }
        res.status(200).json({Success: true, message: 'Ware House found', result: wareHouse});
    } catch (error) {
        console.error("Error fetching Ware House: ",error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const removeWareHouseById = async(req,res)=>{
    try {
        const {warehouseId} = req.params;
        if(!warehouseId){
            console.error("Warehouse ID is required");
            return res.status(400).json({Success: false, message: 'Warehouse ID is required'});
        }
        const wareHouse = await WareHouseModel.findByIdAndDelete(warehouseId);
        res.status(200).json({Success: true, message: 'Warehouse'});
    } catch (error) {
        console.error("Error fetching",error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}

export const loginLogistics = async (req,res)=>{
	try {
		const{email, password} = req.body;
		if(!email ||!password){
            console.error("Email and password are required");
            return res.status(400).json({Success: false, message: 'Email and password are required'});
        }
        const resposse = await getAuthToken(email,password);
		// console.log("Logging in: ",resposse);
		if(!resposse){
            console.error("Error getting ShipRocket auth token: ",resposse);
            return res.status(500).json({Success: false, message: 'Error getting ShipRocket auth token'});
        }
		console.log("ShipRocket auth token: ",resposse);
		res.status(200).json({Success: true, message: 'Logged in successfully', result: resposse});
    } catch (error) {
        console.error("Error getting ShipRocket auth token: ",error);
    }
}

export const checkAvailability = async (req,res)=>{
    try {
        const {pincode,productId} = req.query;
        console.log("Checking availability: ",pincode);
        const product = await ProductModel.findById(productId);
        if(!product){
            console.error("Product Not Found: ",productId);
            return res.status(404).json({Success: false, message: 'Product not found'});
        }
        if(!pincode){
            console.error("Pincode is required");
            return res.status(400).json({Success: false, message: 'Pincode is required'});
        }
        const weight = product.weight;
        /* 
        if(!available){
            return res.status(200).json({Success: false, message: 'Delivery not available'});
        }
        return res.status(200).json({Success: true, message: 'Pincode availability', result: available}); */
		const available = await checkShipmentAvailability(Number(pincode),weight);
        if(available === null || available?.length === 0){
            console.error("Error checking availability");
            return res.status(500).json({Success: false, message: 'Error checking availability'});
        }
        const partnersDelivering = available?.data?.available_courier_companies?.map((partners) => ({edd:partners.estimated_delivery_days,etd:partners.etd,etd_hours:partners.etd_hours}));
        if(partnersDelivering.length > 0) {
            console.log("Pincode is available for delivery: ", partnersDelivering);
            const fastestDelivery = partnersDelivering.reduce((fastest, current) => {
                // Compare 'edd' values, assuming they represent days for delivery
                if (parseInt(current.edd) < parseInt(fastest.edd)) {
                    return current;
                }
                return fastest;
            }, partnersDelivering[0]); // Start with the first element
            return res.status(200).json({Success: true, message: 'Pincode availability', result: fastestDelivery});
        }
        res.status(200).json({Success: false, message: 'Delivery not available'});
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({Success: false, message: 'Internal Server Error'});
    }
}