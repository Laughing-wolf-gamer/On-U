import React, { useState } from "react";

const ShareOnWhatsApp = () => {
	const [link, setLink] = useState(""); // State to store the URL or text to share

	// Method to generate WhatsApp share link
	const generateWhatsAppLink = () => {
		const encodedMessage = encodeURIComponent(link); // Encode URL or message to make it URL-safe
		return `https://wa.me/?text=${encodedMessage}`;
	};

	// Method to handle the sharing
	const handleShare = () => {
		const url = generateWhatsAppLink();
		// Open WhatsApp share link in a new window
		window.open(url, "_blank");
	};

	return (
		<div className="share-container">
		<h2>Share a Link on WhatsApp</h2>
		<input
			type="text"
			placeholder="Enter URL or message to share"
			value={link}
			onChange={(e) => setLink(e.target.value)}
			className="input-field"
		/>
		<button
			onClick={handleShare}
			className="share-button"
			disabled={!link} // Disable button if no link is provided
		>
			Share on WhatsApp
		</button>
		</div>
	);
};

export default ShareOnWhatsApp;
