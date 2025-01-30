import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomItem } from '../../config';
import ReactPlayer from 'react-player';
const clothingItems = [
  "Half Shirt",
  "Casual Shirt",
  "Formal Shirt",
  "Joggers",
  "Jeans",
  "Cotton Pant",
  "T-shirt",
  "Cargo"
];
const GridImageView = React.memo(({ imageToShow, categoriesOptions = [] }) => {
  const [isLoading, setIsLoading] = useState(true); // State to handle loading state of the media
  const [isError, setIsError] = useState(false); // Error handling state
  const activeClothingItem = getRandomItem(categoriesOptions);
  const navigation = useNavigate();
  const fileExtension = imageToShow.split('.').pop(); // Get the file extension
  const isVideo = ['mp4', 'webm', 'ogg','video','mov','avi'].includes(fileExtension); // Check if the file is a video
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension); // Check if the file is an image
  
  // Lazy loading for videos: Intersection Observer or manual lazy loading could be implemented here
  const handleMediaLoad = () => setIsLoading(false);
  
  const handleError = () => setIsError(true); // Error handling for loading media

  const handleMoveToQuery = () => {
    const queryParams = new URLSearchParams();
    if (activeClothingItem) queryParams.set('category', activeClothingItem.toLowerCase());
    const url = `/products?${queryParams.toString()}`;
    navigation(url);
  };

  return (
    <div onClick={handleMoveToQuery} className="relative w-full h-full rounded-lg overflow-hidden">
      <div className="min-w-xs h-full relative">
        {isLoading && !isError && (
          <div className="w-full max-h-full overflow-hidden relative flex flex-col hover:shadow-md hover:shadow-slate-500 shadow animate-pulse">
            {/* Skeleton loader */}
          </div>
        )}
        {isError ? (
          <span className="text-red-600">Failed to Load Media</span> // Show error message if media fails to load
        ) : (
          <>
            {isImage ? (
              <img
                src={imageToShow}
                alt="media_banner"
                width="100%"
                height="100%"
                loading="lazy"
                className="w-full h-full object-cover rounded-lg"
                onLoad={handleMediaLoad}
                onError={handleError} // Handle image loading error
              />
            ) : isVideo ? (
              <ReactPlayer
                url={imageToShow}
                className="w-full h-full object-cover rounded-lg"
                controls={true}
                playing={true} // You can set this to false based on the platform
                muted={true} // You should mute videos for autoplay on mobile
                width="100%"
                height="100%"
                light={false} // Display a preview thumbnail before loading
                onReady={handleMediaLoad}
                onError={handleError} // Handle video loading error
              />
            ) : (
              <span className="text-red-600">Unsupported file type</span> // For unsupported file types
            )}
          </>
        )}
        <div className="w-full text-black bg-white opacity-50 bottom-5 left-0 justify-start absolute h-30 items-start px-2 flex flex-row font-sans font-bold 2xl:text-xl sm:text-sm text-[10px] md:text-xl">
          {activeClothingItem && <span>{activeClothingItem.toUpperCase()}</span>}
        </div>
      </div>
    </div>
  );
});
export default GridImageView;
