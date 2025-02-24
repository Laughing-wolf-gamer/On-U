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
		console.log("Generated Picket Up Request for Shipment: ",response.data);
		
	} catch (error) {
		console.error('Error generating order picket up request:', error);
	}
}

export const generateManifest = async (orderData) => {
	try {
		const{order_id} = orderData;
		const response = await axios.post(`${SHIPROCKET_API_URL}/orders/print/invoice`, {ids:[order_id]},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
		console.log("Manifest: ",response.data);
		return response.data;
	} catch (error) {
		console.error("Error generating manifest:", error);
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
            return shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);
        };

        // Calculate various totals
        const subTotal = calculateTotal('price');
        const totalOrderWeight = calculateTotal('weight');
        const totalOrderHeight = calculateTotal('height');
        const totalOrderLength = calculateTotal('length');
        const totalBredth = calculateTotal('breadth');
        // Map order items to required format
		const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            sku: item?.productId?._id,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage,
            tax: 0,
            hsn: generateRandomId().toString()
        }));
		console.log("Order Courior Details: ",orderItems, subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth);

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
		
		// const activePickupLocation = pickup_locations.find(location => location.is_active);
        // Prepare the order details
		/* 
		"order_id": "2344444",
		"order_date": "2025-02-24",
		"pickup_location": "someCity",
		"channel_id": "6282866",
		"reseller_name": "Best Seller Inc.",
		"company_name": "On-U",
		"billing_customer_name": "John",
		"billing_last_name": "Doe",
		"billing_address": "1234 Elm Street",
		"billing_address_2": "Apt 56B",
		"billing_isd_code": "+91",
		"billing_city": "Kolkata",
		"billing_pincode": "70054",
		"billing_state": "West Bengal",
		"billing_country": "In",
		"billing_email": "john.doe@example.com",
		"billing_phone": "9101094674",
		"billing_alternate_phone": "9101094674",
		"shipping_is_billing": true,
		"order_items": [
			{
				"name": "Blue T-shirt",
				"sku": "TSHIRT-BLU-123",
				"units": "2",
				"selling_price": "19.99",
				"discount": "5.00",
				"hsn": "610999999"
			},
			{
				"name": "Red Sneakers",
				"sku": "SNEAKER-RED-456",
				"units": "1",
				"selling_price": "49.99",
				"discount": "10.00",
				"hsn": "6403999999"
			}
		],
		"payment_method": "prepaid",
		"sub_total": "90.98",
		"length": "30",
		"breadth": "20",
		"height": "15",
		"weight": "1.2",
		"order_type": "NON ESSENTIALS" */
		// console.log("Response Picketup Location",pickup_locations);
		const activePickUpLocation = pickup_locations[0];
        const orderDetails = {
            order_id: randomOrderId,
            shipment_id: randomShipmentId,
            order_date: formatDate(new Date()),
            pickup_location: activePickUpLocation?.pickup_location,
			reseller_name: "On-U",
			company_name: "On-U",
			channel_id:'6282866',
			category:"Clothes",
			billing_isd_code: "+91",
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
            order_items: [...orderItems],
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000,
			order_type:'NON ESSENTIALS',
			hsn: '441122',
        };

        console.log("ShipRocket Order data: ", orderDetails);

        // Send the request to ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
		
        console.log("Shipment Created Response: ",response.data);
		const allAvailableCourior = await getAllServicalibiltyties({
			pickup_postcode:activePickUpLocation?.pin_code,
			delivery_postcode:shipmentData.address.pincode, 
			order_id:response?.data?.order_id,
		});
		const getBestCourir = getBestCourierPartners(allAvailableCourior?.available_courier_companies)
		console.log("Best Courier: ",getBestCourir[0]);
		
		await generateAwb({
			shipment_id:response?.data?.shipment_id,
			courier_id:'',
			status:'',
		});
		// const createPicketUpResponse = await generateOrderPicketUpRequest(response?.data);
        console.log("Response: ", response.data);
		const manifest = await generateManifest(response.data);
		console.log("Manifest: ", manifest);
        return {data:response.data,manifest};

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
		// console.log("Response Picketup Location",pickup_locations);
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
export const getShipmentTrackingStatus = async(shipmentId)=>{
	if(!token) await getAuthToken();
    try {
        const res = await axios.get(`${SHIPROCKET_API_URL}/courier/track/shipment/${shipmentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log(res?.data);
        // console.dir(res.data,{ depth: null})
		const returningTrackingData = res.data[shipmentId]?.tracking_data;
        return returningTrackingData;
    } catch (error) {
        // console.dir(error, { depth: null});
        console.error("Error Checking Shipment Status.: ",error)
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