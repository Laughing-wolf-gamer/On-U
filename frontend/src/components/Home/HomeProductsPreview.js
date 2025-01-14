import { ShoppingCart } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { calculateDiscount, calculateDiscountPercentage, getImagesArrayFromProducts } from '../../config';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';

const HomeProductsPreview = ({ product }) => {
    const navigation = useNavigate();
    const imageArray = getImagesArrayFromProducts(product);
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
            className="w-[90%] bg-slate-200 my-auto h-[80%] overflow-hidden relative flex flex-col transform transition-all duration-300 ease-in-out hover:scale-105"
            onMouseEnter={() => {
                setIsHovered(true);
                handleMouseEnter(0);
            }}
            onMouseLeave={handleMouseLeave}
        >
            <div className="min-w-xs h-full bg-white">
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
                    w-full h-10 flex items-center justify-center 
                    text-white bg-black hover:bg-gray-600 text-center 
                    font-semibold transition-all duration-300 ease-in-out 
                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                <button className="w-full flex items-center text-white justify-center space-x-2 font-medium">
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                </button>
            </div>

            {product && product.salePrice && product.salePrice > 0 && product.salePrice < product.price && (
                <div
                    className={`absolute right-0 top-4 transform z-20 w-fit rounded-tl-lg rounded-bl-lg h-8 p-3 justify-center items-center flex text-white bg-gray-800 text-center font-semibold transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[30px]'}`}
                >
                    <span className="font-semibold text-center text-xs">{amount}% OFF</span>
                </div>
            )}
        </div>
    );
};

const ProductImageVideoView = ({ imageArray, hoveredImageIndex, product, navigation }) => {
    // Function to check if the file is a video based on URL
    const isVideo = (url) => {
        return (
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".avi") ||
            url.includes(".webm")
        );
    };

    // Memoize selected media to avoid recalculating on each render
    const selectedMedia = useMemo(() => {
        return imageArray[hoveredImageIndex];
    }, [imageArray, hoveredImageIndex]);

    // Memoize the media type check (video or image) to avoid recalculating on each render
    const mediaIsVideo = useMemo(() => {
        return selectedMedia && selectedMedia?.url && isVideo(selectedMedia?.url);
    }, [selectedMedia]);

    return (
        imageArray && imageArray.length > 0 && (
            <div
                onClick={(e) => {
                    e.preventDefault();
                    navigation(`/products/${product?._id}`);
                }}
                className="w-full h-full relative transition-opacity duration-500 ease-in-out cursor-pointer bg-gray-100"
            >
                {/* Check if the selected media is a video or an image */}
                {mediaIsVideo ? (
                    <ReactPlayer
                        className="w-full h-full object-fill"
                        url={selectedMedia.url || selectedMedia}
                        playing={true} // Do not autoplay for better performance
                        controls={false} // Show video controls
                        muted
                        width="100%"
                        height="100%"
                        light={false} // Show thumbnail before playing video
                    />
                ) : (
                    <LazyLoadImage
                        effect="blur"
                        src={selectedMedia.url || selectedMedia}
                        width="100%"
                        height="100%"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        alt={`Product ${hoveredImageIndex}`}
                    />
                )}
            </div>
        )
    );
};

export default HomeProductsPreview;
