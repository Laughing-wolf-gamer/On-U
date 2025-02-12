import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, removeAddress, updateAddress } from '../../../action/useraction';
import AddAddressPopup from '../../Bag/AddAddressPopup';
import { X, MapPin, Plus } from 'lucide-react';  // Added icons
import { capitalizeFirstLetterOfEachWord } from '../../../config';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';

const SavedAddresses = () => {
    const {checkAndCreateToast} = useSettingsContext();
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
        checkAndCreateToast("success",'Address added successfully');
        dispatch(getAddress());
    };

    const removeAddressByIndex = async (addressIndex) => {
        await dispatch(removeAddress(addressIndex));
        checkAndCreateToast("success",'Address removed successfully');
        dispatch(getAddress());
    };

    // Fetch all addresses on component mount
    useEffect(() => {
        dispatch(getAddress());
    }, [dispatch]);

    const renderAddress = (i, address) => {
        return (
            <div key={i} className="mb-4 font-kumbsan relative p-6 border transition-color border-gray-300 rounded-lg shadow-sm bg-gray-200 hover:bg-gray-300 duration-300">
                {/* Centered "X" button */}
                <button
                    className="absolute top-2 right-2 flex justify-center items-center bg-red-500 text-white rounded-full w-8 h-8 text-lg font-semibold hover:bg-red-600 transition-colors duration-300"
                    onClick={(e) => removeAddressByIndex(i)}
                >
                    <X size={14} />
                </button>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">Address {i + 1}</h2>
                <div className="space-y-3">
                    {Object.entries(address).map(([key, value], idx) => (
                        <div key={key} className="flex flex-col space-y-4 text-sm text-gray-700">
                            <div className='justify-between items-center flex'>
                                <span className="font-medium text-sm text-gray-600 capitalize">{capitalizeFirstLetterOfEachWord(key)}:</span>
                                <span className="text-gray-800">{value}</span>
                            </div>
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
        <div className="p-6 font-kumbsan bg-gray-100 min-h-screen">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Saved Addresses</h2>

            {/* Display saved addresses */}
            {addressStateLoading ? (
                // If no addresses or loading, show skeletons
                Array(4).fill(0).map((_, index) => <AddressSkeleton key={index} />)
            ) : (
                <Fragment>
                    {allAddresses && allAddresses.length > 0 ? (
                        allAddresses.map((address, index) => renderAddress(index, address))
                    ) : (
                        <p className="text-gray-600">No addresses saved.</p>
                    )}
                </Fragment>
            )}

            {/* Button to open the "Add Address" popup */}
            <button
                onClick={handleOpenPopup}
                className="mt-6 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
            >
                <Plus className="mr-2" size={16} /> {/* Add Icon */}
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

const AddressSkeleton = () => {
    return (
        <div className="flex flex-col space-y-4 text-sm text-gray-700 animate-pulse">
            {/* Skeleton for key-value pair */}
            <div className="justify-between items-center flex">
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div> {/* Skeleton for label (key) */}
                <div className="w-2/3 h-4 bg-gray-300 rounded"></div> {/* Skeleton for value */}
            </div>

            {/* Skeleton for horizontal line */}
            <div className="border-b border-gray-300 my-2 w-full h-px bg-gray-300"></div>
        </div>
    );
};

export default SavedAddresses;
