import React, { Fragment, useRef, useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useDispatch } from 'react-redux'
import { adminCreateOrderReturns, adminCreateRefundRequest, adminGetAllOrders, adminRequestTryCreateManifest, adminRequestTryPickUp, adminSendOrderCancel, adminUpdateUsersOrdersById,adminGetUsersOrdersById } from '@/store/admin/order-slice'
import { capitalizeFirstLetterOfEachWord, getStatusDescription } from '@/config'
import { useSettingsContext } from '@/Context/SettingsContext'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, Map } from 'lucide-react'

const initialFormData = {
  status: '',
}

const OrderDetail = ({ label, value,url = '',downloadEnable = false }) => (
	<div className="flex mt-2 items-center justify-between">
		<p className="font-medium">{label}</p>
		<Label className = {"text-base text-left text-gray-500"}>{!value ? "-":value}</Label>
		{url && <a href={url} download={downloadEnable} target="_blank" className="text-blue-500">Download {value}</a>}
	</div>
)

const OrderItemList = ({ items }) => (
	<div className="space-y-4 w-full p-2">
			{items?.map((item, index) => (
				<div key={index} className="border p-4 rounded-lg shadow-md bg-white">
					<div className="flex flex-col gap-2">
						<div className="flex justify-between">
							<Label className="font-semibold">Title:</Label>
							<span className="text-sm text-gray-600">{item?.productId?.title}</span>
						</div>
						<div className="flex justify-between">
							<Label className="font-semibold">Size:</Label>
							<span className="text-sm text-gray-600">{item?.size}</span>
						</div>
						<div className="flex justify-between">
							<Label className="font-semibold">Color:</Label>
							<span className="text-sm text-gray-600">{item?.color?.name}</span>
						</div>
						<div className="flex justify-between">
							<Label className="font-semibold">SKU:</Label>
							<span className="text-sm text-gray-600">{item?.color?.sku}</span>
						</div>
						<div className="flex justify-between">
							<Label className="font-semibold">Quantity:</Label>
							<span className="text-sm text-gray-600">{item?.quantity}</span>
						</div>
						<div className="flex justify-between">
							<Label className="font-semibold">HSN:</Label>
							<span className="text-sm text-gray-600">{item?.productId?.hsn}</span>
						</div>
						<div className="flex justify-between">
							<Label className="font-semibold">Price:</Label>
							<span className="text-sm text-gray-600">₹ {item?.productId?.salePrice || item?.productId?.price}</span>
						</div>
					</div>
				</div>
			))}
	</div>
);

const ShippingInfo = ({ address }) => (
	<ul className="grid gap-0.5">
		{address && Object.keys(address).map((key, index) => (
			<div key={index}
				className='flex flex-row items-start gap-3'
			>
				<h1
					className='text-gray-700 font-extrabold underline'
				>{capitalizeFirstLetterOfEachWord(key)}: </h1> : <span>{address[key] || '-'}</span>
			</div>
		))}
	</ul>
)
const ReturningDataInfo = ({ ReturningData }) => (
	<ul className="grid gap-0.5">
		{ReturningData && Object.keys(ReturningData).map((key, index) => (
			<div key={index}
				className='flex flex-row items-start gap-3'
			>
				<h1
					className='text-gray-700 text-lg font-bold underline'
				>{capitalizeFirstLetterOfEachWord(key)}: </h1> : <span>{ReturningData[key] || '-'}</span>
			</div>
		))}
	</ul>
)

const AdminOrdersDetailsView = ({ order }) => {
	console.log("Details order: ",order);
	const{checkAndCreateToast} = useSettingsContext();
	const [formData, setFormData] = useState(initialFormData)
	const dispatch = useDispatch()

	const handleSubmitStatus = async (e) => {
		e.preventDefault()
		const { status } = formData
		const data = await dispatch(adminUpdateUsersOrdersById({ orderId: order?._id, status }))
		if (data?.payload?.Success) {
			checkAndCreateToast("success",'Order Status Updated Successfully: ' + data?.payload?.message)
			setFormData(initialFormData)
			dispatch(adminGetAllOrders())
		}
	}
	const handleInitiateRefund = async(e) =>{
		e.preventDefault();
		const response = await dispatch(adminCreateRefundRequest({ orderId: order._id }))
		if(response){
			checkAndCreateToast("success","Refund Request Initiated Successfully")
            dispatch(adminGetAllOrders())
		}else{
			checkAndCreateToast('error',"Failed to initiate refund request")
		}
		handleFetchOrderDetails(order?._id)
	}
	const handlePickupResponse = async () => {
		const response = await dispatch(adminRequestTryPickUp({
			orderId:order._id,
			BestCourior:order?.BestCourior,
			ShipmentCreatedResponseData:order?.ShipmentCreatedResponseData
		}))
		if(response.payload?.error){
			checkAndCreateToast("error",response.payload?.error)
		}else{
			checkAndCreateToast('error',"Successfully created response:");
		}
		handleFetchOrderDetails(order?._id)
	}
	const createCancelOrder = async(e)=>{
		e.preventDefault();
		if(!order?.IsCancelled){
			const response = await dispatch(adminSendOrderCancel({ orderId: order?._id }));
			if(response){
				if (order?.IsCancelled) {
					checkAndCreateToast("success", 'Order Cancelled Successfully');
				} else {
					checkAndCreateToast("success", 'Order Refunded Successfully');
				}
			}else{
				checkAndCreateToast('error','Failed to Cancel Order')
			}
		}
		handleFetchOrderDetails(order?._id)
	}
	const handleCreateManifest = async()=>{
		const response = await dispatch(adminRequestTryCreateManifest({ orderId: order._id }))
        if(response.payload?.error){
            checkAndCreateToast("error",response.payload?.error)
        }else{
            checkAndCreateToast('success',"Successfully created manifest:");
        }
		handleFetchOrderDetails(order?._id)
	}
	const createOrderReturnFromUser = async()=>{
		const response = await dispatch(adminCreateOrderReturns({ orderId: order?._id, userId: order?.userId}));
        if(response){
            if (order?.IsReturning) {
                checkAndCreateToast("success", 'Order Cancelled Successfully');
            } else {
                checkAndCreateToast("success", 'Order Refunded Successfully');
            }
        }else{
            checkAndCreateToast('error','Failed to Cancel Order')
        }
		handleFetchOrderDetails(order?._id)
	}
	const handleFetchOrderDetails = async (orderId)=>{
		await dispatch(adminGetUsersOrdersById(orderId));
	};

	return (
		<DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-auto">
			<DialogTitle className = {"font-bold "}>Order Details</DialogTitle>
			<Separator />
			<div className="grid grid-cols-1 gap-6">
				{/* Order Information */}
				<div className="grid gap-2">
					{
						order?.trackingUrl && <a href={order?.trackingUrl}
							target='_blank' 
							className='text-blue-600 underline font-thin text-lg flex flex-1 gap-2'
						>Track The Shipment <Map/></a>
					}
					<OrderDetail label="Order Database Id" value={order?._id} />
					<OrderDetail label="Order Id" value={order?.order_id} />
					<OrderDetail label="Order Date & Time" value={new Date(order?.createdAt).toLocaleString()} />
					<OrderDetail label="Channel Id" value={order?.channel_id} />
					<OrderDetail label="Convenience Fees" value={order?.ConveenianceFees} />
					<OrderDetail label="Shipment Id" value={order?.shipment_id} />
					<OrderDetail label="Razorpay order Id" value={order?.razorpay_order_id} />
					<OrderDetail label="Razorpay Payment Id" value={order?.paymentId} />
					
					{/* Order Status */}
					<OrderDetail
						label="Order Status"
						value={
							<Badge className="justify-center items-center py-1 px-3 text-white bg-red-500">
								{order?.status || "-"}
							</Badge>
						}
					/>
					
					{/* Order Current Status */}
					<OrderDetail
						label="Order Current Status"
						value={
							<Badge className="justify-center items-center py-1 px-3 text-white bg-yellow-500">
							{order?.current_status || "-"}
							</Badge>
						}
					/>
					
					{/* Estimated Delivery Date (ETD) */}
					<OrderDetail
						label="ETD (Estimated Delivery Date)"
						value={
							<Badge className="justify-center items-center py-1 px-3 text-white bg-blue-500">
							{new Date(order?.etd).toDateString() || "-"}
							</Badge>
						}
					/>
					
					{/* Order Payment Mode */}
					<OrderDetail
						label="Order Payment Mode"
						value={
							<Badge className="justify-center items-center py-1 px-3 text-white bg-green-500">
								{order?.paymentMode}
							</Badge>
						}
					/>
					
					{/* Order Shipment Status */}
					<OrderDetail
						label="Order Shipment Status"
						value={
							<Badge className="justify-center items-center py-1 px-3 text-white">
								{getStatusDescription(order?.shipment_status)}
							</Badge>
						}
					/>
					
					<OrderDetail label="Order Amount" value={`₹ ${order?.TotalAmount}`} />
				</div>

				<Separator />

				{/* Manifest Data */}
				<OrderDetail label="Manifest Data" value="Manifest Details" url={order?.manifest?.invoice_url} downloadEnable />

				<Separator />

				{/* Order Items */}
				<div className="flex flex-col justify-center items-center space-y-2 font-extrabold w-full uppercase underline">
					<h1>Order Details</h1>
					<OrderItemList items={order?.orderItems} />
				</div>

				<Separator />

				{/* Shipping Information */}
				<div className="grid grid-cols-2 gap-4">
					<div className="font-medium">Shipping Info</div>
					<ShippingInfo address={order?.address} />
				</div>

				<Separator />

				{/* Pickup Data (Optional) */}
				{order?.PicketUpData && <PicketUpDataDisplay picketUpData={order?.PicketUpData} />}

				<Separator />
				{
					order?.ReturningData && <div className="grid grid-cols-2 gap-4">
						<div className="font-medium">Return Info</div>
						<ReturningDataInfo ReturningData={order?.ReturningData} />
					</div>
				}
				{order?.tracking_Activity && order?.tracking_Activity.length > 0 && <Fragment>
					<Separator />
					<div className='w-full flex'>
						<DeliveryTrackingActivity TrackingActivity={order?.tracking_Activity}/>
					</div>
				</Fragment>}
				
				
				{/* Action Buttons */}
				<div className="flex flex-wrap gap-3 h-fit justify-center items-center">
					<Button
						disabled={order?.PicketUpData && order?.status === 'Delivered'}
						className="text-white px-4 py-2 rounded-md"
						onClick={handlePickupResponse}
					>
						{
							order?.PicketUpData ? "Delivery PicketUp Response Sent" : "Send Pickup Response"
						}
					</Button>

					<Button
						disabled={order?.manifest}
						className="text-white px-4 py-2 rounded-md"
						onClick={handleCreateManifest}
					>
						{
							order?.manifest? "Manifest Already Generated" : "Create Manifest"
						}
					</Button>

					<Button
						// disabled={order?.IsReturning}
						className="text-white px-4 py-2 rounded-md"
						onClick={createOrderReturnFromUser}
					>
						{
							order?.IsReturning ? "Order Returned Already Generated" : "Try Return Order"
						}
					</Button>

					<Button
						disabled={order?.IsCancelled}
						className="text-white px-4 py-2 rounded-md"
						onClick={createCancelOrder}
					>
						{
							order?.IsCancelled? "Order Canceled" : "Cancel Order"
						}
					</Button>
					{
						order?.paymentMode === 'prepaid' && <Button
							disabled={order?.IsCancelled && order?.RefundData}
							className="text-white px-4 py-2 rounded-md"
							onClick={handleInitiateRefund}
						>
							{!order?.IsCancelled && order?.paymentMode === 'prepaid' && !order?.RefundData ? "Initiate Refund":"Refund Already Initiated"}
						</Button>
					}
					
				</div>
			</div>

		</DialogContent>
	)
}
const PicketUpDataDisplay = ({ picketUpData }) => {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="font-medium">Pickup Information</div>
			<div className="space-y-2">
				<div><strong>AWB Code:</strong> {picketUpData?.awbCode}</div>
				<div><strong>Pickup Status:</strong> {picketUpData?.picketUpResponseData?.data}</div>
				<div><strong>Pickup Scheduled Date:</strong> {new Date(picketUpData.picketUpResponseData.pickup_scheduled_date).toLocaleString()}</div>
				<div><strong>Pickup Generated Date:</strong> {new Date(picketUpData?.picketUpResponseData?.pickup_generated_date?.date).toLocaleString()}</div>
				<div><strong>Pickup Token Number:</strong> {picketUpData?.picketUpResponseData?.pickup_token_number}</div>
			</div>
		</div>
	);
};
const DeliveryTrackingActivity = ({ TrackingActivity }) => {
	const sliderRef = useRef(null);
	
	const [dragState, setDragState] = useState({
		isDragging: false,
		startX: 0,
		startTouchX: 0,
		scrollLeft: 0,
	});
	
	
	// Mouse Down, Mouse Move, Mouse Up Handlers
	const handleMouseDown = (e) => {
		setDragState((prev) => ({
			...prev,
			isDragging: true,
			startX: e.clientX,
			scrollLeft: sliderRef.current.scrollLeft,
		}));
		e.preventDefault();
	};
	
	const handleMouseMove = (e) => {
		if (!dragState.isDragging) return;
		const moveX = e.clientX - dragState.startX;
		sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
	};
	
	const handleMouseUp = () => setDragState((prev) => ({ ...prev, isDragging: false }));
	const handleMouseLeave = () => setDragState((prev) => ({ ...prev, isDragging: false }));
	
	// Touch Start, Touch Move, Touch End Handlers
	const handleTouchStart = (e) => {
		setDragState((prev) => ({
			...prev,
			isDragging: true,
			startTouchX: e.touches[0].clientX,
			scrollLeft: sliderRef.current.scrollLeft,
		}));
	};
	
	const handleTouchMove = (e) => {
		if (!dragState.isDragging) return;
		const moveX = e.touches[0].clientX - dragState.startTouchX;
		sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
	};
	
	const handleTouchEnd = () => setDragState((prev) => ({ ...prev, isDragging: false }));
	
	// Scroll functionality for left and right arrows
	const scroll = (direction) => {
		const slider = sliderRef.current;
		const scrollAmount = 400; // Amount to scroll with each button click
		slider.scrollTo({
			left: slider.scrollLeft + direction * scrollAmount,
			behavior: 'smooth', // This makes the scroll smooth
		});
	};

	return (
		<div className="mt-2 mb-7 w-full pb-6 pt-4 px-4">
			<div className="w-full justify-center items-center flex px-1 py-2">
				<h1 className="flex text-center mt-4 uppercase font-bold">Delivery Tracking</h1>
			</div>

			<div className="relative">
				<button
					onClick={() => scroll(-1)}
					className="absolute left-3 top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-500 hover:scale-105 opacity-90 hover:opacity-100 p-2 rounded-full z-10 py-3"
				>
					<ChevronLeft/>
				</button>

				<div
					ref={sliderRef}
					className="justify-center items-start overflow-x-auto"
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseLeave}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab',userSelect: 'none'  }}
				>
					<ul className="flex gap-4 py-2 sm:gap-2 md:gap-8 lg:gap-6">
						{TrackingActivity.map((detail, index) => (
							<li key={index} className="flex-shrink-0 w-[200px] md:w-max lg:w-max">
								<TrackingDetailsSingle details={detail}/>
							</li>
						))}
					</ul>
				</div>

				<button
					onClick={() => scroll(1)}
					className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white hover:text-purple-500 hover:scale-105 opacity-90 hover:opacity-100 p-2 rounded-full py-3 z-10"
				>
					<ChevronRight/>
				</button>
			</div>
		</div>
	);
}
const TrackingDetailsSingle = ({details})=>{
	return(
		<div className="flex h-full flex-col bg-gray-500 text-white shadow-lg rounded-lg p-2 border border-gray-900 gap-3 items-center justify-center">
			<div className='w-full flex justify-between items-center'>
				<Label>Activity</Label>
				<Badge className="text-xs font-semibold">{details?.activity}</Badge>
			</div>
			<div className='w-full flex justify-between items-center'>
				<Label>Date</Label>
				<Badge className="text-xs font-semibold">{details?.date ? new Date(details?.date).toLocaleString() : "N/A"}</Badge>
			</div>
			<div className='w-full flex justify-between items-center'>
				<Label>Coords Checked At</Label>
				<div className='space-y-2'>
					<Badge className="text-xs font-semibold">{details?.latitude}</Badge>
					<Badge className="text-xs font-semibold">{details?.longitude}</Badge>
				</div>
			</div>
			<div className='w-full flex justify-between items-center'>
				<Label>Location Checked At</Label>
				<Badge className="text-xs font-semibold">{details?.location}</Badge>
			</div>
			<div className='w-full flex justify-between items-center'>
				<Label>SR- Status</Label>
				<Badge className="text-xs font-semibold">{getStatusDescription(details['sr-status'])}</Badge>
			</div>
			<div className='w-full flex justify-between items-center'>
				<Label>SR - Status Label</Label>
				<Badge className="text-xs font-semibold">{details['sr-sr-status-label']}</Badge>
			</div>
			<div className='w-full flex justify-between items-center'>
				<Label>Status</Label>
				<Badge className="text-xs font-semibold">{Number.isInteger(Number(details?.status)) ? getStatusDescription(details?.status) : (details?.status)}</Badge>
			</div>
		</div>
	)
}

export default AdminOrdersDetailsView
