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
        <div className="mt-8 px-6 py-4">
            <h1 className="text-3xl text-center font-bold text-slate-800 mb-6 tracking-wide">
                {headers}
            </h1>
            <div className="relative">
                <ul
                    ref={sliderRef}
                    className="flex flex-row overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
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
                                if (!isDragging) {
                                    navigation('/products');
                                }
                            }}
                            className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            <LazyLoadImage
                                effect="blur"
                                src={c}
                                alt={`banner-${index}`}
                                className="min-h-[200px] min-w-[250px] max-w-[300px] transition-transform duration-500 ease-in-out group-hover:scale-110"
                                onDragStart={handleDragStart} // Prevent image drag
                            />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DraggableImageSlider;
