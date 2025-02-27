import axios from 'axios';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BASE_API_URL, headerConfig } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../../action/useraction';
import { useNavigate } from 'react-router-dom';
import { useSettingsContext } from '../../Contaxt/SettingsContext';

const PaymentPending = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const[isPaymentChecking,setIsPaymentChecking] = useState(false);
	const {checkAndCreateToast} = useSettingsContext();
	const { user } = useSelector(state => state.user);
	const verifyAnyOrdersPayment = async()=>{
		setIsPaymentChecking(true);
        if(!sessionStorage.getItem("checkoutData")){
			navigate('/bag');
			return;
		};
		const data = JSON.parse(sessionStorage.getItem("checkoutData"))
        try {
            console.log("Verifying Order Response: ",data);
            const response = await axios.post(`${BASE_API_URL}/api/payment/razerypay/paymentVerification`,data,headerConfig())
            sessionStorage.removeItem("checkoutData")
            if(response?.data.success){
                checkAndCreateToast("success","Payment Successful");
				navigate('/bag/checkout/success');
            }else{
                checkAndCreateToast("error","Payment Failed");
				navigate('/bag/checkout/failure');
            }
            
        } catch (error) {
            console.error(`Error Verifying order: `,error);
			checkAndCreateToast("success","Error Verifying Payment");
			navigate('/bag/checkout');
        }finally{
			setIsPaymentChecking(false);
		}
    }
	useEffect(()=>{
		dispatch(getuser());
	},[])
	useEffect(()=>{
		if(user && !isPaymentChecking){
			verifyAnyOrdersPayment();
		}
	},[user,isPaymentChecking])
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="bg-gray-50 p-10 rounded-xl shadow-2xl max-w-lg text-center w-full sm:w-auto">
				<div className="flex justify-center mb-6">
					<Loader size={60} className="text-gray-600 animate-spin" />
				</div>
					<h1 className="text-4xl font-semibold text-gray-900 mb-4">Verifying Payment...</h1>
					<p className="text-lg text-gray-700 mb-6">
						Your payment is being processed. Please wait while we verify your transaction.
					</p>
			</div>
		</div>
	);
};

export default PaymentPending;
