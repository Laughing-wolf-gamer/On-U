import React, { useState, useEffect } from 'react';
import './Login.css';
import { clearErrors, registerUser } from '../../action/useraction';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { FormControl, Input, InputLabel } from '@mui/material';

const Registeruser = () => {
    const {checkAndCreateToast} = useSettingsContext();
	const[isUpdating,setIsUpdating] = useState(false);
    const navigation = useNavigate();
    const {  error, loading } = useSelector(state => state.Registeruser);
    const [name, setname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setgender] = useState('');
    const [email, setemail] = useState('');
    const dispatch = useDispatch();
    const onsubmit = async (e) => {
		setIsUpdating(true);
        e.preventDefault();
        if (!name ||!phoneNumber ||!gender ||!email) {
            checkAndCreateToast('error', 'All Fields are required!');
            return;
        }
		// Remove non-digit characters from phoneNumber
		const digitsOnly = phoneNumber.replace(/\D/g, '');

		// Check if the length is greater than 10
		if (digitsOnly.length !== 10) {
			// console.log("Phone number is greater than 10 digits.");
			checkAndCreateToast('error', 'Phone number should be 10 digits or fewer!');
			setIsUpdating(false);
			return;
		}
        const myForm = {
            phonenumber: phoneNumber,
            name: name,
            gender: gender,
            email: email,
        };
        const registerUserResponse = await dispatch(registerUser(myForm));
		setIsUpdating(false);
		const{user:ReceivedUser} = registerUserResponse;
		if(ReceivedUser){
			if(ReceivedUser.verify === 'verified'){
				checkAndCreateToast('success','You are Already Registered!');
				navigation('/Login');
				return;
			}
			navigation('/verifying',{state:{email:ReceivedUser.email,phoneNumber:ReceivedUser.phoneNumber}});
		}else{
			checkAndCreateToast('error','Failed to Register! Please try again');
		}
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
    }, [error, dispatch]);
    return (
		<form onSubmit={onsubmit}>
			<div className="w-full font-kumbsan min-h-screen bg-gray-100 py-10">
				<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl">
					<h1 className="text-center text-3xl font-semibold text-gray-700 mb-8">Register User</h1>
					<div className="space-y-6">
						{/* Email Input */}
						<FormControl className='justify-start w-full items-start flex flex-col space-y-1'>
							<InputLabel htmlFor='email' className="text-gray-700 font-semibold">Email</InputLabel>
							<Input
								type="email"
								name="email"
								required
								className="w-full p-4  mb-4"
								placeholder="E-Mail"
								onChange={(e) => setemail(e.target.value)}
							/>
						</FormControl>
						<FormControl className='justify-start w-full items-start flex flex-col space-y-1'>
							<InputLabel htmlFor='PhoneNumber' className="text-gray-700 font-semibold">Phone Number</InputLabel>
							{/* Phone Number Input */}
							<Input
								type="number"
								name="PhoneNumber"
								minLength={'10'}
								maxLength={'10'}
								required
								className="w-full p-4 mb-4"
								placeholder="Phone Number"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</FormControl>
						<FormControl className='justify-start w-full items-start flex flex-col space-y-1'>
							<InputLabel htmlFor='name' className="text-gray-700 font-semibold">Full Name</InputLabel>
							{/* Name Input */}
							<Input
								type="text"
								name="name"
								required
								className="w-full p-4 mb-4"
								placeholder="Full Name"
								value={name}
								onChange={(e) => setname(e.target.value)}
							/>
						</FormControl>

						{/* Gender Selection */}

						<div className="flex items-center space-x-8 mb-6">
							<label htmlFor='gender' className="text-gray-700 font-semibold">Gender</label>
							<div>
								<input
									type="radio"
									name="gender"
									value="Men"
									required
									className="accent-gray-500"
									onClick={() => setgender('men')}
								/>
								<span className="ml-2 text-gray-700">Men</span>
							</div>
							<div>
								<input
									type="radio"
									name="gender"
									value="Women"
									required
									className="accent-gray-500"
									onClick={() => setgender('women')}
								/>
								<span className="ml-2 text-gray-700">Women</span>
							</div>
						</div>

						{/* Submit Button */}
						<button
							disabled={isUpdating}
							type="submit"
							className="w-full items-center justify-center flex py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300"
						>
							{isUpdating ? (
								<div className="w-6 h-6 border-4 border-t-4 border-white border-t-purple-800 rounded-full animate-spin"></div>
							) : (
								<span>SUBMIT</span>
							)}
						</button>

						{/* Login Link */}
						<Link
							to="/Login"
							rel="noopener noreferrer"
							className="text-center block text-gray-400 font-semibold mt-4 "
						>
							Already have an account? <span className='font-bold text-gray-700 hover:underline'>LogIn</span>
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
					</div>
				</div>
			</div>
		</form>

    );
};

export default Registeruser;
