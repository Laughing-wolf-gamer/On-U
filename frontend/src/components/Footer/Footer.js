import React, { Fragment } from "react";
import g1 from "../images/googleplay.png";
import g2 from "../images/appleplay.png";
import g3 from "../images/original.png";
import g4 from "../images/return.png";
import { AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { ImTwitter, ImInstagram } from "react-icons/im";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="w-screen bg-slate-100">
            <div className="w-full max-w-screen-2xl justify-self-center p-14 py-10 max-h-[900px] font1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-black border-b border-gray-300 pb-10">
                    {/* Online Shopping */}
                    <div className="border-r border-gray-300 pr-8">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">ONLINE SHOPPING</h1>
                        <Link to="/products">
                            <ul className="text-sm space-y-2">
                                <li className="hover:underline text-gray-700">Men</li>
                                <li className="hover:underline text-gray-700">Women</li>
                                <li className="hover:underline text-gray-700">Kids</li>
                            </ul>
                        </Link>
                    </div>

                    {/* Useful Links */}
                    <div className="border-r border-gray-300 pr-8">
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
                    <div className="border-r border-gray-300 pr-8">
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
                    <div>
                        <div className="flex items-center mb-6">
                            <img src={g3} alt="Original Products" className="w-12 mr-4" />
                            <div>
                                <h1 className="font-normal text-gray-800">100% ORIGINAL</h1>
                                <span className="text-gray-600">Guarantee for all products on On-U.com</span>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <img src={g4} alt="Easy Returns" className="w-12 mr-4" />
                            <div>
                                <h1 className="font-normal text-gray-800">Return within 30 days</h1>
                                <span className="font-thin text-gray-500"> Of receiving your order</span>
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
