import { Link } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

const DraggableImageSlider = ({ images, headers }) => {
    const navigation = useNavigate();
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startTouchX, setStartTouchX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse Down handler
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(sliderRef.current.scrollLeft);
        // Disable image dragging while dragging the slider
        e.preventDefault();
    };

    // Mouse Move handler
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const moveX = e.clientX - startX;
        sliderRef.current.scrollLeft = scrollLeft - moveX;
    };

    // Mouse Up handler
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Mouse Leave handler
    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Touch Start handler
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setStartTouchX(e.touches[0].clientX);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    // Touch Move handler
    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const moveX = e.touches[0].clientX - startTouchX;
        sliderRef.current.scrollLeft = scrollLeft - moveX;
    };

    // Touch End handler
    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Prevent dragging the image itself
    const handleDragStart = (e) => {
        e.preventDefault();
    };

    return (
        <div className="mt-4 grid grid-cols-1 min-h-[200px]">
            <h1 className="text-3xl px-8 font-bold font1 tracking-widest text-slate-800 mb-8 mt-8">
                {headers}
            </h1>
            <div className="w-screen flex justify-start items-center">
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
                    {images.map((c, index) => (
                        <div
                            key={`q_banners_${index}`}
                            onClick={(e) => {
                                e.preventDefault();
                                if (isDragging) {
                                    navigation('/products');
                                }
                            }}
                            className="m-2"
                        >
                            <li>
                                <LazyLoadImage
                                    effect="blur"
                                    src={c}
                                    alt="banners"
                                    className="min-h-[100px] min-w-[200px] transform transition-transform duration-500 ease-in-out hover:scale-110"
                                    onDragStart={handleDragStart} // Prevent image drag
                                />
                            </li>
                        </div>
                    ))}

                </ul>
            </div>
        </div>
    );
};

export default DraggableImageSlider;