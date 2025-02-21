import axios from 'axios';
import dotenv from 'dotenv'
import User from '../../model/usermodel.js';

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
		return null;
    } catch (error) {
        console.error('Error fetching auth token:', error);
        return null;
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

export const generateOrderForShipment = async(userId,shipmentData,randomOrderId) =>{
    if(!token) await getAuthToken();
    try {
		console.log("User Id: ", userId);
        const userData = await User.findById(userId);
        if(!userData){
            console.error("User not found");
            return null;
        }
		const subTotal = shipmentData.orderItems.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
		const totalOrderWeight = shipmentData.orderItems.reduce((total, item) => total + (item.productId.weight * item.quantity), 0);
		const totalOrderHeight = shipmentData.orderItems.reduce((total, item) => total + (item.productId.height * item.quantity), 0);
		const totalOrderLength = shipmentData.orderItems.reduce((total, item) => total + (item.productId.length * item.quantity), 0);
		const totalOrderWidth = shipmentData.orderItems.reduce((total, item) => total + (item.productId.width * item.quantity), 0);
		const totalBredth = shipmentData.orderItems.reduce((total, item) => total + (item.productId.breadth * item.quantity), 0);
        const orderItems = shipmentData.orderItems.map(item =>{
            console.log("item: ",item);
            return{
                name:item.productId.title,
                sku: item.productId._id, // The unique identifier for the product
                selling_price:item.productId.salePrice || item.productId.price,
                units: item.quantity,
                discount: 0,
                tax: 0,
                hsn: '1234'
            }
        })
        
        function formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        const orderDetails = {
            order_id: randomOrderId, // Unique order ID, ensure this is generated dynamically
            order_date: formatDate(new Date()), // The date when the order is placed (in YYYY-MM-DD HH:mm format)
            pickup_location: "warehouse", // The city from where the order is to be picked up
            billing_customer_name: shipmentData.address.Firstname, // Customer's name
            billing_last_name:shipmentData.address.Lastname,
            billing_address: shipmentData.address.address1, // Customer's billing address line 1
            billing_city: shipmentData.address.address2, // Customer's billing address line 2 (city)
            billing_pincode: shipmentData.address.pincode, // Billing address postal code
            billing_state: shipmentData.address.state, // State for the billing address
            billing_country: "India", // Country for the billing address
            billing_phone: shipmentData.address.phoneNumber, // Customer's phone number
            billing_alternate_phone: userData?.phoneNumber,
            shipping_is_billing: true, // Set to true if shipping address is same as billing address
            order_items: orderItems, // Array of items in the order (This needs to be defined)
            payment_method: shipmentData.paymentMode, // Payment method (can be 'Prepaid' or 'Cash on Delivery')
            sub_total: subTotal, // Sub-total amount for the order (without taxes and shipping charges)
            length: totalOrderLength, // Package dimensions (length)
            breadth: totalBredth, // Package dimensions (breadth)
            height: totalOrderHeight, // Package dimensions (height)
            weight: totalOrderWeight, // Package weight in kilograms
        };
        
        
        
        
        console.log("ShipRocket Order data: ",orderDetails)
        const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`,orderDetails,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.dir(response.data,{depth:null});
        return response.data;
    } catch (error) {
        // console.dir('Error creating order:', error);
        console.dir(error, { depth: null});
        return null;
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
        
        return res?.data?.data;
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