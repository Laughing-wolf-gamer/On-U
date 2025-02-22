import { Loader } from "lucide-react";

const UploadOverlay = ({ isUploading }) => {
    if (!isUploading) return null; // Only render the overlay if uploading is true
  
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-md shadow-lg text-center">
				<div className="animate-pulse w-full justify-cente flex flex-col items-center text-xl text-gray-700 font-semibold">
					<p className="w-full text-center">Uploading images, Hold your Breath</p>
					<div className="mt-4">
						<Loader size={60} className="text-gray-600 animate-spin" />
					</div>
				</div>
				<div className="mt-6 relative w-full h-2 bg-gray-300 rounded-full overflow-hidden">
					{/* Shimmering loading bar */}
					<div className="animate-loading-bar absolute top-0 left-0 h-full bg-blue-600"></div>
					
					{/* Shine effect */}
					<div className="shine-effect absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-white opacity-30 animate-shine"></div>
				</div>
			</div>
		</div>
    );
};

export default UploadOverlay;
