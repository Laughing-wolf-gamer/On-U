import React, { useEffect, useState, useMemo, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import AdminOrdersDetailsView from './AdminOrdersDetailsView';
import { useDispatch, useSelector } from 'react-redux';
import { adminFetchAllShiprocketCancleOrder, adminGetAllOrders, admingetShiprocketToken, adminGetUsersOrdersById, resetOrderDetails } from '@/store/admin/order-slice';
import { Badge } from '../ui/badge';
import { Copy, TruckIcon } from 'lucide-react';
import newStyled from '@emotion/styled';
import { Slider } from '@mui/material';
import LogisticsLoginView from './LogisticsLoginView';
import LoadingView from '@/pages/admin-view/LoadingView';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { useSettingsContext } from '@/Context/SettingsContext';
import { Label } from '../ui/label';
import { IoIosReturnLeft } from 'react-icons/io';

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
	const{checkAndCreateToast} = useSettingsContext();
	const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
	const [openReturnOrderDialogue, setOpenReturnOrdersDialogue] = useState(false);
	const [openLoginDialogue, setOpenLoginDialogue] = useState(false);
	const [logisticsToken, setLogisticsToken] = useState(null);
	const [filters, setFilters] = useState({
		sortOrder: 'latest', // 'latest' or 'oldest'
		statusFilter: '',
		minOrders: 0,
		maxOrders: 10,
	});

	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const {isLoading,token, orderList, orderDetails,returnOrderList } = useSelector((state) => state.adminOrder);

	useEffect(() => {
		dispatch(adminGetAllOrders());
		dispatch(admingetShiprocketToken());
		dispatch(adminFetchAllShiprocketCancleOrder())
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
		setOpenLoginDialogue(false);
		dispatch(admingetShiprocketToken());
	};
	useEffect(()=>{
		if(token){
			if(!logisticsToken){
            	setLogisticsToken(token?.token);
			}
        }
	},[token,dispatch])

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
					{/* Header Section */}
						<div className="flex flex-col lg:flex-row items-center justify-between w-full space-y-4 lg:space-y-0">

						{/* Title Section */}
						<CardTitle className="text-3xl font-semibold text-gray-800 mb-4 lg:mb-0">
							All Orders
						</CardTitle>

						{/* Content Section */}
						<div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
							
							{/* Information and Button Section */}
							<div className="flex flex-col items-center lg:items-start space-y-4">
							{
								token?.expiringTime && <Label className="text-sm text-gray-500 text-center lg:text-left">
									The Token will expire On {new Date(token?.expiringTime).toDateString()}.
								</Label>
							}
							

							<Button
								onClick={() => setOpenLoginDialogue(true)}
								className="flex items-center justify-between space-x-3 py-3 px-4 border border-gray-300 rounded-md transition-all w-full lg:w-auto"
							>
								<TruckIcon />
								<span>Get ShipRocket API Token</span>
							</Button>

								{logisticsToken && (
									<Button
										onClick={() => {
											navigator.clipboard.writeText(logisticsToken);
											checkAndCreateToast('success', 'Logistics Token copied to clipboard!');
										}}
										className="flex items-center justify-between space-x-3 py-3 px-4 border border-gray-300 rounded-md transition-all w-full lg:w-auto"
									>
									<Copy />
										<span>Token</span>
									</Button>
								)}
							</div>

						</div>

						<Button
							onClick={() => setOpenReturnOrdersDialogue(!openReturnOrderDialogue)}
							className="mt-6 lg:mt-0 bg-blue-500 text-white hover:bg-blue-600 p-4 rounded-md flex items-center justify-center space-x-2 transition ease-in-out duration-300 w-full lg:w-auto"
						>
							<IoIosReturnLeft className="text-lg" />
							<span>Returning Orders</span>
						</Button>
					</div>
					<CardContent className = {"mt-10"}>
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
										<span className="text-sm">{order?.order_id}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold text-sm">Order Date:</span>
										<span className="text-sm">{new Date(order?.createdAt).toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold text-sm">Order By:</span>
										<div className="text-sm sm:text-base truncate">{order?.address?.Firstname} {order?.address?.Lastname}</div>
									</div>
									<div className="flex justify-between">
										<span className="font-semibold text-sm">Payment Method:</span>
										<span className="text-sm">
											<Badge className={`py-1 px-3 text-white`}>{order?.paymentMode}</Badge>
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
					<Dialog open ={openReturnOrderDialogue} onOpenChange={()=> {setOpenReturnOrdersDialogue(false); dispatch(adminFetchAllShiprocketCancleOrder())}}>
						{returnOrderList && <ReturningOrderDialogWindow orderData={returnOrderList}/> }
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
const ReturningOrderDialogWindow = ({ orderData = [] }) => {
	console.log("Returning Orders: ",orderData)
	return (
		<DialogContent className="max-w-min max-h-[500px] overflow-y-auto">
			<DialogTitle className="font-bold">Returning Orders Info</DialogTitle>
			{/* Make sure orderData is an array and map through it */}
			{orderData && orderData.length > 0 ? (
				<div className="container mx-auto p-4">
				<table className="min-w-full table-auto text-center border-collapse border border-gray-200">
					<thead>
					<tr className="bg-gray-100">
						<th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Order ID</th>
						<th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Customer Name</th>
						<th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Customer Ph.</th>
						<th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Pickup Pincode</th>
						<th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Status</th>
						<th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Total</th>
					</tr>
					</thead>
					<tbody>
						{/* Iterate over orderData array and render each row */}
						{orderData.map((item, index) => (
							<tr key={index} className="border-t border-gray-200">
							<td className="px-4 py-2 text-sm text-gray-600">{item?.channel_order_id}</td>
							<td className="px-4 py-2 text-sm text-gray-600">{item?.pickup_person_name}</td>
							<td className="px-4 py-2 text-sm text-gray-600">{item?.pickup_person_phone}</td>
							<td className="px-4 py-2 text-sm text-gray-600">{item?.pickup_code}</td>
							<td className="px-4 py-2 text-sm text-gray-600"><Badge className={`animate-pulse`}>{item?.status}</Badge></td>
							<td className="px-4 py-2 text-sm text-gray-600">{item?.total}</td>
							</tr>
						))}
					</tbody>
				</table>
				</div>
			) : (
				<p className="text-center text-gray-600">No returning orders available.</p>
			)}
		</DialogContent>
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
	<div className="grid grid-cols-6 gap-2 p-3 bg-gray-100 font-semibold text-sm sm:text-base">
		<div className='text-center'>Order Id</div>
		<div className='text-center'>Order Date</div>
		<div className='text-center'>Order By</div>
		<div className='text-center'>Payment Method</div>
		<div className='text-center'>Total Amount</div>
		<div className="text-center">Details</div>
	</div>
);
const OrderTableRow = ({ orders, handleFetchOrderDetails }) => (
	<Fragment>
		{orders.map((order) => (
			<div key={order?._id} className="grid grid-cols-6 text-center justify-center items-center gap-2 p-3">
				<div className="text-sm sm:text-base">{order?.order_id}</div>
				<div className="text-sm sm:text-base">{new Date(order?.createdAt).toLocaleString()}</div>
				<div className="text-sm sm:text-base">{order?.address?.Firstname || order?.address?.FirstName} {order?.address?.Lastname}</div>
				<div className="text-sm sm:text-base justify-center flex items-center">
					<Badge className={`justify-center items-center py-1 text-center uppercase px-3 text-white bg-green-500`}>{order?.paymentMode}</Badge>
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
const ShippingInfo = ({ address }) => (
	<ul className="grid gap-0.5">
		{address && Object.keys(address).map((key, index) => (
			<span key={index}>
				{capitalizeFirstLetterOfEachWord(key)}: {address[key] || 'No-Data'}
			</span>
		))}
	</ul>
)

export default AdminOrderLayout;
