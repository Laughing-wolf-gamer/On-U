import { Input } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressForm } from '../../action/common.action';
import { removeSpaces } from '../../config';
/* const initState = {
    name:'',
    phonenumber: '',
    address1: '',
    address2: '',
    pincode: '',
    citystate: '',
} */
const AddAddressPopup = ({ isOpen, onClose, onSave }) => {
    const[formInitState, setFormInitState] = useState(null)
    const [newAddress, setNewAddress] = useState({});
    const{formData} = useSelector(state => state.fetchFormBanners)
    const dispatch = useDispatch()

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log("New Address: ",newAddress)
        // return;
        if (Object.values(newAddress).every(value => value.trim() !== '')) {
            onSave(newAddress);
            setNewAddress(formInitState || {}); // Reset form
            onClose(); // Close modal
        } else {
            alert('Please fill out all the fields.');
        }
    };
    const handleFormInit = () => {
        if (formData) {
            const formInit = {};
            formData.forEach(item => {
                // Remove spaces from the key (item)
                const key = removeSpaces(item); // Replace spaces with empty string
                formInit[key] = '';
            });
            setFormInitState(formInit);
        }
    }
    useEffect(()=>{
        handleFormInit();
    },[formData])
    useEffect(()=>{
        dispatch(fetchAddressForm())
    },[dispatch])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                <form className="space-y-4">
                    {formData &&
                        formData.map((item, index) => (
                            <Fragment key={index}>
                                <div>
                                    <label className="block text-sm font-medium mb-1">{item}</label>
                                    <input
                                        type="text"
                                        name={removeSpaces(item)}
                                        value={newAddress[removeSpaces(item)] || ''}
                                        onChange={handleChange}
                                        className="w-full border px-3 py-2 rounded"
                                        placeholder={`Enter ${removeSpaces(item)}`}
                                    />
                                </div>
                            </Fragment>
                        ))}
                </form>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => {
                            onClose();
                            setNewAddress(formInitState || {}); // Reset form when closing
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
