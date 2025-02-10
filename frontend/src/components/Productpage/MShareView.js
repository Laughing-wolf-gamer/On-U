import { useState } from "react";
import { FaShare } from "react-icons/fa";
import { IoIosCopy, IoLogoWhatsapp } from "react-icons/io";
import { useSettingsContext } from "../../Contaxt/SettingsContext";

const MShareView = () => {
    const [showDropdown, setShowDropdown] = useState(false);
	const {checkAndCreateToast} = useSettingsContext();
	// Method to get the active URL (current page URL)
	const getProductURL = () => {
		return window.location.href; // Gets the current URL of the page
	};

	// Method to generate the WhatsApp share link
	const generateWhatsAppLink = (url) => {
		const encodedUrl = encodeURIComponent(url); // Encode the URL to make it URL-safe
		return `https://wa.me/?text=Check%20out%20this%20product!%20${encodedUrl}`;
	};

	// Method to handle the sharing
	const handleShare = () => {
		const productURL = getProductURL(); // Get the active page URL
		const shareLink = generateWhatsAppLink(productURL); // Generate the WhatsApp sharing URL
		// Open the WhatsApp share link in a new window or tab
		window.open(shareLink, "_blank");
	};
	const getCopyUrl = ()=>{
		const productURL = getProductURL(); // Get the active page URL
		const shareLink = generateWhatsAppLink(productURL); // Generate the WhatsApp sharing URL
		return shareLink;
	}
	const HandleOnShareTypeButtonClick =(type)=>{
		switch(type){
			case "whatsApp":
				handleShare();
				checkAndCreateToast("success", "Sharing The Product On Whatsapp!");
			break;
			case "copyUrl":
				navigator.clipboard.writeText(getCopyUrl());
				checkAndCreateToast("success", "Link Copied to Clipboard!");
			break;
		}
	}
    // Check if the screen width is smaller than 768px (for small screens)

    const handleButtonClick = () => {
        setShowDropdown((prev) => !prev); // Toggle dropdown on button press for small screens
		
    };

    return (
        <div
            className="absolute top-4 font-kumbsan left-4 flex flex-col justify-start items-center h-fit"
        >
            {/* Share Button */}
            <div
                onClick={handleButtonClick}
                className="bg-white md:p-3 sm:p-3 xl:p-3 2xl:p-3 p-2 rounded-full focus:outline-none"
            >
                <FaShare size={20} />
            </div>

            {/* Dropdown Menu */}
            <div
				
                className={`mt-2 flex flex-col space-y-4 p-3 w-fit overflow-hidden transition-all duration-300 ease-in-out ${showDropdown ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                <div
					onClick={()=> HandleOnShareTypeButtonClick("whatsApp")}
                    className="text-green-200 hover:text-green-600 transition duration-300 text-3xl"
                >
                <IoLogoWhatsapp />
                </div>
				<div
					onClick={()=> HandleOnShareTypeButtonClick("copyUrl")}
					className="text-gray-300 hover:text-gray-800 transition duration-300 text-3xl"
				>
				<IoIosCopy />
                </div>
            </div>
        </div>
    );
};

export default MShareView;
