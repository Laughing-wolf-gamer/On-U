import React, { useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { useDispatch } from 'react-redux'
import { adminGetAllOrders, adminUpdateUsersOrdersById } from '@/store/admin/order-slice'
import { capitalizeFirstLetterOfEachWord, GetBadgeColor } from '@/config'
import { toast } from 'react-toastify'
import { useSettingsContext } from '@/Context/SettingsContext'

const initialFormData = {
  status: '',
}

const OrderDetail = ({ label, value }) => (
	<div className="flex mt-2 items-center justify-between">
		<p className="font-medium">{label}</p>
		<Label className = {"text-base text-gray-500"}>{value}</Label>
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
			<OrderDetail
				label="Order Status"
				value={
					<Badge className={`justify-center items-center py-1 px-3 text-white`}>
						{order?.current_status}
					</Badge>
				}
			/>
			<OrderDetail label="Order Amount" value={`₹ ${order?.TotalAmount}`} />
			</div>
			
			<Separator />
			
			{/* Order Items */}
			<div className="grid gap-4">
			<div className="font-medium">Order Details</div>
			<OrderItemList items={order?.orderItems} />
			</div>

			<Separator />
			
			{/* Shipping Information */}
			<div className="grid gap-4">
			<div className="font-medium">Shipping Info</div>
			<ShippingInfo address={order?.address} />
			</div>

			<Separator />

			{/* You can add the form section here if needed */}
		</div>
		</DialogContent>
	)
}

export default AdminOrdersDetailsView
