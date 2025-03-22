import React, { useState, useCallback, useMemo, memo } from 'react';
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

const GridImageView = ({ imageToShow, categoriesOptions = [], startPlaying = false,categoryName }) => {
    // const activeClothingItem = useMemo(() => getRandomItem(categoriesOptions) || getRandomItem(clothingItems), [categoriesOptions]);
    const navigation = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // console.log("Image to show: ", imageToShow);
    const fileExtension = imageToShow.split('.').pop();
    const isVideo = ['mp4', 'webm', 'ogg', 'video', 'mov', 'avi'].includes(fileExtension);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileExtension);

    const handleMediaLoad = useCallback(() => setIsLoading(false), []);
    const handleError = useCallback(() => setIsError(true), []);
    const handleMoveToQuery = useCallback(() => {
        const queryParams = new URLSearchParams();
        if (categoryName) queryParams.set('category', categoryName.toLowerCase());
        const url = `/products?${queryParams.toString()}`;
        navigation(url);
    }, [categoryName, navigation]);

    return (
        <div onClick={handleMoveToQuery} className="relative font-kumbsan w-full h-auto rounded-lg overflow-hidden cursor-pointer">
            <div className="min-w-xs h-full relative">
                {isError ? (
                    <span className="text-red-600">Failed to Load Media</span>
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
                                onError={handleError}
                            />
                        ) : isVideo ? (
                            <ReactPlayer
                                url={imageToShow}
                                className="w-full h-full object-cover rounded-lg"
                                loop = {true}
                                controls = {false}
                                playing={startPlaying}
                                muted
                                width="100%"
                                height="100%"
                                light={false}
                                onReady={handleMediaLoad}
                                onError={handleError}
                            />
                        ) : (
                            <span className="text-red-600">Unsupported file type</span>
                        )}
                    </>
                )}
                <div className="w-full text-black bg-white opacity-50 uppercase bottom-5 left-0 justify-start absolute h-30 items-start px-2 flex flex-row font-bold 2xl:text-xl sm:text-sm text-[10px] md:text-xl">
                    <span>{categoryName}</span>
                </div>
            </div>
        </div>
    );
}

export default GridImageView;
