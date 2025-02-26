import React, { useState, useEffect, useRef, useMemo } from "react";
import { getImagesArrayFromProducts, hexToRgba } from "../../config";
import ReactPlayer from "react-player";
import { Heart } from "lucide-react";
import { createwishlist, getwishlist } from "../../action/orderaction";
import { useDispatch } from "react-redux";
import { useSessionStorage } from "../../Contaxt/SessionStorageContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";

const AutoSlidingCarousel = ({ pro, user, wishlist = [], showWishList = true }) => {
    const { sessionData,sessionBagData, setWishListProductInfo } = useSessionStorage();
    const [isInWishList, setIsInWishList] = useState(false);
	const {checkAndCreateToast} = useSettingsContext();


    const [imageArray,setImageArray] = useState([]);
    const [slideIndex, setSlideIndex] = useState(1); // Default to the first slide
    const [videoInView, setVideoInView] = useState(new Array(imageArray.length).fill(false)); // Track video visibility
    const timerRef = useRef(null); // Ref to hold the timer for auto sliding
    const dispatch = useDispatch();

    useEffect(()=>{
        setImageArray(getImagesArrayFromProducts(pro, true))
    },[pro])

    // Function to change to a specific slide
    const currentSlide = (n) => {
        setSlideIndex(n);
    };

    // Function to start auto sliding
    const startAutoSliding = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current); // Clear any existing interval
        }
        timerRef.current = setInterval(() => {
            // toast.info("Timer changed: ");
            setSlideIndex((prevIndex) => (prevIndex % imageArray.length) + 1); // Loop through slides
        }, 5000); // Change slide every 7 seconds
    };

    // Function to stop auto sliding
    const stopAutoSliding = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current); // Stop the auto sliding
        }
    };

    useEffect(() => {
        // Check if the user is logged in
        if(wishlist){
            updateButtonStates();
        }
    }, [user, wishlist, pro,sessionData]); 

    // Track visibility of video elements using IntersectionObserver
    const observer = useRef(
        new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = entry.target.dataset.index;
                setVideoInView((prevState) => {
                    const updatedState = [...prevState];
                    updatedState[index] = entry.isIntersecting;
                    return updatedState;
                });
            });
        }, { threshold: 0.5 }) // 50% visibility before triggering play
    );
    const updateButtonStates = () => {
        if (user) {
            // console.log("Updateing wishList: ",wishlist);
            setIsInWishList(wishlist?.orderItems?.some(w => w.productId?._id === pro?._id));
        } else {
            setIsInWishList(sessionData.some(b => b.productId?._id === pro?._id));
        }
    };

    useEffect(() => {
        const videoElements = document.querySelectorAll(".video-element");
        videoElements.forEach((video) => {
            observer.current.observe(video);
        });

        return () => {
            videoElements.forEach((video) => {
                observer.current.unobserve(video);
            });
        };
    }, [imageArray]); // Re-run observer setup when imageArray changes

    // Calculate slide visibility and dot highlight based on slideIndex
    const slideStyle = (i) => ({
        display: i + 1 === slideIndex ? "block" : "none", // Show only the current slide
    });

    const dotStyle = (i) => ({
        backgroundColor: slideIndex === i + 1 ? hexToRgba('#1D1616', 0.5) : hexToRgba('#9AA6B2', 1),
    });

    // Memoize the media type for each image in the imageArray
    const mediaItems = useMemo(() => {
        return imageArray.map((im) => ({
        url: im.url,
        isVideo:
            im.url &&
            (im.url.includes("video") ||
            im.url.endsWith(".mp4") ||
            im.url.endsWith(".mov") ||
            im.url.endsWith(".avi")),
        }));
    }, [imageArray]); // Recalculate only when imageArray changes

    const addToWishList = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (user) {
            const response = await dispatch(createwishlist({ productId: pro._id }));
            await dispatch(getwishlist());
            checkAndCreateToast("success", "Wishlist Updated Successfully");
            // console.log("Wishlist Updated Successfully: ",response);
            if(response){
                setIsInWishList(response);
                // updateButtonStates();
            }
        } else {
            setWishListProductInfo(pro, pro._id);
            checkAndCreateToast("success", "Bag is Updated Successfully");
            updateButtonStates();
        }
    };
    useEffect(() => {
        updateButtonStates();
        console.log("Wishlist Updated Successfully",sessionData);
    }, [sessionData,sessionBagData]);

    return (
        <div
            className="slideshow-container font-kumbsan min-w-full h-full bg-gray-200 relative overflow-hidden"
            onMouseEnter={startAutoSliding} // Start auto sliding when mouse enters
            onMouseLeave={stopAutoSliding} // Stop auto sliding when mouse leaves
        >
            {pro ? (
                <div className="w-full h-full justify-center items-start flex flex-col">
                {imageArray &&
                    imageArray.length > 0 &&
                    mediaItems.map((mediaItem, i) => (
                        <div
                            key={i}
                            className={`fade w-full h-fit`}
                            style={slideStyle(i)}
                        >
                            {/* Skeleton Loader */}
                            {mediaItem.isVideo ? (
                                // Video file handling with ReactPlayer (Skeleton for Video)
                                <div
                                    className="media-item overflow-hidden video-element"
                                    data-index={i}
                                    style={{ position: "relative", width: "100%", height: "100%" }}
                                >
                                    {/* Skeleton loader for video */}
                                    <div
                                        className="w-full h-full bg-gray-200 animate-pulse"
                                        style={{ position: "absolute", top: 0, left: 0 }}
                                    ></div>
                                    <ReactPlayer
                                        url={mediaItem.url}
                                        loop={true}
                                        className="w-full min-h-64 object-contain"
                                        muted={true}
                                        controls={false}
                                        loading="lazy"
                                        width="100%"
                                        height="100%"
                                        playing={videoInView[i]} // Play video only when in view
                                        light={false} // Optional: thumbnail preview
                                        onStart={() => setVideoInView((prev) => [...prev, true])} // Start video when in view
                                        onEnded={() => setVideoInView((prev) => [...prev, false])} // Stop video after it ends
                                    />
                                </div>
                            ) : (
                                // Image file handling with LazyLoadImage (Skeleton for Image)
                                <div
                                    className="media-item"
                                    style={{ position: "relative", width: "100%", height: "100%" }}
                                >
                                    <img
                                        loading="lazy"
                                        src={mediaItem.url}
                                        className="w-full h-full object-contain"
                                        width="100%"
                                        alt="product"
                                        onLoad={() => setVideoInView((prev) => [...prev, true])} // Ensure it stops showing skeleton when image is loaded
										onContextMenu={(e) => e.preventDefault()}  // Disable right-click
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                // Show loading spinner or something else here while data is not available
                <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
            )}

            {/* Navigation Dots */}
            {showWishList && (
				<div
					className="absolute top-3 left-2 min-w-max focus:outline-none transition duration-300 ease-out hover:scale-110 transform hover:translate-y-1"
					onClick={addToWishList}
				>
					{isInWishList ? (
						<div className="text-red-500 animate-shine p-1 rounded-full">
							<Heart fill="red" className="text-red-500 animate-pulse duration-500" />
						</div>
					) : (
						<div className="transition-all duration-300 ease-out hover:scale-110 hover:translate-y-2">
							<Heart fill="white" className="text-white" />
						</div>
					)}
				</div>
			)}

        </div>
    );
};

export default AutoSlidingCarousel;
