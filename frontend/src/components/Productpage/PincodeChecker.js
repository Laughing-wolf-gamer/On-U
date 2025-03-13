import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import { useLocationContext } from "../../Contaxt/LocationContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";

const PincodeChecker = ({productId}) => {
    const{pincode,position,isPermissionGranted} = useLocationContext();
    const [message, setMessage] = useState("");
	const {checkAndCreateToast} = useSettingsContext();
    const [customPincode, setCustomPincode] = useState(pincode);
    const handleInputChange = (e) => {
        setCustomPincode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
			let currentPincode = pincode;
			if(customPincode) currentPincode = customPincode;
			if(!currentPincode){
				checkAndCreateToast('error','Please enter a valid pincode');
				return;
			}
            const response = await axios.get(`${BASE_API_URL}/api/logistic/checkPincode/?pincode=${currentPincode}&productId=${productId}`);
            if (response.data.result) {
                console.log("Delivery is available! ",response.data.result);
                const result = response.data.result;
                setMessage(`Delivery is available for this pincode Within ${result?.edd} days`);
            } else {
                setMessage("Sorry, delivery is not available for this pincode.");
            }
        } catch (error) {
            setMessage("Pincode not found!, Please try different PinCode and try again");
        }
    }
	useEffect(()=>{
		if(pincode){
			// setMessage(`Delivery is available for this pincode Within days`);
            setCustomPincode(pincode);
            console.log("Pincode is set from context: ",position);
		}
	},[pincode])
    return (
        <div className="max-w-sm w-full p-4 bg-white">
		<h3 className="text-xl font-semibold text-gray-800 mb-4">Pincode</h3>
		
		<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
			<input
				type="number"
				placeholder="Enter Pincode"
				value={customPincode}
				onChange={handleInputChange}
				className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
				maxLength="6"
			/>
			
			<button
				type="submit"
				className="w-full sm:w-1/3 h-12 bg-black text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
			>
			Check
			</button>
		</form>
		
		{message && <p className="mt-4 text-center text-gray-600 text-sm">{message}</p>}
		</div>

    );
};

export default PincodeChecker;
