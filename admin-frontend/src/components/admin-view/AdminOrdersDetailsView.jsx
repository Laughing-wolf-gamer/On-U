import React, { useEffect, useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useDispatch } from 'react-redux'
import { adminGetAllOrders, adminGetUsersOrdersById, adminRequestTryCreateManifest, adminRequestTryPickUp, adminUpdateUsersOrdersById } from '@/store/admin/order-slice'
import { capitalizeFirstLetterOfEachWord, GetBadgeColor, getStatusDescription } from '@/config'
import { toast } from 'react-toastify'
import { useSettingsContext } from '@/Context/SettingsContext'
import { Button } from '../ui/button'

const initialFormData = {
  status: '',
}

const OrderDetail = ({ label, value,url = '',downloadEnable = false }) => (
	<div className="flex mt-2 items-center justify-between">
		<p className="font-medium">{label}</p>
		<Label className = {"text-base text-gray-500"}>{value}</Label>
		{url && <a href={url} download={downloadEnable} target="_blank" className="text-blue-500">Download {value}</a>}
	</div>
)

const OrderItemList = ({ items }) => (
	<ul className="flex flex-row justify-between items-center gap-3">
		{items?.map((item, index) => (
			<li key={index} className="flex items-center justify-between">
				<span>{item?.title}</span>
				<span>Quantity: {item?.quantity}</span>
				<span>Price: ₹{item?.productId?.salePrice || item?.productId?.price}</span>
			</li>
		))}
	</ul>
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

const AdminOrdersDetailsView = ({ order }) => {
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
	const handlePickupResponse = async () => {
		const response = await dispatch(adminRequestTryPickUp({
			BestCourior:order?.BestCourior,
			ShipmentCreatedResponseData:order?.ShipmentCreatedResponseData
		}))
		if(response.payload?.error){
			console.log("Pickup response: ", response);
			checkAndCreateToast("error",response.payload?.error)
		}else{
			checkAndCreateToast('error',"Successfully created response:");
		}
	}
	const handleCreateManifest = async()=>{
		const response = await dispatch(adminRequestTryCreateManifest({ orderId: order._id }))
        if(response.payload?.error){
            console.log("Manifest response: ", response);
            checkAndCreateToast("error",response.payload?.error)
        }else{
            checkAndCreateToast('success',"Successfully created manifest:");
        }
	}

	return (
		<DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-auto">
			<DialogTitle className = {"font-bold "}>Order Details</DialogTitle>
			<Separator />
			<div className="grid gap-6">
				{/* Order Information */}
				<div className="grid gap-6">
				<OrderDetail label="Order Database Id" value={order?._id} />
				<OrderDetail label="Order Id" value={order?.order_id} />
				<OrderDetail label="Order Date & Time" value={new Date(order?.createdAt).toLocaleString()} />
				<OrderDetail label="Channel Id" value={order?.channel_id} />
				<OrderDetail label="Convenience Fees" value={order?.ConveenianceFees} />
				<OrderDetail label="Shipment Id" value={order?.shipment_id} />
				<OrderDetail label="Razorpay order Id" value={order?.razorpay_order_id} />
				<OrderDetail label="Razorpay Payment Id" value={order?.paymentId} />
				
				<OrderDetail
					label="Order Status"
					value={
						<Badge className={`justify-center items-center py-1 px-3 text-white bg-red-500`}>
							{order?.status || "No-Data"}
						</Badge>
					}
				/>
				<OrderDetail
					label="Order Current Status"
					value={
						<Badge className={`justify-center items-center py-1 px-3 text-white bg-yellow-500`}>
							{order?.current_status || "No-Data"}
						</Badge>
					}
				/>
				<OrderDetail
					label="ETD (Estimated Delivery Date)"
					value={
						<Badge className={`justify-center items-center py-1 px-3 text-white bg-blue-500`}>
							{order?.etd || "No-Data"}
						</Badge>
					}
				/>
				<OrderDetail
					label="Order Payment Mode"
					value={
						<Badge className={`justify-center items-center py-1 px-3 text-white bg-green-500`}>
							{order?.paymentMode}
						</Badge>
					}
				/>
				<OrderDetail
					label="Order Shipment Status"
					value={
						<Badge className={`justify-center items-center py-1 px-3 text-white`}>
							{getStatusDescription(order?.shipment_status)}
						</Badge>
					}
				/>
				<OrderDetail label="Order Amount" value={`₹ ${order?.TotalAmount}`} />
				</div>
				
				<Separator />
				<OrderDetail label="Manifest Data" value={"Manifest Details"} url={order?.manifest && order?.manifest?.invoice_url} downloadEnable />
				{/* Order Items */}
				<div className="grid grid-cols-2 gap-4">
					<div className="font-medium">Order Details</div>
						<OrderItemList items={order?.orderItems} />
					</div>
					<Separator />
					
					{/* Shipping Information */}
					<div className="grid grid-cols-2 gap-4">
						<div className="font-medium">Shipping Info</div>
						<ShippingInfo address={order?.address} />
					</div>
					<Separator />
					{
						order?.PicketUpData && <PicketUpDataDisplay picketUpData={order?.PicketUpData}/>
					}
				<div className='grid grid-cols-2 justify-between items-center'>
					{/* You can add the form section here if needed */}
					{!order?.PicketUpData && (
						<div className="w-full flex justify-center items-center">
							<Button
								className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
								onClick={() => handlePickupResponse()}
							>
								Re-Try Pickup
							</Button>
						</div>
					)}
					{
						!order?.manifest && <div className="w-full flex justify-center items-center">
							<Button
								className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
								onClick={handleCreateManifest}
							>
								Create Manifest
							</Button>
						</div>
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

export default AdminOrdersDetailsView
