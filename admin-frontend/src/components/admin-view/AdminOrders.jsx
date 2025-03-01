import React, { useEffect, useState, useMemo, useCallback, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '../ui/dialog';
import AdminOrdersDetailsView from './AdminOrdersDetailsView';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetAllOrders, adminGetUsersOrdersById, resetOrderDetails } from '@/store/admin/order-slice';
import { Badge } from '../ui/badge';
import { Copy, TruckIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import newStyled from '@emotion/styled';
import { Slider } from '@mui/material';
import LogisticsLoginView from './LogisticsLoginView';
import LoadingView from '@/pages/admin-view/LoadingView';
import { getStatusDescription } from '@/config';

const orderStatus = [
  { id: 'Confirmed', label: 'Confirmed' },
  { id: 'Processing', label: 'Processing' },
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

const CustomSlider = newStyled(Slider)({
  '& .MuiSlider-thumb': {
    backgroundColor: '#333333',
    border: '2px solid #212121',
    '&:hover': {
      backgroundColor: '#555555',
    },
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#E0E0E0',
  },
  '& .MuiSlider-track': {
    backgroundColor: '#212121',
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#212121',
    color: 'white',
  },
});

const AdminOrderLayout = () => {
	const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
	const [openLoginDialogue, setOpenLoginDialogue] = useState(false);
	const [logisticsToken, setLogisticsToken] = useState('');
	const [filters, setFilters] = useState({
		sortOrder: 'latest', // 'latest' or 'oldest'
		statusFilter: '',
		minOrders: 0,
		maxOrders: 10,
	});

	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const {isLoading, orderList, orderDetails } = useSelector((state) => state.adminOrder);

	useEffect(() => {
		dispatch(adminGetAllOrders());
	}, [dispatch]);

	const handleFetchOrderDetails = async (orderId)=>{
		await dispatch(adminGetUsersOrdersById(orderId));
	};

	useEffect(() => {
		if (orderDetails) {
			setOpenDetailsDialogue(true);
		}
	}, [orderDetails]);

	const handleLoginComplete = (data) => {
		setLogisticsToken(data);
	};

	// Sorting and filtering orders
	const sortedOrderList = useMemo(() => {
		return [...orderList].sort((a, b) => {
		const dateA = new Date(a?.createdAt);
		const dateB = new Date(b?.createdAt);
		return filters.sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
		});
	}, [orderList, filters.sortOrder]);

	const filteredOrderList = useMemo(() => {
		return sortedOrderList.filter((order) => {
		if (filters.statusFilter === '') return true;
			return order?.status === filters.statusFilter;
		});
	}, [sortedOrderList, filters.statusFilter]);

	const displayedOrders = useMemo(() => {
		return filteredOrderList.slice(filters.minOrders, filters.maxOrders);
	}, [filteredOrderList, filters.minOrders, filters.maxOrders]);

	const isNoOrders = displayedOrders.length === 0;

	return (
		<Card className="w-full">
			{isLoading  ? <LoadingView/> :(
				<Fragment>
					<CardHeader className="text-center p-4 relative">
						<CardTitle className="text-2xl font-semibold mb-4">All Orders</CardTitle>
						<div className="absolute right-3 top-4 space-x-4 flex flex-col lg:flex-row lg:space-x-4 lg:space-y-0 space-y-2">
							<Button
								onClick={() => setOpenLoginDialogue(true)}
								variant="outline"
								className="flex items-center justify-center space-x-2 py-4 px-2 bg-black border border-gray-300 rounded-md text-white"
							>
								<TruckIcon /><span className='md:block hidden'>Get ShipRocket API Token</span>
							</Button>
							{logisticsToken && (
								<Button
									onClick={() => {
										navigator.clipboard.writeText(logisticsToken);
										toast.success('Logistics Token copied to clipboard!');
									}}
									variant="outline"
									className="flex items-center justify-center space-x-2 py-4 px-2 bg-black border border-gray-300 rounded-md text-white"
								>
									<Copy />
									<span>{logisticsToken.slice(0, 20)}....</span>
								</Button>
							)}
						</div>
					</CardHeader>


					<CardContent>
						<OrderFilter filters={filters} setFilters={setFilters} orderStatus={orderStatus} filteredOrderList={filteredOrderList} />

						{/* No Orders Banner */}
						{isNoOrders && (
							<div className="text-center p-4 mb-4 border border-gray-200 rounded-lg shadow-sm bg-gray-100">
							<span className="text-lg font-semibold text-gray-800">No Orders Available</span>
							</div>
						)}

						{/* Table for larger screens */}
						<div className="hidden sm:block">
							{!isNoOrders && <OrderTable orders={displayedOrders} handleFetchOrderDetails={handleFetchOrderDetails} />}
							{!isNoOrders && <OrderTableRow orders={displayedOrders} handleFetchOrderDetails={handleFetchOrderDetails} />}
						</div>

						{/* Orders List for smaller screens */}
						<div className="sm:hidden">
							{displayedOrders.map((order) => (
							<div key={order?._id} className="p-4 mb-4 text-center border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
								<div className="flex flex-col space-y-3">
								<div className="flex justify-between">
									<span className="font-semibold text-sm">Order Id:</span>
									<span className="text-sm">{order?._id}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold text-sm">Order Date:</span>
									<span className="text-sm">{new Date(order?.createdAt).toLocaleString()}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold text-sm">Order Status:</span>
									<span className="text-sm">
									<Badge className={`py-1 px-3 text-white`}>{order?.status}</Badge>
									</span>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold text-sm">Order Shipment Status:</span>
									<span className="text-sm">
									<Badge className={`py-1 px-3 text-white`}>{getStatusDescription(order?.shipment_status)}</Badge>
									</span>
								</div>
								<div className="flex justify-between">
									<span className="font-semibold text-sm">Order Total Amount:</span>
									<span className="text-sm">₹ {order?.TotalAmount}</span>
								</div>
								<Button
									onClick={() => handleFetchOrderDetails(order?._id)}
									className="btn btn-primary mt-2 w-full text-sm"
								>
									View Details
								</Button>
								</div>
							</div>
							))}
						</div>
						</CardContent>


					{/* Dialog for order details */}
					<Dialog open={openDetailsDialogue} onOpenChange={() => { setOpenDetailsDialogue(false); dispatch(resetOrderDetails()); }}>
						{orderDetails && (
							<AdminOrdersDetailsView order={orderDetails} user={user} />
						)}
					</Dialog>

					{/* Dialog for login */}
					<Dialog open={openLoginDialogue} onOpenChange={() => { setOpenLoginDialogue(false); }}>
						<LogisticsLoginView OnLoginComplete={handleLoginComplete} />
					</Dialog>
				</Fragment>
			)}
		</Card>
	);
};

const OrderFilter = ({ filters, setFilters, orderStatus,filteredOrderList }) => (
	<div className="mb-4 text-center space-x-4 flex flex-col sm:flex-row justify-center sm:justify-between px-3 items-center">
		<Button
			variant="outline"
			onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'latest' ? 'oldest' : 'latest' })}
		>
			Sort by {filters.sortOrder === 'latest' ? 'Oldest' : 'Latest'}
		</Button>

		<select
			className="border border-gray-300 px-4 py-2 rounded-md"
			value={filters.statusFilter}
			onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
		>
		<option value="">Filter Status (All)</option>
			{orderStatus.map((status,index) => (
				<option key={`${index}-${status.id}`} value={status.id}>{status.label}</option>
			))}
		</select>
		{/* Slider for displaying number of orders */}
		<div className="mb-4 text-center space-x-4 w-full sm:w-1/6 sm:justify-self-start">
			<label className="sm:text-lg sm:font-medium">Total Orders</label>
			<CustomSlider
				value={[filters.minOrders, filters.maxOrders]}
				onChange={(e, newValue) => {
					setFilters({ ...filters, minOrders: newValue[0], maxOrders: newValue[1] });
				}}
				valueLabelDisplay="auto"
				aria-labelledby="range-slider"
				min={0}
				max={filteredOrderList.length}
			/>
		</div>
	</div>
);

const OrderTable = ({ orders, handleFetchOrderDetails }) => (
	<div className="grid grid-cols-7 gap-2 p-3 bg-gray-100 font-semibold text-sm sm:text-base">
		<div>Order Id</div>
		<div>Order Date</div>
		<div>Payment Method</div>
		<div>Order Status</div>
		<div>Shipment Status Code</div>
		<div>Total Amount</div>
		<div className="text-center">Details</div>
	</div>
);
const OrderTableRow = ({ orders, handleFetchOrderDetails }) => (
	<Fragment>
		{orders.map((order) => (
			<div key={order?._id} className="grid grid-cols-7 gap-2 p-3">
				<div className="text-sm sm:text-base truncate">{order?._id}</div>
				<div className="text-sm sm:text-base">{new Date(order?.createdAt).toLocaleDateString()}</div>
				<div className="text-sm sm:text-base">
					<Badge className={`justify-center items-center py-1 px-3 text-white bg-green-500`}>{order?.paymentMode}</Badge>
				</div>
				<div className="text-sm sm:text-base">
					<Badge className={`justify-center items-center py-1 px-3 text-white`}>{order?.status}</Badge>
				</div>
				<div className="text-sm sm:text-base">
					<Badge className={`justify-center items-center py-1 px-3 text-white bg-red-500`}>{getStatusDescription(order?.shipment_status)}</Badge>
				</div>
				<div className="text-sm sm:text-base">₹ {order?.TotalAmount}</div>
				<div className="text-sm sm:text-base text-center">
					<Button onClick={() => handleFetchOrderDetails(order?._id)} className="btn btn-primary text-xs sm:text-sm">
						View Details
					</Button>
				</div>
			</div>
		))}
	</Fragment>
)

export default AdminOrderLayout;
