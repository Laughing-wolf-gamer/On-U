import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux'
import './App.css';
import Navbar from './components/Navbar/Navbar.js'
import Home from "./components/Home/Home.js";
import MNavbar from "./components/Navbar/MobileNav/MNavbar.js";
import Login from "./components/Login/Login";
import Otpverify from "./components/Login/otpverify";
import Registeruser  from "./components/Login/Registeruser";
import { getuser } from "./action/useraction";
import Overview from "./components/Login/Dashboard/overview";
import Allproductpage from "./components/Product/Allproduct";
import Ppage from "./components/Productpage/Ppage";
import MPpage from "./components/Productpage/MPpage";
import Coupon from "./components/Coupon/Coupon";
import Wishlist from "./components/Wishlist/Wishlist";
import Bag from './components/Bag/Bag'
import Address from "./components/Bag/Address";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BASE_API_URL } from "./config/index.js";
import About from "./components/About-Screen/About.js";
import Contact from "./components/About-Screen/Contact.js";
import OrderDetailsPage from "./components/Login/Dashboard/OrderDetailsPage.js";
import FAQ from "./components/About-Screen/FAQ.js";
import TermsAndConditions from "./components/About-Screen/TermsAndConditions.js";
import PrivacyPolicy from "./components/About-Screen/PrivacyPolicy.js";
import { FunctionProvider } from "./Contaxt/FunctionContext.js";
import toast, { Toaster } from 'react-hot-toast';



function App() {
    const dispatch = useDispatch()
    const {loading, user, isAuthentication} = useSelector(state => state.user)

    const [state, setstate] = useState(false)
    
    useEffect(() => {
        if (state ===  false) {
            dispatch(getuser())
            setstate(true)
        }
        
    
        let url = document.URL
        if (url.includes('&')) {
            if (!url.includes('?')) {
            let url1=  url.replace('&','?')
                window.location = url1
            }
        }

        if(isAuthentication){
            console.log(url)
            if (url === window.location.protocol+"//" + window.location.host + '/Login') {
                window.location.href = window.location.protocol + "//"+window.location.host
            }
            if (url === window.location.protocol+"//" + window.location.host + '/verifying') {
                window.location.href = window.location.protocol + "//"+window.location.host
            }
            if (url === window.location.protocol+"//" + window.location.host + '/registeruser') {
                window.location.href = window.location.protocol + "//"+window.location.host
            }
        }
        
    }, [dispatch, isAuthentication]);
    console.log("Base Server API",BASE_API_URL);
    return (
        <FunctionProvider>
        <Router>
            <Navbar user={user}/>
            <MNavbar user={user}/>
            {/* <Coupon /> */}
            <Routes>
            <Route path="/" element={<Home user={user}/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/verifying" element={<Otpverify/>}/>
            <Route path='/registeruser' element={<Registeruser/>}/>
            <Route path='/dashboard' element={<Overview user={user}/>}/>
            {loading === false && (isAuthentication && <Route path='/dashboard' element={<Overview user={user}/>}/>)}
            {loading === false && (isAuthentication === false &&<Route path="/dashboard" element={<Navigate to="/" />} />)} 
            <Route path='/products' element={<Allproductpage user = {user}/>}/>
            {window.screen.width > 1024 && <Route path='/products/:id' element={ <Ppage/>}/>}
            {window.screen.width < 1024 && <Route path='/products/:id' element={<MPpage/>}/>}
            <Route path='/my_wishlist' element={<Wishlist user={isAuthentication}/>}/>
            <Route path='/bag' element={<Bag user={user}/>}/>
            {user && <Route path="/order/details/:id" element = {<OrderDetailsPage user={user}/>}/>}
            <Route path='/address/bag' element={<Address user={user}/>}/>
            <Route path='/about' element={<About />}/>
            <Route path='/contact' element={<Contact />}/>
            <Route path='/faq' element={<FAQ />}/>
            <Route path='/tc' element={<TermsAndConditions />}/>
            <Route path='/privacyPolicy' element={<PrivacyPolicy />}/>
            </Routes>
            
            
        </Router>
        <Toaster 
            position="top-center"
            reverseOrder={false}
        />
        </FunctionProvider>
    );
}

export default App;
