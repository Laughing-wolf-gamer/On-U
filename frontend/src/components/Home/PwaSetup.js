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
	return <div className={`w-full sr-only h-12 justify-center flex rounded-md bg-black text-white`}>
		{/* Show the install button only if the app is not already installed */}
		{!isInstalled && deferredPrompt && (
			<button className='font-kumbsan' onClick={handleInstallClick}>
				Add to Home Screen
			</button>
		)}
	</div>

}

export default PwaSetup
