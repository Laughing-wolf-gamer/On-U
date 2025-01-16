import { Card, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { verifyingOrder } from '@/store/shop/order-slice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const PaymentReturn = () => {
	const {toast} = useToast();
	const dispatch = useDispatch();
	const verifyAnyOrdersPayment = async()=>{
		try {
		  const data = JSON.parse(sessionStorage.getItem("checkoutData"))
		  console.log("Session Data:",data)
		  const resp = await dispatch(verifyingOrder({
			paymentData:data?.responseResult,
			orderId:data?.orderId,
			cartId:data?.cartId
		  }))
		  console.log(resp);
		  if(resp.payload.result === "SUCCESS"){
			toast({
				title: "Payment Successful",
				description: "Your order has been placed successfully",
			});
			window.location.href = "/shop/payment-success"
		  }else{
			window.location.href = "/shop/payment-failed"
		  }
		} catch (error) {
		  console.error(`Error Verifying order`)
		}
	  }
	  useEffect(()=>{
		verifyAnyOrdersPayment();
	  },[])
	return (
		<Card>
			<CardHeader>Payment Return</CardHeader>
		</Card>
	)
}

export default PaymentReturn