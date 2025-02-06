import React, { Fragment } from "react";
import g1 from "../images/googleplay.png";
import g2 from "../images/appleplay.png";
import g3 from "../images/original.png";
import g4 from "../images/return.png";
import { AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { ImTwitter, ImInstagram } from "react-icons/im";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const Footer = () => {
    return (
        <div className="w-screen font-kumbsan">
            <div className="w-full max-w-screen-2xl justify-self-center p-14 py-10 max-h-[900px] font1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-black border-b border-gray-300 pb-10">
                {/* Online Shopping */}
                {/* Owner Address Details */}
                <div className="border-r border-gray-300 space-y-3 pr-4">
                    <h1 className="text-lg font-bold mb-4 text-gray-800">ON-U</h1>
                    <p className="text-sm text-gray-700">Owner: John Doe</p>
                    <div className="flex flex-row justify-start space-x-1 hover:text-pink-400 items-center">
                    <h2 className="text-xl font-bold">GET DIRECTION</h2>
                    <ArrowUp className="rotate-45"/>
                    </div>
                    <p className="text-sm text-gray-700">Company: On-U.com</p>
                    <p className="text-sm text-gray-700">Address: 1234, Some Street, City, Country</p>
                    <p className="text-sm text-gray-700">Phone: +1 (234) 567-890</p>
                    <p className="text-sm text-gray-700">Email: owner@onu.com</p>
                </div>
                {/* <div className="border-r border-gray-300 pr-4">
                    
                    <h1 className="text-lg font-bold mb-4 text-gray-800">ONLINE SHOPPING</h1>
                    <Link to="/products">
                        <ul className="text-sm space-y-2">
                            <li className="hover:underline text-gray-700">Men</li>
                            <li className="hover:underline text-gray-700">Women</li>
                            <li className="hover:underline text-gray-700">Kids</li>
                        </ul>
                    </Link>
                </div> */}

                {/* Useful Links */}
                <div className="border-r border-gray-300 pr-4">
                    <h1 className="text-lg font-bold text-gray-800 mb-4">USEFUL LINKS</h1>
                    <ul className="text-sm space-y-2">
                        <Link to="/about">
                            <li className="hover:underline text-gray-700">About Us</li>
                        </Link>
                        <Link to="/contact">
                            <li className="hover:underline text-gray-700">Contact Us</li>
                        </Link>
                        <Link to="/faq">
                            <li className="hover:underline text-gray-700">FAQ</li>
                        </Link>
                        <Link to="/tc">
                            <li className="hover:underline text-gray-700">Terms And Conditions</li>
                        </Link>
                        <Link to="/privacyPolicy">
                            <li className="hover:underline text-gray-700">Privacy Policy</li>
                        </Link>
                        </ul>
                    </div>

                {/* App and Social Media */}
                <div className="border-r border-gray-300 pr-4">
                    <h1 className="text-lg font-bold mb-4 text-gray-800">EXPERIENCE ON-U APP</h1>
                    <div className="grid grid-cols-2 gap-4 mb-6 w-52 md:w-auto">
                        <img src={g1} alt="Google Play" />
                        <img src={g2} alt="Apple Store" />
                    </div>
                    <h1 className="text-lg font-normal text-gray-800 mb-4">KEEP IN TOUCH</h1>
                    <div className="flex space-x-4 md:text-2xl text-lg text-gray-800">
                        <AiFillFacebook />
                        <ImTwitter />
                        <AiFillYoutube />
                        <ImInstagram />
                    </div>
                </div>

                {/* Features */}
                <div className="flex w-full flex-col justify-start items-center space-y-4">
                    {/* Email and Checkbox for Agreement */}
                    <div className="text-center justify-start items-start w-full flex flex-col">
                        <div className="w-full flex flex-col justify-start items-start mb-4 space-y-4">
                            <h1 className="text-xl text-left font-semibold text-gray-800">Stay Updated</h1>
                            <h3 className="text-gray-700 text-left">Subscribe to our newsletter for the latest updates.</h3>
                        </div>
                        <div className="flex w-full border justify-between items-center border-gray-500 space-x-4 rounded-full p-1">
                            <input
                                type="email"
                                placeholder="enter your email address"
                                className="rounded-full p-2 w-full h-full text-black placeholder:text-left outline-none "
                                // onChange={(e) => setstate(e.target.value)}
                            />
                            <button className="bg-black p-2 hover:bg-gray-700 transition-all duration-300 ease-in-out text-white rounded-full rotate-45">
                                <ArrowUp />
                            </button>
                        </div>

                        <div className="flex mt-4 items-center">
                            <input type="checkbox" id="agreement" className="mr-2" />
                            <label htmlFor="agreement" className="text-sm text-gray-700">
                                I agree to the <span className="text-blue-600">Terms & Conditions</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
                {/* Popular Searches */}
                <div className="text-sm mt-10">
                    <h1 className="font-extrabold text-black mb-4">POPULAR SEARCHES</h1>
                    <p className="text-gray-700">
                        Shirts | Dresses For Girls | T-Shirts | Sandals
                    </p>
                </div>
                {/* Footer Bottom */}
                <div className="mt-6 text-center text-gray-500 text-md">
                    &copy; 2025 www.theOnu.com. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Footer;
