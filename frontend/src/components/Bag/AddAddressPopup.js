import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressForm } from '../../action/common.action';
import { capitalizeFirstLetterOfEachWord, removeSpaces } from '../../config';
import { Input, Button, FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { X } from 'lucide-react';
import axios from 'axios';

const AddAddressPopup = ({ isOpen, onClose, onSave }) => {
    const [formInitState, setFormInitState] = useState(null);
    const [newAddress, setNewAddress] = useState({});
    const { formData } = useSelector(state => state.fetchFormBanners);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
	const { checkAndCreateToast } = useSettingsContext();

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Automatically fetch state and country based on pincode
        if (name === 'pincode' && value.length === 6) {
            fetchStateAndCountry(value);
        }
    };

    // Fetch state and country based on pincode
    const fetchStateAndCountry = async (pincode) => {
        try {
            // Assuming we have an API that returns state and country for a given pincode
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
			const responseData = response.data.length > 0 ? response.data[0] : null;
			if(!responseData) throw new Error("Invalid Pincode");
			if(responseData?.PostOffice.length === 0) throw new Error("Invalid Pincode");
            const data = responseData?.PostOffice[0];
			console.log("Country Data: ",data);

            if (data && data.State && data.Country && data.District) {

				handleChange({ target: { name: 'state', value: data.State } });
				handleChange({ target: { name: 'City', value: data.District} });
                // setState(data.State);
                // setCountry(data.Country);
				handleChange({ target: { name: 'country', value: data.Country } });
                setError(null); // Clear any previous errors
            } else {
                checkAndCreateToast('error', 'Invalid Pincode');
                setError({ errorTag: 'pincode', error: 'Invalid Pincode' });
            }
        } catch (error) {
			console.error("Error fetching state and country:", error);
            checkAndCreateToast('error', 'Failed to fetch state and country');
        }
    };

    const handleSave = () => {
        if (Object.values(newAddress).every(value => value.trim() !== '')) {
            if (newAddress['address1'].length > 30) {
                checkAndCreateToast('error', 'Address should be less than 30 Characters!');
                setError({ errorTag: 'address1', error: 'Address should be less than 30 Characters!' });
                return;
            }
            if (newAddress['address2'].length > 30) {
                checkAndCreateToast('error', 'Address should be less than 30 Characters!');
                setError({ errorTag: 'address2', error: 'Address should be less than 30 Characters!' });
                return;
            }

            const digitsOnly = newAddress['phoneNumber'].replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                checkAndCreateToast('error', 'Phone number should be 10 digits!');
                setError({ errorTag: 'phoneNumber', error: 'Phone number should be 10 digits!' });
                return;
            }

            const pincodeDigitsOnly = newAddress['pincode'].replace(/\D/g, '');
            if (pincodeDigitsOnly.length !== 6) {
                checkAndCreateToast('error', 'Pincode should be 6 digits!');
                setError({ errorTag: 'pincode', error: 'Pincode should be 6 digits!' });
                return;
            }

            // Add state and country to the newAddress object before saving
            onSave(newAddress);
            setNewAddress(formInitState || {}); // Reset form
            onClose(); // Close modal
            setError(null); // Clear any previous errors
        } else {
            checkAndCreateToast('error', 'Please fill out all the fields.');
            setError({ errorTag: null, error: 'Please fill out all the fields.' });
        }
    };

    const handleFormInit = () => {
        if (formData) {
            const formInit = {};
            formData.forEach(item => {
                const key = removeSpaces(item); // Replace spaces with empty string
                formInit[key] = '';
            });
            setFormInitState(formInit);
        }
    };

    useEffect(() => {
        handleFormInit();
    }, [formData]);

    useEffect(() => {
        dispatch(fetchAddressForm());
    }, [dispatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 w-96 max-w-full mx-4 sm:mx-0 relative max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-600">
                <h2 className="text-xl font-semibold mb-4 text-center">Add New Address</h2>
                <form className="space-y-4">
                    {formData && formData.map((item, index) => (
                        <form onSubmit={handleSave} key={index}>
							<FormControl fullWidth>
								<InputLabel htmlFor={item}>{capitalizeFirstLetterOfEachWord(item)} <span className='text-gray-800 text-xs'>*</span></InputLabel>
								<Input
									id={removeSpaces(item)}
									name={removeSpaces(item)}
									value={newAddress[removeSpaces(item)] || ''}
									type={item === 'phoneNumber' || item === 'pincode' ? 'number' : 'text'}
									onChange={handleChange}
									placeholder={`Enter ${removeSpaces(item)}`}
									maxLength={'30'}
								/>
							</FormControl>
                        </form>
                    ))}

                    {/* State and Country Fields */}
                   {/*  <FormControl fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            label="State"
                            disabled
                        >
                            <MenuItem value={state}>{state}</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Country</InputLabel>
                        <Select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            label="Country"
                            disabled
                        >
                            <MenuItem value={country}>{country}</MenuItem>
                        </Select>
                    </FormControl> */}

                </form>
                <button
                    onClick={handleSave}
                    color="primary"
                    className="px-4 py-2 bg-black w-full flex text-center mt-2 items-center justify-center rounded-md hover:bg-gray-600 text-white"
                >
                    Save
                </button>
                <button
                    onClick={() => {
                        onClose();
                        setNewAddress(formInitState || {}); // Reset form when closing
                        setError(null); // Reset error on cancel
                    }}
                    color="secondary"
                    className="p-2 rounded-full absolute top-2 right-2 items-center justify-center text-black"
                >
                    <X />
                </button>
            </div>
        </div>
    );
};

export default AddAddressPopup;
