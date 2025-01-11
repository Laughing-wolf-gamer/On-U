import OrderModel from "../../model/ordermodel.js";
import WareHouseModel from "../../model/WareHosue.mode.js";

export const updateOrderStatusFromShipRokcet = async (req,res)=>{
    try {
        console.log("Receving Data: ",req.body);
        const { order_id, current_status } = req.body;
        // console.log(`Order ID: ${order_id}, Status: ${current_status}`);
        const dbOrder = await OrderModel.findOne({ShipRocketOrderId:order_id});
        if(!dbOrder){
            console.error(`No order found with ShipRocket Order ID: ${order_id}`);
            return res.status(404).json({Success:false, message: 'No order found'});
        }
        // Update the order status in the database
        dbOrder.status = current_status;
        await dbOrder.save();
        console.log(`Order status updated to ${current_status} for ShipRocket Order ID: ${order_id}`);
        // Send a webhook to ShipRocket to notify about the status change
        // sendWebhookToShipRocket(dbOrder);

        // Send email to the customer about the order status change
        // sendEmailToCustomer(dbOrder);

        // Return a success response to ShipRocket
        res.status(200).send('Webhook received');
    } catch (error) {
        console.error("Error updating order status: ",error);
    }
}

export const createNewWareHouse = async(req,res)=>{
    try {
        const{_id,pincode,country,state,address} = req.body;
        console.log("Warehouse: ",req.body);
        if(_id){
            const updateFields = {};
            if(pincode)updateFields.pincode = pincode;
            if(country)updateFields.country = country
            if(state)updateFields.state = state
            if(address)updateFields.address = address
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
            pincode,
            country,
            state,
            address
        })
        if(!newWareHouse){
            console.error("Error creating new Ware House");
            return res.status(400).json({Success:false, message: 'Error creating new Ware House'});
        }
        await newWareHouse.save();
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