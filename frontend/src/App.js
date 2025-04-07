import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom"
import React, {useEffect, useState} from 'react';
import { useDispatch} from 'react-redux'
import './App.css';
import Navbar from './components/Navbar/Navbar.js'
import Home from "./components/Home/Home.js";
import MNavbar from "./components/Navbar/MobileNav/MNavbar.js";
import Login from "./components/Login/Login";
import Otpverify from "./components/Login/otpverify";
import Registeruser  from "./components/Login/Registeruser";
import Overview from "./components/Login/Dashboard/overview";
import Allproductpage from "./components/Product/Allproduct";
import Ppage from "./components/Productpage/Ppage";
import MPpage from "./components/Productpage/MPpage";
import Wishlist from "./components/Wishlist/Wishlist";
import Bag from './components/Bag/Bag'
import Address from "./components/Bag/Address";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { BASE_API_URL } from "./config/index.js";
import About from "./components/Website_HelpSupport/About.js";
import Contact from "./components/Website_HelpSupport/Contact.js";
import OrderDetailsPage from "./components/Login/Dashboard/OrderDetailsPage.js";
import FAQ from "./components/Website_HelpSupport/FAQ.js";
import TermsAndConditions from "./components/Website_HelpSupport/TermsAndConditions.js";
import PrivacyPolicy from "./components/Website_HelpSupport/PrivacyPolicy.js";
import { Toaster } from 'react-hot-toast';
import CheckoutPage from "./components/Bag/NewCheckoutPage.js";
import NotFoundPage from "./NotFoundPage.js";
import PaymentSuccess from "./components/Bag/PaymentSuccess.js";
import PaymentFailed from "./components/Bag/PaymentFailed.js";
import PaymentPending from "./components/Bag/PaymentPending.js";
import { useServerAuth } from "./Contaxt/AuthContext.js";
import axios from "axios";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return windowSize;
};

function App() {
    const dispatch = useDispatch()
    const{width} = useWindowSize();
	const{userLoading,user, isAuthentication,checkAuthUser} = useServerAuth();

    const [state, setstate] = useState(false)
    
    useEffect(() => {
        if (state === false) {
			checkAuthUser();
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
    console.log("Base Server API: ",BASE_API_URL);
	
    const isMobile = width < 1024;
    return (
		<Router>
			<Navbar />
			<MNavbar />
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Home user={user} />} />
				<Route path="/Login" element={<Login />} />
				<Route path="/verifying" element={<Otpverify />} />
				<Route path='/registeruser' element={<Registeruser />} />
				
				{/* Authenticated Routes */}
				<Route path='/dashboard' element={<Overview user={user} loading={userLoading} isAuthentication={isAuthentication} />} />
				<Route path='/order/details/:orderId' element={<OrderDetailsPage user={user} />} />				
				{/* Checkout Routes */}
				<Route path='/my_wishlist' element={<Wishlist />} />
				<Route path='/bag' element={<Bag user={user} />} />
				<Route path='/bag/checkout' element={<CheckoutPage />} />
				<Route path='/bag/checkout/success' element={<PaymentSuccess />} />
				<Route path='/bag/checkout/failure' element={<PaymentFailed />} />
				<Route path='/bag/checkout/pending' element={<PaymentPending />} />
				
				{/* Address Route */}
				<Route path='/address/bag' element={<Address user={user} />} />
				
				{/* Static Pages */}
				<Route path='/about' element={<About />} />
				<Route path='/contact' element={<Contact />} />
				<Route path='/faq' element={<FAQ />} />
				<Route path='/tc' element={<TermsAndConditions />} />
				<Route path='/privacyPolicy' element={<PrivacyPolicy />} />
				
				{/* Product Pages */}
				<Route path='/products' element={<Allproductpage user={user} />} />
				<Route path='/products/:id' element={isMobile ? <MPpage /> : <Ppage />} />

				{/* Catch-All Route */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</Router>
		
    );
}

export default App;


{/* <Coupon /> */}
{/* <Router>
	<Navbar user={user}/>
	<MNavbar user={user}/>
	<Routes>
		<Route path="/" element={<Home user={user}/>}/>
		<Route path="/Login" element={<Login/>}/>
		<Route path="/verifying" element={<Otpverify/>}/>
		<Route path='/registeruser' element={<Registeruser/>}/>
		<Route path='/dashboard' element={<Overview user={user} loading = {loading}/>}/>
		{loading === false && (isAuthentication && <Route path='/dashboard' element={<Overview user={user} loading={loading} isAuthentication = {isAuthentication}/>}/>)}
		{loading === false && (isAuthentication === false &&<Route path="/dashboard" element={<Navigate to="/" />} />)} 
		<Route path='/products' element={<Allproductpage user = {user}/>}/>
		<Route path='/my_wishlist' element={<Wishlist user={isAuthentication}/>}/>
		<Route path='/bag' element={<Bag user={user}/>}/>
		<Route path='/bag/checkout' element={<CheckoutPage/>}/>
		<Route path='/bag/checkout/success' element={<PaymentSuccess/>}/>
		<Route path='/bag/checkout/failure' element={<PaymentFailed/>}/>
		<Route path='/bag/checkout/pending' element={<PaymentPending/>}/>
		<Route path='/address/bag' element={<Address user={user}/>}/>
		<Route path='/about' element={<About />}/>
		<Route path='/contact' element={<Contact />}/>
		<Route path='/faq' element={<FAQ />}/>
		<Route path='/tc' element={<TermsAndConditions />}/>
		<Route path='/privacyPolicy' element={<PrivacyPolicy />}/>
		<Route path="*" element={<NotFoundPage />} />
		{user && <Route path="/order/details/:orderId" element = {<OrderDetailsPage user={user}/>}/>}
		{window.screen.width > 1024 && <Route path='/products/:id' element={ <Ppage/>}/>}
		{window.screen.width < 1024 && <Route path='/products/:id' element={<MPpage/>}/>}
	</Routes>
</Router> */}