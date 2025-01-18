import React, { Fragment, useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginmobile, loginVerify } from '../../action/useraction';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';

const Login = () => {
  const [logInData, setLogInData] = useState('');
  const [otpData, setOtpData] = useState(null);
  const [otp, setOtp] = useState('');
  const Redirect = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginuser);
  const Alert = useAlert();
  let par = document.getElementById('error');

  const continues = async () => {
    if (!logInData) {
      Alert.error('Please enter a Valid LogIn Details');
      return;
    }
    try {
      const reponse = await dispatch(loginmobile({ logInData }));
      const{success,message,result} = reponse;
      if(success){
        setOtpData(result); // Assuming result means OTP is sent
        Alert.info("Otp sent successfully To Your Mail Id ")
      }else{
        Alert.error(message);
      }
    } catch (error) {
      Alert.error('Failed to login');
      console.error(error);
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
        Alert.success('Login Successful');
        setOtpData(null); // Clear OTP data after successful verification
        setOtp('');
        Redirect('/');
      }else{
        Alert.error(message || "Verification Failed");
      }
    }
  };

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
              <Link to="/tc"><span className="text-gray-600">Terms of Use</span> &{' '}</Link>
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
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {otpData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
          <div className="bg-white p-8 rounded-xl shadow-xl w-[90%] sm:w-[80%] md:w-[60%] max-w-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Enter OTP</h2>

            <input
              type="number"
              maxLength={6}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-400 mb-4 text-lg placeholder-gray-400"
              onChange={handleOtpChange}
              value={otp}
              placeholder="Enter OTP"
            />
            <div className="flex justify-between gap-4">
              <button
                className="w-[48%] py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
                onClick={handleOtpVerify}
              >
                Verify OTP
              </button>
              <button
                className="w-[48%] py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
                onClick={handleCloseOtpModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Login;
