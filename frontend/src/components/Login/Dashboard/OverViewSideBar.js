import React from 'react';

const OverViewSideBar = ({activeSection,setActiveSection}) => {
  return (
    <div>
      <ul>
        <li>
          <button onClick={(e)=>{
            e.preventDefault()
            setActiveSection('User-Details')
          }} className="w-full text-left p-2 hover:underline">User Details</button>
        </li>
        <li>
          <button onClick={(e)=>{
            e.preventDefault()
            setActiveSection('Orders-Returns')
          }} className="w-full text-left p-2 hover:underline">Orders & Returns</button>
        </li>
        <li>
          <button onClick={(e)=>{
            e.preventDefault()
            setActiveSection('Saved-Addresses')
          }} className="w-full text-left p-2 hover:underline">Saved Addresses</button>
        </li>
        <li>
          <button onClick={(e)=>{
            e.preventDefault()
            setActiveSection('Saved-Cards')
          }} className="w-full text-left p-2 hover:underline">Payment Methods</button>
        </li>
        {/* <li>
          <button onClick={(e)=>{
            e.preventDefault()
            setActiveSection('Coupons')
          }} className="w-full text-left p-2 hover:underline">Wishlist</button>
        </li> */}
        <li>
          <button onClick={(e)=>{
            e.preventDefault()
            setActiveSection('Gift-Cards')
          }} className="w-full text-left p-2 hover:underline">Account Settings</button>
        </li>
      </ul>
    </div>
  );
};

export default OverViewSideBar;
