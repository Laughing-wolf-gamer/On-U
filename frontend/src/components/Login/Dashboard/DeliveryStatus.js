import React from "react";

const DeliveryStatus = ({ status }) => {
    const steps = [
        "Processing",
        "Order-Shipped",
        "Out-for-Delivery",
        "Delivered",
    ];

    // Determine the current step index based on the status
    const currentStepIndex = steps.indexOf(status);
    console.log("Current Step Index: ", (currentStepIndex / (steps.length - 1)) * 100);
    return (
        <div className="w-full bg-white px-2 justify-self-start shadow-lg rounded-lg">
            {/* Progress Bar */}
            <div className="flex items-center py-4 justify-between relative">
                {steps.map((step, index) => (
                    <div key={index} className="flex-1 mb-7 py-7 h-fit text-center">
                    {/* Circle representing the step */}
                    <div
                        className={`w-10 h-10 rounded-full mx-auto ${
                            index <= currentStepIndex
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        } flex items-center justify-center transition-colors duration-300`}
                    >
                        {index < currentStepIndex ? (
                            <span className="text-white">✓</span>
                        ) : (
                            <span>{index + 1}</span>
                        )}
                    </div>
                        {/* Step label */}
                        <p
                            className={`mt-3 text-sm ${
                                index <= currentStepIndex ? "text-green-500" : "text-gray-500"
                            }`}
                        >
                            {step}
                        </p>
                    </div>
                ))}

                {/* Progress bar connector */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-0">
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 h-1 bg-green-500`}
                        style={{
                            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`, // Fill the bar to current step
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeliveryStatus;
