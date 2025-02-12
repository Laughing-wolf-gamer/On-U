import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../action/orderaction';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaSortAmountDown, FaRegClock, FaRegCheckCircle } from 'react-icons/fa'; // Importing icons
import DeliveryStatus from './DeliveryStatus';

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
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('');

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        navigation(`/order/details/${order._id}`);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch, filter, sort]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const filteredOrders = () => {
        let orders = allorder;
        if (filter && orders) {
            const currentDate = new Date();
            switch (filter) {
                case 'thisMonth':
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate.getMonth() === currentDate.getMonth() &&
                            orderDate.getFullYear() === currentDate.getFullYear();
                    });
                    break;
                case 'last7Days':
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(currentDate.getDate() - 7);
                        return orderDate >= sevenDaysAgo;
                    });
                    break;
                case 'yesterday':
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        const yesterday = new Date();
                        yesterday.setDate(currentDate.getDate() - 1);
                        return orderDate.toDateString() === yesterday.toDateString();
                    });
                    break;
                default:
                    break;
            }
        }

        if (sort && orders) {
            if (sort === 'latest') {
                orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sort === 'oldest') {
                orders = orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
        }

        return orders;
    };

    const ordersToDisplay = filteredOrders();

    return (
        <div className="space-y-6 w-full flex flex-col items-center px-4 sm:px-6 md:px-8">
            <h2 className="font-semibold text-2xl text-gray-800 mb-6">Orders & Returns</h2>

            {/* Filter and Sort Dropdowns */}
            <div className="flex justify-center md:justify-start sm:justify-start xl:justify-start 2xl:justify-start space-x-7 w-full mb-6">
                <div className="w-fit flex items-center">
                    <FaFilter className="mr-2 text-gray-600" /> {/* Filter Icon */}
                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-md"
                    >
                        <option value="">Filter by</option>
                        <option value="thisMonth">This Month</option>
                        <option value="last7Days">Last 7 Days</option>
                        <option value="yesterday">Yesterday</option>
                    </select>
                </div>

                <div className="w-fit flex items-center">
                    <FaSortAmountDown className="mr-2 text-gray-600" /> {/* Sort Icon */}
                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="border p-2 rounded-md"
                    >
                        <option value="">Sort by</option>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>

            {orderLoading ? (
                Array(9).fill(0).map((_, index) => <OrderCardSkeleton key={index} />)
            ) : (
                <Fragment>
                    {ordersToDisplay && ordersToDisplay.length > 0 ? (
                        <div className="grid grid-cols-1 w-full">
                            {ordersToDisplay.map((order, index) => (
                                <OrderCard
                                    key={index}
                                    order={order}
                                    onViewDetails={handleViewDetails}
                                />
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
