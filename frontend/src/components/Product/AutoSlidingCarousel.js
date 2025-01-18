import React, { useState, useEffect, useRef, useMemo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getImagesArrayFromProducts, hexToRgba } from "../../config";
import ReactPlayer from "react-player";

const AutoSlidingCarousel = ({ pro }) => {
  const imageArray = getImagesArrayFromProducts(pro);
  console.log("Image Array: ", imageArray);
  const [slideIndex, setSlideIndex] = useState(1); // Default to the first slide
  const [videoInView, setVideoInView] = useState(new Array(imageArray.length).fill(false)); // Track video visibility
  const timerRef = useRef(null); // Ref to hold the timer for auto sliding

  // Function to change to a specific slide
  const currentSlide = (n) => {
    setSlideIndex(n);
  };

  // Function to start auto sliding
  const startAutoSliding = () => {
    timerRef.current = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex % imageArray.length) + 1); // Loop through slides
    }, 7000); // Change slide every 7 seconds
  };

  // Function to stop auto sliding
  const stopAutoSliding = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Effect hook to initialize carousel and cleanup on unmount
  useEffect(() => {
    startAutoSliding(); // Start auto sliding when the component mounts

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current); // Cleanup interval on unmount
      }
    };
  }, []); // Empty dependency array means this runs only once when the component mounts

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
      isVideo: im.url && (im.url.includes("video") || im.url.endsWith(".mp4") || im.url.endsWith(".mov") || im.url.endsWith(".avi")),
    }));
  }, [imageArray]); // Recalculate only when imageArray changes

  return (
    <div
      className="slideshow-container min-h-[150px] relative"
      onMouseEnter={stopAutoSliding} // Stop auto sliding when mouse enters
      onMouseLeave={startAutoSliding} // Start auto sliding when mouse leaves
    >
      {imageArray && imageArray.length > 0 && mediaItems.map((mediaItem, i) => (
        <div key={i} className={`${pro._id} fade w-full`} style={slideStyle(i)}>
          {/* Check if the file is a video or image */}
          {mediaItem.isVideo ? (
            // Video file handling with ReactPlayer
            <div className="media-item overflow-hidden video-element" data-index={i} style={{ position: 'relative', width: '100%', height: '100%' }}>
              <ReactPlayer
                url={mediaItem.url}
                loop={true}
                className="w-full h-full object-contain"
                muted={true}
                controls={false}
                loading="lazy"
                width="100%"
                height="100%"
                playing={videoInView[i]} // Play video only when in view
                light={false} // Optional: thumbnail preview
              />
            </div>
          ) : (
            // Image file handling with LazyLoadImage
            <div className="media-item" style={{ position: 'relative', width: '100%', height: '100%' }}>
              <LazyLoadImage
                loading="lazy"
                src={mediaItem.url}
                className="w-full h-full object-contain"
                width="100%"
                alt="product"
                effect="blur"
              />
            </div>
          )}
        </div>
      ))}
  
      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 min-w-max">
        {imageArray.map((_, i) => (
          <div
            key={i}
            className={`${pro._id} inline-block w-2 h-2 mx-1 rounded-full opacity-50 cursor-pointer`}
            onClick={() => currentSlide(i + 1)} // Change slide on dot click
            style={dotStyle(i)} // Dynamic dot color based on current slide
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSlidingCarousel;
