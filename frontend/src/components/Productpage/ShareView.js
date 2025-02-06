import React, { useState } from "react";
import { FaShare } from "react-icons/fa";
import { ImFacebook, ImGoogle, ImTwitter, ImInstagram } from "react-icons/im";

const ShareView = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div
        onMouseLeave={() => setShowDropdown(false)}
        className="absolute top-4 font-kumbsan left-4 flex flex-col justify-start items-center h-fit"
        >
        {/* Share Button */}
        <div
            onMouseEnter={() => setShowDropdown(true)}
            className="bg-white bg-opacity-50 p-5 rounded-full focus:outline-none"
        >
            <FaShare size={20} />
        </div>

        {/* Dropdown Menu */}
        <div
            onMouseLeave={() => setShowDropdown(false)}
            className={`mt-2 flex flex-col space-y-4 p-5 w-fit overflow-hidden transition-all duration-300 ease-in-out ${
            showDropdown
                ? "max-h-[500px] opacity-100" // Adjust max-height to the height of the dropdown content
                : "max-h-0 opacity-0"
            }`}
        >
            <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition duration-300 text-3xl"
            >
            <ImFacebook />
            </a>
            <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-red-600 transition duration-300 text-3xl"
            >
            <ImGoogle />
            </a>
            <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-400 transition duration-300 text-3xl"
            >
            <ImTwitter />
            </a>
            <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-pink-600 transition duration-300 text-3xl"
            >
            <ImInstagram />
            </a>
        </div>
        </div>
    );
};

export default ShareView;
