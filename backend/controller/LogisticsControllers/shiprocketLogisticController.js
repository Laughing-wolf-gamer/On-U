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
// Helper function to format date
const formatDate = (date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
};
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

        
		const pickup_locations = await getPickUpLocation();
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
        return {data:response.data,manifest,warehouse_name:activePickUpLocation};

    } catch (error) {
        console.error("Error creating order:", error);
        return null;
    }
};

export const generateOrderRetrunShipment = async (shipmentData,userId) => {
	if(!token) await getAuthToken();
	try {
		/* "order_id": "r121579B09ap3o",
		"order_date": "2021-12-30",
		"channel_id": "27202",
		"pickup_customer_name": "iron man",
		"pickup_last_name": "",
		"company_name":"iorn pvt ltd",
		"pickup_address": "b 123",
		"pickup_address_2": "",
		"pickup_city": "Delhi",
		"pickup_state": "New Delhi",
		"pickup_country": "India",
		"pickup_pincode": 110030,
		"pickup_email": "deadpool@red.com",
		"pickup_phone": "9810363552",
		"pickup_isd_code": "91",
		"shipping_customer_name": "Jax",
		"shipping_last_name": "Doe",
		"shipping_address": "Castle",
		"shipping_address_2": "Bridge",
		"shipping_city": "ghaziabad",
		"shipping_country": "India",
		"shipping_pincode": 201005,
		"shipping_state": "Uttarpardesh",
		"shipping_email": "kumar.abhishek@shiprocket.com",
		"shipping_isd_code": "91",
		"shipping_phone": 8888888888,
		"order_items": [
			{
			"sku": "WSH234",
			"name": "shoes",
			"units": 2,
			"selling_price": 100,
			"discount": 0,
			"qc_enable":true,
			"hsn": "123",
			"brand":"",
			"qc_size":"43"
			}
			],
		"payment_method": "PREPAID",
		"total_discount": "0",
		"sub_total": 400,
		"length": 11,
		"breadth": 11,
		"height": 11,
		"weight": 0.5 */
		// console.log("ShipRocket Shipment data: ", shipmentData.picketUpLoactionWareHouseName);
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
		// const pickup_locations = await getPickUpLocation();
		// console.log("Order Courior Details: ",orderItems, subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth);
		const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
		console.log("Active Pickup Location: ", activePickUpLocation);
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
			reseller_name: "On-U",
			company_name: "On-U",
			channel_id:'6282866',
			category:"Clothes",
			pickup_isd_code: "+91",
            pickup_customer_name: shipmentData.address.Firstname,
            pickup_last_name: shipmentData.address.Lastname,
            pickup_address: shipmentData.address.address1,
            pickup_city: shipmentData.address.address2,
            pickup_pincode: shipmentData.address.pincode,
            pickup_state: shipmentData.address.state,
            pickup_country: 'India',
            pickup_phone: shipmentData.address.phoneNumber,

			shipping_customer_name:activePickUpLocation.name,
			shipping_last_name:'',
			shipping_address:activePickUpLocation.address,
			shipping_address_2:activePickUpLocation.address_2,
			shipping_city:activePickUpLocation.city,
			shipping_country:activePickUpLocation.country,
			shipping_pincode:activePickUpLocation.pin_code,
            shipping_state:activePickUpLocation.state,
			shipping_email:activePickUpLocation.email,
            shipping_phone:activePickUpLocation.phone,
			units:orderItems.length,
            order_items: [...orderItems],
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000,
			hsn: '441122',
        };
		console.log("ShipRocket Order returning data: ", orderDetails);
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/return`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Return Shipment Created Response: ", response.data);
        return response.data;
    } catch (error) {
        // console.dir(error,{depth:null});
		console.error("Error creating return shipment:", error?.response?.data);
        return null;
    }
}

export const generateExchangeShipment = async (shipmentData, userId) => {
	if(!token) await getAuthToken();
	try {
		/* 
			"order_items": [
			{
			"name": "Black tshirt XL",
			"selling_price": "500.00",
			"units": "1",
			"hsn": "1733808730720",
			"sku": "mackbook",
			"tax": "",
			"discount": "",
			"brand": "",
			"color": "",
			"exchange_item_id": "193658024",
			"exchange_item_name": "Black tshirt XL",
			"exchange_item_sku": "mackbook",
			"qc_enable": true,
			"qc_product_name": "Black tshirt XL",
			"qc_product_image": "https://sr-multichannel-stage.s3.ap-south-1.amazonaws.com/1310/qc_product_img/547950c2-9c2f-4908-98d5-276f9ad5b63a.png",
			"qc_brand": "changedname1",
			"qc_color": "changecolr",
			"qc_size": "changesize112",
			"accessories": "",
			"qc_used_check": "1",
			"qc_sealtag_check": "1",
			"qc_brand_box": "1",
			"qc_check_damaged_product": "yes"
			}
		],
		"buyer_pickup_first_name": "Test",
		"buyer_pickup_last_name": "Test",
		"buyer_pickup_email": "test@gmail.com",
		"buyer_pickup_address": "Test",
		"buyer_pickup_address_2": "",
		"buyer_pickup_city": "South West Delhi",
		"buyer_pickup_state": "Delhi",
		"buyer_pickup_country": "India",
		"buyer_pickup_phone": "9716414139",
		"buyer_pickup_pincode": "110045",
		"buyer_shipping_first_name": "Test",
		"buyer_shipping_last_name": "Test",
		"buyer_shipping_email": "test@gmail.com",
		"buyer_shipping_address": "dkalsd",
		"buyer_shipping_address_2": "",
		"buyer_shipping_city": "South West Delhi",
		"buyer_shipping_state": "Delhi",
		"buyer_shipping_country": "India",
		"buyer_shipping_phone": "9716414139",
		"buyer_shipping_pincode": "110045",
		"seller_pickup_location_id": "5723898",
		"seller_shipping_location_id": "5723898",
		"exchange_order_id": "EX_TEST002",
		"return_order_id": "R_TEST002",
		"payment_method": "prepaid",
		"order_date": "2024-12-10",
		"channel_id": "1960878",
		"existing_order_id": "",
		"return_reason": "29",
		"sub_total": "500.00",
		"shipping_charges": "",
		"giftwrap_charges": "",
		"total_discount": "0",
		"transaction_charges": "",
		"exchange_length": "11",
		"exchange_breadth": "11",
		"exchange_height": "11",
		"exchange_weight": "11",
		"return_length": "10.00",
		"return_breadth": "10.00",
		"return_height": "10.00",
		"return_weight": "0.500",
		"qc_check": "true" */

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
		// const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            sku: item?.productId?._id,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
			qc_enable:true,
			qc_product_name: item?.productId?.title,
            qc_product_image: item?.productId?.image,
            qc_brand: item?.productId?.brand,
            qc_color: item?.productId?.color?.name,
            qc_size: item?.productId?.size?.lable,
            discount: item?.productId?.DiscountedPercentage,
            tax: 0,
        }));
		// const pickup_locations = await getPickUpLocation();
		// console.log("Order Courior Details: ",orderItems, subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth);
		const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
		console.log("Active Pickup Location: ", activePickUpLocation);
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
			reseller_name: "On-U",
			company_name: "On-U",
			channel_id:'6282866',
			category:"Clothes",
			pickup_isd_code: "+91",
            pickup_customer_name: shipmentData.address.Firstname,
            pickup_last_name: shipmentData.address.Lastname,
            pickup_address: shipmentData.address.address1,
            pickup_city: shipmentData.address.address2,
            pickup_pincode: shipmentData.address.pincode,
            pickup_state: shipmentData.address.state,
            pickup_country: 'India',
            pickup_phone: shipmentData.address.phoneNumber,

			shipping_customer_name:activePickUpLocation.name,
			shipping_last_name:'',
			shipping_address:activePickUpLocation.address,
			shipping_address_2:activePickUpLocation.address_2,
			shipping_city:activePickUpLocation.city,
			shipping_country:activePickUpLocation.country,
			shipping_pincode:activePickUpLocation.pin_code,
            shipping_state:activePickUpLocation.state,
			shipping_email:activePickUpLocation.email,
            shipping_phone:activePickUpLocation.phone,
			units:orderItems.length,
            order_items: [...orderItems],
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000,
        };
		console.log("ShipRocket Exchange data: ", orderDetails);
		const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/exchange`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Return Shipment Created Response: ", response.data);

	} catch (error) {
		console.error("Error creating exchange shipment:", error?.response?.data);
	}
}

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