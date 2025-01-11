// src/components/PincodeChecker.js
import React, { useState } from "react";
import axios from "axios";

const PincodeChecker = () => {
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setPincode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/check-pincode", {
        pincode,
      });

      if (response.data.deliverable) {
        setMessage("Delivery is available for this pincode!");
      } else {
        setMessage("Sorry, delivery is not available for this pincode.");
      }
    } catch (error) {
      setMessage("An error occurred while checking delivery.");
    }
  };

  return (
    <div className="max-w-md p-6 bg-white h-fit">
      <h3 className="text-sm  font-thin text-left mb-4">Check Pincode for Delivery</h3>
      <form onSubmit={handleSubmit} className="space-x-4 justify-between items-center flex flex-row">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-800 rounded-md"
          maxLength="6"
        />
        <button
          type="submit"
          className="w-2/4 flex-wrap h- bg-black text-white p-2 rounded-md hover:bg-gray-800"
        >
          Check Delivery
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
    </div>
  );
};

export default PincodeChecker;
