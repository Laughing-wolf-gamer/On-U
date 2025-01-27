import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef, Fragment } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

const DraggableImageSlider = ({ images, headers, showArrows = true }) => {
    const navigation = useNavigate();
    const sliderRef = useRef(null);
    
    // State to handle dragging and touch events
    const [dragState, setDragState] = useState({
        isDragging: false,
        startX: 0,
        startTouchX: 0,
        scrollLeft: 0,
    });

    // Mouse Down, Mouse Move, Mouse Up Handlers
    const handleMouseDown = (e) => {
        setDragState((prev) => ({
            ...prev,
            isDragging: true,
            startX: e.clientX,
            scrollLeft: sliderRef.current.scrollLeft,
        }));
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!dragState.isDragging) return;
        const moveX = e.clientX - dragState.startX;
        sliderRef.current.scrollLeft = dragState.scrollLeft - moveX + 400;
    };

    const handleMouseUp = () => setDragState((prev) => ({ ...prev, isDragging: false }));
    const handleMouseLeave = () => setDragState((prev) => ({ ...prev, isDragging: false }));

    // Touch Start, Touch Move, Touch End Handlers
    const handleTouchStart = (e) => {
        setDragState((prev) => ({
            ...prev,
            isDragging: true,
            startTouchX: e.touches[0].clientX,
            scrollLeft: sliderRef.current.scrollLeft,
        }));
    };

    const handleTouchMove = (e) => {
        if (!dragState.isDragging) return;
        const moveX = e.touches[0].clientX - dragState.startTouchX;
        sliderRef.current.scrollLeft = dragState.scrollLeft - moveX + 400;
    };

    const handleTouchEnd = () => setDragState((prev) => ({ ...prev, isDragging: false }));

    // Prevent dragging the image itself
    const handleDragStart = (e) => e.preventDefault();

    // Handle image click navigation only when not dragging
    const handleImageClick = (e) => {
        e.preventDefault();
        if (!dragState.isDragging) {
            navigation('/products');
        }
    };

    // Scroll functionality for left and right arrows
    const scroll = (direction) => {
        const slider = sliderRef.current;
        const scrollAmount = 400; // Amount to scroll with each button click
        slider.scrollTo({
            left: slider.scrollLeft + direction * scrollAmount,
            behavior: 'smooth',  // This makes the scroll smooth
        });
    };

    return (
        <div className="grid grid-cols-1 min-h-[200px] bg-slate-200 relative px-10">
            <h1 className="text-3xl font-bold font1 tracking-widest text-slate-800 mb-8">
                {headers}
            </h1>
            <div className="relative w-full flex justify-start items-center">
                {/* Left and Right Arrow Buttons */}
                {showArrows && (
                    <Fragment>
                        {/* Left Arrow Button */}
                        <button
                            onClick={() => scroll(-1)}
                            className="absolute h-[40%] left-4 rounded-md top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-600 opacity-90 hover:opacity-100 z-10"
                        >
                            <ChevronLeft size={40} />
                        </button>
                        {/* Right Arrow Button */}
                        <button
                            onClick={() => scroll(1)}
                            className="absolute h-[40%] right-4 rounded-md top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-600 opacity-90 hover:opacity-100 z-10"
                        >
                            <ChevronRight size={40} />
                        </button>
                    </Fragment>
                )}

                {/* Slider Container to hide overflow items */}
                <div className="w-full overflow-hidden">
                    <ul
                        ref={sliderRef}
                        className="flex flex-row overflow-x-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {images.map((image, index) => (
                            <div
                                key={`q_banners_${index}`}
                                onClick={handleImageClick}
                                className="m-2 min-h-[100px] min-w-[200px] transform transition-transform duration-500 ease-in-out hover:scale-110 mr-4"
                            >
                                <li>
                                    <LazyLoadImage
                                        effect="blur"
                                        src={image}
                                        alt="banners"
                                        loading="lazy"
                                        width="100%"
                                        height="100%"
                                        onDragStart={handleDragStart} // Prevent image drag
                                    />
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DraggableImageSlider;
