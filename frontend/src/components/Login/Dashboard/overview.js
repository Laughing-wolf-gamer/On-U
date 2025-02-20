import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import OverViewSideBar from './OverViewSideBar';
import UserDetails from './UserDetails';
import { useNavigate } from 'react-router-dom';
import { AlignJustify, LogOut } from 'lucide-react';
import { FaExclamationTriangle, FaUser, FaUserAltSlash } from 'react-icons/fa'; // Import the react-icon for logout
import BackToTopButton from '../../Home/BackToTopButton';
import { useDispatch } from 'react-redux';
import { logout } from '../../../action/useraction';
import WhatsAppButton from '../../Home/WhatsAppButton';
const NotLoggedInModal = () => {
	const navigate = useNavigate();

	const handleLoginRedirect = (e) => {
		e.stopPropagation();
		navigate('/Login');
	};

	 return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-40 flex justify-center items-center z-50">
			{/* Modal Container */}
			<div className="bg-white rounded-lg p-6 w-96 shadow-lg">
				{/* Exclamation Icon */}
				<div className="flex items-center justify-center mb-4 text-gray-500">
					<FaUserAltSlash size={60} />
				</div>
				<h2 className="text-2xl font-semibold text-gray-800 mb-4">Not Logged In</h2>
				<p className="text-gray-600 mb-4">
					You need to log in to access this feature. Please log in to continue.
				</p>

				{/* Log In Button with User Icon */}
				<div className="flex justify-center items-center">
					<button
						onClick={handleLoginRedirect}
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 flex items-center space-x-2"
					>
						<FaUser size={20} /> {/* User icon next to the text */}
						<span>Log In</span>
					</button>
				</div>
			</div>
		</div>
	);
};
const Overview = ({ user ,loading,isAuthentication}) => {
	console.log("user: ",user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [activeSection, setActiveSection] = useState('User-Details');
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// If no user, show warning
	/* useEffect(() => {
		if(!loading && !isAuthentication){
			if (!user ) {
				navigate('/Login');
			}
		}
	}, [user, navigate]); */

	const scrollableDivRef = useRef(null); // Create a ref to access the div element

	const handleLogout = async () => {
		await dispatch(logout())
		navigate('/Login');
	};
	if(!loading && !isAuthentication && !user){
		return <NotLoggedInModal/>;
	}

	return (
		<div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto bg-gray-50 text-gray-800">
			<div className="container mx-auto px-4">
				{/* Account Header */}
				<div className="py-6 border-b px-3 mx-auto w-full bg-white">
					<div className="flex justify-between items-center">
						{/* Account Info Section */}
						<div>
						<h1 className="font-semibold text-2xl sm:text-xl md:text-2xl text-gray-800">Account Overview</h1>
						<p className="text-sm sm:text-base md:text-sm text-gray-600">{user?.user?.name}</p>
						</div>

						{/* Logout Button */}
						<button
							onClick={handleLogout}
							className="flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
						>
						<LogOut size={20} /> {/* Logout icon */}
						</button>
					</div>
				</div>



			<div className="flex flex-col lg:flex-row mt-4">
				<div
					className={`w-full lg:w-[20%] mt-4 flex-col justify-start p-6 rounded-lg border-r-2 bg-white`}
				>
					<OverViewSideBar setActiveSection={setActiveSection} activeSection={activeSection} />
				</div>
				{/* <div className="md:hidden">
				</div> */}


				{/* Profile Details */}
				<div className="w-full lg:w-[75%] py-4">
					<div className="bg-white rounded-lg">
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
		<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
		</div>
	);
};

export default Overview;
