import axios from 'axios';
import dotenv from 'dotenv'
import User from '../../model/usermodel.js';
import { getBestCourierPartners, getStringFromObject } from '../../utilis/basicUtils.js';
import logger from '../../utilis/loggerUtils.js';
import OrderModel from '../../model/ordermodel.js';

dotenv.config();



const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
let token = '';

export const getAuthToken = async (email,password) => {
    try {
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
		console.log("Awb Generationg response: ",response.data.response.data);
		const awb_code = response.data.response.data?.awb_code
		return awb_code || null;
	} catch (error) {
		console.error('Error Creating AWB: ', error?.response?.data);
		// console.dir(error,{depth:null});
		// logger.error(`Error creating AWB: ${getStringFromObject(error?.response?.data)}`)
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
		console.error('Error fetching all serviceabilityties:', error?.response?.data);
		// console.dir(error,{depth:null});
		// logger.error(`Failed to fetch all serviceabilityties ${getStringFromObject(error?.response?.data)}`)
		return null;
	}
}
export const generateOrderPicketUpRequest =async(order,orderData,bestCourior)=>{
	if (!token) await getAuthToken();
	try {
		const {shipment_id,order_id} = orderData;
		let bestCourier = bestCourior;
		if(!bestCourier){
			// const order = await OrderModel.findOne({order_id:order_id,shipment_id:shipment_id})
			console.log("Delivary Pincode Address: ",order);
			const pickup_locations = await getPickUpLocation();
			const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
			const allAvailableCourier = await getAllServicalibiltyties({
                pickup_postcode: primaryLocation?.pin_code,
                delivery_postcode: order?.address?.pincode,
                order_id: order_id,
            })
			bestCourier = getBestCourierPartners(allAvailableCourier?.available_courier_companies)[0];
            console.error("No suitable courier found");
			bestCourier = allAvailableCourier?.available_courier_companies[0];
		}
		const awbCode = await generateAwb({
			shipment_id:shipment_id,
			courier_id:bestCourier?.courier_company_id,
		});
		console.log('awbCode', awbCode);
		if(!awbCode){
			return null;
		}
		// if(!awbCode) throw new Error("Error generating awb code");
		console.log("Generating Picket Up Request for Shipment: ",orderData);
		const response = await axios.post(`${SHIPROCKET_API_URL}/courier/generate/pickup`, {shipment_id:[shipment_id]},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
		console.log("Generated Picket Up Request for Shipment: ",response.data);
		if(!response.data.response){
			throw new Error("Error generating picket up request");
		}
		const returningData = {awbCode,picketUpResponseData:response.data.response};
		return returningData;
	} catch (error) {
		console.error('Error generating order picket up request:', error);
		// logger.error(`Error generating order picket up request ${getStringFromObject(error?.response?.data || error?.message)}`);
		return null;
	}
}

export const generateInvoice = async (orderData) => {
	if (!token) await getAuthToken();
	try {
		console.log("Generating order Invoice:", orderData)
		const{order_id} = orderData;
		const response = await axios.post(`${SHIPROCKET_API_URL}/orders/print/invoice`, {ids:[order_id]},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
		console.log("Invoice: ",response.data);
		return response.data;
	} catch (error) {
		console.error("Error generating Invoice:", error?.response?.data);
		return null;
	}
}
export const generateManifest = async (orderData) => {
	if (!token) await getAuthToken();
	try {

		const{shipment_id} = orderData;
		console.log("Generating order Manifest:", shipment_id)
		const response = await axios.post(`${SHIPROCKET_API_URL}/manifests/generate`, {shipment_id:[Number(shipment_id)]},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
		console.log("Manifest: ",response.data);
		return response.data;
	} catch (error) {
		console.error("Error generating manifest:", error?.response?.data);
		return null;
	}
}
export const fetchAllPickupLocation =async()=>{
	if (!token) await getAuthToken();
    try {
        console.log("Fetching all pickup locations");
        const response = await axios.get(`${SHIPROCKET_API_URL}/settings/company/pickup`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log("All pickup locations: ",response.data);
        return response?.data?.data?.shipping_address || [];
    } catch (error) {
        console.error('Error fetching all pickup locations:', error?.response?.data);
        return null;
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
/* export const generateOrderForShipment = async (userId, shipmentData, randomOrderId, randomShipmentId) => {
    if (!token) await getAuthToken();

    try {
        // console.log("User Id: ", userId);

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
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            sku: item?.productId?.sku || item?.productId?._id,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.sku || generateRandomId().toString()
        }));
		console.log("Order Courior Details: ",orderItems, subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth);

        
		const pickup_locations = await getPickUpLocation();
		console.log("Response Picketup Location",pickup_locations);
		const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
		console.log("Check Is Primary Location: ",primaryLocation)
        const orderDetails = {
            order_id: randomOrderId,
            shipment_id: randomShipmentId,
            order_date: formatDate(new Date()),
            pickup_location: primaryLocation?.pickup_location,
			reseller_name: primaryLocation?.pickup_location,
			company_name: primaryLocation?.pickup_location,
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
			pickup_postcode:primaryLocation?.pin_code,
			delivery_postcode:shipmentData.address.pincode, 
			order_id:response?.data?.order_id,
		});
		console.log("All Available Courier: ",allAvailableCourior?.available_courier_companies);
		const getBestCourir = getBestCourierPartners(allAvailableCourior?.available_courier_companies)
		const bestCourior = getBestCourir[0];
		console.log("Best Courier: ",bestCourior);
		
		const createPicketUpResponse = await generateOrderPicketUpRequest({
			order_id:response?.data?.order_id,
            shipment_id:response?.data?.shipment_id,
			status:response?.data?.status,
			status_code:response?.data?.status_code,
			onboarding_completed_now:response?.data?.onboarding_completed_now,
			courier_company_id:bestCourior?.courier_company_id
		},bestCourior);
        // console.log("createPicketUpResponse: ", createPicketUpResponse);
		const manifest = await generateInvoice(response.data);
        return {shipmentCreatedResponseData:response.data,bestCourior,manifest,warehouse_name:primaryLocation,PickupData:createPicketUpResponse};

    } catch (error) {
        console.error("Error creating order:", error?.response?.data);
        return null;
    }
}; */
export const generateOrderForShipment = async (userId, shipmentData, randomOrderId, randomShipmentId) => {
    // Check if token exists and fetch it if not
    if (!token) await getAuthToken();

    try {
        // Fetch user data if necessary
        const userData = await User.findById(userId);
        if (!userData) {
            console.error("User not found");
            return null;
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate various totals
        const [subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);

        // Generate random ID for HSN and SKU if needed
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        // Map order items to required format
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            sku: item?.productId?.sku || item?.productId?._id,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.sku || generateRandomId().toString()
        }));

        // Get available pickup locations
        const pickup_locations = await getPickUpLocation();
        const primaryLocation = pickup_locations.find(loc => loc.is_primary_location);
        if (!primaryLocation) {
            console.error("Primary pickup location not found");
            // return null;
        }

        // Prepare order details
        const orderDetails = {
            order_id: randomOrderId,
            shipment_id: randomShipmentId,
            order_date: formatDate(new Date()),
            pickup_location: primaryLocation?.pickup_location,
            reseller_name: primaryLocation?.pickup_location,
            company_name: primaryLocation?.pickup_location,
            channel_id: '6282866',
            category: "Clothes",
            billing_isd_code: "+91",
            billing_customer_name: shipmentData.address.Firstname,
            billing_last_name: shipmentData.address.Lastname,
            billing_address: shipmentData.address.address1,
            billing_city: shipmentData.address.address2,
            billing_pincode: shipmentData.address.pincode,
            billing_state: shipmentData.address.state,
            units: orderItems.length,
            billing_country: 'In',
            billing_phone: shipmentData.address.phoneNumber,
            billing_alternate_phone: userData?.phoneNumber,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000, // Convert weight to KG
            order_type: 'NON ESSENTIALS',
            hsn: '441122',
        };

        // Send the request to ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Shipment Created Response: ", response.data);

        // Fetch available couriers in parallel with other tasks
        const [allAvailableCourier, manifest] = await Promise.all([
            getAllServicalibiltyties({
                pickup_postcode: primaryLocation?.pin_code,
                delivery_postcode: shipmentData.address.pincode,
                order_id: response?.data?.order_id,
            }),
            generateInvoice(response.data)
        ]);

        console.log("All Available Courier: ", allAvailableCourier?.available_courier_companies);
        // Get the best courier based on the available companies
        let bestCourier = getBestCourierPartners(allAvailableCourier?.available_courier_companies)[0];
        if (!bestCourier) {
            console.error("No suitable courier found");
			bestCourier = allAvailableCourier?.available_courier_companies[0];
        }

        // Create pickup request with the best courier
        const createPickUpResponse = await generateOrderPicketUpRequest({
            order_id: response?.data?.order_id,
            shipment_id: response?.data?.shipment_id,
            status: response?.data?.status,
            status_code: response?.data?.status_code,
            onboarding_completed_now: response?.data?.onboarding_completed_now,
            courier_company_id: bestCourier?.courier_company_id
        }, bestCourier);
		console.log("createPickUpResponse: ", createPickUpResponse);
        return {
            shipmentCreatedResponseData: response.data,
            bestCourier,
            manifest,
            warehouse_name: primaryLocation,
            PickupData: createPickUpResponse
        };

    } catch (error) {
        console.error("Error creating order:", error?.response?.data || error.message);
		// logger.error(`Error creating order: ${getStringFromObject(error?.response?.data || error.message)}`)
        return null;
    }
};
export const generateRefundOrder = async(order)=>{
	try {
		const {paymentId,TotalAmount} = order;
		const response = await axios.post(`https://api.razorpay.com/v1/payments/${paymentId}/refund`,{amount: TotalAmount});
	} catch (error) {
		console.error(`Error creating order: `,error);
	}
}
export const generateOrderCancel = async(orderId)=>{
	if (!token) await getAuthToken();
	try {
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/cancel`, {ids: [orderId]}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Cancel Order Response: ", response.data);
        return response.data?.status_code === 200 ? true : false;
    } catch (error) {
        console.error("Error cancelling order:", error?.response?.data || error.message);
        return false;
    }
}
export const generateOrderRetrunShipment = async (shipmentData, userId) => {
    if (!token) await getAuthToken();

    try {
        // Check if user exists, skip if not needed for the process
        if (!userId) {
            throw new Error("User ID is required");
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate various totals in parallel using Promise.all
        const [
            subTotal,
            totalOrderWeight,
            totalOrderHeight,
            totalOrderLength,
            totalBredth
        ] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);

        // Generate random ID for HSN and SKU if needed
        const generateRandomId = () => Math.floor(10000000 + Math.random() * 90000000);

        // Map order items to required format in a single pass
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            sku: item?.productId?.sku || item?.productId?._id,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.sku || generateRandomId().toString()
        }));

        // Extract the active pickup location
        const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
        if (!activePickUpLocation) {
            throw new Error("Pickup location is missing");
        }

        // Construct the order details for the return shipment
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
            reseller_name: "On U",
            company_name: "On U",
            channel_id: '6282866',
            category: "Clothes",
            pickup_isd_code: "+91",
            pickup_customer_name: shipmentData.address.Firstname,
            pickup_last_name: shipmentData.address.Lastname,
            pickup_address: shipmentData.address.address1,
            pickup_city: shipmentData.address.address2,
            pickup_pincode: shipmentData.address.pincode,
            pickup_state: shipmentData.address.state,
            pickup_country: 'India',
            pickup_phone: shipmentData.address.phoneNumber,

            shipping_customer_name: activePickUpLocation.name,
            shipping_last_name: '',
            shipping_address: activePickUpLocation.address,
            shipping_address_2: activePickUpLocation.address_2,
            shipping_city: activePickUpLocation.city,
            shipping_country: activePickUpLocation.country,
            shipping_pincode: activePickUpLocation.pin_code,
            shipping_state: activePickUpLocation.state,
            shipping_email: activePickUpLocation.email,
            shipping_phone: activePickUpLocation.phone,
            units: orderItems.length,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000, // Convert weight to KG
            hsn: '441122' // Use a predefined HSN code
        };

        console.log("ShipRocket Order Returning Data: ", orderDetails);

        // Create return shipment by calling ShipRocket API
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/return`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Return Shipment Created Response: ", response.data);
        return response.data;

    } catch (error) {
        console.error("Error creating return shipment:", error?.response?.data || error.message);
        logger.error(`Error creating return shipment: ${getStringFromObject(error?.response?.data || error.message)}`);
        return null;
    }
};


/* export const generateOrderRetrunShipment = async (shipmentData,userId) => {
	if(!token) await getAuthToken();
	try {
		// Fetch user data
        const userData = await User.findById(userId);
        if (!userData) {
            // console.error("User not found");
            // return null;
			throw new Error("User not found");
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
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            discount: item?.productId?.DiscountedPercentage || 0,
            sku: item?.productId?.sku || item?.productId?._id,
            tax: item?.productId?.gst || 0,
            hsn: item?.productId?.sku || generateRandomId().toString()
        }));
		// const pickup_locations = await getPickUpLocation();
		// console.log("Order Courior Details: ",orderItems, subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth);
		const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
		console.log("Active Pickup Location: ", activePickUpLocation);
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
			reseller_name: "On U",
			company_name: "On U",
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
		logger.error(`Error creating return shipment: ${error?.response?.data || error.message}`);
        return null;
    }
} */

/* export const generateExchangeShipment = async (shipmentData, userId) => {
	if(!token) await getAuthToken();
	try {
		
		const userData = await User.findById(userId);
        if (!userData) {
            // console.error("User not found");
			throw new Error("User not found");
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
			reseller_name: "On U",
			company_name: "On U",
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
} */


export const generateExchangeShipment = async (shipmentData, userId) => {
    // Check and fetch token only if it's not available
    if (!token) await getAuthToken();

    try {
        // If userId is passed, no need to fetch user data from DB unless necessary
        if (!userId) {
            throw new Error("User ID is required");
        }

        // Helper function to calculate totals for order items
        const calculateTotal = (key) => shipmentData.orderItems.reduce((total, item) => total + item.productId[key], 0);

        // Calculate totals concurrently using Promise.all
        const [subTotal, totalOrderWeight, totalOrderHeight, totalOrderLength, totalBredth] = await Promise.all([
            calculateTotal('price'),
            calculateTotal('weight'),
            calculateTotal('height'),
            calculateTotal('length'),
            calculateTotal('breadth')
        ]);

        // Map order items to the required format
        const orderItems = shipmentData.orderItems.map(item => ({
            name: item?.productId?.title,
            sku: item?.productId?._id,
            selling_price: item.productId.salePrice || item.productId.price,
            units: item.quantity,
            qc_enable: true,
            qc_product_name: item?.productId?.title,
            qc_product_image: item?.productId?.image,
            qc_brand: item?.productId?.brand,
            qc_color: item?.productId?.color?.name,
            qc_size: item?.productId?.size?.label,
            discount: item?.productId?.DiscountedPercentage,
            tax: 0,
        }));

        // Get pickup location from shipment data
        const activePickUpLocation = shipmentData.picketUpLoactionWareHouseName;
        if (!activePickUpLocation) {
            throw new Error("Pickup location is missing");
        }

        // Construct the order details
        const orderDetails = {
            order_id: shipmentData.order_id,
            order_date: formatDate(shipmentData.createdAt),
            reseller_name: "On U",
            company_name: "On U",
            channel_id: '6282866',
            category: "Clothes",
            pickup_isd_code: "+91",
            pickup_customer_name: shipmentData.address.Firstname,
            pickup_last_name: shipmentData.address.Lastname,
            pickup_address: shipmentData.address.address1,
            pickup_city: shipmentData.address.address2,
            pickup_pincode: shipmentData.address.pincode,
            pickup_state: shipmentData.address.state,
            pickup_country: 'India',
            pickup_phone: shipmentData.address.phoneNumber,

            shipping_customer_name: activePickUpLocation.name,
            shipping_last_name: '',
            shipping_address: activePickUpLocation.address,
            shipping_address_2: activePickUpLocation.address_2,
            shipping_city: activePickUpLocation.city,
            shipping_country: activePickUpLocation.country,
            shipping_pincode: activePickUpLocation.pin_code,
            shipping_state: activePickUpLocation.state,
            shipping_email: activePickUpLocation.email,
            shipping_phone: activePickUpLocation.phone,
            units: orderItems.length,
            order_items: orderItems,
            payment_method: shipmentData?.paymentMode,
            sub_total: subTotal,
            length: totalOrderLength,
            breadth: totalBredth,
            height: totalOrderHeight,
            weight: totalOrderWeight / 1000,  // Convert weight to KG
        };

        console.log("ShipRocket Exchange Data: ", orderDetails);

        // Make the request to ShipRocket API to create the exchange shipment
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/exchange`, orderDetails, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Return Shipment Created Response: ", response.data);
        return response.data; // Returning response for further processing if necessary
    } catch (error) {
        console.error("Error creating exchange shipment:", error?.response?.data || error.message);
		logger.error(`Error creating exchange shipment ${getStringFromObject(error?.response?.data || error.message)}`)
        // throw new Error("Failed to create exchange shipment"); // Forward the error for handling upstream
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
	if(!token) await getAuthToken();
    try {
		const res = await axios.get(`${SHIPROCKET_API_URL}/courier/track?order_id=${orderId}&channel_id=6282866`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
		console.log("Shipment order Tracking: ",res.data);
        return res.data;
    } catch (error) {
		console.error("Error getting Shipment Order by ID: ",error?.response?.data);
		return null;
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
		// console.dir(error, { depth: null});
		console.error("Error getting PickeUp Location: ",error?.response?.data);
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
		return res?.data?.success;
    } catch (error) {
        // console.dir(error, { depth: null});
		console.error("Error adding new PickeUp Location: ",error?.response?.data);
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