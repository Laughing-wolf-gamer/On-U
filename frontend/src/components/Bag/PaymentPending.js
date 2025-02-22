import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import { BASE_API_URL, headerConfig } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../../action/useraction';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSettingsContext } from '../../Contaxt/SettingsContext';

const PaymentPending = () => {
	/* const dispatch = useDispatch();
	const navigate = useNavigate();
	const {checkAndCreateToast} = useSettingsContext();
	const { user, isAuthentication } = useSelector(state => state.user);
	const verifyAnyOrdersPayment = async()=>{
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
			navigate('/bag');
        }
    }
	useEffect(()=>{
		dispatch(getuser());
	},[])
	useEffect(()=>{
		if(user){
			verifyAnyOrdersPayment();
		}
	},[user]) */
	return (
		<div className="bg-gradient-to-tl from-gray-800 to-black min-h-screen flex items-center justify-center">
			<div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg text-center w-full sm:w-auto">
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
