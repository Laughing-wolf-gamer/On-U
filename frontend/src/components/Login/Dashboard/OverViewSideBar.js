import React from 'react';

const OverViewSideBar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-fit bg-gray-800 text-gray-200 p-6 rounded-lg shadow-lg">
      <ul className="space-y-4">
        <li>
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('User-Details');
            }}
            className={`w-full text-left p-3 rounded-lg hover:bg-gray-600 focus:outline-none transition duration-200 ${
              activeSection === 'User-Details' ? 'bg-gray-600' : 'bg-gray-800'
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
            className={`w-full text-left p-3 rounded-lg hover:bg-gray-600 focus:outline-none transition duration-200 ${
              activeSection === 'Orders-Returns' ? 'bg-gray-600' : 'bg-gray-800'
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
            className={`w-full text-left p-3 rounded-lg hover:bg-gray-600 focus:outline-none transition duration-200 ${
              activeSection === 'Saved-Addresses' ? 'bg-gray-600' : 'bg-gray-800'
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
