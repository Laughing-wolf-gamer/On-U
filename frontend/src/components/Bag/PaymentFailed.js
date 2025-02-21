import { X } from 'lucide-react';
import React from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const PaymentFailed = () => {
	const navigate = useNavigate();
	return (
		<div className="bg-gradient-to-tl font-kumbsan from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
			<div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg text-center w-full sm:w-auto">
				<div className="flex justify-center mb-6">
				<IoCloseCircle size={90} className="text-red-600" />
				</div>
				<h1 className="text-4xl font-semibold text-gray-900 mb-4">Payment Failed!</h1>
				<p className="text-lg text-gray-700 mb-6">
				Oops! Something went wrong. Your payment could not be processed.
				</p>
				<div className="space-x-4">
					<button onClick={()=> navigate('/bag/checkout')} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out">
						Go To Checkout
					</button>
					<button onClick={()=> navigate('/bag')} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 ease-in-out">
						Go To Bag
					</button>
				</div>
			</div>
		</div>
	);
};

export default PaymentFailed;
