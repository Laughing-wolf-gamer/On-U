const UploadOverlay = ({ isUploading }) => {
    if (!isUploading) return null; // Only render the overlay if uploading is true
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md shadow-lg text-center">
          <div className="animate-pulse text-xl text-gray-700 font-semibold">
            <p className="w-full justify-self-center text-center">Uploading images, please wait...</p>
            <div className="mt-4">
              <svg
                className="w-12 h-12 text-blue-600 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1 1 16 0A8 8 0 1 1 4 12z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
};

export default UploadOverlay;