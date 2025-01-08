import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, removeAddress, updateAddress } from '../../../action/useraction';
import AddAddressPopup from '../../Bag/AddAddressPopup';
import { Circle, SeparatorVertical, X } from 'lucide-react';
import { useAlert } from 'react-alert';
import { capitalizeFirstLetterOfEachWord } from '../../../config';
import LoadingOverlay from '../../../utils/LoadingOverLay';

const SavedAddresses = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { allAddresses, loading: addressStateLoading } = useSelector(state => state.getAllAddress);
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
    return (
      <div key={i} className="mb-4 relative p-6 border transition-color border-gray-700 rounded-lg shadow-md bg-gray-800 hover:shadow-xl duration-300">
        {/* Centered "X" button */}
        <button
          className="absolute top-2 right-2 flex justify-center items-center bg-red-700 text-white rounded-full w-8 h-8 text-lg font-semibold hover:bg-red-800 transition-colors duration-300"
          onClick={(e) => removeAddressByIndex(i)}
        >
          <X size={14} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-3">Address {i + 1}</h2>
        <div className="space-y-3">
          {Object.entries(address).map(([key, value], idx) => (
            <div key={key} className="flex flex-col space-y-4 text-sm text-gray-400">
              <div className='justify-between items-center flex'>
                <span className="font-medium text-sm text-gray-500 capitalize">{capitalizeFirstLetterOfEachWord(key)}:</span>
                <span className="text-gray-300">{value}</span>
              </div>
              {/* Horizontal line */}
              {idx < Object.entries(address).length - 1 && (
                <div className="border-b border-gray-600 my-2 w-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <LoadingOverlay isLoading={addressStateLoading} />
      <h2 className="font-semibold text-lg text-white mb-4">Saved Addresses</h2>

      {/* Display saved addresses */}
      {allAddresses && allAddresses.length > 0 ? (
        allAddresses.map((address, index) => renderAddress(index, address))
      ) : (
        <p className="text-gray-400">No addresses saved.</p>
      )}

      {/* Button to open the "Add Address" popup */}
      <button
        onClick={handleOpenPopup}
        className="mt-6 py-2 px-6 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-300"
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

export default SavedAddresses;
