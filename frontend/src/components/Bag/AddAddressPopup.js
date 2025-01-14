import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressForm } from '../../action/common.action';
import { removeSpaces } from '../../config';
import { Input, Button, FormControl, InputLabel, FormHelperText } from '@mui/material';

const AddAddressPopup = ({ isOpen, onClose, onSave }) => {
    const [formInitState, setFormInitState] = useState(null);
    const [newAddress, setNewAddress] = useState({});
    const { formData } = useSelector(state => state.fetchFormBanners);
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (Object.values(newAddress).every(value => value.trim() !== '')) {
            onSave(newAddress);
            setNewAddress(formInitState || {}); // Reset form
            onClose(); // Close modal
            setError(''); // Clear any previous errors
        } else {
            setError('Please fill out all the fields.');
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

    useEffect(() => {
        handleFormInit();
    }, [formData]);

    useEffect(() => {
        dispatch(fetchAddressForm());
    }, [dispatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 w-96 max-w-full mx-4 sm:mx-0">
                <h2 className="text-xl font-semibold mb-4 text-center">Add New Address</h2>
                <form className="space-y-4">
                    {formData && formData.map((item, index) => (
                        <Fragment key={index}>
                            <div>
                                <FormControl fullWidth error={error}>
                                    <InputLabel htmlFor={removeSpaces(item)}>{item}</InputLabel>
                                    <Input
                                        id={removeSpaces(item)}
                                        name={removeSpaces(item)}
                                        value={newAddress[removeSpaces(item)] || ''}
                                        onChange={handleChange}
                                        placeholder={`Enter ${removeSpaces(item)}`}
                                    />
                                    {error && (
                                        <FormHelperText>{error}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                        </Fragment>
                    ))}
                </form>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={() => {
                            onClose();
                            setNewAddress(formInitState || {}); // Reset form when closing
                            setError(''); // Reset error on cancel
                        }}
                        color="secondary"
                        className="px-4 py-2 bg-black rounded-md hover:bg-gray-600 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        color="primary"
                        className="px-4 py-2 bg-black rounded-md hover:bg-gray-600 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAddressPopup;
