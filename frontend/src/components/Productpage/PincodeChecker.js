import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import { useLocationContext } from "../../Contaxt/LocationContext";

const PincodeChecker = ({productId}) => {
    const{pincode,position,isPermissionGranted} = useLocationContext();
    const [customPincode, setCustomPincode] = useState("");
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        setCustomPincode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // console.log("Pincode: ",pincode, " is Proudct:",productId);
            const response = await axios.get(`${BASE_API_URL}/api/logistic/logistic/checkAvailability/${pincode}/${productId}`,);

            if (response.data.result) {
                console.log("Delivery is available!",response.data.result);
                const result = response.data.result;
                setMessage(`Delivery is available for this pincode Within ${result?.edd} days`);
            } else {
                setMessage("Sorry, delivery is not available for this pincode.");
            }
        } catch (error) {
            setMessage("An error occurred while checking delivery.");
        }
    };
    console.log("Position: ",position,"Pincode: ",pincode);
    return (
        <div className="max-w-sm p-2 bg-white h-fit">
            <h3 className="text-sm  font-thin text-left mb-4">Pincode</h3>
            <form onSubmit={handleSubmit} className="space-x-4 justify-between items-center flex flex-row">
                <input
                    type="number"
                    placeholder="Enter Pincode"
                    value={customPincode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-800 rounded-md"
                    maxLength="6"
                />
                <button
                    type="submit"
                    className="w-1/3 flex-wrap h-12 my-auto bg-black p-2 rounded-md hover:bg-gray-800"
                >
                    <span className="w-full h-full text-center text-white font-light text-xl">Check</span>
                </button>
            </form>
            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>
    );
};

export default PincodeChecker;
