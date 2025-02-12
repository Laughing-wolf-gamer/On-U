import React from "react";
import g1 from "../images/googleplay.png";
import g2 from "../images/appleplay.png";
import { AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { ImTwitter, ImInstagram } from "react-icons/im";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const Footer = () => {
    return (
        <div className="w-screen h-fit border-t-[1px] border-t-gray-300 bg-white font-kumbsan">
            <div className="w-full max-w-screen-2xl justify-self-center p-14 py-10 max-h-[900px] font1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-black border-b border-gray-200 pb-10">
                    {/* Online Shopping */}
                    <div className="md:border-r lg:border-r xl:border-r 2xl:border-r border-gray-200 space-y-3">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">ON-U</h1>
                        <p className="text-sm hover:underline text-gray-600">Owner: On-U</p>
                        <div className="flex flex-row justify-start space-x-1 cursor-pointer hover:text-indigo-400 items-center">
                            <Link to={'/contact'}><h2 className="text-xl font-bold">GET DIRECTION</h2></Link>
                            <ArrowUp className="rotate-45" />
                        </div>
                        <p className="text-sm hover:underline text-gray-600">Company: On-U.com</p>
                        <p className="text-sm hover:underline text-gray-600">Address: 1234, Some Street, City, Country</p>
                        <p className="text-sm hover:underline text-gray-600">Phone: +1 (234) 567-890</p>
                        <p className="text-sm hover:underline text-gray-600">Email: owner@onu.com</p>
                    </div>

                    {/* Customer Services */}
                    <div className="md:border-r lg:border-r xl:border-r 2xl:border-r border-gray-200 pr-4">
                        <h1 className="text-lg font-bold text-gray-800 mb-4">CUSTOMER SERVICES</h1>
                        <ul className="text-sm space-y-2">
                            <Link to="/about">
                                <li className="hover:underline text-gray-600">Shipping</li>
                            </Link>
                            <Link to="/about">
                                <li className="hover:underline text-gray-600">About Us</li>
                            </Link>
                            <Link to="/faq">
                                <li className="hover:underline text-gray-600">FAQ</li>
                            </Link>
                            <Link to="/contact">
                                <li className="hover:underline text-gray-600">Orders</li>
                            </Link>
                            <Link to="/tc">
                                <li className="hover:underline text-gray-600">Terms And Conditions</li>
                            </Link>
                            <Link to="/privacyPolicy">
                                <li className="hover:underline text-gray-600">Privacy Policy</li>
                            </Link>
                        </ul>
                    </div>

                    {/* App and Social Media */}
                    <div className="md:border-r lg:border-r xl:border-r 2xl:border-r border-gray-200 pr-4">
                        <h1 className="text-lg font-bold mb-4 text-gray-800">EXPERIENCE ON-U APP</h1>
                        <div className="grid grid-cols-2 gap-4 mb-6 w-52 md:w-auto">
                            <img src={g1} alt="Google Play" className="object-contain w-full h-full" />
                            <img src={g2} alt="Apple Store" className="object-contain w-full h-full" />
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex w-full flex-col justify-start items-start">
						<h1 className="text-lg font-normal text-gray-800 mb-4">KEEP IN TOUCH</h1>

						{/* Social Media Icons */}
						<div className="flex space-x-6 text-3xl text-gray-800 mb-6">
							<AiFillFacebook className="transition-transform transform hover:scale-110 hover:text-blue-600" />
							<ImTwitter className="transition-transform transform hover:scale-110 hover:text-blue-400" />
							<AiFillYoutube className="transition-transform transform hover:scale-110 hover:text-red-600" />
							<ImInstagram className="transition-transform transform hover:scale-110 hover:text-pink-600" />
						</div>

						{/* Email Input and Agreement Section */}
						<div className="flex w-full max-w-md border border-gray-300 rounded-full space-x-3 p-3 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
							<input
								type="email"
								placeholder="Get Cool Coupons To your mail"
								className="rounded-full w-full text-black placeholder:text-gray-400 outline-none transition-all duration-300 ease-in-out"
							/>
							<button className="bg-black p-3 hover:bg-gray-700 transition-all duration-300 ease-in-out text-white rounded-full transform hover:rotate-45 focus:outline-none">
								<ArrowUp />
							</button>
						</div>
					</div>


                </div>

                <div className="mt-6 h-[50px] justify-end items-center flex flex-col text-center text-gray-500 text-md">
                    <span>&copy; 2025 www.theOnu.com. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;
