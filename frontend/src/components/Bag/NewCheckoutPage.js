import React, { useState } from "react";

const NewCheckoutPage = () => {
  const [activeTab, setActiveTab] = useState("shipping");

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="flex justify-between items-center p-4 border-b">
          <ul className="flex space-x-8">
            <li>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`text-lg ${activeTab === "shipping" ? "font-semibold text-blue-600" : "text-gray-600"}`}
              >
                Shipping
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("payment")}
                className={`text-lg ${activeTab === "payment" ? "font-semibold text-blue-600" : "text-gray-600"}`}
              >
                Payment
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="mt-24">
        {activeTab === "shipping" && <ShippingDetails />}
        {activeTab === "payment" && <PaymentDetails />}
      </div>
    </div>
  );
};

const ShippingDetails = () => {
    const savedAddresses = [
      { id: 1, address: "123 Main St, New York, NY" },
      { id: 2, address: "456 Elm St, Los Angeles, CA" },
    ];
  
    const [newAddress, setNewAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  
    const handleAddAddress = () => {
      if (newAddress) {
        alert("New address added: " + newAddress);
        setNewAddress("");
      }
    };
  
    return (
      <div>
        <h2 className="text-xl font-semibold">Shipping Details</h2>
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Saved Addresses</h3>
          <div className="space-y-4 mt-4">
            {savedAddresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAddress.id === address.id ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                {address.address}
              </div>
            ))}
          </div>
  
          <div className="mt-6">
            <h3 className="font-semibold text-lg">Add New Address</h3>
            <input
              type="text"
              className="mt-2 p-2 w-full border rounded-md"
              placeholder="Enter new address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <button
              onClick={handleAddAddress}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Address
            </button>
          </div>
        </div>
      </div>
    );
};
const PaymentDetails = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
  
    return (
      <div>
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="mt-6">
          <h3 className="font-semibold text-lg">Select Payment Method</h3>
          <div className="space-y-4 mt-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedPaymentMethod === "creditCard" ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => setSelectedPaymentMethod("creditCard")}
            >
              Credit Card
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedPaymentMethod === "paypal" ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => setSelectedPaymentMethod("paypal")}
            >
              PayPal
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedPaymentMethod === "bankTransfer" ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => setSelectedPaymentMethod("bankTransfer")}
            >
              Bank Transfer
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md">
            Proceed to Payment
          </button>
        </div>
      </div>
    );
};

export default NewCheckoutPage;
