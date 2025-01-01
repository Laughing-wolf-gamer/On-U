import { Input } from '@mui/material';
import React, { useState } from 'react';
const initState = {
    name:'',
    phonenumber: '',
    address1: '',
    address2: '',
    pincode: '',
    citystate: '',
}
const AddAddressPopup = ({ isOpen, onClose, onSave }) => {
    const [newAddress, setNewAddress] = useState(initState);

    const handleChange = (e) => {
        console.log("e.target.name",e.target.name)
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (Object.values(newAddress).every(value => value.trim() !== '')) {
            onSave(newAddress);
            setNewAddress(initState); // Reset form
            onClose(); // Close modal
        } else {
            alert('Please fill out all the fields.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newAddress.name}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter street"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                            type='number'
                            name="phonenumber"
                            value={newAddress.phonenumber}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter Phone Number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address 1</label>
                        <input
                            type="text"
                            name="address1"
                            value={newAddress.address1}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter Address 1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address 2</label>
                        <input
                            type="text"
                            name="address2"
                            value={newAddress.address2}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter Address 2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Pin Code</label>
                        <Input
                            type="text"
                            name="pincode"
                            value={newAddress.pincode}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter Pin code"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input
                            type="text"
                            name="citystate"
                            value={newAddress.citystate}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter State"
                        />
                    </div>
                </form>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => {
                            onClose();
                            setNewAddress(initState);
                        }}
                        
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-500 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AddAddressPopup;
