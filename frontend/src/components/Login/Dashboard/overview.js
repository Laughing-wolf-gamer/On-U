import React, { useState } from 'react';
import Footer from '../../Footer/Footer';
import OrdersReturns from './OrdersReturns';
import SavedAddresses from './SavedAddresses';
import PaymentMethods from './PaymentMethods';
// import Wishlist from './Wishlist';
import AccountSettings from './AccountSettings';
import OverViewSideBar from './OverViewSideBar';
import UserDetails from './UserDetails';

const Overview = ({ user }) => {
  const [activeSection, setActiveSection] = useState('User-Details');

  return (
    <div>
      {/* Account Header */}
      <div className="py-4 border-b-[1px] mx-auto w-[90%] mt-5 2xl:w-[70%] xl:w-[70%] lg:w-[70%]">
        <h1 className="font-semibold text-lg font1">Account</h1>
        <p className="text-xs">{user?.user?.name}</p>
      </div>

      {/* Main Content Area */}
      <div className="flex w-[90%] h-auto mx-auto 2xl:w-[70%] xl:w-[70%] lg:w-[70%]">
        {/* Sidebar */}
        <div className="w-[30%] border-r-2 2xl:w-[20%] xl:w-[20%] lg:w-[20%]">
          <OverViewSideBar setActiveSection={setActiveSection} />
        </div>

        {/* Profile Details */}
        <div className="w-[70%] py-3 h-full 2xl:w-full xl:w-full lg:w-full">
          <div className="w-[100%] mx-auto text-xs 2xl:w-[90%] xl:w-[90%] lg:w-[90%] 2xl:text-base xl:text-base lg:text-base">
            <h1 className="font-semibold text-lg font1 border-b-[1px] my-4 py-4">Profile Details</h1>

            {/* Render active section */}
            {activeSection === 'User-Details' && <UserDetails user={user?.user}/>}
            {activeSection === 'Orders-Returns' && <OrdersReturns />}
            {activeSection === 'Saved-Addresses' && <SavedAddresses />}
            {activeSection === 'Saved-Cards' && <PaymentMethods />}
            {/* {activeSection === 'Coupons' && <Wishlist />} */}
            {activeSection === 'Gift-Cards' && <AccountSettings />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Overview;
