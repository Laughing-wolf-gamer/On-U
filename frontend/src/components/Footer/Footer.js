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
    <Fragment>
      <div className="w-screen mx-3 py-10 font1 bg-slate-50 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-black">
          {/* Online Shopping */}
          <div>
            <h1 className="text-lg font-bold mb-4">ONLINE SHOPPING</h1>
            <ul className="text-sm space-y-2">
              <li className="hover:underline text-gray-400">Men</li>
              <li className="hover:underline text-gray-400">Women</li>
              <li className="hover:underline text-gray-400">Kids</li>
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h1 className="text-lg font-bold text-gray-800 mb-4">USEFUL LINKS</h1>
            <ul className="text-sm space-y-2">
              <Link to="/about">
                <li className="hover:underline text-gray-400">About Us</li>
              </Link>
              <Link to="/contact">
                <li className="hover:underline text-gray-400">Contact Us</li>
              </Link>
              <li className="hover:underline text-gray-400">FAQ</li>
              <li className="hover:underline text-gray-400">Terms Of Use</li>
              <li className="hover:underline text-gray-400">Track Orders</li>
            </ul>
          </div>

          {/* App and Social Media */}
          <div>
            <h1 className="text-lg font-bold mb-4">EXPERIENCE ON-U APP</h1>
            <div className="grid grid-cols-2 gap-4 mb-6 w-52 md:w-auto">
              <img src={g1} alt="Google Play" />
              <img src={g2} alt="Apple Store" />
            </div>
            <h1 className="text-lg font-normal text-gray-800 mb-4">KEEP IN TOUCH</h1>
            <div className="flex space-x-4 md:text-2xl text-lg text-gray-400">
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
                <span className="text-gray-600 flex-wrap">Guarantee for all products on On-U.com</span>
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <img src={g4} alt="Easy Returns" className="w-12 mr-4" />
              <div>
                <h1 className="font-normal text-gray-800">Return within 30 days</h1>
               <span className="font-thin text-gray-400"> Of receiving your order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="text-sm mt-10">
          <h1 className="font-extrabold text-black mb-4">POPULAR SEARCHES</h1>
          <p className="text-gray-700">
            Makeup | Dresses For Girls | T-Shirts | Sandals | Handbags | Sport Shoes | Watches | Earrings | Rings | Lipstick
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          &copy; 2024 www.On-U.com. All rights reserved.
        </div>
      </div>
    </Fragment>
  );
};

export default Footer;
