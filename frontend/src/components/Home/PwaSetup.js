import React, { Fragment, useEffect, useState } from 'react'
import { BiDownload } from 'react-icons/bi';
const PwaSetup = () => {
	const [deferredPrompt, setDeferredPrompt] = useState(null);
  	const [isInstalled, setIsInstalled] = useState(false);

  	useEffect(() => {
    	// Listen for the beforeinstallprompt event
		const handleBeforeInstallPrompt = (event) => {
			event.preventDefault(); // Prevent the default install prompt
			setDeferredPrompt(event); // Store the event for later
		};

		// Check if the app is already installed
		if (window.matchMedia('(display-mode: standalone)').matches) {
			setIsInstalled(true);
		}

		// Listen for the 'beforeinstallprompt' event
		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		// Cleanup listener on unmount
		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		};
	}, []);

	// Function to handle the install button click
	const handleInstallClick = () => {
		if (deferredPrompt) {
			// Show the install prompt
			deferredPrompt.prompt();

			// Wait for the user to respond to the prompt
			deferredPrompt.userChoice.then((choiceResult) => {
				if (choiceResult.outcome === 'accepted') {
					console.log('User accepted the A2HS prompt');
				} else {
					console.log('User dismissed the A2HS prompt');
				}
				setDeferredPrompt(null); // Reset the deferred prompt
			});
		}
	};
	return (
		<Fragment>
		{/* Show the install button only if the app is not already installed */}
		{!isInstalled && deferredPrompt && (
			<button
				className="px-6 py-3 mb-4 w-full flex justify-center items-center space-x-3 rounded-lg bg-gradient-to-r from-gray-500 to-neutral-600 text-white font-semibold shadow-lg hover:bg-gradient-to-r hover:from-gray-500 hover:to-neutral-600 hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none"
				onClick={handleInstallClick}
				aria-label="Install app to home screen"
			>
				<BiDownload size={24} className="transform hover:animate-pulse" />
				<span className="text-sm md:text-base">Add to Home Screen</span>
			</button>
		)}
		</Fragment>
	);
};

export default PwaSetup
