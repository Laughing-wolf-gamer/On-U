import React, { Fragment, useState, useEffect } from 'react';
import './Login.css';
import { clearErrors, registerUser } from '../../action/useraction';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import GoogleLogin from 'react-google-login';
import { useAlert } from 'react-alert';
import { fetchAddressForm } from '../../action/common.action';
import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { removeSpaces } from '../../config';

const Registeruser = () => {
    const Alert = useAlert();
    const redirect = useNavigate();
    const { formData } = useSelector(state => state.fetchFormBanners);
    const { user, error, loading } = useSelector(state => state.Registeruser);
    const [name, setname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setgender] = useState('');
    const [email, setemail] = useState('');
    const [newAddress, setNewAddress] = useState({});
    // const [address1, setaddress1] = useState('');
    // const [address2, setaddress2] = useState('');
    // const [citysate, setcitysate] = useState('');
    // const [pincode, setpincode] = useState('');
    const dispatch = useDispatch();

    const signin_google = (response) => {
        // Handle Google Sign-In (optional)
    };

    const onsubmit = async (e) => {
        e.preventDefault();
        const myForm = {
            phonenumber: phoneNumber,
            name: name,
            gender: gender,
            email: email,
            address:newAddress
        };
        await dispatch(registerUser(myForm));
    };
    const handleChangeAddressData = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        if (user) {
            Alert.success('Otp Sent To Your EmailID');
            redirect('/verifying');
        }
        dispatch(fetchAddressForm());
    }, [error, user, dispatch]);
    console.log("address form. ", formData);
    return (
        <Fragment>
            <form onSubmit={(e) => onsubmit(e)}>
                <div className="w-full min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-10">
                    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-center text-3xl font-semibold text-gray-700 mb-8">Register New User</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="PhoneNumber"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <input
                                type="text"
                                name="name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                            />

                            <div className="flex items-center space-x-6 mb-5">
                                <label className="text-gray-700 font-semibold">Gender</label>
                                <div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Men"
                                        className="accent-pink-500"
                                        onClick={() => setgender('men')}
                                    />
                                    <span className="ml-2 text-gray-700">Men</span>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Women"
                                        className="accent-pink-500"
                                        onClick={() => setgender('women')}
                                    />
                                    <span className="ml-2 text-gray-700">Women</span>
                                </div>
                            </div>

                            <input
                                type="text"
                                name="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="E-Mail (Optional)"
                                onChange={(e) => setemail(e.target.value)}
                            />

                            <div className="flex items-center justify-center my-4">
                                <GoogleLogin
                                    clientId="667896313498-k77vitq087j4jhfne9fnd7i31abf2ok1.apps.googleusercontent.com"
                                    buttonText="Sign Up with Google"
                                    icon={<FcGoogle />}
                                    onSuccess={signin_google}
                                    onFailure={signin_google}
                                    cookiePolicy="single_host_origin"
                                    className="w-full text-gray-800 border-2 border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 transition-colors"
                                />
                            </div>
                            <h1>Add Address Data: </h1>
                            {formData && formData.map((item, index) => (
                                <Fragment key={index}>
                                    <div>
                                        <FormControl fullWidth error={error}>
                                            <InputLabel htmlFor={removeSpaces(item)}>{item}</InputLabel>
                                            <Input
                                                id={removeSpaces(item)}
                                                name={removeSpaces(item)}
                                                value={newAddress[removeSpaces(item)] || ''}
                                                onChange={handleChangeAddressData}
                                                placeholder={`Enter ${removeSpaces(item)}`}
                                            />
                                            {error && (
                                                <FormHelperText>{error}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </div>
                                </Fragment>
                            ))}
                            {/* <input
                                type="text"
                                name="address1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="House No, Building, Street Area (Optional)"
                                onChange={(e) => setaddress1(e.target.value)}
                            />
                            <input
                                type="text"
                                name="area"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Locality Town (Optional)"
                                onChange={(e) => setaddress2(e.target.value)}
                            />
                            <input
                                type="text"
                                name="city"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="City District & State (Optional)"
                                onChange={(e) => setcitysate(e.target.value)}
                            />
                            <input
                                type="text"
                                name="pincode"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                placeholder="Pincode (Optional)"
                                onChange={(e) => setpincode(e.target.value)}
                            /> */}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300"
                            >
                                {!loading ? 'Create Account' : 'Loading...'}
                            </button>

                            <Link
                                to="/Login"
                                className="text-center block text-pink-600 font-semibold mt-4 hover:underline"
                            >
                                Already have an account? Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    );
};

export default Registeruser;
