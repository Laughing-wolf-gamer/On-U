import React, { Fragment, useEffect, useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import OverViewSideBar from './OverViewSideBar';
import UserDetails from './UserDetails';
import { useNavigate } from 'react-router-dom';
import { AlignJustify } from 'lucide-react';

const Overview = ({ user }) => {
    const navigation = useNavigate();
    const [activeSection, setActiveSection] = useState('User-Details');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // If no user, show warning
    useEffect(()=>{
        if (!user) {
            navigation('/Login')
        }
    },[])

    return (
        <div className="w-screen font-sans h-screen overflow-y-auto justify-start scrollbar bg-white overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            <div className="bg-gray-50 min-h-screen text-gray-800">
            {/* Account Header */}
            <div className="py-6 border-b mx-auto w-[90%] mt-5 2xl:w-[70%] px-4 xl:w-[70%] lg:w-[70%] bg-gray-200 shadow-md rounded-lg">
                <h1 className="font-semibold text-2xl text-gray-800">Account</h1>
                <p className="text-sm text-gray-600">{user?.user?.name}</p>
            </div>

            <div className="flex flex-col lg:flex-row mt-4">
                {/* Toggle Button for Small Screens */}
                <button
                    className="lg:hidden p-4 bg-gray-300 text-gray-800"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <AlignJustify />
                </button>

                {/* Sidebar */}
                <div
                    className={`w-full lg:w-[15%] justify-center items-center mt-4 flex-col ml-3 p-6 rounded-lg shadow-md border-r-2 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}
                >
                    <OverViewSideBar setActiveSection={setActiveSection} activeSection={activeSection} />
                </div>

                {/* Profile Details */}
                <div className="w-full lg:w-[80%] py-3 px-4">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full mx-auto text-sm">
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
        </div>
    );
};

export default Overview;
