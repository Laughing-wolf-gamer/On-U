import React from "react";

const DeliveryStatus = ({ status }) => {
    const steps = [
        "Processing",
        "Order Confirmed",
        "Order Shipped",
        "Out for Delivery",
        "Delivered",
    ];

    // Determine the current step index based on the status
    const currentStepIndex = steps.indexOf(status);
    console.log("Current Step Index: ", (currentStepIndex / (steps.length - 1)) * 100);

    return (
        <div className="w-full mb-4 px-4 py-6 justify-self-start shadow-lg rounded-lg">
            {/* Progress Bar */}
            <div className="relative">
                {/* Progress bar connector */}
                <div className="absolute hidden md:block top-1/2 my-auto left-0 right-0 h-1 bg-gray-300 z-0">
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 h-1 bg-green-500`}
                        style={{
                            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`, // Fill the bar to current step
                        }}
                    />
                </div>

                {/* Steps */}
                <div className="flex flex-col h-fit mb-5 sm:flex-row items-center justify-between space-y-10 sm:space-y-0 sm:space-x-6">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center flex flex-col items-center">
                            {/* Circle representing the step */}
                            <div
                                className={`w-7 h-7 rounded-full bg-white font-bold mx-auto mb-3 flex items-center justify-center transition-colors duration-300 ${
                                    index <= currentStepIndex
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-300 text-gray-600"
                                }`}
                            >
                                {index < currentStepIndex ? (
                                    <span className="text-white text-xl">✓</span>
                                ) : (
                                    <span className="text-xl">{index + 1}</span>
                                )}
                            </div>
                            {/* Step label */}
                            <p
                                className={`text-sm font-bold text-center flex-wrap ${
                                    index <= currentStepIndex
                                        ? "text-green-500"
                                        : "text-gray-500"
                                }`}
                            >
                                {step}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeliveryStatus;
