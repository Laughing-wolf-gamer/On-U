import React, { useState, useEffect, useRef } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getImagesArrayFromProducts, hexToRgba } from "../../config";

const AutoSlidingCarousel = ({ pro }) => {
  const imageArray = getImagesArrayFromProducts(pro);
  const [slideIndex, setSlideIndex] = useState(1); // Default to the first slide
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

  // Calculate slide visibility and dot highlight based on slideIndex
  const slideStyle = (i) => ({
    display: i + 1 === slideIndex ? "block" : "none", // Show only the current slide
  });

  const dotStyle = (i) => ({
    backgroundColor: slideIndex === i + 1 ? hexToRgba('#9AA6B2', 0.5) : hexToRgba('#9AA6B2', 1),
  });

  return (
    <div
      className="slideshow-container min-h-[150px] relative"
      onMouseEnter={stopAutoSliding} // Stop auto sliding when mouse enters
      onMouseLeave={startAutoSliding} // Start auto sliding when mouse leaves
    >
      {/* Render all slides */}
      {imageArray.map((im, i) => (
        <div key={i} className={`${pro._id} fade w-full`} style={slideStyle(i)}>
          <LazyLoadImage
            src={im.url ? im.url : im} // Use url or fallback to the image itself
            className="w-full h-full object-contain"
            width="100%"
            alt="product"
            effect="blur"
          />
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
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
