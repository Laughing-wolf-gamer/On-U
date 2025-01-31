import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = ({user,isAuthenticated}) => {
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(()=>{
        if(user){
            navigate('/admin/dashboard')
        }else{
            isAuthenticated ? navigate('/') : navigate('/auth/login')
        }
        },5000)
    },[])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Oops! Page Not Found</p>
        <a
            href="/"
            className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors"
        >
            Go Back Home
        </a>
        <span >
            Reload the Page to move Back to Home Page.
        </span>
        </div>
    );
};

export default NotFound;
