import React, { Fragment, useState, useEffect, useRef } from 'react'
import img from '../images/mobile-otp.png'
import './Login.css'
import { otpverifie, resendotp } from '../../action/useraction'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSettingsContext } from '../../Contaxt/SettingsContext'


const Otpverify = () => {
	const [otpArray, setOtpArray] = useState(new Array(6).fill(''));
	const inputsRef = useRef([]);
    const navigation = useNavigate()
    const dispatch = useDispatch()
	const[isUpdating,setIsUpdating] = useState(false);
    const { checkAndCreateToast } = useSettingsContext();
    const [otp, setotp] = useState('')
    const { user, error, loading } = useSelector(state => state.Registeruser)
    const { userVerify } = useSelector(state => state.userdetails)
	const location = useLocation();
	const {email:ReceivedUserEmail,phoneNumber:ReceivedUserPhoneNumber } = location.state;
    const continues = async (e) => {
		setIsUpdating(true);
        e.preventDefault();
        const response = await dispatch(otpverifie({ otp: otp, email: ReceivedUserEmail,phoneNumber:ReceivedUserPhoneNumber }))
		setIsUpdating(false);
		if(response?.success){
			checkAndCreateToast("success","Verification Successful")
			navigation('/');
		}else{
			checkAndCreateToast("error", 'invalid Otp')
		}
        if (error) {
            let par = document.getElementById('error')
            par.innerHTML = error
        }
		
    }

    const Resndotp = async () => {
		setIsUpdating(true);
        if (ReceivedUserEmail) {
            const response = await dispatch(resendotp({email: ReceivedUserEmail,phoneNumber:ReceivedUserPhoneNumber }))
            console.log("Otp Resend: ", response);
            if (!response.success) {
                checkAndCreateToast("error", 'invalid Otp')
                return
            }
            checkAndCreateToast("success", "Otp Successfully Resent");
        }else{
			checkAndCreateToast("error","otp Failed to Resent! no User found!")
		}
		setIsUpdating(false);
    }

	useEffect(()=>{
		if(!ReceivedUserPhoneNumber || !ReceivedUserEmail){
			navigation(-1);
		}
	},[location])
    useEffect(() => {
        if (userVerify) {
            if (userVerify.verify === "verified") {
                navigation('/')
            }
        }
    }, [userVerify, user, loading, navigation, checkAndCreateToast]);
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
		setotp(otpArray.join(''));
	}, [otpArray]);
    return (
        <div className='flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-t from-gray-100 to-gray-200 min-h-screen'>
			<form
				onSubmit={continues}
				className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8"
			>
				<div className='text-center'>
				<img src={img} alt="OTP Verification" className='w-20 sm:w-24 mx-auto' />
				
				<div className='mt-6'>
					<h1 className='text-xl sm:text-2xl font-semibold text-gray-800'>
					Verify With OTP
					</h1>
					<p className='text-sm text-gray-500 mb-4'>Sent to {ReceivedUserEmail}</p>

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
							className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-center text-base sm:text-lg border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
							/>
						))}
					</div>

					<button
					disabled={isUpdating}
					onClick={Resndotp}
					type="button"
					className='text-sm hover:underline text-gray-600 cursor-pointer hover:text-gray-800 mb-4'
					>
					Resend OTP
					</button>

					<button
					disabled={isUpdating || !otp}
					type='submit'
					className='bg-gray-600 flex justify-center items-center text-white w-full font-semibold text-lg py-3 mt-3 rounded-lg hover:bg-gray-700 transition duration-200'
					>
					{isUpdating ? (
						<div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin"></div>
					) : (
						<span>SUBMIT</span>
					)}
					</button>

					<p className='text-sm text-center mt-4'>
					Have trouble logging in?{" "}
					<Link to='/contact' className='text-gray-600 hover:text-gray-800 hover:underline'>
						Contact Us
					</Link>
					</p>
				</div>
				</div>
			</form>
			</div>

    )
}

export default Otpverify
