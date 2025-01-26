import { Heart, ShoppingCart } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { createwishlist, getwishlist } from '../../action/orderaction';
import { useToast } from '../../Contaxt/ToastProvider';
import toast from 'react-hot-toast';

const HomeProductsPreview = ({ product,user,wishlist = [], selectedColorImages = [] ,dispatch}) => {
    const { sessionData, setWishListProductInfo } = useSessionStorage();
    const [isInWishList, setIsInWishList] = useState(false);
    const navigation = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
    const [timer, setTimer] = useState(null);
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type, message) => {
        console.log("check Toast: ", type, message, activeToast);
        if (activeToast !== message) {
        switch (type) {
            case "error":
            toast.error(message);
            break;
            case "warning":
            toast.warning(message);
            break;
            case "info":
            toast.info(message);
            break;
            case "success":
            toast.success(message);
            break;
            default:
            toast.info(message);
            break;
        }
        showToast(message);
        }
    };
    const addToWishList = async (e) => {
        e.stopPropagation();
        if (user) {
          const response = await dispatch(createwishlist({ productId: product._id }));
          await dispatch(getwishlist());
          checkAndCreateToast("success", "Wishlist Updated Successfully");
          console.log("Wishlist Updated Successfully: ",response);
          if(response){
            // updateButtonStates();
            setIsInWishList(response);
          }
        } else {
          setWishListProductInfo(product, product._id);
          checkAndCreateToast("success", "Bag is Updated Successfully");
          updateButtonStates();
        }
      };
    // Handle mouse enter event
    const handleMouseEnter = (index) => {
        setIsHovered(true);
        setHoveredImageIndex(index);
        const newTimer = setInterval(() => {
            setHoveredImageIndex((prevIndex) => (prevIndex + 1) % selectedColorImages.length);
        }, 1000); // Change image every 1000ms
        setTimer(newTimer);
        clearInterval(newTimer);
    };
    useEffect(() => {
        // Check if the user is logged in
        if(wishlist){
            updateButtonStates();
        }
    }, [user, wishlist, product,sessionData]);
    const updateButtonStates = () => {
        if (user) {
            // console.log("Updateing wishList: ",wishlist);
            setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === product?._id));
        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === product?._id));
        }
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
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timer]);

    // Auto hover effect for smaller screens
    if (window.screen.width < 1024 && !isHovered) {
        setIsHovered(true);
    }

    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

    // Check if product exists
    const amount = useMemo(() => {
        if (product && product.salePrice < product.price) {
            return Math.round((product.price - product.salePrice) / product.price * 100);
        }
        return 0;
    }, [product]);

    // Handle hover state
    const handleMediaLoad = () => {
        setIsMediaLoaded(true); // Set media as loaded when it's ready
    };

    return (
        <div
            className="w-full sm:w-full md:w-full lg:w-full max-h-full overflow-hidden relative flex flex-col hover:shadow-md hover:shadow-slate-500 shadow"
            onMouseEnter={() => {
                setIsHovered(true);
                handleMouseEnter(0);
            }}
            onMouseLeave={handleMouseLeave}
        >
            {/* Skeleton for Product Image/Video */}
            <div className="min-w-xs h-full relative">
                {!isMediaLoaded && (
                    <div className="w-full h-full animate-pulse bg-gray-100"></div> // Skeleton loader
                )}
                {selectedColorImages && selectedColorImages.length > 0 && (
                    <ProductImageVideoView
                        imageArray={selectedColorImages}
                        hoveredImageIndex={hoveredImageIndex}
                        product={product}
                        navigation={navigation}
                        onLoad={handleMediaLoad} // Pass media load handler to the component
                    />
                )}
            </div>

            {/* Skeleton for Buttons */}
            <div
                className={`absolute bottom-0 left-1/2 transform z-20 -translate-x-1/2
                    w-full h-fit flex flex-col gap-1 items-center justify-center
                    font-sans transition-all duration-300 ease-in-out md:text-sm text-xs
                    ${isHovered ? 'opacity-100 translate-y-0 shadow' : 'opacity-0 translate-y-4'}`}
            >
                {!product ? (
                    <div className="w-full h-10 bg-gray-300 animate-pulse rounded-md"></div> // Skeleton button
                ) : (
                    <>
                        <div className="w-full h-7 md:h-10 flex items-center justify-center font-sans">
                            <button onClick={addToWishList} className="w-full h-full flex items-center text-black bg-white text-center justify-center font-sans hover:shadow-md space-x-2">
                                {
                                    isInWishList ? <div className='animate-vibrateScale'><Heart size={30} fill='red' strokeWidth={0}/></div>:<Heart size={30} />
                                }
                                <span className="font-sans text-xs md:text-sm">Add to Wishlist</span>
                            </button>
                        </div>
                        <div className="w-full h-7 md:h-10 flex items-center justify-center font-sans">
                            <button onClick={(e) => { navigation(`/products/${product?._id}`); }} className="w-full h-full flex items-center text-white bg-gray-900 text-center justify-center font-sans hover:shadow-md space-x-2">
                                <ShoppingCart size={30} />
                                <span className="font-sans text-xs md:text-sm">Add to Cart</span>
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Skeleton for Discount Badge */}
            <div className="md:block hidden">
                {!product || amount === 0 ? (
                    <div className="absolute right-0 top-4 transform z-20 w-fit h-8 p-3 justify-center items-center flex bg-gray-300 animate-pulse rounded-tl-lg rounded-bl-lg"></div> // Skeleton discount badge
                ) : (
                    <div
                        className={`absolute right-0 top-4 transform z-20 w-fit rounded-tl-lg rounded-bl-lg h-8 p-3 justify-center items-center flex text-white bg-gray-800 text-center font-sans font-normal md:font-semibold transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[30px]'}`}
                    >
                        <span className="font-semibold text-center text-[10px] md:text-xs">{amount}% OFF</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductImageVideoView = ({ imageArray, hoveredImageIndex, product, navigation ,onLoad}) => {
    // State to track whether the media is loaded
    const [isMediaLoaded, setIsMediaLoaded] = useState(false);

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
        if(product){
            navigation(`/products/${product?._id}`);
        }
    }, [navigation, product]);

    // Early return if there is no valid image array or selected media
    if (!imageArray || imageArray.length === 0 || !selectedMedia) {
        return null;
    }

    // Function to handle media load completion
    const handleMediaLoad = () => {
        setIsMediaLoaded(true);
        if(onLoad){
            onLoad();
        }
    };

    return (
        <div
            onClick={handleClick}
            className="w-full h-full bg-gray-100 relative transition-opacity duration-500 ease-in-out cursor-pointer"
        >
            {/* Skeleton Loader */}
            {!isMediaLoaded && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse">
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                </div>
            )}
            <Fragment>
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
                        onReady={handleMediaLoad} // Trigger media load completion
                    />
                ) : (
                    <img
                        effect="blur"
                        src={selectedMedia.url}
                        width="100%"
                        height="100%"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        alt={`Product ${hoveredImageIndex}`}
                        onLoad={handleMediaLoad} // Trigger media load completion
                    />
                )}
            </Fragment>
        </div>
    );
};

export default HomeProductsPreview;
