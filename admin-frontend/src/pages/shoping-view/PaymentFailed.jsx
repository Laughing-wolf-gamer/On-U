import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
	const navigate = useNavigate();
	return (
		<Card className = {"p-10"}>
			<CardHeader>
				<CardTitle className = {"text-4xl"}>
					Payment Was Failed...
				</CardTitle>
			</CardHeader>
			<Button className = {"mt-5"} onClick = {()=> navigate('/shop/checkout')} >Try Again... Go Back to Checkout</Button>
		</Card>
	)
}

export default PaymentFailed