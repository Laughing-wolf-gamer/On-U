import React, { useState } from 'react';

// Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="font-semibold text-2xl text-gray-800 mb-4">Order Details</h2>
          
          {/* Order Image */}
          <div className="flex justify-center mb-4">
            <img
              src={order?.image || 'https://via.placeholder.com/150'}
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
  
          {/* Order Details */}
          <div className="space-y-2 mb-4">
            <p className="text-gray-700"><strong>Product ID:</strong> {order?.productId || 'Not Available'}</p>
            <p className="text-gray-700"><strong>Order ID:</strong> {order?.orderId || 'Not Available'}</p>
            <p className="text-gray-700"><strong>Order Status:</strong> {order?.status || 'Pending'}</p>
          </div>
  
          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };


const OrderCard = ({ order ,onViewDetails }) => {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h2 className="font-semibold text-2xl text-gray-800 mb-4">Order Details</h2>
  
        <div className="space-y-4">
          {/* Order Image */}
          <div className="flex justify-center">
            <img
              src={order?.image || 'https://via.placeholder.com/150'}
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
          </div>
  
          {/* Order Details */}
          <div className="space-y-2">
            <p className="text-gray-700"><strong>Product ID:</strong> {order?.productId || 'Not Available'}</p>
            <p className="text-gray-700"><strong>Order ID:</strong> {order?.orderId || 'Not Available'}</p>
            <p className="text-gray-700"><strong>Order Status:</strong> {order?.status || 'Pending'}</p>
          </div>
  
          {/* Order Actions */}
          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              View Details
            </button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400">
              Return Order
            </button>
          </div>
        </div>
      </div>
    );
  };
const OrdersReturns = ({orders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };
    return (
        <div className="space-y-6">
            <h2 className="font-semibold text-2xl text-gray-800 mb-6">Orders & Returns</h2>
            {orders && orders.length > 0 ? (
                orders.map((order, index) => (
                    <OrderCard key={index} order={order} onViewDetails={handleViewDetails}/>
                ))
            ) : (
                <p className="text-gray-500">No orders yet.</p>
            )} 
            {/* Render Modal if there's a selected order */}
            {selectedOrder && (
                <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
            )}
            
        </div>
    );
};

export default OrdersReturns;
