import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, removeAddress, updateAddress } from '../../../action/useraction';
import AddAddressPopup from '../../Bag/AddAddressPopup';
import { Circle, SeparatorVertical, X } from 'lucide-react';
import { useAlert } from 'react-alert';

const SavedAddresses = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { allAddresses,loading:addressStateLoading } = useSelector(state => state.getAllAddress);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);

  // Open Add Address Popup
  const handleOpenPopup = () => setIsAddressPopupOpen(true);

  // Close Add Address Popup and fetch updated addresses
  const handleClosePopup = () => {
    setIsAddressPopupOpen(false);
    dispatch(getAddress());
  };

  // Handle saving new address
  const handleSaveAddress = async (newAddress) => {
    // Assuming you have a function to update the user's address in the backend
    await dispatch(updateAddress(newAddress));
    alert.success('Address added successfully');
    dispatch(getAddress());
  };
  const removeAddressByIndex = async (addressIndex) => {
    await dispatch(removeAddress(addressIndex));
    alert.success('Address removed successfully');
    dispatch(getAddress());
  };

  // Fetch all addresses on component mount
  useEffect(() => {
    dispatch(getAddress());
  }, [dispatch]);


  const renderAddress = (i, address) => {
    console.log("Address Loading: ", addressStateLoading);
    return (
      <div key={i} className="mb-4 relative p-6 border transition-color border-gray-300 rounded-lg shadow-md bg-white hover:shadow-lg duration-300">
        {/* Centered "X" button */}
        <button
          className="absolute top-2 right-2 flex justify-center items-center bg-red-600 text-white rounded-full w-8 h-8 text-lg font-semibold hover:bg-red-700 transition-colors duration-300"
          onClick={(e) => removeAddressByIndex(i)}
        >
          <X size={14} />
        </button>
  
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Address {i + 1}</h2>
        <div className="space-y-3">
          {Object.entries(address).map(([key, value], idx) => (
            <div key={key} className="flex flex-col space-y-4 text-sm text-gray-700">
              <div className='justify-between items-center flex'>
                <span className="font-medium text-sm text-gray-600 capitalize">{key}:</span>
                <span className="text-gray-800">{value}</span>
              </div>
              {/* Horizontal line */}
              {idx < Object.entries(address).length - 1 && (
                <div className="border-b border-gray-300 my-2 w-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div className="p-6">
      <LoadingOverlay isLoading={addressStateLoading} />
      <h2 className="font-semibold text-lg mb-4">Saved Addresses</h2>

      {/* Display saved addresses */}
      {allAddresses && allAddresses.length > 0 ? (
        allAddresses.map((address,index) => renderAddress(index,address))
      ) : (
        <p>No addresses saved.</p>
      )}

      {/* Button to open the "Add Address" popup */}
      <button
        onClick={handleOpenPopup}
        className="mt-6 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Add Address
      </button>

      {/* AddAddressPopup Component */}
      <AddAddressPopup
        isOpen={isAddressPopupOpen}
        onClose={handleClosePopup}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex justify-center items-center">
        <Circle className="animate-spin text-white text-[40px]" />
      </div>
    </div>
  );
};

export default SavedAddresses;
