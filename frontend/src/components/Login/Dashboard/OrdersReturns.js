import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../action/orderaction';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa'; // Importing icons
import { useEncryptionDecryptionContext } from '../../../Contaxt/EncryptionContext';
import { ORDER_ENCRYPTION_SECREAT_KEY } from '../../../config';
import { ChevronRight } from 'lucide-react';
import DeliveryStatusAllOrders from './DeliveryStatusAllOrders';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const OrderCard = ({ order, onViewDetails }) => {
	return (
		<div 
			onClick={(e) => {
				onViewDetails(order);
			}}
			className="w-full justify-between items-center flex py-4 px-2 bg-white rounded-md border-b-[1px] border-gray-300 space-y-2 cursor-pointer transition duration-300">
				{/* Order Details */}
				<div className="flex flex-row flex-1 justify-start items-center space-x-2">
					<LazyLoadImage
						effect='blur'
						useIntersectionObserver
							wrapperProps={{
							// If you need to, you can tweak the effect transition using the wrapper style.
							style: {transitionDelay: "0.5s"},
						}}
						placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}	
						loading='lazy'
						src={order?.orderItems[0]?.color?.images[0]?.url}
						alt="order preview image"
						className="w-20 h-min sm:w-40 sm:h-40 object-cover rounded-md hover:scale-105 transition-all duration-500 ease-in-out"
					/>
					<div className="space-y-2 w-full sm:space-y-3">
						<div className="text-gray-700 text-sm sm:text-base">
							<strong>Order ID:</strong> {order?.order_id || 'Not Available'}
						</div>
						<div className="text-gray-700 h-fit space-x-1">
							<strong className='text-sm sm:text-base'>Status:</strong>
							<span className='bg-black text-white text-[7px] sm:text-xs animate-pulse rounded-full px-3 py-2'>
								{order?.status}
							</span>
						</div>
						<div className="space-x-2 flex items-center justify-start">
							<strong className="text-xs md:text-base text-gray-700">ETD : </strong>
							<span className='whitespace-nowrap text-xs md:text-sm'>{order?.etd ? new Date(order?.etd).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Will Update Soon'}</span>
						</div>						
						<DeliveryStatusAllOrders status={order?.status} hiddenText = {window.screen.width < 1024} />
					</div>
				</div>
				<ChevronRight onClick={(e) => {
					e.stopPropagation();
					onViewDetails(order);
				}} className='text-black text-2xl hover:animate-vibrateScale transition-all ease-in-out hover:scale-105' size={20}/>
		</div>
	);
};




const OrdersReturns = () => {
	const orderStatus = [
		{ id: 'Confirmed', label: 'Confirmed' },
		{ id: 'Processing', label: 'Processing' },
		{ id: 'Pickup Scheduled', label: 'Pickup Scheduled' },
		{ id: "Ready To Ship", label: 'Ready To Ship' },
		{ id: 'Shipped', label: 'Shipped' },
		{ id: 'Delivered', label: 'Delivered' },
		{ id: 'Canceled', label: 'Canceled' },
		{ id: 'Delivered', label: 'Delivered' },
		{ id: 'RTO Initiated', label: 'RTO Initiated' },
		{ id: 'Lost', label: 'Lost' },
		{ id: 'Pickup Error', label: 'Pickup Error' },
		{ id: 'RTO Acknowledged', label: 'RTO Acknowledged' },
		{ id: 'Pickup Rescheduled', label: 'Pickup Rescheduled' },
		{ id: 'Cancellation Requested', label: 'Cancellation Requested' },
		{ id: 'Out For Delivery', label: 'Out For Delivery' },
		{ id: 'In Transit', label: 'In Transit' },
		{ id: 'Out For Pickup', label: 'Out For Pickup' },
		{ id: 'Pickup Exception', label: 'Pickup Exception' },
	];
	const{encryptWithKey} = useEncryptionDecryptionContext();
    const { allorder, loading: orderLoading } = useSelector((state) => state.getallOrders);
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sort, setSort] = useState('');

    const handleViewDetails = (order) => {
		const productEncryption = encryptWithKey(order?._id,ORDER_ENCRYPTION_SECREAT_KEY);
        navigation(`/order/details/${productEncryption}`);
    };
    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch, filter, sort]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
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
            }
        }

        if (sort && orders) {
            if (sort === 'latest') {
                orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sort === 'oldest') {
                orders = orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
        }
		if(statusFilter && orders){
			if(statusFilter === '') return orders;
			orders = orders.filter((order) => order?.status === statusFilter);
		}

        return orders;
    };

    const ordersToDisplay = filteredOrders();

    return (
        <div className="space-y-6 w-full flex flex-col items-center sm:px-6 md:px-8">
            <h2 className="font-semibold text-2xl text-gray-800 mb-6">Orders & Returns</h2>

            {/* Filter and Sort Dropdowns */}
            <div className="flex sm:flex-row flex-col justify-center items-center md:justify-between gap-3 w-full mb-6">
                <div className="flex w-full space-x-2 items-center px-2">
                    <FaFilter className="mr-2 text-gray-600" /> {/* Filter Icon */}
                    <select
                        value={filter}
                        onChange={handleFilterChange}
                        className="border w-full p-2 rounded-md"
                    >
                        <option value="">Filter by Date</option>
                        <option value="thisMonth">This Month</option>
                        <option value="last7Days">Last 7 Days</option>
                        <option value="yesterday">Yesterday</option>
                    </select>
                </div>
                <div className="flex w-full space-x-2 items-center px-2">
                    <FaFilter className="mr-2 text-gray-600" /> {/* Filter Icon */}
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="border w-full p-2 rounded-md"
                    >
						<option value="">Filter by Status</option>
						{orderStatus.map((status, index) => (
							<option key={index} value={status.id}>{status.label}</option>
						))}
                    </select>
                </div>

                <div className="w-full flex items-center space-x-2 px-2">
                    <FaSortAmountDown className="mr-2 text-gray-600" /> {/* Sort Icon */}
                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="border w-full p-2 rounded-md"
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
                <div className='w-full space-y-2'>
                    {ordersToDisplay && ordersToDisplay.length > 0 ? (
                        <>
                            {ordersToDisplay.map((order, index) => (
                                <OrderCard
                                    key={index}
                                    order={order}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </>
                    ) : (
                        <p className="text-gray-500">No orders yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const OrderCardSkeleton = () => {
	return (
		<div className="w-full justify-between p-2 bg-white shadow-lg space-y-2 rounded-lg mt-6 animate-pulse">
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
