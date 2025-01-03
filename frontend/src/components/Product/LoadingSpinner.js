import { useState } from 'react';

// Loading spinner component
const LoadingSpinner = () => {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="flex flex-col justify-center items-center">
            <div className="border-t-4 border-b-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
        </div>
    </div>
}


export default LoadingSpinner;
