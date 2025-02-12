import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../action/orderaction';
import { getRandomItem } from '../../../config';
import { useNavigate } from 'react-router-dom';
import DeliveryStatus from './DeliveryStatus';

// Modal Component
/* const OrderDetailsModal = ({ order, onClose }) => {
    console.log("Selected Order: ",order);
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
          <h2 className="font-semibold text-2xl text-gray-800 mb-4">Order Details</h2>

          {order?.orderItems && order.orderItems.length > 0 ? (
            [1,2,3,4,5,6].map((item, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-center mb-4">

                  {order.orderItems[0]?.color?.images?.length > 0 ? (
                    <img
                      src={order.orderItems[0]?.color?.images[0]?.url || 'https://via.placeholder.com/150'}
                      alt={`Product ${order.orderItems[0]?.productId?._id}`}
                      className="w-32 h-32 object-contain rounded-lg shadow-md mb-2"
                  />
                  ) : (
                    <img
                      src={'https://via.placeholder.com/150'}
                      alt="Product Placeholder"
                      className="w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  )}
                </div>
    
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <strong>Product ID:</strong> {order.orderItems[0]?.productId?._id || 'Not Available'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Product Name:</strong> {order.orderItems[0]?.productId?.title || 'Not Available'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Quantity:</strong> {order.orderItems[0]?.quantity || 0}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-700">No Order Items Available</p>
          )}
    
          <div className="space-y-2 mb-4">
            <p className="text-gray-700">
              <strong>Order ID:</strong> {order?._id || 'Not Available'}
            </p>
            <p className="text-gray-700">
              <strong>Order Status:</strong> {order?.status || 'Pending'}
            </p>
          </div>
    
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
  
  }; */

const OrderCard = ({ order, onViewDetails }) => {
	return (
		<div
		onClick={(e) => {
			e.preventDefault();
			onViewDetails(order);
		}}
		className="w-full justify-between mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 cursor-pointer hover:shadow-xl transition duration-300"
		>
			{/* Delivery Status Progress Bar */}
			<div className="w-full flex-wrap justify-center items-center">
				<DeliveryStatus status={order?.status} />
			</div>
			<div className="flex justify-between items-center space-x-6">
				<div className="flex-1 space-y-2">
				<p className="text-gray-700">
					<strong>Order ID:</strong> {order?._id || 'Not Available'}
				</p>
				<p className="text-gray-700">
					<strong>Total Items:</strong> {order?.orderItems?.length || 'Not Available'}
				</p>
				<p className="text-gray-700">
					<strong>Order Status:</strong> {order?.status || 'Pending'}
				</p>
				</div>
			</div>
		</div>
	);
};

const OrdersReturns = () => {
	const { allorder, loading: orderLoading } = useSelector((state) => state.getallOrders);
	const navigation = useNavigate();
	const dispatch = useDispatch();
	const [selectedOrder, setSelectedOrder] = useState(null);

	const handleViewDetails = (order) => {
		setSelectedOrder(order);
		navigation(`/order/details/${order._id}`);
	};

	const handleCloseModal = () => {
		setSelectedOrder(null);
	};

	useEffect(() => {
		dispatch(fetchAllOrders());
	}, [dispatch]);

  return (
		<div className="space-y-6 w-full flex flex-col items-center px-4 sm:px-6 md:px-8">
		<h2 className="font-semibold text-2xl text-gray-800 mb-6">Orders & Returns</h2>
		{orderLoading ? (
			// If no orders or loading, show skeletons
			Array(9)
			.fill(0)
			.map((_, index) => <OrderCardSkeleton key={index} />)
		) : (
			<Fragment>
			{allorder && allorder.length > 0 ? (
				<div className="grid grid-cols-1 w-full">
				{allorder.map((order, index) => (
					<OrderCard key={index} order={order} onViewDetails={handleViewDetails} />
				))}
				</div>
			) : (
				<p className="text-gray-500">No orders yet.</p>
			)}
			</Fragment>
		)}
		</div>
	);
};

const OrderCardSkeleton = () => {
	return (
		<div className="w-full justify-between mx-auto p-6 bg-white shadow-lg rounded-lg mt-6 animate-pulse">
		{/* Delivery Status Progress Bar */}
		<div className="w-full flex-wrap justify-center items-center">
			<div className="h-6 w-3/4 bg-gray-300 rounded"></div>
		</div>

		<div className="flex justify-between items-center space-x-6">
			<div className="flex-1 space-y-2">
			<div className="h-4 bg-gray-300 rounded w-3/4"></div> {/* Order ID placeholder */}
			<div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Total items placeholder */}
			<div className="h-4 bg-gray-300 rounded w-2/3"></div> {/* Order status placeholder */}
			</div>
		</div>
		</div>
	);
};
export default OrdersReturns;
