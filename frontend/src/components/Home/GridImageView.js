import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GridImageView = ({ imageToShow }) => {
  const navigation = useNavigate();
  const fileExtension = imageToShow.split('.').pop();  // Get the file extension
  const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);  // Check if the file is a video
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExtension); // Check if the file is an image
  
  const [isLoading, setIsLoading] = useState(true);  // State to handle loading state of the media
  
  const handleMediaLoad = () => {
    setIsLoading(false);  // Set loading to false once the media has finished loading
  };

  return (
    <div onClick={() => navigation("/products")} className="relative w-full h-full rounded-lg overflow-hidden">
      <div className="min-w-xs h-full relative">
        {isLoading && (
          <div className="w-full max-h-full overflow-hidden relative flex flex-col hover:shadow-md hover:shadow-slate-500 shadow"></div>  // Skeleton loader view
        )}
        {
          isImage ? (
            <img
              src={imageToShow}
              alt={`media_banner`}
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
              onLoad={handleMediaLoad}  // Trigger onLoad when the image is loaded
            />
          ) : isVideo ? (
            <video
              className="w-full h-full object-cover rounded-lg"
              controls={false}
              muted
              autoPlay
              onLoadedData={handleMediaLoad}  // Trigger onLoad when the video data is loaded
            >
              <source src={imageToShow} type={`video/${fileExtension}`} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <span>Unsupported file type</span>
          )
        }

      </div>
    </div>
  );
};

export default GridImageView;
