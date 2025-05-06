import React, { Fragment, useEffect, useRef, useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { getuser, loginmobile, loginVerify } from '../../action/useraction';
import { Link, useNavigate } from 'react-router-dom';
import { addItemArrayBag, createAndSendProductsArrayWishList } from '../../action/orderaction';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { X } from 'lucide-react';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';
const Login = () => {
	const [otpArray, setOtpArray] = useState(new Array(6).fill(''));
	const inputsRef = useRef([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [loginInput, setLoginInput] = useState('');
	const [otpData, setOtpData] = useState(null);
	const [otp, setOtp] = useState('');

	const { sessionData, sessionBagData } = useSessionStorage();
	const { fetchWishList, fetchBag } = useServerWishList();
	const { user, checkAuthUser } = useServerAuth();
	const dispatch = useDispatch();
	const navigation = useNavigate();
	const { checkAndCreateToast } = useSettingsContext();

	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInput);
	const isPhone = /^[0-9]{10}$/.test(loginInput);

	const continues = async (event) => {
		event.preventDefault();
		setIsUpdating(true);

		if (!isEmail && !isPhone) {
			checkAndCreateToast("error", 'Enter a valid email or 10-digit phone number');
			setIsUpdating(false);
			return;
		}

		try {
			const response = await dispatch(
				loginmobile({
					LoginData: loginInput
					// phoneNumber: isPhone ? loginInput : null,
				})
			);

			const { success, message, result } = response;
			if (success) {
				setOtpData(result);
				checkAndCreateToast("success", "OTP sent successfully");
			} else {
				if (message === 'No User Found') {
					checkAndCreateToast("error", "Please Create an Account!", 1000);
					navigation('/registeruser');
					return;
				}
				checkAndCreateToast("error", message);
			}
		} catch (error) {
			checkAndCreateToast("error", 'Failed to login');
			console.error("Login error:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleOtpVerify = async (event) => {
		event.preventDefault();
		setIsUpdating(true);

		if (otpData) {
			const response = await dispatch(
				loginVerify({
					phoneNumber: otpData.phoneNumber,
					email: otpData.email,
					otp,
				})
			);

			const { success, message, result } = response;
			if (success && result) {
				try {
					await checkSavedWishListData();
					await checkSavedBagData();
				} catch (error) {
					console.error("Failed to sync saved data", error);
				} finally {
					setIsUpdating(false);
				}
				await checkAuthUser();
				checkAndCreateToast("success", 'Login Successful');
				setOtpData(null);
				setOtp('');
				if (sessionStorage.getItem("checkoutData")) {
					navigation('/bag/checkout/pending');
					return;
				}
				navigation(-1);
			} else {
				checkAndCreateToast("error", message || "Verification Failed");
				setIsUpdating(false);
			}
		} else {
			setIsUpdating(false);
		}
	};

	const checkSavedWishListData = async () => {
		const wishListData = sessionData.map(item => item?.productId?._id);
		if (wishListData.length > 0) {
			const response = await dispatch(createAndSendProductsArrayWishList(wishListData));
			if (response?.success) {
				localStorage.setItem("wishListItem", JSON.stringify([]));
				await fetchWishList();
			}
		}
	};

	const checkSavedBagData = async () => {
		const savedBagData = sessionBagData.map(item => ({
			productId: item.productId,
			size: item?.size,
			color: item?.color,
			quantity: item?.quantity,
			isChecked: item?.isChecked,
		}));
		if (savedBagData.length > 0) {
			const response = await dispatch(addItemArrayBag(savedBagData));
			if (response?.success) {
				localStorage.setItem("bagItem", JSON.stringify([]));
				await fetchBag();
			}
		}
	};

	const handleCloseOtpModal = () => {
		setOtpData(null);
		setOtp('');
	};

	useEffect(() => {
		if (user) {
			navigation(-1);
		}
	}, [user]);
	

	const handleOtpChange = (e, index) => {
		const value = e.target.value.replace(/\D/, ''); // Only allow digits
		if (value.length > 1) return;

		const updatedOtp = [...otpArray];
		updatedOtp[index] = value;
		setOtpArray(updatedOtp);

		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
			inputsRef.current[index - 1]?.focus();
		}
	};

	useEffect(() => {
		setOtp(otpArray.join(''));
	}, [otpArray]);

	return (
		<Fragment>
			<div className="w-full h-screen bg-gray-50 flex items-center justify-center py-16">
				<div className="bg-white w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] rounded-lg shadow-lg p-8">
					<form onSubmit={continues} className="mx-auto w-full">
						<h1 className="text-3xl font-semibold text-center mb-6">Login</h1>

						<input
							type="text"
							required
							value={loginInput}
							onChange={(e) => setLoginInput(e.target.value)}
							placeholder="Enter Email or Phone Number"
							className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
						/>

						<div className="text-sm text-center mb-6 text-gray-600">
							<span>By continuing, I agree to the </span>
							<Link to="/tc" target="_blank" className="text-gray-500 hover:underline">Terms of Use</Link> <span className='text-gray-600 mx-1'>&</span>
							<Link to="/privacyPolicy" target="_blank" className="text-gray-500 hover:underline">Privacy Policy</Link>
						</div>

						<button
							disabled={isUpdating}
							type="submit"
							className="w-full py-3 flex justify-center items-center bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300 mb-4"
						>
							{isUpdating ? (
								<div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin" />
							) : (
								<span>LOGIN</span>
							)}
						</button>

						<Link to="/registeruser" className="text-center block text-gray-400 font-semibold mt-4">
							Not Registered Yet? <span className="font-bold text-gray-700 hover:underline">Register</span>
						</Link>

						<div className="flex justify-center gap-6 mt-8">
							<ImFacebook className="text-gray-700 hover:text-blue-600 text-2xl cursor-pointer" />
							<ImGoogle className="text-gray-700 hover:text-red-600 text-2xl cursor-pointer" />
							<ImTwitter className="text-gray-700 hover:text-blue-400 text-2xl cursor-pointer" />
							<ImInstagram className="text-gray-700 hover:text-pink-600 text-2xl cursor-pointer" />
						</div>
					</form>
				</div>
			</div>

			{otpData && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-2">
					<form
					onSubmit={handleOtpVerify}
					className="bg-gradient-to-t from-gray-100 to-gray-300 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md relative overflow-y-auto max-h-[95vh]"
					>
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
						Enter OTP
					</h2>

					<div className="flex justify-between gap-2 sm:gap-3 mb-6">
						{otpArray.map((digit, idx) => (
							<input
								key={idx}
								ref={(el) => (inputsRef.current[idx] = el)}
								type="text"
								inputMode="numeric"
								maxLength="1"
								value={digit}
								onChange={(e) => handleOtpChange(e, idx)}
								onKeyDown={(e) => handleKeyDown(e, idx)}
								className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-base sm:text-lg border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
							/>
						))}
					</div>

					<div className="flex justify-center items-center gap-4">
						<button
							type="submit"
							className="w-full py-3 bg-gray-800 text-white flex font-semibold justify-center items-center text-center rounded-lg hover:bg-gray-900"
						>
							{isUpdating ? (
								<div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin" />
							) : (
								<span>Verify OTP</span>
							)}
						</button>
					</div>

					<X
						className="w-10 h-10 sm:w-12 sm:h-12 absolute top-2 right-2 p-2 cursor-pointer"
						onClick={handleCloseOtpModal}
					/>
					</form>
				</div>
				)}


		</Fragment>
	);
};

export default Login;
