import { Check } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
	const navigation = useNavigate();
	return (
		<div className="bg-gradient-to-tl min-h-screen flex items-center justify-center">
			<div className="bg-gray-50 p-10 rounded-xl shadow-2xl max-w-lg text-center w-full sm:w-auto">
				<div className="flex justify-center mb-6">
				<Check size={60} className="text-black" />
				</div>
				<h1 className="text-4xl font-semibold text-gray-900 mb-4">Payment Successful!</h1>
				<p className="text-lg text-gray-700 mb-6">
				Thank you for your purchase! Your payment has been processed successfully.
				</p>
				<div className="space-x-4">
					<button onClick={()=> navigation('/products')} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out">
						Continue Shopping
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;
