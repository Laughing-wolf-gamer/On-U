import React from "react";

const DeliveryStatus = ({ status , hiddenText }) => {
	const steps = [
		{title:'Confirmed', label: "Confirmed", icon: "📦" },
		{title:'RTS', label: "Ready To Ship", icon: "🚚" },
		{title:'Shipped', label: "Shipped", icon: "✈️" },
		{title:'OFD', label: "Out for Delivery", icon: "📬" },
		{title:'Delivered', label: "Delivered", icon: "✅" },
	];

	let currentStepIndex = steps.findIndex((step) => step.label === status);

	if (currentStepIndex < 0) {
		currentStepIndex = 2;
	}

	return (
		<div className="rounded-lg mb-2 px-2 w-full">
			<div className="w-full overflow-hidden">
				<div className="flex items-center justify-between relative overflow-hidden">
					{/* Progress Bar */}
					<div className="absolute top-1/2 transform -translate-y-[10px] left-6 right-5 h-1 bg-gray-300 rounded-md">
						<div
						className="sm:h-0.5 md:h-1 bg-red-400"
						style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
						></div>
					</div>
					{/* Steps */}
					{steps.map((step, index) => (
						<div key={index} className="flex flex-col items-center z-10 overflow-hidden">
							<div
								className={`flex flex-col items-center justify-center text-white font-bold shadow-md transition-all duration-300  text-sm sm:text-lg`}
							>
								<div className={`rounded-full flex items-center justify-center ${
									index <= currentStepIndex ? "bg-red-400" : "bg-gray-300"
									} w-5 h-5 sm:w-10 sm:h-10`}>
									{step.icon}	
								</div>
								{
									!hiddenText &&  <p
										className={`mt-2 text-xs font-semibold ${
										index <= currentStepIndex ? "text-gray-700" : "text-gray-400"
										}`}
									>
										{step.title}
									</p>
								}
							</div>
							
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DeliveryStatus;
