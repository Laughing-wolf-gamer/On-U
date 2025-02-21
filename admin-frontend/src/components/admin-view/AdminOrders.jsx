import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import AdminOrdersDetailsView from './AdminOrdersDetailsView'
import { useDispatch, useSelector } from 'react-redux'
import { adminGetAllOrders, adminGetUsersOrdersById, loginLogistics, resetOrderDetails } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'
import { BASE_URL, GetBadgeColor, Header } from '@/config'
import { Copy, TruckIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import { Input } from '../ui/input'
import axios from 'axios'

const AdminOrderLayout = () => {
    const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);
	const[openLoginDialogue, setOpenLoginDialogue] = useState(false);
	const [logisticsTokken, setLogisticsToken] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');  // 'latest' or 'oldest'
    const [statusFilter, setStatusFilter] = useState('');  // To filter orders by status
    const [minOrders, setMinOrders] = useState(0);  // Minimum number of orders to show
    const [maxOrders, setMaxOrders] = useState(10); // Maximum number of orders to show

    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { orderList, orderDetails } = useSelector(state => state.adminOrder)

    useEffect(() => {
        dispatch(adminGetAllOrders())
    }, [dispatch])

    const handleFetchOrderDetails = async (orderId) => {
        await dispatch(adminGetUsersOrdersById(orderId))
    }

    useEffect(() => {
        if (orderDetails) {
            setOpenDetailsDialogue(true);
        }
    }, [orderDetails])
	const OnLoginComplete = (data)=>{
		setLogisticsToken(data);
	}

    // Sort orders based on the selected sortOrder
    const sortedOrderList = [...orderList].sort((a, b) => {
        const dateA = new Date(a?.createdAt);
        const dateB = new Date(b?.createdAt);
        if (sortOrder === 'latest') {
            return dateB - dateA;  // Newest first
        } else {
            return dateA - dateB;  // Oldest first
        }
    });

    // Filter orders by status
    const filteredOrderList = sortedOrderList.filter(order => {
        if (statusFilter === '') return true; // No filter selected, show all orders
        return order?.status === statusFilter;
    });

    // Apply min-max filtering for the number of orders to show
    const displayedOrders = filteredOrderList.slice(minOrders, maxOrders);

    // Check if there are no orders available
    const isNoOrders = !displayedOrders || displayedOrders.length === 0;

    return (
        <Card className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-full mx-auto">
            <CardHeader className="text-center p-4 relative">
				<CardTitle className="text-2xl font-semibold mb-4">All Orders</CardTitle>
				<div className='absolute right-3 space-x-4 flex flex-row justify-between'>
					<Button
						onClick={() => setOpenLoginDialogue(true)}
						variant="outline"
						className="flex items-center  justify-center space-x-2 py-4 px-2 bg-black border border-gray-300 rounded-md text-white"
					>
						<TruckIcon />
						<span>Login to view logistics</span>
					</Button>
					{
						logisticsTokken && <Button
							onClick={() => {
								navigator.clipboard.writeText(logisticsTokken);
								toast.success("Logistics Tokken copied to clipboard!");
							}}
							variant="outline"
							className="flex items-center justify-center space-x-2 py-4 px-2 bg-black border border-gray-300 rounded-md text-white"
						>
							<Copy />
							<span>{logisticsTokken.slice(0,50)}....</span>
						</Button>
					}
					
				</div>
			</CardHeader>

            <CardContent>
                {/* Sorting and Filter Dropdown */}
                <div className="mb-4 text-center space-x-4">
                    {/* Sort By Dropdown */}
                    <Button
                        variant="outline"
                        onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                    >
                        Sort by {sortOrder === 'latest' ? 'Oldest' : 'Latest'}
                    </Button>

                    {/* Filter By Status Dropdown */}
                    <select 
                        className="border border-gray-300 px-4 py-2 rounded-md"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Filter Status (All)</option>
                        <option value="Processing">Processing</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Order Shipped">Order Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        {/* Add more options based on available statuses */}
                    </select>
                </div>

                {/* Slider to select number of orders to show */}
                <div className="mb-4 text-center space-x-4">
                    <label className="text-lg font-medium">Min-Max Orders</label>
                    <div className="flex justify-center items-center space-x-4">
                        <input 
                            type="range" 
                            min="0" 
                            max={filteredOrderList.length} 
                            value={minOrders} 
                            onChange={(e) => setMinOrders(parseInt(e.target.value))}
                            className="slider"
                        />
                        <span>{minOrders} to {maxOrders}</span>
                        <input 
                            type="range" 
                            min={minOrders} 
                            max={filteredOrderList.length} 
                            value={maxOrders} 
                            onChange={(e) => setMaxOrders(parseInt(e.target.value))}
                            className="slider"
                        />
                    </div>
                </div>

                {/* No Orders Banner */}
                {isNoOrders && (
                    <div className="text-center p-4 mb-4 border border-gray-200 rounded-lg shadow-sm bg-gray-100">
                        <span className="text-lg font-semibold text-gray-800">No Orders Available</span>
                    </div>
                )}

                {/* Non-table layout for larger screens */}
                {!isNoOrders && (
                    <div className="hidden sm:block">
                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 font-semibold text-sm sm:text-base">
                            <div>Order Id</div>
                            <div>Order Date</div>
                            <div>Order Status</div>
                            <div>Order Price</div>
                            <div className="text-center">Details</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {
                                displayedOrders && displayedOrders.length > 0 && displayedOrders.map((order) => (
                                    <div key={order?._id} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-100">
                                        <div className="text-sm sm:text-base">{order?._id}</div>
                                        <div className="text-sm sm:text-base">{new Date(order?.createdAt).toLocaleString()}</div>
                                        <div className="text-sm sm:text-base">
                                            <Badge className={`justify-center items-center py-1 px-3 hover:bg-transparent hover:shadow-md ${GetBadgeColor(order?.status)}`}>{order?.status}</Badge>
                                        </div>
                                        <div className="text-sm sm:text-base">₹ {order?.TotalAmount}</div>
                                        <div className="text-sm sm:text-base text-center">
                                            <Button onClick={() => handleFetchOrderDetails(order?._id)} className="btn btn-primary text-xs sm:text-sm">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* Mobile-optimized layout */}
                <div className="sm:hidden">
                    {
                        displayedOrders.map((order) => (
                            <div key={order?._id} className="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
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
                                            <Badge className={`py-1 px-3 ${GetBadgeColor(order?.status)}`}>{order?.status}</Badge>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">Order Price:</span>
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
                        ))
                    }
                </div>
            </CardContent>

            {/* Dialog for order details */}
            <Dialog open={openDetailsDialogue} onOpenChange={() => {
                setOpenDetailsDialogue(false);
                dispatch(resetOrderDetails());
            }}>
                <AdminOrdersDetailsView order={orderDetails} user={user} />
            </Dialog>
			<Dialog open={openLoginDialogue} onOpenChange={() => {
				setOpenLoginDialogue(false);
			}}>
				<LogisticsLoginView OnLoginComplete={OnLoginComplete} />
			</Dialog>
        </Card>
    )
}
const LogisticsLoginView = ({OnLoginComplete})=>{
	const[logisticsLoginForm,setLogisticsLoginForm] = useState({email: '', password: ''});
	const handleLogisticsTokenChange = async(e) => {
		e.preventDefault();
		try {
			// const response = await axios.post(`${BASE_URL}/api/logistic/login`,logisticsLoginForm,Header())
			const response = await axios.post(`${BASE_URL}/api/logistic/login`,logisticsLoginForm,Header())
			if(response){
				console.log("Logistics Login Response: ", response?.data?.result);
				OnLoginComplete(response?.data?.result);
				toast.success("Logged In Success" );
			}else{
				toast.error("Invalid Email or Password");
			}
		} catch (error) {
			console.error ("Error logging in logistics: ", error);
			toast.error("Error logging in logistics");
		}
	}
	return(
        <DialogContent className="sm:max-w-[600px] h-fit p-8 bg-white rounded-lg shadow-lg">
			<DialogTitle className="text-2xl font-semibold mb-6 text-gray-800 text-center">Generate Shiprockt Logistics API Token</DialogTitle>
			<p className="text-gray-700 text-lg">Note: After Every 10 days Please enter your email and password to Re-login Shiprocket logistics user.</p>
			<form onSubmit={handleLogisticsTokenChange} className="flex flex-col space-y-4">
				<Input
					value={logisticsLoginForm?.email}
					onChange={(e)=> setLogisticsLoginForm({...logisticsLoginForm, email: e.target.value})}
					type="email"
					placeholder="Email"
					required
					className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Input
					value={loginLogistics?.password}
					onChange={(e)=> setLogisticsLoginForm({...logisticsLoginForm, password: e.target.value})}
					type="password"
					placeholder="Password"
					required
					className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<Button
					type="submit"
					className="py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-200 ease-in-out"
				>
					Login
				</Button>
			</form>
		</DialogContent>

    )
}

export default AdminOrderLayout;
