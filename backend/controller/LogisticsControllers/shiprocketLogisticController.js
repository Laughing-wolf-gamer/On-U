import axios from 'axios';
import dotenv from 'dotenv'
import User from '../../model/usermodel.js';
import qs from 'querystring'

dotenv.config();

const DELEIVARY_TOKEN = process.env.DELIVARY_API_TOKEN;
const DELEIVARY_API = process.env.DELIVARY_API_START;


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
    // if(!token) await getAuthToken();
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
        // Prepare the payload data as the 'data' object
        const requestData = {
            order_id: randomOrderId, // Unique order ID
            payment_mode: 'COD', // Payment mode (COD, Pre-paid, or Pickup)
            pickup_location: 'Registered Warehouse Name', // Exact warehouse name (case-sensitive)
            client_name: 'ON U', // Registered client name
            fragile_shipment: false, // Set to true if fragile items are being shipped
            waybill: [  // Shipment data (waybills for each box)
            {
                box_id: 'box_1',
                waybill_number: 'WB123456789',  // Unique waybill number for this box
                contents: 'Product 1, Product 2' // Product details for the box
            },
            {
                box_id: 'box_2',
                waybill_number: 'WB987654321',  // Unique waybill number for another box
                contents: 'Product 3, Product 4' // Product details for the box
            }
            ]
        };
        
        // URL encode the JSON payload
        const payload = qs.stringify({
            format: 'json',  // Specify that the format is JSON
            data: JSON.stringify(requestData) // Encode the data as a JSON string
        });
        
        // Define your API Key or Bearer Token
        const apiKey = DELEIVARY_TOKEN.toString();  // Replace with your actual API key or token
        
        // Make the POST request using Axios with authentication headers
        axios.post('https://track.delhivery.com/api/cmu/create.json', payload, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Content-Type for URL-encoded data
            'Authorization': `Token ${apiKey}`  // Include the authentication token or API key
            }
        })
        .then(response => {
        console.log('Success:', response.data);
        })
        .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
        });
        /* const data = {
            pickup_time: '14:30:00',  // Example time in hh:mm:ss
            pickup_date: '2025-01-20', // Example date in YYYY-MM-DD
            pickup_location: 'Warehouse A', // Example pickup location
            expected_package_count: 5 // Example expected package count
        };
        
        // Replace with your actual API key or token
        const apiKey = DELEIVARY_TOKEN.toString();
        
        axios.post('https://track.delhivery.com/fm/request/new/', data, {
        headers: {
            'Authorization': `Token ${apiKey}`, // For Bearer token
        }
        })
        .then(response => {
            console.log('Request successful:', response.data);
        })
        .catch(error => {
            console.error('Error during the request:', error.response ? error.response.data : error.message);
        }); */
        // const createdOrderResponse  = await axios.request(orderOptions);
        // console.log("Created Order request", createdOrderResponse.data);
        /* const PicketUpData = {
            pickup_time:new Date().toTimeString(),
            pickup_date:new Date().toLocaleDateString(),
            pickup_location:'warehouse 1',
            expected_package_count:1,
        }
        const Picketoptions = {
            method: 'POST',
            url: `https://track.delhivery.com/api/cmu/create.json`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Change the content type to form-url-encoded
                Authorization: `Token ${DELEIVARY_TOKEN}`,
                'Cache-Control': 'no-cache, must-revalidate, proxy-revalidate'
            },
            params: `format=json&data=`,
            data:PicketUpData
        };
        const orderCreation = await axios.request(Picketoptions); */

        // console.log("Created Picket Up request", orderCreation.data);
        

        return null;
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


export const checkShipmentAvailability = async(delivary_pin,weight) =>{
    try {
        console.log("Checking shipment availability: ",delivary_pin,DELEIVARY_TOKEN);
        const res = await axios.get(`${DELEIVARY_API}/pin-codes/json/?filter_codes=${Number(delivary_pin)}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${DELEIVARY_TOKEN}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        });
        console.log("res",res?.data?.delivery_codes[0].postal_code);
        /* if(!token) await getAuthToken();
        const picketUp_pin = 784501;
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

        console.log("Checking Delivery: ",res.data); */
        // console.dir(res.data,{ depth: null})
        const firstPostalCode = res?.data?.delivery_codes[0].postal_code
        return firstPostalCode.remarks === '';
        // return res?.data?.delivery_codes || [];
    } catch (error) {
        // console.dir(error, { depth: null});
        console.error("Error: ",error.message)
    }
}