import React, { Fragment, useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { loginmobile, loginVerify } from '../../action/useraction';
import { Link, useNavigate } from 'react-router-dom';
import { addItemArrayBag, createAndSendProductsArrayWishList } from '../../action/orderaction';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { X } from 'lucide-react';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
const Login = () => {
	const[isUpdating,setIsUpdating] = useState(false);
    const [logInEmail, setLogInEmail] = useState('');
    const { sessionData,sessionBagData } = useSessionStorage();
    const [otpData, setOtpData] = useState(null);
    const [otp, setOtp] = useState('');
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const {checkAndCreateToast} = useSettingsContext();


    const continues = async (event) => {
		event.preventDefault();
		setIsUpdating(true);
        if (!logInEmail) {
            checkAndCreateToast("error",'Please enter a Valid LogIn Details');
			setIsUpdating(false);
            return;
        }
        try {
            const response = await dispatch(loginmobile({logInEmail}));
			console.log("Login Check Result: ",response);
            const{success,message,result} = response;
            if(success){
                setOtpData(result); // Assuming result means OTP is sent
                checkAndCreateToast("success","Otp sent successfully To Your E-Mail Id")
            }else{
				if(message === 'No User Found'){
					checkAndCreateToast("error","Please Create a Account!",1000);
					navigation('/registeruser');
					return;
				}
                checkAndCreateToast("error",message);
            }
        } catch (error) {
            checkAndCreateToast("error",'Failed to login');
            console.error("Failed to login ,",error);
        }finally{
			setIsUpdating(false);
		}
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleOtpVerify = async(event) => {
		event.preventDefault();
		setIsUpdating(true);
        if(otpData){
            const response = await dispatch(loginVerify({phoneNumber:otpData.phoneNumber,email:otpData.email,otp:otp}))
            const{success,message,result} = response;
            if(success && result){
                try {
                    await checkSavedWishListData();
                    await checkSavedBagData();
                } catch (error) {
                    console.error("Failed to check saved wish list data")
                }finally{
					setIsUpdating(false);
				}
                checkAndCreateToast("success",'Login Successful');
                setOtpData(null); // Clear OTP data after successful verification
                setOtp('');
                navigation('/');
            }else{
                checkAndCreateToast("error",message || "Verification Failed");
				setIsUpdating(false);
            }
        }else{
			setIsUpdating(false);
		}
    };
    const checkSavedWishListData = async()=>{
        const wishListData = sessionData;
        if(wishListData){
            const response = dispatch(createAndSendProductsArrayWishList(wishListData));
            if(response){
                if(response.success){
                    // sessionStorage.setItem("bagItem", JSON.stringify([]));
                    sessionStorage.setItem("wishListItem", JSON.stringify([]));
                }
            }
        }
    }
    const checkSavedBagData = async()=>{
        const savedBagData = sessionBagData;
        const response = await dispatch(addItemArrayBag(savedBagData));        
        if(response && response.success){
            sessionStorage.setItem("bagItem", JSON.stringify([]));
        }
    }
    const handleCloseOtpModal = () => {
        setOtpData(false);
        setOtp('');
    };
    return (
		<Fragment>
			<div className="w-full h-screen bg-gray-50 flex items-center justify-center py-16">
				<div className="bg-white w-full sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] rounded-lg shadow-lg p-8">
					<form onSubmit={continues} className="mx-auto w-full">
						<h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login or Sign Up</h1>
						<input
							type="email"
							required
							name="logInData"
							className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
							onChange={(e) => setLogInEmail(e.target.value)}
							placeholder="Enter Your Email"
						/>
						<div className="text-sm text-center mb-6 text-gray-600">
							<span>By Continuing, I agree to the{' '}</span>
							<Link to="/tc"><span className="text-gray-500">Terms of Use</span> & </Link>
							<Link to="/privacyPolicy"><span className="text-gray-500">Privacy Policy</span></Link>
						</div>

						<button
							disabled={isUpdating}
							type="submit"
							onClick={continues}
							className="w-full py-3 items-center justify-center flex bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300 mb-4"
						>
							{isUpdating ? (
								<div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin"></div>
							) : (
								<span>LOGIN</span>
							)}
						</button>

						<Link
							to="/registeruser"
							className="text-center text-gray-500 font-bold hover:underline block"
						>
							<h1 className="text-sm">
								No Account? <span className="text-gray-500">Register User</span>
							</h1>
						</Link>

						{/* Social Media Links */}
						<div className="flex justify-center gap-6 mt-8">
							<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
								<ImFacebook className="text-gray-700 hover:text-blue-600 transition duration-300 text-2xl" />
							</a>
							<a href="https://google.com" target="_blank" rel="noopener noreferrer">
								<ImGoogle className="text-gray-700 hover:text-red-600 transition duration-300 text-2xl" />
							</a>
							<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
								<ImTwitter className="text-gray-700 hover:text-blue-400 transition duration-300 text-2xl" />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
								<ImInstagram className="text-gray-700 hover:text-pink-600 transition duration-300 text-2xl" />
							</a>
						</div>
					</form>
				</div>
			</div>

			{/* OTP Modal */}
			{otpData && (
				<div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
					<form onSubmit={handleOtpVerify} className="bg-gradient-to-t from-gray-100 to-gray-300 p-8 rounded-lg shadow-2xl w-[90%] sm:w-[80%] md:w-[50%] max-w-md relative">
						<h2 className="text-3xl font-bold text-center text-black mb-6">Enter OTP</h2>

						<input
							type="number"
							required
							maxLength={6} // Set the max character limit to 6
							className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-400 mb-6 text-lg text-gray-700 placeholder-gray-600 bg-gray-200"
							onChange={handleOtpChange}
							value={otp}
							placeholder="Enter OTP"
						/>

						<div className="flex justify-center items-center gap-4">
							<button
								className="w-full py-3 justify-center items-center flex bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-200"
								onClick={handleOtpVerify}
							>
								{isUpdating ? (
									<div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin"></div>
								) : (
									<span>Verify OTP</span>
								)}
							</button>
						</div>

						<X
							className="w-12 h-12 absolute top-0 right-2 rounded-full p-3 text-xl font-semibold transition duration-200 cursor-pointer"
							onClick={handleCloseOtpModal}
						/>
					</form>
				</div>
			)}
		</Fragment>
	);

};

export default Login;
