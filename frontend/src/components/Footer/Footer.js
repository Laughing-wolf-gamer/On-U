import React from "react";
import g1 from "../images/googleplay.png";
import g2 from "../images/appleplay.png";
import { AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { ImTwitter, ImInstagram } from "react-icons/im";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const Footer = () => {
    return (
        <div className="w-screen border-t-[1px] border-t-gray-400 shadow-xl bg-neutral-100 drop-shadow-md font-kumbsan">
            <div className="w-full max-w-screen-2xl justify-self-center p-14 py-10 max-h-[900px] font1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-black border-b border-gray-300 pb-10">
                    {/* Online Shopping */}
                    <div className="border-r border-gray-500 space-y-3">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">ON-U</h1>
                        <p className="text-sm hover:underline text-gray-700">Owner: John Doe</p>
                        <div className="flex flex-row justify-start space-x-1 cursor-pointer hover:text-pink-400 items-center">
                            <h2 className="text-xl font-bold">GET DIRECTION</h2>
                            <ArrowUp className="rotate-45"/>
                        </div>
                        <p className="text-sm hover:underline text-gray-700">Company: On-U.com</p>
                        <p className="text-sm hover:underline text-gray-700">Address: 1234, Some Street, City, Country</p>
                        <p className="text-sm hover:underline text-gray-700">Phone: +1 (234) 567-890</p>
                        <p className="text-sm hover:underline text-gray-700">Email: owner@onu.com</p>
                    </div>

                    {/* Useful Links */}
                    {/* <div className="border-r border-gray-500 pr-4">
                        <h1 className="text-lg font-bold text-gray-800 mb-4">USEFUL LINKS</h1>
                        <ul className="text-sm space-y-2">
                            <Link to="/">
                                <li className="hover:underline text-gray-700">Home</li>
                            </Link>
                            <Link to="/dashboard">
                                <li className="hover:underline text-gray-700">Profile</li>
                            </Link>
                            <Link to="/bag">
                                <li className="hover:underline text-gray-700">Bag</li>
                            </Link>
                            <Link to="/my_wishlist">
                                <li className="hover:underline text-gray-700">WishList</li>
                            </Link>
                        </ul>
                    </div> */}
                    <div className="border-r border-gray-500 pr-4">
                        <h1 className="text-lg font-bold text-gray-800 mb-4">CUSTOMER SERVICES</h1>
                        <ul className="text-sm space-y-2">
                            <Link to="/about">
                                <li className="hover:underline text-gray-700">Shipping</li>
                            </Link>
                            <Link to="/about">
                                <li className="hover:underline text-gray-700">About Us</li>
                            </Link>
                            <Link to="/faq">
                                <li className="hover:underline text-gray-700">FAQ</li>
                            </Link>
                            <Link to="/contact">
                                <li className="hover:underline text-gray-700">Orders</li>
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
                    <div className="border-r border-gray-500 pr-4">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">EXPERIENCE ON-U APP</h1>
                        <div className="grid grid-cols-2 gap-4 mb-6 w-52 md:w-auto">
                            <img src={g1} alt="Google Play" className="object-contain w-full h-full" />
                            <img src={g2} alt="Apple Store" className="object-contain w-full h-full" />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex w-full flex-col justify-center items-start py-3">
                        <h1 className="text-lg font-normal text-gray-800 mb-4">KEEP IN TOUCH</h1>
                        <div className="flex space-x-6 text-3xl text-gray-800 mb-6">
                            <AiFillFacebook className="transition-transform transform hover:scale-110 hover:text-blue-600" />
                            <ImTwitter className="transition-transform transform hover:scale-110 hover:text-blue-400" />
                            <AiFillYoutube className="transition-transform transform hover:scale-110 hover:text-red-600" />
                            <ImInstagram className="transition-transform transform hover:scale-110 hover:text-pink-600" />
                        </div>

                        {/* Email Input and Agreement Section */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex w-full border border-gray-800 rounded-full space-x-3 p-3 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
                                <input
                                    type="email"
                                    placeholder="Get Cool Coupons To your mail"
                                    className="rounded-full p-3 w-full text-black placeholder:text-gray-400 outline-none transition-all duration-300 ease-in-out"
                                    // onChange={(e) => setstate(e.target.value)}
                                />
                                <button className="bg-black p-3 hover:bg-gray-700 transition-all duration-300 ease-in-out text-white rounded-full transform hover:rotate-45 focus:outline-none">
                                    <ArrowUp />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 h-[200px] justify-end items-center flex flex-col text-center text-gray-500 text-md">
                    <span>&copy; 2025 www.theOnu.com. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
