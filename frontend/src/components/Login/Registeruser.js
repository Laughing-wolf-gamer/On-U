import React, { Fragment, useState, useEffect } from 'react';
import './Login.css';
import { clearErrors, registerUser } from '../../action/useraction';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAddressForm } from '../../action/common.action';
import { ImFacebook, ImGoogle, ImInstagram, ImTwitter } from 'react-icons/im';
import { useSettingsContext } from '../../Contaxt/SettingsContext';

const Registeruser = () => {
    const {checkAndCreateToast} = useSettingsContext();
    const navigation = useNavigate();
    const { formData } = useSelector(state => state.fetchFormBanners);
    const { user, error, loading } = useSelector(state => state.Registeruser);
    const [name, setname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setgender] = useState('');
    const [email, setemail] = useState('');
    // const [newAddress, setNewAddress] = useState({});
    const dispatch = useDispatch();
    const onsubmit = async (e) => {
        e.preventDefault();
        if (!name ||!phoneNumber ||!gender ||!email) {
            checkAndCreateToast('error', 'All Fields are required!');
            return;
        }
        const myForm = {
            phonenumber: phoneNumber,
            name: name,
            gender: gender,
            email: email,
        };
        await dispatch(registerUser(myForm));
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        if (user) {
            checkAndCreateToast('success', 'Otp Sent To Your EmailID');
            navigation('/verifying');
        }
        dispatch(fetchAddressForm());
    }, [error, user, dispatch]);
    return (
        <Fragment>
            <form onSubmit={(e) => onsubmit(e)}>
                <div className="w-full min-h-screen bg-gray-300 py-10">
                    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-center text-3xl font-semibold text-gray-700 mb-8">Register New User</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="E-Mail"
                                onChange={(e) => setemail(e.target.value)}
                            />
                            <input
                                type="text"
                                name="PhoneNumber"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <input
                                type="text"
                                name="name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                                        className="accent-gray-500"
                                        onClick={() => setgender('women')}
                                    />
                                    <span className="ml-2 text-gray-700">Women</span>
                                </div>
                            </div>

                            

                            {/* <div className="flex items-center justify-center my-4">
                                <GoogleLogin
                                    clientId="667896313498-k77vitq087j4jhfne9fnd7i31abf2ok1.apps.googleusercontent.com"
                                    buttonText="Sign Up with Google"
                                    icon={<FcGoogle />}
                                    onSuccess={signin_google}
                                    onFailure={signin_google}
                                    cookiePolicy="single_host_origin"
                                    className="w-full text-gray-800 border-2 border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-100 transition-colors"
                                />
                            </div> */}
                            {/* <h1>Add Address Data: </h1>
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
                            ))} */}
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300"
                            >
                                {!loading ? 'Create Account' : 'Loading...'}
                            </button>

                            <Link
                                to="/Login"
                                className="text-center block text-gray-600 font-semibold mt-4 hover:underline"
                            >
                                Already have an account? Log In
                            </Link>
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
            </form>
        </Fragment>
    );
};

export default Registeruser;
