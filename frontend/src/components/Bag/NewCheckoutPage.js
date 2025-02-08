import React, { useState } from 'react';

const NewCheckout = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [products, setProducts] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isNewAddress, setIsNewAddress] = useState(false);

    // Calculate total
    const calculateTotal = () => {
        const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
        return total - discount;
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
        {/* Login Prompt if not logged in */}
        {!isLoggedIn && <LoginPrompt onLogin={() => setIsLoggedIn(true)} />}
        
        {/* Product List */}
        <ProductList products={products} />
        
        {/* Coupon and Discount */}
        <CouponInput couponCode={couponCode} setCouponCode={setCouponCode} setDiscount={setDiscount} />
        <DiscountSummary discount={discount} />
        
        {/* Total Calculation */}
        <div className="text-xl font-semibold mt-4">
            <span>Total: </span>
            <span>${calculateTotal()}</span>
        </div>

        {/* Delivery Address */}
        <DeliveryAddress 
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            setIsNewAddress={setIsNewAddress}
        />

        {/* New Address Form */}
        {isNewAddress && <NewAddressForm />}

        {/* Payment Options */}
        <PaymentOptions total={calculateTotal()} />
        </div>
    );
};
const ProductList = ({ products }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold">Products in your Cart</h2>
            <div className="mt-4 space-y-4">
            {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mr-4" />
                    <div>
                    <h3 className="text-xl">{product.name}</h3>
                    <p className="text-gray-500">x{product.quantity}</p>
                    </div>
                </div>
                <div>
                    <span>${product.price * product.quantity}</span>
                </div>
                </div>
            ))}
            </div>
        </div>
    );
};
const CouponInput = ({ couponCode, setCouponCode, setDiscount }) => {
    const handleApplyCoupon = () => {
        if (couponCode === "DISCOUNT10") {
            setDiscount(10); // Apply 10% discount
        } else {
            setDiscount(0);
        }
    };
  
    return (
        <div className="mt-4">
            <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border p-2 rounded"
            placeholder="Enter Coupon Code"
            />
            <button onClick={handleApplyCoupon} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
            Apply
            </button>
        </div>
    );
};
const DiscountSummary = ({ discount }) => {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Discount Summary</h3>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>-${discount}</span>
        </div>
      </div>
    );
};
const PaymentOptions = ({ total }) => {
    const handlePayment = (method) => {
        console.log("Processing payment via", method);
        // Implement payment logic here
    };
  
    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold">Payment Options</h3>
            <div className="mt-2 space-y-4">
            <button onClick={() => handlePayment("Credit Card")} className="w-full bg-green-500 text-white py-3 rounded">
                Pay with Credit Card
            </button>
            <button onClick={() => handlePayment("PayPal")} className="w-full bg-blue-500 text-white py-3 rounded">
                Pay with PayPal
            </button>
            </div>
        </div>
    );
};
const LoginPrompt = ({ onLogin }) => {
    return (
        <div className="p-4 bg-yellow-200 mb-4">
            <p>Please log in to proceed with your order.</p>
            <button onClick={onLogin} className="bg-blue-500 text-white py-2 px-4 rounded">
                Log In
            </button>
        </div>
    );
};
const DeliveryAddress = ({ selectedAddress, setSelectedAddress, setIsNewAddress }) => {
    const handleAddressSelection = (address) => {
      setSelectedAddress(address);
    };
  
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        {selectedAddress ? (
          <div>
            <p>{selectedAddress}</p>
            <button onClick={() => setIsNewAddress(true)} className="text-blue-500">Change Address</button>
          </div>
        ) : (
          <button onClick={() => setIsNewAddress(true)} className="bg-blue-500 text-white py-2 px-4 rounded">
            Add New Address
          </button>
        )}
      </div>
    );
};
const NewAddressForm = () => {
    return (
        <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-semibold">New Delivery Address</h3>
            <input type="text" className="border p-2 rounded mt-2 w-full" placeholder="Street Address" />
            <input type="text" className="border p-2 rounded mt-2 w-full" placeholder="City" />
            <input type="text" className="border p-2 rounded mt-2 w-full" placeholder="State" />
            <input type="text" className="border p-2 rounded mt-2 w-full" placeholder="Postal Code" />
            <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full">Save Address</button>
        </div>
    );
};

export default NewCheckout;
