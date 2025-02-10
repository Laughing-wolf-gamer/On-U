import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import OverViewSideBar from './OverViewSideBar';
import UserDetails from './UserDetails';
import { useNavigate } from 'react-router-dom';
import { AlignJustify, LogOut } from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the react-icon for logout
import BackToTopButton from '../../Home/BackToTopButton';
import { useDispatch } from 'react-redux';
import { logout } from '../../../action/useraction';

const Overview = ({ user ,loading}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [activeSection, setActiveSection] = useState('User-Details');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// If no user, show warning
	useEffect(() => {
		if(!loading){
			if (!user ) {
				navigate('/Login');
			}
		}
	}, [user, navigate]);

	const scrollableDivRef = useRef(null); // Create a ref to access the div element

	const handleLogout = async () => {
		await dispatch(logout())
		navigate('/');
		// Clear user session data or authentication tokens here if needed
		// For example, clearing localStorage/sessionStorage or calling an API to log out
		// localStorage.removeItem('authToken');  // Example
		// navigate('/Login');  // Navigate back to the login page
	};

	return (
		<div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto bg-gray-50 text-gray-800">
		<div className="container mx-auto px-4">
			{/* Account Header */}
			<div className="py-6 border-b px-3 mx-auto w-full lg:w-[80%] xl:w-[70%] bg-white rounded-lg">
			<div className="flex justify-between items-center">
				{/* Account Info Section */}
				<div>
				<h1 className="font-semibold text-2xl text-gray-800">Account Overview</h1>
				<p className="text-sm text-gray-600">{user?.user?.name}</p>
				</div>

				{/* Logout Button */}
				<button
				onClick={handleLogout}
				className="flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
				>
				<LogOut /> {/* Logout icon */}
				</button>
			</div>
			</div>


			<div className="flex flex-col lg:flex-row mt-4">
			{/* Toggle Button for Small Screens */}
			<button
				className="lg:hidden p-4 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				<AlignJustify />
			</button>

			{/* Sidebar */}
			<div
				className={`w-full lg:w-[20%] mt-4 flex flex-col justify-start p-6 rounded-lg border-r-2 bg-white ${sidebarOpen ? 'block' : 'hidden'} lg:block`}
			>
				<OverViewSideBar setActiveSection={setActiveSection} activeSection={activeSection} />
			</div>

			{/* Profile Details */}
			<div className="w-full lg:w-[75%] py-4 px-6">
				<div className="bg-white p-6 rounded-lg">
					{/* Render active section */}
					{activeSection === 'User-Details' && <UserDetails user={user?.user} />}
					{activeSection === 'Orders-Returns' && <OrdersReturns />}
					{activeSection === 'Saved-Addresses' && <SavedAddresses />}
				</div>
			</div>
			</div>

		</div>

		{/* Footer */}
		<Footer />
		<BackToTopButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};

export default Overview;
