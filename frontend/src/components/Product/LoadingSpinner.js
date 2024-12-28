import { useState } from 'react';

// Loading spinner component
const LoadingSpinner = () => {
    return<div className="flex justify-center items-center">
        <div className="border-t-4 border-b-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
    </div>
}


export default LoadingSpinner;
