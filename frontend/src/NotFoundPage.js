import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Import the icon from react-icons
import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r white">
			<div className="text-center text-gray-900">
				<FaExclamationTriangle className="text-8xl mb-4" /> {/* Display the icon */}
				<h1 className="text-6xl font-extrabold">404</h1>
				<p className="text-lg mt-2">Oops! Page not found.</p>
				<p className="text-sm mt-1">
				The page you are looking for might have been moved or deleted.
				</p>
				<Link
					to="/"
					className="mt-6 inline-block bg-gray-700 text-white px-6 py-2 rounded-lg text-lg hover:bg-gray-600 transition-all"
				>
				Go Back to Home
				</Link>
			</div>
		</div>
	);
};

export default NotFoundPage;
