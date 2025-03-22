import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddressForm } from '../../action/common.action';
import { capitalizeFirstLetterOfEachWord, removeSpaces } from '../../config';
import { Input, Button, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { X } from 'lucide-react';

const AddAddressPopup = ({ isOpen, onClose, onSave }) => {
    const [formInitState, setFormInitState] = useState(null);
    const [newAddress, setNewAddress] = useState({});
    const { formData } = useSelector(state => state.fetchFormBanners);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
	const{checkAndCreateToast} = useSettingsContext();

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
		console.log("Check New Address!",newAddress);
        if (Object.values(newAddress).every(value => value.trim() !== '')) {
			// Remove non-digit characters from phoneNumber
			const digitsOnly = newAddress['phoneNumber'].replace(/\D/g, '');

			// Check if the length is greater than 10
			if (digitsOnly.length !== 10) {
				// console.log("Phone number is greater than 10 digits.");
				checkAndCreateToast('error', 'Phone number should be 10 digits or fewer!');
				setError({errorTag:'phoneNumber',error:'Phone number should be 10 digits or fewer!'})
				return;
			}
			const pincodeDigistOnly = newAddress['pincode'].replace(/\D/g, '');
			if(pincodeDigistOnly.length !== 6){
				checkAndCreateToast('error', 'Pincode should be 6 digits!');
				setError({errorTag:'pincode',error:'Pincode should be 6 digits!'})
                return;
			}
            onSave(newAddress);
            setNewAddress(formInitState || {}); // Reset form
            onClose(); // Close modal
            setError(null); // Clear any previous errors
        } else {
            // setError('Please fill out all the fields.');
			checkAndCreateToast('error', 'Please fill out all the fields.');
            setError({errorTag:null,error:'Please fill out all the fields.'})
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
            <div className="bg-white p-6 w-96 max-w-full mx-4 sm:mx-0 relative">
                <h2 className="text-xl font-semibold mb-4 text-center">Add New Address</h2>
                <form className="space-y-4">
                    {formData && formData.map((item, index) => (
                        <Fragment key={index}>
                            <div>
                                <FormControl fullWidth error={error}>
                                    <InputLabel htmlFor={item}>{capitalizeFirstLetterOfEachWord(item)} <span className='text-gray-800 text-xs'>*</span></InputLabel>
                                    <Input
                                        id={removeSpaces(item)}
                                        name={removeSpaces(item)}
                                        value={newAddress[removeSpaces(item)] || ''}
										type={item === 'phoneNumber' || item === 'pincode' ? 'number' : 'text'}
                                        onChange={handleChange}
                                        placeholder={`Enter ${removeSpaces(item)}`}
                                    />
                                    {error && (
                                        <FormHelperText>{
											error.errorTag === item ? error.error :''
										}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                        </Fragment>
                    ))}
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
					<X/>
				</button>
            </div>
        </div>
    );
};

export default AddAddressPopup;
