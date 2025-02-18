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
    const [logInData, setLogInData] = useState('');
    const { sessionData,sessionBagData } = useSessionStorage();
    const [otpData, setOtpData] = useState(null);
    const [otp, setOtp] = useState('');
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const {checkAndCreateToast} = useSettingsContext();
    const continues = async () => {
        if (!logInData) {
            checkAndCreateToast("error",'Please enter a Valid LogIn Details');
            return;
        }
        try {
            const reponse = await dispatch(loginmobile({ logInData }));
            const{success,message,result} = reponse;
            if(success){
                setOtpData(result); // Assuming result means OTP is sent
                checkAndCreateToast("success","Otp sent successfully To Your Mail Id ")
            }else{
                checkAndCreateToast("error",message);
            }
        } catch (error) {
            checkAndCreateToast("error",'Failed to login');
            console.error("Failed to login ,",error);
        }
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleOtpVerify = async() => {
        // Assuming you verify OTP here (replace with actual verification logic)
        if(otpData){
            const response = await dispatch(loginVerify({phoneNumber:otpData.phoneNumber,otp:otp}))
            console.log("Verified OTP: ",response);
            const{success,message,result} = response;
            if(success && result){
                try {
                    await checkSavedWishListData();
                    await checkSavedBagData();
                } catch (error) {
                    console.error("Failed to check saved wish list data")
                }
                checkAndCreateToast("success",'Login Successful');
                setOtpData(null); // Clear OTP data after successful verification
                setOtp('');
                navigation('/');
            }else{
                checkAndCreateToast("error",message || "Verification Failed");
            }
        }
    };
    const checkSavedWishListData = async()=>{
        const wishListData = /* getLocalStorageWishListItem() */sessionData;
        console.log("After Login Wishlist data: ", wishListData);
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
        
        console.log("After Login Bag data: ", response);
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
            <div className="w-full h-screen bg-gray-300 flex items-center justify-center py-10">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]">
                    <div className="mx-auto w-full">
                        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login or Sign Up</h1>
    
                        <input
                            type="text"
                            name="logInData"
                            className="w-full p-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
                            onChange={(e) => setLogInData(e.target.value)}
                            placeholder="Enter Phone Number / Email"
                        />
                        <p id="error" className="text-xs text-black text-center mb-4"></p>
    
                        <h1 className="text-sm text-center mb-5">
                            By Continuing, I agree to the{' '}
                            <Link to="/tc"><span className="text-gray-600">Terms of Use</span> & </Link>
                            <Link to="/privacyPolicy"><span className="text-gray-600">Privacy Policy</span></Link>
                        </h1>
    
                        <button
                            type="submit"
                            onClick={continues}
                            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300 mb-4"
                        >
                            LOG IN
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
                        <div className="flex justify-center gap-4 mt-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                {/* <facebo className="text-gray-700 hover:text-blue-600 transition duration-300 text-xl" /> */}
                                <ImFacebook className="text-gray-700 hover:text-blue-600 transition duration-300 text-xl"/>
                            </a>
                            <a href="https://google.com" target="_blank" rel="noopener noreferrer">
                                {/* <FontAwesomeIcon icon={faGoogle} className="text-gray-700 hover:text-red-600 transition duration-300 text-xl" /> */}
                                <ImGoogle className="text-gray-700 hover:text-red-600 transition duration-300 text-xl" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                {/* <FontAwesomeIcon icon={faTwitter} className="text-gray-700 hover:text-blue-400 transition duration-300 text-xl" /> */}
                                <ImTwitter className="text-gray-700 hover:text-blue-400 transition duration-300 text-xl" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                {/* <FontAwesomeIcon icon={faInstagram} className="text-gray-700 hover:text-pink-600 transition duration-300 text-xl" /> */}
                                <ImInstagram className="text-gray-700 hover:text-pink-600 transition duration-300 text-xl" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* OTP Modal */}
            {otpData && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
                    <div className="bg-gradient-to-t from-gray-100 to-gray-300 p-8 rounded-lg shadow-2xl w-[90%] sm:w-[80%] md:w-[50%] max-w-md relative">
                        <h2 className="text-3xl font-bold text-center text-black mb-6">Enter OTP</h2>

                        <input
                            type="number"
                            maxLength={6}
                            className="w-full p-4 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-500 mb-6 text-lg text-gray-700 placeholder-gray-600 bg-gray-300"
                            onChange={handleOtpChange}
                            value={otp}
                            placeholder="Enter OTP"
                        />
                        <div className="flex justify-center items-center gap-4">
                            <button
                                className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-200"
                                onClick={handleOtpVerify}
                            >
                                Verify OTP
                            </button>
                        </div>
                        <X className="w-12 h-12 absolute  top-0 right-2 rounded-full p-3 text-xl font-semibold transition duration-200 cursor-pointer"
                            onClick={handleCloseOtpModal}
                        />
                    </div>
                </div>
            )}


        </Fragment>
    );
};

export default Login;
