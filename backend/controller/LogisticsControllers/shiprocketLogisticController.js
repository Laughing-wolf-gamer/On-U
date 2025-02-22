import axios from 'axios';
import dotenv from 'dotenv'
import User from '../../model/usermodel.js';
import { getBestCourierPartners } from '../../utilis/basicUtils.js';

dotenv.config();



const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
let token = '';

export const getAuthToken = async (email,password) => {
    try {
        // console.log("ShipApi URL: ", SHIPROCKET_API_URL, SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD);

        const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
            email: email || SHIPROCKET_EMAIL,
            password: password || SHIPROCKET_PASSWORD
        });

        token = response?.data?.token; // Store the token
        console.log('Connected to Shiprocket');
		if(token !== null){
			return token;
		}
		return '';
    } catch (error) {
        console.error('Error fetching auth token:', error);
        return '';
    }
};

export const logoutAuthToken = async ()=>{
    try {
        const response = await axios.post(`${SHIPROCKET_API_URL}/auth/logout`)
        token = ''; // Clear the token
        console.log('ShipRocket auth token logged out');
    } catch (error) {
        console.error('Error logging out auth token:', error.message);
    }
}
const generateAwb = async(awbData)=>{
	if (!token) await getAuthToken();
	try {
		console.log("Check AWB ",awbData);
		const response = await axios.post(`${SHIPROCKET_API_URL}/courier/assign/awb`,awbData,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
		// console.dir(response?.data,{depth:null});
		return response?.data?.data;
	} catch (error) {
		console.error('Error Creating AWB:', error);
		// console.dir(error,{depth:null});
		return null;
	}
}
const getAllServicalibiltyties = async (servicesData) => {
	if (!token) await getAuthToken();
	try {
		// console.log("Check Serviciablity ",servicesData);
		const response = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
			params: servicesData,  // Use `params` for query parameters in GET requests
        })
		// console.dir(response?.data,{depth:null});
		return response?.data?.data;
	} catch (error) {
		console.error('Error fetching all serviceabilityties:', error);
		// console.dir(error,{depth:null});
		return null;
	}
}
const generateOrderPicketUpRequest =async(orderData)=>{
	if (!token) await getAuthToken();
	try {
		console.log("Generating Picket Up Request for Shipment: ",orderData);
		const {shipment_id} = orderData;
		const response = await axios.post(`${SHIPROCKET_API_URL}/courier/generate/pickup`, {shipment_id:[shipment_id]},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
		
	} catch (error) {
		console.error('Error generating order picket up request:', error);
	}
}

export const generateOrderForShipment = async (userId, shipmentData, randomOrderId, randomShipmentId) => {
    if (!token) await getAuthToken();

    try {
        console.log("User Id: ", userId);

        // Fetch user data
        const userData = await User.findById(userId);
        if (!userData) {
            console.error("User not found");
            return null;
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => {
            return shipmentData.orderItems.reduce((total, item) => total + (item.productId[key] * item.quantity), 0);
        };

        // Calculate various totals
        const subTotal = calculateTotal('price');
        const totalOrderWeight = calculateTotal('weight');
        const totalOrderHeight = calculateTotal('height');
        const totalOrderLength = calculateTotal('length');
        const totalBredth = calculateTotal('breadth');

        // Map order items to required format
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item.productId.title,
            sku: item.productId._id,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: 0,
            tax: 0,
            hsn: '1234'
        }));

        // Helper function to format date
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        };
		const pickup_locations = await getPickUpLocation();
		/*
			pickup_postcode
			delivery_postcode 
			weight
			cod
			order_id
		*/
		console.log("Response Picketup Location",pickup_locations);
		const activePickUpLocatin = pickup_locations[0];
		const allAvailableCourior = await getAllServicalibiltyties({
			pickup_postcode:activePickUpLocatin?.pin_code,
			delivery_postcode:shipmentData.address.pincode, 
			order_id:response?.data?.order_id,
		});
		const getBestCourir = getBestCourierPartners(allAvailableCourior?.available_courier_companies)
		console.log("Best Courier: ",getBestCourir[0]);
		// const activePickupLocation = pickup_locations.find(location => location.is_active);
        // Prepare the order details
        const orderDetails = {
            order_id: randomOrderId,
            shipment_id: randomShipmentId,
            order_date: formatDate(new Date()),
            pickup_location: activePickUpLocatin?.pickup_location,
            billing_customer_name: shipmentData.address.Firstname,
            billing_last_name: shipmentData.address.Lastname,
            billing_address: shipmentData.address.address1,
            billing_city: shipmentData.address.address2,
            billing_pincode: shipmentData.address.pincode,
            billing_state: shipmentData.address.state,
			units:orderItems.length,
            billing_country: 'In',
            billing_phone: shipmentData.address.phoneNumber,
            billing_alternate_phone: userData?.phoneNumber,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: shipmentData.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight,
			is_insurance_opt:true,
			is_document:1,
			shipping_method:"HL"
        };

        // console.log("ShipRocket Order data: ", orderDetails);

        // Send the request to ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Shipment Created Response: ",response.data);
		
		await generateAwb({
			shipment_id:response?.data?.shipment_id,
		});
		// const createPicketUpResponse = await generateOrderPicketUpRequest(response?.data);
        
        return response.data;

    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
};
export const getAllShipRocketOrder = async()=>{
    if(!token) await getAuthToken();
    try {
        
        const response = await axios.get(`${SHIPROCKET_API_URL}/orders`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.dir(response.data,{depth:null});
        return response.data.data;
    } catch (error) {
        console.dir(error, { depth: null});
        return [];
    }
}

export const getShipmentOrderByOrderId = async(orderId)=>{
    try {
        
    } catch (error) {
        console.dir(error, { depth: null});
    }
}
export const getPickUpLocation = async()=>{
	if(!token) await getAuthToken();
	try {
		const res = await axios.get(`${SHIPROCKET_API_URL}/settings/company/pickup`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
		
		return res?.data?.data?.shipping_address;
	} catch (error) {
		console.dir(error, { depth: null});
	}
}
export const addNewPicketUpLocation = async(locationData)=>{
	if(!token) await getAuthToken();
    try {
        const res = await axios.post(`${SHIPROCKET_API_URL}/settings/company/addpickup`, locationData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        console.log("Created PickeUp Location Response: ",res?.data);
    } catch (error) {
        console.dir(error, { depth: null});
    }
}

export const checkShipmentAvailability = async(delivary_pin,weight) =>{
    try {
		const pickup_locations =  await getPickUpLocation();
		console.log("Response Picketup Location",pickup_locations);
        if(!token) await getAuthToken();
        const picketUp_pin = pickup_locations[0]?.pin_code; // Assuming the first pickup location is the closest one
        const shipmentData = {
            cod: 1,  // Make sure `cod` is a boolean
            pickup_postcode: picketUp_pin,
            delivery_postcode: delivary_pin,  // Make sure `delivary_pin` is defined somewhere
            weight: weight,  // Assuming `weight` is defined and a valid number
        };

        console.log("Shipment availability: ", shipmentData);

        const res = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: shipmentData,  // Use `params` for query parameters in GET requests
        });

        // console.log(res?.data);
        // console.dir(res.data,{ depth: null})
        return res.data;
    } catch (error) {
        // console.dir(error, { depth: null});
        console.error("Error Checking Pincode.: ",error)
    }
}

export const GetWalletBalance = async(req,res)=>{
	try {
		if(!token) await getAuthToken();
        const walletResponse = await axios.get(`${SHIPROCKET_API_URL}/account/details/wallet-balance`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
		console.log("Wallet: ",walletResponse.data?.data?.balance_amount);
		const balance = walletResponse.data?.data?.balance_amount;
		res.status(200).json({success: true,message:"Succefully Get Wallet Balance", result: balance || 0});
	} catch (error) {
		console.error("Error getting Wallet Balance.: ",error)
		res.status(500).json({success: false,message:"Error Getting Wallet Balance"});
	}
}