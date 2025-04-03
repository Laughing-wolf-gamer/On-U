import { CircleCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServerAuth } from '../../Contaxt/AuthContext';

const PaymentSuccess = () => {
	const [seconds, setSeconds] = useState(10); // Set initial countdown time (10 seconds)
	const navigate = useNavigate();
	const{userLoading,user, isAuthentication,checkAuthUser} = useServerAuth();
	// Use useEffect to manage the timer countdown
	useEffect(() => {
		if (seconds === 0) {
			// Navigate to the /products page when the countdown hits 0
			navigate('/products');
			return;
		}

		// Set up a timer to decrease the seconds every second
		const timerId = setInterval(() => {
			setSeconds((prevSeconds) => prevSeconds - 1);
		}, 1000);

		// Cleanup the timer when the component unmounts or the countdown ends
		return () => clearInterval(timerId);
	}, [seconds, navigate]);
	useEffect(()=>{
		if(!user && !userLoading){
			// checkAuthUser();
			navigate('/products');
		}
	},[user])
	return (
		<div className="bg-gradient-to-tl min-h-screen flex items-center justify-center">
			<div className="bg-gray-50 p-10 rounded-xl shadow-2xl max-w-lg text-center w-full sm:w-auto">
				<div className="flex justify-center mb-6">
				<CircleCheck size={100} strokeWidth={1.2} className="text-black" />
				</div>
				<h1 className="text-4xl font-semibold text-gray-900 mb-4">Order Successful!</h1>
				<p className="text-lg text-gray-700 mb-6">
					Thank you for your purchase! Your order has been placed successfully.
				</p>

				{/* Display the countdown timer */}
				<p className="text-xl text-gray-700 mb-4">
					Your Shopping Will Continue in {seconds} second{seconds !== 1 ? 's' : ''}
				</p>

				<div className="space-x-4">
					<button
						onClick={() => navigate('/products')}
						className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out"
					>
						Continue Shopping
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;
