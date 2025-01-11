import axios from 'axios';
import dotenv from 'dotenv'
import User from '../../model/usermodel.js';

dotenv.config();


const SHIPROCKET_API_URL = process.env.SHIPROCKET_API_URL;
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
let token = '';

export const getAuthToken = async () => {
    try {
        // console.log("ShipApi URL: ", SHIPROCKET_API_URL, SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD);

        const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD
        });

        token = response?.data?.token; // Store the token
        console.log('Connected to Shiprocket');
    } catch (error) {
        console.error('Error fetching auth token:', error.message);
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

/* const orderDetails = {
    "order_id": "ORD987654321",
    "order_date": "2025-07-24 11:11",  // Optional, but some systems might need it
    "pickup_location": "Kolkata",
    "channel_id": "1", // Assuming channel_id is required, you should use the actual channel ID
    "billing_customer_name": "Alice Johnson",
    "billing_last_name": "Johnson",
    "billing_address": "456 Green Street",
    "billing_address_2": "Near Central Park",
    "billing_isd_code": "91",  // India ISD code
    "billing_city": "Mumbai",
    "billing_pincode": "400001",
    "billing_state": "Maharashtra",
    "billing_country": "India",
    "billing_email": "alice.johnson@example.com",
    "billing_phone": "+919876543210",
    "billing_alternate_phone": "9854321098", // Optional, but provide an alternate number if available
    "shipping_is_billing": true,
    "shipping_customer_name": "Alice Johnson",
    "shipping_last_name": "Johnson",
    "shipping_address": "456 Green Street",
    "shipping_address_2": "Near Central Park",
    "shipping_city": "Mumbai",
    "shipping_state": "Maharashtra",
    "shipping_country": "India",
    "shipping_pincode": "400001",
    "shipping_email": "alice.johnson@example.com",
    "shipping_phone": "+919876543210",
    "order_items": [
        {
            "name": "Product 1",
            "sku": "P12345",
            "units": 2,
            "selling_price": "500",
            "discount": "50",
            "tax": "18",
            "hsn": "123456"
        }
    ],
    "payment_method": "COD", // Example: "COD" (Cash on Delivery), you can set other payment methods as needed
    "shipping_charges": "50", // Add shipping charges if applicable
    "giftwrap_charges": "0", // Optional, if no charges, set to 0
    "transaction_charges": "0", // Optional
    "total_discount": "50", // Example total discount, adjust as needed
    "sub_total": "1000", // Subtotal for the order
    "length": "10", // Product packaging dimension length in cm
    "breadth": "10", // Product packaging dimension breadth in cm
    "height": "10", // Product packaging dimension height in cm
    "weight": "1", // Product weight in kg
    "ewaybill_no": "", // Optional, provide if needed
    "customer_gstin": "123456789012345", // Optional, GST number if applicable
    "invoice_number": "INV123456", // Optional, provide if applicable
    "order_type": "adhoc" // Make sure this is the correct order type, e.g., "adhoc"
}; */

export const generateOrderForShipment = async(shipmentData,randomOrderId) =>{
    if(!token) await getAuthToken();
    try {
        const userData = await User.findById(shipmentData.userId);
        if(!userData){
            console.error("User not found");
            return null;
        }
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
            billing_customer_name: userData.name, // Customer's name
            billing_last_name:"last_name",
            billing_address: shipmentData.SelectedAddress.address1, // Customer's billing address line 1
            billing_city: shipmentData.SelectedAddress.address2, // Customer's billing address line 2 (city)
            billing_pincode: shipmentData.SelectedAddress.pincode, // Billing address postal code
            billing_state: "Delhi", // State for the billing address
            billing_country: "India", // Country for the billing address
            billing_phone: `9101094674`, // Customer's phone number
            billing_alternate_phone: "9101094674",
            shipping_is_billing: true, // Set to true if shipping address is same as billing address
            order_items: orderItems, // Array of items in the order (This needs to be defined)
            payment_method: shipmentData.paymentMode, // Payment method (can be 'Prepaid' or 'Cash on Delivery')
            sub_total: 100, // Sub-total amount for the order (without taxes and shipping charges)
            length: 10, // Package dimensions (length)
            breadth: 10, // Package dimensions (breadth)
            height: 10, // Package dimensions (height)
            weight: 1, // Package weight in kilograms
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


export const checkShipmentAvailability = async(wareHousePincode,) =>{
    if(!token) await getAuthToken();
    try {
        const res = await axios.get(`${SHIPROCKET_API_URL}/courier/serviceability/`)   
    } catch (error) {
        console.dir(error, { depth: null});
    }
}