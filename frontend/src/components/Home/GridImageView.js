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
const GridImageView = ({ imageToShow ,categoriesOptions = []}) => {
  const activeClothingItem = getRandomItem(categoriesOptions)
  const navigation = useNavigate();
  const fileExtension = imageToShow.split('.').pop();  // Get the file extension
  const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);  // Check if the file is a video
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg','webp'].includes(fileExtension); // Check if the file is an image
  
  const [isLoading, setIsLoading] = useState(true);  // State to handle loading state of the media
  
  const handleMediaLoad = () => {
    setIsLoading(false);  // Set loading to false once the media has finished loading
  };
  const handleMoveToQuery = ()=>{
    const queryParams = new URLSearchParams();
    
		if (activeClothingItem) queryParams.set('category', activeClothingItem.toLowerCase());
    const url = `/products?${queryParams.toString()}`;
    navigation(url);
  }

  return (
    <div onClick={handleMoveToQuery} className="relative w-full h-full rounded-lg overflow-hidden">
      <div className="min-w-xs h-full relative">
        {isLoading && (
          <div className="w-full max-h-full overflow-hidden relative flex flex-col hover:shadow-md hover:shadow-slate-500 shadow"></div>  // Skeleton loader view
        )}
        {
          isImage ? (
            <img
              src={imageToShow}
              alt={`media_banner`}
              width="100%"
              height="100%"
              loading="lazy"
              className="w-full h-full object-cover rounded-lg"
              onLoad={handleMediaLoad}  // Trigger onLoad when the image is loaded
            />
          ) : isVideo ? (
            <ReactPlayer
              url={imageToShow}
              className="w-full h-full object-cover rounded-lg"
              controls={true}
              autoPlay={true}
              playing={true}
              muted={true}
              width="100%"
              height="100%"
              light={false}
              onReady={handleMediaLoad}
            />
          ) : (
            <span className='text-red-600'>Unsupported file type/ or Failed to Load</span>
          )
        }
        <div className='w-full text-black bg-white opacity-50 bottom-5 left-0 justify-start absolute h-30 items-start px-2 flex flex-row font-sans font-bold 2xl:text-xl sm:text-sm text-[10px] md:text-xl'>
          {
            activeClothingItem && <span> {activeClothingItem.toUpperCase()} </span>
          }
        </div>

      </div>
    </div>
  );
};

export default GridImageView;
