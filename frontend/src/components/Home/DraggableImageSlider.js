import React, { useState, useRef } from 'react'; 
import { LazyLoadImage } from 'react-lazy-load-image-component'; 
import { useNavigate } from 'react-router-dom';  

const DraggableImageSlider = ({ images, headers }) => {     
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
        sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;     
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
        sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;     
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

    console.log("is Draggable", dragState)      

    return (         
        <div className="pt-1 px-7 grid grid-cols-1 min-h-[200px] bg-slate-200">             
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
                    {images.map((image, index) => (                         
                        <div                             
                            key={`q_banners_${index}`}                             
                            onClick={handleImageClick}                             
                            className="m-2 transform transition-transform duration-300 ease-in-out hover:scale-105"                         
                        >                             
                            <li>                                 
                                <LazyLoadImage                                     
                                    effect="blur"                                     
                                    src={image}                                     
                                    alt="banners"                                     
                                    loading="lazy"                                     
                                    className="min-h-[100px] min-w-[200px]  hover:bg-blue-500"                                     
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
