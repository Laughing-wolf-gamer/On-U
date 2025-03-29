import React from "react";

const DeliveryStatus = ({ status }) => {
	const steps = [
		{title:'Confirmed', label: "Confirmed", icon: "📦" },
		{title:'RTS', label: "Ready To Ship", icon: "🚚" },
		{title:'Shipped', label: "Shipped", icon: "✈️" },
		{title:'OFD', label: "Out for Delivery", icon: "📬" },
		{title:'Delivered', label: "Delivered", icon: "✅" },
	];

	const currentStepIndex = steps.findIndex((step) => step.label === status);

	if (currentStepIndex < 0) {
		/* return (
			<div className="error-container p-6 bg-red-100 text-red-800 rounded-lg border border-red-300 shadow-lg text-center mb-4">
				<h1 className="error-title text-xl font-bold animate-pulse underline mb-2">{`${status}`}</h1>
			</div>
		); */
		return null;
	}

	return (
		<div className="rounded-lg mb-2 px-2 w-full">
			<div className="w-full">
				<div className="flex items-center justify-between relative">
					{/* Progress Bar */}
					<div className="absolute top-1/2 transform -translate-y-1/2 left-4 right-4 h-1 bg-gray-300">
						<div
						className="h-1 bg-red-400"
						style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
						></div>
					</div>
					{/* Steps */}
					{steps.map((step, index) => (
						<div key={index} className="flex flex-col items-center z-10">
							<div
								className={`flex items-center justify-center rounded-full text-white font-bold shadow-md transition-all duration-300 ${
								index <= currentStepIndex ? "bg-red-400" : "bg-gray-300"
								} w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-lg`}
							>
								{step.icon}
							</div>
							<p
								className={`mt-2 text-xs font-semibold ${
								index <= currentStepIndex ? "text-gray-700" : "text-gray-400"
								}`}
							>
								{step.title}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DeliveryStatus;
