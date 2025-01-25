import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CustomCarousel = ({ selectedSizeColorImageArray }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const carouselWidth = useRef(0); // Store the width of the carousel

  // Update current index based on the scroll position
  const updateCurrentIndex = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.children[0]?.offsetWidth || 0; // Get the width of the first item
      const index = Math.floor(scrollPosition / itemWidth);
      setCurrentIndex(index);
    }
  };

  // Handle drag start
  const handleDragStart = (e) => {
    isDragging.current = true;
    startX.current = e.clientX || e.touches[0].clientX;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  // Handle drag end
  const handleDragEnd = () => {
    isDragging.current = false;
    // Adjust the current index based on scroll position after drag
    updateCurrentIndex();
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging.current) return;
    const x = e.clientX || e.touches[0].clientX;
    const move = (x - startX.current) * 2; // Adjust drag speed by multiplying
    carouselRef.current.scrollLeft = scrollLeft.current - move;
  };

  // Handle swipe on touch devices
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].clientX;
    const move = (x - startX.current) * 2; // Adjust drag speed by multiplying
    carouselRef.current.scrollLeft = scrollLeft.current - move;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    // Adjust the current index based on scroll position after touch end
    updateCurrentIndex();
  };

  // Adjust scroll position when the current index changes
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.offsetWidth || 0;
      carouselRef.current.scrollLeft = currentIndex * itemWidth;
    }
  }, [currentIndex]);

  // Calculate carousel width after the component mounts
  useEffect(() => {
    if (carouselRef.current) {
      carouselWidth.current = carouselRef.current.offsetWidth;
    }
  }, [selectedSizeColorImageArray]);

  // Render indicators (active and non-active)
  const renderIndicator = (index) => {
    return (
      <span
        onClick={() => setCurrentIndex(index)}
        className={`w-3 h-3 rounded-full mx-2 cursor-pointer ${
          currentIndex === index ? 'bg-black' : 'bg-gray-300'
        }`}
      ></span>
    );
  };

  return (
    <div
      className="relative"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onMouseMove={handleDragMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel content */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-4 scroll-smooth snap-x snap-mandatory"
        style={{
          scrollBehavior: 'smooth',
        }}
        onScroll={updateCurrentIndex} // Update index when scrolling
      >
        {selectedSizeColorImageArray && selectedSizeColorImageArray.length > 0 ? (
          selectedSizeColorImageArray.map((im, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-full max-w-[600px] h-[400px] relative snap-start"
            >
              {im.url ? (
                im.url.endsWith('.mp4') ||
                im.url.endsWith('.mov') ||
                im.url.endsWith('.avi') ? (
                  // Video player (ReactPlayer)
                  <div className="relative w-full h-full">
                    <ReactPlayer
                      className="w-full h-full object-contain"
                      url={im.url}
                      loop={true}
                      muted={true}
                      controls={false}
                      playing={true}
                      loading="lazy"
                      width="100%"
                      height="100%"
                    />
                    <div className="h-[30px] bg-neutral-100"></div>
                  </div>
                ) : (
                  // Image lazy-load
                  <div className="relative w-full h-full">
                    <LazyLoadImage
                      effect="blur"
                      src={im.url}
                      alt={`product ${i}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="h-[30px] bg-white"></div>
                  </div>
                )
              ) : (
                // Fallback if no URL is provided
                <div>No media found</div>
              )}
            </div>
          ))
        ) : (
          <div>No media available</div>
        )}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex">
        {selectedSizeColorImageArray.map((_, index) => renderIndicator(index))}
      </div>
    </div>
  );
};

export default CustomCarousel;
