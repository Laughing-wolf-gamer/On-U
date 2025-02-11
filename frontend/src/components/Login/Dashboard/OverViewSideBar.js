import React from 'react';
import { FaUser, FaBox, FaMapMarkedAlt } from 'react-icons/fa'; // Importing the icons

const OverViewSideBar = ({ activeSection, setActiveSection }) => {
	return (
		<div className="w-full font-kumbsan bg-white shadow-md rounded-lg md:h-screen md:sticky top-0 p-4">
		<ul className="space-y-4">
			{/* User Details Button */}
			<li>
			<button
				onClick={(e) => {
				e.preventDefault();
				setActiveSection('User-Details');
				}}
				className={`w-full text-center py-3 px-4 rounded-md focus:outline-none transition duration-200 font-semibold ${
				activeSection === 'User-Details'
					? 'text-white bg-gray-500'
					: 'text-gray-700 hover:bg-gray-100'
				}`}
			>
				<div className="flex items-center justify-center space-x-2">
				<FaUser className="text-xl" /> {/* User Icon */}
				<span>User Details</span>
				</div>
			</button>
			</li>

			{/* Orders & Returns Button */}
			<li>
			<button
				onClick={(e) => {
				e.preventDefault();
				setActiveSection('Orders-Returns');
				}}
				className={`w-full text-center py-3 px-4 rounded-md focus:outline-none transition duration-200 font-semibold ${
				activeSection === 'Orders-Returns'
					? 'text-white bg-gray-500'
					: 'text-gray-700 hover:bg-gray-100'
				}`}
			>
				<div className="flex items-center justify-center space-x-2">
				<FaBox className="text-xl" /> {/* Orders Icon */}
				<span>Orders & Returns</span>
				</div>
			</button>
			</li>

			{/* Saved Addresses Button */}
			<li>
			<button
				onClick={(e) => {
				e.preventDefault();
				setActiveSection('Saved-Addresses');
				}}
				className={`w-full text-center py-3 px-4 rounded-md focus:outline-none transition duration-200 font-semibold ${
				activeSection === 'Saved-Addresses'
					? 'text-white bg-gray-500'
					: 'text-gray-700 hover:bg-gray-100'
				}`}
			>
				<div className="flex items-center justify-center space-x-2">
				<FaMapMarkedAlt className="text-xl" /> {/* Map Icon for Addresses */}
				<span>Saved Addresses</span>
				</div>
			</button>
			</li>
		</ul>
		</div>
	);
};

export default OverViewSideBar;
