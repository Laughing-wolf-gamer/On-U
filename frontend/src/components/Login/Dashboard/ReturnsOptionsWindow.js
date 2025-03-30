import { FormControl, Input, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { useSettingsContext } from "../../../Contaxt/SettingsContext";
import { X } from "lucide-react";

const ReturnsOptionsWindow = ({ OnSubmit,OnClose }) => {
	const{checkAndCreateToast} = useSettingsContext();
	const [paymentOption, setPaymentOption] = useState("Bank"); // To track selected payment option
	const [formData, setFormData] = useState({
		bankAccountNumber: "",
		confirmBankAccountNumber: "",
		ifscCode: "",
		phoneNumber: "",
		bankName: "",
		upiId: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const validateUpiId = (upiId) => {
		const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
		return upiRegex.test(upiId);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if(paymentOption === 'Bank'){
			if (formData.bankAccountNumber !== formData.confirmBankAccountNumber) {
				checkAndCreateToast("error", "Bank account numbers do not match.");
				return;
			}
		}else{
			if(!validateUpiId(formData.upiId)){
				checkAndCreateToast("error", "Please Enter a Valid UPI ID.");
                return;
			}
		}
		const digitsOnly = formData.phoneNumber.replace(/\D/g, '');

		// Check if the length is greater than 10
		if (digitsOnly.length !== 10) {
			checkAndCreateToast('error', 'Phone number should be 10 digits!');
			return;
		}
		OnSubmit(formData); // Calling the OnSubmit function with form data
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg w-96 max-h-[120vw] overflow-y-auto shadow-lg">
				<div className="w-full bg-black justify-center flex relative items-center shadow-md p-4 rounded-lg">
					<h2 className="text-xl text-center text-white font-semibold">Select Refund Options</h2>
					<button
						onClick={OnClose}
						className="absolute top-2 right-2 text-white hover:text-gray-400"
					>
						<X size={20} />
					</button>
				</div>

				<ReturnDataSwitch defaultValue={paymentOption} OnRefundModeSet={(mode)=> setPaymentOption(mode)}/>

				{paymentOption === "Bank" && (
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="bankAccountNumber">Bank Account Number</InputLabel>
							<Input
								type="password"
								name="bankAccountNumber"
								id="bankAccountNumber"
								placeholder="Enter Bank Account Number"
								value={formData.bankAccountNumber}
								onChange={handleChange}
								required
							/>
						</FormControl>

						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="confirmBankAccountNumber">Confirm Bank Account Number</InputLabel>
							<Input
								type="password"
								name="confirmBankAccountNumber"
								id="confirmBankAccountNumber"
								placeholder="Confirm Your Bank Account Number"
								value={formData.confirmBankAccountNumber}
								onChange={handleChange}
								required
							/>
						</FormControl>

						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="ifscCode">IFSC Code</InputLabel>
							<Input
								type="text"
								name="ifscCode"
								id="ifscCode"
								placeholder="Enter your Bank IFSC Code"
								value={formData.ifscCode}
								onChange={handleChange}
								required
							/>
						</FormControl>

						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
							<Input
								type="number"
								name="phoneNumber"
								id="phoneNumber"
								placeholder="Enter phone number Linked to your account"
								value={formData.phoneNumber}
								onChange={handleChange}
								required
							/>
						</FormControl>

						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="bankAccountName">Bank Account Name</InputLabel>
							<Input
								type="text"
								name="bankAccountName"
								id="bankAccountName"
								placeholder="Enter Your Bank Account Name"
								value={formData.bankName}
								onChange={handleChange}
								required
							/>
						</FormControl>
					</form>
				)}

				{paymentOption === "UPI" && (
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
							<Input
								type="number"
								name="phoneNumber"
								id="phoneNumber"
								placeholder="Enter You Phone number"
								value={formData.phoneNumber}
								onChange={handleChange}
								required
							/>
						</FormControl>
						<FormControl fullWidth variant="outlined" className="mb-4">
							<InputLabel htmlFor="upiId" className="block font-medium text-gray-700">UPI ID</InputLabel>
							<Input
								type="email"
								name="upiId"
								id="upiId"
								value={formData.upiId}
								onChange={handleChange}
								required
							/>
						</FormControl>
					</form>
				)}

				<button
					onClick={handleSubmit}
					className={`mt-6 w-full z-30 text-center ${window.screen.width > 1024  ? "":"sticky bottom-[-20px]"} px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition duration-300`}
				>
					Submit
				</button>
			</div>
		</div>
	);
};
const ReturnDataSwitch = ({defaultValue ='', OnRefundModeSet }) => {
	const [refundMethod, setRefundMethod] = useState(defaultValue || "Bank");

	const handleToggle = () => {
		const newPaymentMethod = refundMethod === 'Bank' ? 'UPI' : 'Bank';
		setRefundMethod(newPaymentMethod);
		OnRefundModeSet(newPaymentMethod);
	};

	return (
		<div className="space-y-6 p-6 max-w-sm mx-auto bg-white rounded-xl">
			<div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 space-y-4 md:space-y-0">
				{/* Prepaid Label */}
				<div
					className={`px-7 max-w-md py-2 rounded-md text-center ${
						refundMethod === 'Bank' 
						? 'font-semibold bg-black text-white' 
						: 'font-normal border border-black text-black'
					}`}
				>
					Bank
				</div>

				{/* Switch toggle */}
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={refundMethod === 'UPI'}
						onChange={handleToggle}
						className="sr-only"
					/>
					<div className="md:w-12 md:h-6 w-6 h-12 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out">
						<div
						className={`w-6 h-6 bg-black rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
							refundMethod === 'UPI' ? 'md:translate-x-6 md:translate-y-0 translate-x-0 translate-y-6' : 'md:translate-x-0 translate-x-0 translate-y-0'
						}`}
						></div>
					</div>
				</label>

				{/* COD Label */}
				<div
					className={`px-7 max-w-md py-2 rounded-md text-center ${
						refundMethod === 'UPI' 
						? 'font-semibold bg-black text-white' 
						: 'font-normal border border-black text-black'
					}`}
				>
					UPI
				</div>
			</div>
		</div>
	);
};

export default ReturnsOptionsWindow;