import React, { useEffect, useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import PaymentMethods from './PaymentMethods';
import AccountSettings from './AccountSettings';
import OverViewSideBar from './OverViewSideBar';
import UserDetails from './UserDetails';
import { useNavigate } from 'react-router-dom';

const Overview = ({ user }) => {
  const navigation = useNavigate();
  const [activeSection, setActiveSection] = useState('User-Details');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // If no user, show warning
  if (!user) {
    return (
      <div className="bg-gray-50 h-[90%] flex flex-col items-center justify-center">
        <div className="text-center bg-white h-full justify-center items-center p-8 rounded-lg shadow-md w-[90%] xl:w-[70%]">
          <h1 className="text-xl font-semibold text-gray-800">No User Logged In</h1>
          <p className="text-gray-500 my-4">Please log in to access your account.</p>
          <button
            onClick={(e) => navigation('/Login')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Account Header */}
      <div className="py-6 border-b mx-auto w-[90%] mt-5 2xl:w-[70%] px-4 xl:w-[70%] lg:w-[70%] bg-white shadow-md rounded-lg">
        <h1 className="font-semibold text-2xl text-gray-800">Account</h1>
        <p className="text-sm text-gray-500">{user?.user?.name}</p>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Toggle Button for Small Screens */}
        <button
          className="lg:hidden p-4 bg-gray-800 text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          Toggle Menu
        </button>

        {/* Sidebar */}
        <div
          className={`w-full lg:w-[30%] bg-white p-6 rounded-lg shadow-md border-r-2 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}
        >
          <OverViewSideBar setActiveSection={setActiveSection} activeSection={activeSection} />
        </div>

        {/* Profile Details */}
        <div className="w-full lg:w-[70%] py-3">
          <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto text-sm">
            {/* Render active section */}
            {activeSection === 'User-Details' && <UserDetails user={user?.user} />}
            {activeSection === 'Orders-Returns' && <OrdersReturns />}
            {activeSection === 'Saved-Addresses' && <SavedAddresses />}
            {/* {activeSection === 'Saved-Cards' && <PaymentMethods />} */}
            {/* {activeSection === 'Gift-Cards' && <AccountSettings />} */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Overview;
