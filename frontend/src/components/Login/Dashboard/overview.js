import React, { useEffect, useRef, useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import OverViewSideBar from './OverViewSideBar';
import UserDetails from './UserDetails';
import { useNavigate } from 'react-router-dom';
import { AlignJustify } from 'lucide-react';
import BackToTopButton from '../../Home/BackToTopButton';

const Overview = ({ user }) => {
  const navigation = useNavigate();
  const [activeSection, setActiveSection] = useState('User-Details');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If no user, show warning
  useEffect(() => {
    if (!user) {
      navigation('/Login');
    }
  }, [user, navigation]);

  const scrollableDivRef = useRef(null); // Create a ref to access the div element

  return (
    <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto bg-gray-50 text-gray-800">
      <div className="container mx-auto px-4">
        {/* Account Header */}
        <div className="py-6 border-b mx-auto w-full lg:w-[80%] xl:w-[70%] bg-white rounded-lg">
          <h1 className="font-semibold text-2xl text-gray-800">Account Overview</h1>
          <p className="text-sm text-gray-600">{user?.user?.name}</p>
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
