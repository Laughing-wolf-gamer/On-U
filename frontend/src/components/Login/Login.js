import React, { Fragment, useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginmobile } from '../../action/useraction';
import { Link, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';

const Login = () => {
  const [mobileno, setmobileno] = useState('');
  const Redirect = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginuser);
  const Alert = useAlert();
  let par = document.getElementById('error');

  const continues = async () => {
    if (mobileno.length < 10) {
      par.innerHTML = 'Error: Please enter a valid 10-digit mobile number';
      return;
    }
    if (mobileno.length === 10) {
      await dispatch(loginmobile({ phonenumber: mobileno }));
      if (user) {
        Alert.success('Login Successful');
        Redirect('/');
      }
    }
  };

  useEffect(() => {
    if (user) {
      if(sessionStorage.getItem('token')){
        Alert.success('Login Successful');
        // console.log('Logged In User: ', user);
        Redirect('/');
      }
    }
  }, [user, Redirect]);

  return (
    <Fragment>
      <div className="w-full h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center py-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[50%] xl:w-[40%] 2xl:w-[35%]">
          {/* <img src={img} alt="login" className="w-full h-auto rounded-lg mb-6" /> */}
          <div className="mx-auto w-full">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Login or Sign Up
            </h1>

            <input
              type="number"
              name="phonenumber"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
              onChange={(e) => setmobileno(e.target.value)}
              placeholder="+91 | Mobile Number*"
            />
            <p id="error" className="text-xs text-red-500 text-center mb-4"></p>

            <h1 className="text-sm text-center mb-5">
              By Continuing, I agree to the{' '}
              <span className="text-pink-500">Terms of Use</span> &{' '}
              <span className="text-pink-500">Privacy Policy</span>
            </h1>

            <button
              type="submit"
              onClick={continues}
              className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition duration-300 mb-4"
            >
              LOG IN
            </button>

            <Link
              to="/registeruser"
              className="text-center text-pink-500 font-bold hover:underline block"
            >
              <h1 className="text-sm">
                No Account? <span className="text-pink-500">Register User</span>
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
