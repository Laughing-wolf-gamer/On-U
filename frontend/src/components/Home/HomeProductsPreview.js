import { Heart, ShoppingCart } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateDiscount, calculateDiscountPercentage, getImagesArrayFromProducts } from '../../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const HomeProductsPreview = ({ product }) => {
    const navigation = useNavigate();
    const imageArray = getImagesArrayFromProducts(product,true);
    console.log("Image Array: ",imageArray);
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
    const [timer, setTimer] = useState(null);

    // Handle mouse enter event
    const handleMouseEnter = (index) => {
        setIsHovered(true);
        setHoveredImageIndex(index);
        const newTimer = setInterval(() => {
            setHoveredImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
        }, 1000); // Change image every 1000ms
        setTimer(newTimer);
        clearInterval(newTimer);
    };

    // Handle mouse leave event
    const handleMouseLeave = () => {
        setIsHovered(false);
        setHoveredImageIndex(0);
        if (timer) {
            clearInterval(timer);
            setTimer(null);
        }
    };

    // Cleanup timer when component unmounts
    useEffect(() => {
        // Clear interval if the component is unmounted or if timer changes
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timer]);

    const amount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price 
        ? calculateDiscountPercentage(product?.price, product?.salePrice) 
        : product?.price;

    // Auto hover effect for smaller screens
    if (window.screen.width < 1024 && !isHovered) {
        setIsHovered(true);
    }

    return (
        <div
            className="w-[100%] h-[100%] overflow-hidden relative flex flex-col hover:shadow-md hover:shadow-slate-500 shadow"
            onMouseEnter={() => {
                setIsHovered(true);
                handleMouseEnter(0);
            }}
            onMouseLeave={handleMouseLeave}
        >
            <div className="min-w-xs h-full">
                {
                    imageArray && imageArray.length && 
                        <ProductImageVideoView 
                            imageArray={imageArray} 
                            hoveredImageIndex={hoveredImageIndex} 
                            product={product} 
                            navigation={navigation} 
                        />
                }
            </div>
            <div 
                className={`absolute bottom-0 left-1/2 transform z-20 -translate-x-1/2 
                    w-full h-fit flex flex-col gap-1 items-center justify-center 
                    font-sans transition-all duration-300 ease-in-out
                    ${isHovered ? 'opacity-100 translate-y-0 shadow' : 'opacity-0 translate-y-4'}`}
            >
                <div
                    className={`w-full h-fit`}
                >
                    <button onClick={(e)=>{
                        e.stopPropagation();
                        navigation(`/products/${product?._id}`);
                    }} className="w-full h-7 md:h-10 flex text-sm items-center text-black bg-white focus:bg-red-400 focus:bg text-center justify-center font-sans hover:shadow-md">
                        <Heart size={20} />
                        <span className='font-sans'>Add to Wishlist</span>
                    </button>
                </div>
                <div
                    className={`w-full h-fit`}
                >
                    <button onClick={(e)=>{
                        navigation(`/products/${product?._id}`);  
                    }} className="w-full h-7 md:h-10 flex text-sm items-center text-white bg-gray-800 hover:bg-gray-900 focus:bg-gray-700 text-center justify-center font-sans hover:shadow-md">
                        <ShoppingCart size={20} />
                        <span className='font-sans'>Add to Cart</span>
                    </button>
                </div>
            </div>

            {product && product.salePrice && product.salePrice > 0 && product.salePrice < product.price && (
                <div
                    className={`absolute right-0 top-4 transform z-20 w-fit rounded-tl-lg rounded-bl-lg h-3 md:h-8 p-3 justify-center items-center flex text-white bg-gray-800 text-center font-sans font-normal md:font-semibold transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[30px]'}`}
                >
                    <span className="font-semibold text-center text-xs">{amount}% OFF</span>
                </div>
            )}
        </div>
    );
};

const ProductImageVideoView = ({ imageArray, hoveredImageIndex, product, navigation }) => {
    // Function to check if the file is a video based on URL
    const isVideo = useCallback((url) => {
        return (
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".avi") ||
            url.includes(".webm")
        );
    }, []);

    // Memoize selected media to avoid recalculating on each render
    const selectedMedia = useMemo(() => imageArray[hoveredImageIndex], [imageArray, hoveredImageIndex]);

    // Memoize media type check to avoid recalculating on each render
    const mediaIsVideo = useMemo(() => selectedMedia && selectedMedia.url && isVideo(selectedMedia.url), [selectedMedia, isVideo]);

    // Handle the navigation on click, memoized to avoid unnecessary re-renders
    const handleClick = useCallback((e) => {
        e.preventDefault();
        navigation(`/products/${product?._id}`);
    }, [navigation, product]);

    // Early return if there is no valid image array or selected media
    if (!imageArray || imageArray.length === 0 || !selectedMedia) {
        return null;
    }

    return (
        <div
            onClick={handleClick}
            className="w-full h-full relative transition-opacity duration-500 ease-in-out cursor-pointer"
        >
            {/* Check if the selected media is a video or an image */}
            {mediaIsVideo ? (
                <ReactPlayer
                    className="w-full h-full object-fill"
                    url={selectedMedia.url}
                    playing
                    controls={false}
                    loading="lazy"
                    muted
                    width="100%"
                    height="100%"
                    light={false} // Show thumbnail before playing video
                />
            ) : (
                <LazyLoadImage
                    effect="blur"
                    src={selectedMedia.url}
                    width="100%"
                    height="100%"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    alt={`Product ${hoveredImageIndex}`}
                />
            )}
        </div>
    );
};

export default HomeProductsPreview;
