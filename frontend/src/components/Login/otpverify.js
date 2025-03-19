import React, { Fragment, useState, useEffect } from 'react'
import img from '../images/mobile-otp.png'
import './Login.css'
import { otpverifie, resendotp } from '../../action/useraction'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSettingsContext } from '../../Contaxt/SettingsContext'

const Otpverify = () => {
    const navigation = useNavigate()
    const dispatch = useDispatch()
	const[isUpdating,setIsUpdating] = useState(false);
    const { checkAndCreateToast } = useSettingsContext();
    const [otp, setotp] = useState('')
    const { user, error, loading } = useSelector(state => state.Registeruser)
    const { userVerify } = useSelector(state => state.userdetails)
	const location = useLocation();
	const { email:ReceivedUserEmail,phoneNumber:ReceivedUserPhoneNumber } = location.state;
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
            const response = await dispatch(resendotp({email: ReceivedUserEmail }))
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


    useEffect(() => {
        if (userVerify) {
            if (userVerify.verify === "verified") {
                navigation('/')
            }
        }
    }, [userVerify, user, loading, navigation, checkAndCreateToast]);
    return (
        <div className='flex flex-col items-center py-10 bg-gradient-to-t from-gray-100 to-gray-200 min-h-screen'>
            <form
                onSubmit={continues}
                className="w-full sm:w-[430px] bg-white rounded-lg shadow-lg p-8"
            >
                <div className='text-center'>
                    <img src={img} alt="OTP Verification" className='w-24 mx-auto' />
                    <div className='mt-6'>
                        <h1 className='text-2xl font-semibold text-gray-800'>Verify With OTP</h1>
                        <p className='text-sm text-gray-500 mb-4'>Sent to {ReceivedUserEmail}</p>

                        <input 
							type="number" 
							name="otp"
							required
							maxLength={6} // Set the max character limit to 6
							className='w-full h-12 border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500'
							onChange={(e) => setotp(e.target.value)} 
							placeholder='Enter OTP'
						/>

                        <button
							disabled = {isUpdating}
                            onClick={Resndotp} 
                            className='text-sm hover:underline text-gray-600 cursor-pointer hover:text-gray-800'>
                            Resend OTP
                        </button>

                        <button
							disabled = {isUpdating || !otp}
                            type='submit' 
                            className='bg-gray-600 justify-center items-center flex text-white w-full font-semibold text-lg py-3 mt-5 rounded-lg hover:bg-gray-700 transition duration-200'
                        >
                            {isUpdating ? <div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin"></div> : <span>SUBMIT</span>}
                        </button>

                        <h1 className='text-sm text-center mt-4'>
                            Have trouble logging in? <Link to={'/contact'} className='text-gray-600 hover:text-gray-800 hover:underline cursor-pointer'>Contact Us</Link>
                        </h1>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Otpverify
