import React, { useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { Badge } from '../ui/badge'
import { useDispatch } from 'react-redux'
import { adminGetAllOrders, adminUpdateUsersOrdersById } from '@/store/admin/order-slice'
import { useToast } from '@/hooks/use-toast'
import { capitalizeFirstLetterOfEachWord, GetBadgeColor } from '@/config'
const initialFormData = {
	status:'',
}
const AdminOrdersDetailsView = ({order}) => {
	console.log("Order Details: ",GetBadgeColor(order?.status))
	const [formData,setFormData] = useState(initialFormData);
	const dispatch = useDispatch();
	const{toast} = useToast();
	const handleSubmitStatus = async (e)=>{
		e.preventDefault();
        console.log(formData)
		const {status} = formData;
		const data = await dispatch(adminUpdateUsersOrdersById({orderId:order?._id,status}))
		console.log("Data Updated: " + data)
		if(data?.payload?.Success){
			toast({
                title: "Order Status Updated Successfully",
                description: data?.payload?.message,
            })
            setFormData(initialFormData);
			dispatch(adminGetAllOrders())
		}
	}
	console.log("Order Details: ",order)
	return (
		<DialogContent className = "sm:max-w-[600px] h-[500px] overflow-y-auto">
			<DialogTitle>Order Details</DialogTitle>
			<div className='grid gap-6'>
				<div className='grid gap-6'>
					<div className='flex mt-6 items-center justify-between'>
						<p className='font-medium'>Order Id</p>
						<Label>{order?._id}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Order Date & Time</p>
						<Label>{new Date(order?.createdAt).toLocaleString()}</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Order Status</p>
						<Label>
							<Badge className={`justify-center items-center py-1 px-3  ${GetBadgeColor(order?.status)} text-white`}>{order?.status}</Badge>
						</Label>
					</div>
					<div className='flex mt-2 items-center justify-between'>
						<p className='font-medium'>Order Amount</p>
						<Label>₹ {order?.TotalAmount}</Label>
					</div>
				</div>
				<Separator/>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<div className='font-medium'>Order Details</div>
						<ul className='grid gap-3'>
							{
								order?.orderItems?.map((item, index) => (
									<li key={index} className='flex items-center justify-between'>
										<span>{item?.title}</span>
										<span>Quantity: {item?.quantity}</span>
										<span>Price: ₹{item?.productId?.salePrice ? item?.productId?.salePrice : item?.productId?.price}</span>
									</li>
								))
							}
						</ul>
					</div>
				</div>
				<Separator/>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<div className='font-medium'>Shipping Info</div>
						<ul className='grid gap-0.5'>
							{order?.SelectedAddress && Object.keys(order?.SelectedAddress).map((key,index)=>(
								<span key={index}>{capitalizeFirstLetterOfEachWord(key)}: {order?.SelectedAddress[key] || "No-Data"}</span>
							))}
							
						</ul>
					</div>
				</div>
				<Separator/>

				<div>
					<CommonForm formControls={[
						{
							label:"Status",
							name:'status',
							componentType:'select',
							options:[
								{id:'Processing', label:'Processing'},
								{id:'Order Confirmed', label:'Order Confirmed'},
								{id:'Order Shipped',label:"Order Shipped"},
								{id:'Out for Delivery',label:"Out for Delivery"},
								{id:'Delivered',label:"Delivered"},
								{id:'Candled',label:"Candled"},
							]
						},
					]}
						formData={formData}
						setFormData={setFormData}
						buttonText={"Update Order Status"}
						handleSubmit={handleSubmitStatus}
						isBtnValid={true}
					/>
				</div>
			</div>
		</DialogContent>
	)
}

export default AdminOrdersDetailsView