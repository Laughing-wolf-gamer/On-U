import React, { useEffect, useState } from 'react'

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
	return <div className={`fixed z-50 left-8 2xl:left-20 p-3 bg-black text-white rounded-full shadow-lg transition-opacity duration-300 bottom-16 sm:bottom-20 md:bottom-6 lg:bottom-6 xl:bottom-6 2xl:bottom-10`}>
			<h1>{isInstalled ? 'App is Installed!' : 'Welcome to the Web App'}</h1>
			{/* Show the install button only if the app is not already installed */}
			{!isInstalled && deferredPrompt && (
				<button onClick={handleInstallClick}>
					Install App
				</button>
			)}
	</div>

}

export default PwaSetup
