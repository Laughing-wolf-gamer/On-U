import { useState } from "react";
import { FaShare } from "react-icons/fa";
import { ImFacebook, ImGoogle, ImTwitter, ImInstagram } from "react-icons/im";

const ShareView = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    // Check if the screen width is smaller than 768px (for small screens)
    const isSmallScreen = window.screen.width < 1024;

    const handleButtonClick = () => {
        if (isSmallScreen) {
        setShowDropdown((prev) => !prev); // Toggle dropdown on button press for small screens
        }
    };

    return (
        <div
        onMouseLeave={() => !isSmallScreen && setShowDropdown(false)} // Hide on mouse leave for large screens
        className="absolute top-4 font-kumbsan left-4 flex flex-col justify-start items-center h-fit"
        >
        {/* Share Button */}
        <div
            onMouseEnter={() => !isSmallScreen && setShowDropdown(true)} // Hover to open for large screens
            onMouseDown={handleButtonClick} // Toggle for small screens
            className="bg-white bg-opacity-50 md:p-5 sm:p-5 xl:p-5 2xl:p-5 p-2 rounded-full focus:outline-none"
        >
            <FaShare size={20} />
        </div>

        {/* Dropdown Menu */}
        <div
            onMouseLeave={() => !isSmallScreen && setShowDropdown(false)} // Hide on mouse leave for large screens
            className={`mt-2 flex flex-col space-y-4 p-5 w-fit overflow-hidden transition-all duration-300 ease-in-out ${
            showDropdown ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
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
