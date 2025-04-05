import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import { useLocationContext } from "../../Contaxt/LocationContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";
import { Input } from "@mui/material";

const PincodeChecker = ({productId}) => {
    const { pincode, position, isPermissionGranted } = useLocationContext();
    const [message, setMessage] = useState("");
    const { checkAndCreateToast } = useSettingsContext();
    const [customPincode, setCustomPincode] = useState(pincode);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setCustomPincode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form submission on Enter key press
        setIsLoading(true);

        try {
            let currentPincode = pincode;
            if (customPincode) currentPincode = customPincode;
            if (!currentPincode) {
                checkAndCreateToast("error", "Please enter a valid pincode");
                return;
            }
            const pincodeDigistOnly = currentPincode.replace(/\D/g, "");
            if (pincodeDigistOnly.length !== 6) {
                checkAndCreateToast("error", "Pincode should be 6 digits!");
                return;
            }

            const response = await axios.get(
                `${BASE_API_URL}/api/logistic/checkPincode/?pincode=${currentPincode}&productId=${productId}`
            );
            if (response.data.result) {
                const result = response.data.result;
                setMessage(`Delivery is available for this pincode within ${result?.edd} days`);
            } else {
                setMessage("Sorry, delivery is not available for this pincode.");
            }
        } catch (error) {
            setMessage("Pincode not found! Please try a different Pincode and try again");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pincode && isPermissionGranted) {
            setCustomPincode(pincode);
        }
    }, [pincode]);

    return (
        <div className="max-w-sm w-full p-4 bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pincode</h3>

            <form onSubmit={handleSubmit} className="flex justify-center flex-row items-center gap-2">
                <Input
                    type="number"
                    placeholder="Enter Pincode"
					required
                    value={customPincode || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                    maxLength={"6"}
                    onFocus={(e) => e.preventDefault()} // Prevent form submission on focus
                />
                
                <button
                    type="submit"
                    className="w-20 justify-center items-center flex sm:w-1/3 h-12 bg-black text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-t-4 border-white border-t-gray-800 rounded-full animate-spin"></div>
                    ) : (
                        <span>Check</span>
                    )}
                </button>
            </form>

            {message && <p className="mt-4 text-left text-gray-600 text-sm">{message}</p>}
        </div>
    );
};

export default PincodeChecker;
