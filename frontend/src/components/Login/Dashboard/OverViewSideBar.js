import React from 'react';

const OverViewSideBar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-fit">
      <ul className="space-y-4">
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('User-Details');
            }}
            className={`w-full text-center h-full focus:outline-none transition duration-200 font-semibold ${
              activeSection === 'User-Details' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            User Details
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('Orders-Returns');
            }}
            className={`w-full h-full text-center p-3 focus:outline-none transition duration-200 font-semibold ${
              activeSection === 'Orders-Returns' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Orders & Returns
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('Saved-Addresses');
            }}
            className={`w-full h-full text-center focus:outline-none transition duration-200 font-semibold ${
              activeSection === 'Saved-Addresses' ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            Saved Addresses
          </button>
        </li>
      </ul>
    </div>
  );
};

export default OverViewSideBar;
