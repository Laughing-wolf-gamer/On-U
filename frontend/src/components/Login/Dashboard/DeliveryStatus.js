import React from "react";

const DeliveryStatus = ({ status }) => {
    const steps = [
        "Confirmed",
        "Processing",
        "Order Shipped",
        "Out for Delivery",
        "Delivered",
    ];

    // Determine the current step index based on the status
    const currentStepIndex = steps.indexOf(status);

    // Calculate the progress percentage
    const progress = (currentStepIndex / (steps.length - 1)) * 100;
    console.log("Current Step Index: ", currentStepIndex);
    console.log("Progress: ", progress);

    return (
        <div className="w-full mb-4 px-4 py-6 justify-self-start shadow-lg rounded-lg">
            {/* Progress Bar */}
            <div className="relative overflow-hidden">
                {/* Progress bar connector for horizontal view (larger screens) */}
                <div className="absolute hidden sm:block top-1/2 my-auto left-0 right-0 h-1 bg-gray-300 z-10">
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 h-1 bg-black`}
                        style={{
                            width: `${progress}%`, // Fill the bar to the current step
                        }}
                    />
                </div>

                {/* Steps */}
                <div className="flex flex-col sm:flex-row h-fit mb-5 sm:space-y-0 overflow-hidden space-y-10 items-center justify-between sm:space-x-6">
                    {/* Vertical progress bar for smaller screens */}
                    <div className="absolute sm:hidden left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-1 bg-gray-300 z-0">
                        <div
                            className="h-full bg-black rounded-md"
                            style={{
                                height: `${progress}%`, // Fill the bar to the current step
                            }}
                        />
                    </div>

                    {steps.map((step, index) => (
                        <div key={index} className="text-center bg-gray-50 flex flex-col items-center z-10">
                            {/* Circle representing the step */}
                            <div
                                className={`w-7 h-7 rounded-full font-bold mx-auto mb-3 flex items-center justify-center transition-colors duration-300 ${
                                    index <= currentStepIndex
                                        ? "bg-black text-white"
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
                                        ? "text-black"
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
