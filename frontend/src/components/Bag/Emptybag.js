import React from "react";
import shoppingbag from '../images/shopping-bag.png';
import { useNavigate } from "react-router-dom";

const EmptyBag = () => {
	const redirect = useNavigate();

	function handleMoveToShoppingView() {
		redirect('/products');
	}

	return (
		<div className="flex flex-col w-full h-screen items-center justify-center text-center px-4 sm:px-6 py-8 sm:py-12">
			<div className="w-full max-w-lg p-6 sm:p-10">
				<img
					src={shoppingbag} // Replace with your actual image path
					alt="Empty Bag"
					className="mx-auto mb-8 w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 object-contain hover:animate-bounce"
				/>
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
					Oops! Your Bag Feels Light
				</h2>
				<p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
					It looks like you haven't added anything yet. Browse our collection and start shopping now!
				</p>
				<button
					onClick={handleMoveToShoppingView}
					className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all hover:scale-105 duration-300 text-base sm:text-lg md:text-xl shadow-md"
				>
					Continue Shopping
				</button>
			</div>
		</div>

	);
};

export default EmptyBag;
