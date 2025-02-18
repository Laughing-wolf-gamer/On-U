import React, { Fragment, useState, useEffect } from 'react'
import img from '../images/mobile-otp.png'
import './Login.css'
import { otpverifie, resendotp } from '../../action/useraction'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSettingsContext } from '../../Contaxt/SettingsContext'

const Otpverify = () => {
    const navigation = useNavigate()
    const { checkAndCreateToast } = useSettingsContext();
    const [otp, setotp] = useState('')
    const dispatch = useDispatch()
    const { user, error, loading } = useSelector(state => state.Registeruser)
    const { userVerify } = useSelector(state => state.userdetails)

    const H = window.innerHeight
    const Hpx = H - 56

    const continues = async (e) => {
        e.preventDefault();
        console.log(otp, userVerify)

        const response = await dispatch(otpverifie({ otp: otp, mobileno: user?.user?.phoneNumber }))
		console.log("Resending Otp: ", response);
		if(response?.success){
			checkAndCreateToast("success","Verification Successfull")
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
        if (user) {
            console.log("Resending Otp: ", user?.user);
            const response = await dispatch(resendotp({ email: user?.user.email }))
            if (!response.payload?.success) {
                checkAndCreateToast("error", 'invalid Otp')
                return
            }
            checkAndCreateToast("success", "Otp Successfully Resent");
        }
    }

    useEffect(() => {
        if (userVerify) {
            if (userVerify.verify === "verified") {
                navigation('/')
            }
        }
    }, [userVerify, user, loading, navigation, checkAndCreateToast]);

    console.log("User: ", user)
    console.log("Verifying User: ", userVerify)

    return (
        <div className='flex flex-col items-center py-10 bg-gradient-to-t from-gray-100 to-gray-200 min-h-screen'>
            <form
                encType="multipart/form-data"
                onSubmit={continues}
                className="w-full sm:w-[430px] bg-white rounded-lg shadow-lg p-8"
            >
                <div className='text-center'>
                    <img src={img} alt="OTP Verification" className='w-24 mx-auto' />
                    <div className='mt-6'>
                        <h1 className='text-2xl font-semibold text-gray-800'>Verify With OTP</h1>
                        <p className='text-sm text-gray-500 mb-4'>Sent to {user?.user?.email}</p>

                        <input 
                            type="number" 
                            name="phonenumber" 
                            className='w-full h-12 border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500'
                            onChange={(e) => setotp(e.target.value)} 
                            placeholder='Enter OTP' 
                        />
                        <p id='error' className='text-xs text-red-500'></p>

                        <h1 
                            onClick={Resndotp} 
                            className='text-sm text-gray-600 cursor-pointer hover:text-gray-800'>
                            Resend OTP
                        </h1>

                        <button 
                            type='submit' 
                            className='bg-gray-600 text-white w-full font-semibold text-lg py-3 mt-5 rounded-lg hover:bg-gray-700 transition duration-200'
                        >
                            {!loading ? 'VERIFY' : 'Loading...'}
                        </button>

                        <h1 className='text-sm text-center mt-4'>
                            Have trouble logging in? <span className='text-gray-600 hover:text-gray-800 cursor-pointer'>Get help</span>
                        </h1>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Otpverify
