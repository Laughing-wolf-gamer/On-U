import React, { useState, useEffect } from 'react';

const DeliveryStatusAllOrders = ({ status, hiddenText }) => {
	const steps = [
		{ title: 'Confirmed', label: "Confirmed", icon: "📦" },
		{ title: 'RTS', label: "Ready To Ship", icon: "🚚" },
		{ title: 'Shipped', label: "Shipped", icon: "✈️" },
		{ title: 'OFD', label: "Out for Delivery", icon: "📬" },
		{ title: 'Delivered', label: "Delivered", icon: "✅" },
	];

	let currentStepIndex = steps.findIndex((step) => step.label === status);

	if (currentStepIndex < 0) {
		currentStepIndex = -1; // Set to -1 if status is invalid
	}

	// States for the animation
	const [animatedStep, setAnimatedStep] = useState(0);
	const [currentWidth, setCurrentWidth] = useState(0);

	useEffect(() => {
		// Delay the animation for smooth effect
		const timer = setTimeout(() => {
			setAnimatedStep(currentStepIndex); // Update the step index
			if (currentStepIndex !== -1) {
				setCurrentWidth((currentStepIndex / (steps.length - 1)) * 100); // Set the progress bar width
			} else {
				setCurrentWidth(0); // Reset progress if status is invalid
			}
		}, 500); // Delay for 500ms

		return () => clearTimeout(timer); // Cleanup timeout on unmount
	}, [status, currentStepIndex]);

	return (
		<div className="rounded-lg mb-2 px-2 w-full">
			<div className="w-full overflow-hidden">
				<div className="flex items-center justify-between relative overflow-hidden">
					{/* Progress Bar */}
					<div className="absolute top-1/2 transform -translate-y-1/2 left-5 right-4 sm:left-4 sm:right-3 md:left-6 md:right-5 h-1 bg-gray-300 rounded-md">
						<div
							className="h-0.5 md:h-1 bg-red-400 transition-all duration-1000 ease-in-out"
							style={{
								width: `${currentWidth}%`, // Animate width from 0 to target value
							}}
						></div>
					</div>

					{/* Steps */}
					{steps.map((step, index) => (
						<div key={index} className="flex flex-col items-center z-10 overflow-hidden">
							<div
								className={`flex flex-col items-center justify-center text-white font-bold shadow-md transition-all duration-500 ease-in-out text-sm sm:text-lg`}
							>
								<div
									className={`rounded-full flex items-center justify-center ${
										currentStepIndex === -1
											? "bg-gray-200"
											: index <= animatedStep
											? "bg-red-400"
											: "bg-gray-300"
									} w-5 h-5 sm:w-10 sm:h-10 transform transition-transform duration-500 ease-in-out`}
								>
									{step.icon}
								</div>
								{!hiddenText && (
									<p
										className={`mt-2 text-xs font-semibold ${
											currentStepIndex === -1
												? "text-gray-500"
												: index <= animatedStep
												? "text-gray-700"
												: "text-gray-400"
										}`}
									>
										{step.title}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DeliveryStatusAllOrders;
