import React, { useState, useCallback, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ImageZoom = ({ imageSrc, zoomSize = 120, maxZoomSize = 200, minZoomSize = 50 }) => {
    const [zoomStyle, setZoomStyle] = useState({});
    const [showZoom, setShowZoom] = useState(false);
    const [currentZoomSize, setCurrentZoomSize] = useState(zoomSize);
    const [isCtrlPressed, setIsCtrlPressed] = useState(false);
    const [fixedZoomPosition, setFixedZoomPosition] = useState(null);

    // Listen for Ctrl key events
    useEffect(() => {
        const handleKeyDown = (e) => {
			console.log("e.key: ",e.key);
            if (e.key === 'Control') {
                setIsCtrlPressed(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === 'Control') {
                setIsCtrlPressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleMouseEnter = useCallback(() => {
        setShowZoom(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        const rect = e.target.getBoundingClientRect(); // Get the position of the image
        const x = e.clientX - rect.left; // Mouse position relative to the image
        const y = e.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;

        const bgX = (x / width) * 100; // Calculate background position as percentage
        const bgY = (y / height) * 100;

		console.log("Fixed Zoom Position: ",fixedZoomPosition);
        if (isCtrlPressed && fixedZoomPosition) {
            // Calculate the distance of the cursor from the center of the zoom box
            const distanceX = Math.abs(fixedZoomPosition.x - x);
            const distanceY = Math.abs(fixedZoomPosition.y - y);

            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2); // Diagonal distance

            // Determine zoom box size based on the cursor's distance from the center
            // Increase the zoom size when the cursor moves away, and decrease when moving closer
            let newSize = currentZoomSize + (distance > 100 ? 2 : -2);

            // Clamp the zoom size between minZoomSize and maxZoomSize
            newSize = Math.min(maxZoomSize, Math.max(minZoomSize, newSize));

            // Update the current zoom size
            setCurrentZoomSize(newSize);

            // Set the zoom style based on the new zoom size and position
            setZoomStyle({
                top: `${y - newSize / 2}px`, // Center the zoom box vertically on the mouse
                left: `${x - newSize / 2}px`, // Center the zoom box horizontally on the mouse
                backgroundPosition: `${bgX}% ${bgY}%`, // Set the background position to follow the mouse
                backgroundImage: `url(${imageSrc})`, // Apply the original image as background
                backgroundSize: `${width * 8}px ${height * 8}px`, // Adjust zoom level (double the image size)
            });
        } else {
            // When Ctrl key is not pressed, zoom box follows the mouse as usual
            setZoomStyle({
                top: `${y - currentZoomSize / 2}px`,
                left: `${x - currentZoomSize / 2}px`,
                backgroundPosition: `${bgX}% ${bgY}%`,
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${width * 2}px ${height * 2}px`,
            });
        }
    }, [currentZoomSize, imageSrc, isCtrlPressed, fixedZoomPosition]);

    const handleMouseLeave = useCallback(() => {
        setShowZoom(false);
    }, []);

    const handleWheel = useCallback((e) => {
        // Prevent browser zoom behavior when Ctrl key is held down
        if (isCtrlPressed) {
            e.preventDefault(); // Prevent default browser zoom
            const zoomAdjustment = e.deltaY < 0 ? 10 : -10; // Zoom in when scrolling up, zoom out when scrolling down
            setCurrentZoomSize((prevSize) => Math.max(minZoomSize, Math.min(maxZoomSize, prevSize + zoomAdjustment))); // Limit zoom size
        }
    }, [isCtrlPressed, minZoomSize, maxZoomSize]);

    const handleClick = useCallback((e) => {
        if (isCtrlPressed) {
            // When Ctrl is pressed, set the zoom box to a fixed position
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setFixedZoomPosition({ x, y });
        }
    }, [isCtrlPressed]);

    return (
        <div 
            className="relative h-full w-full bg-gray-200 overflow-hidden" 
            onWheel={handleWheel}
            onClick={handleClick}
        >
            <img
                src={imageSrc}
                alt="Zoomable"
                loading="lazy"
                className="w-full h-full object-cover"
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onContextMenu={(e) => e.preventDefault()}  // Disable right-click
            />

            {/* Zoom Square */}
            {showZoom && (
                <div
                    className="absolute pointer-events-none border-2 border-gray-300 rounded"
                    style={{
                        ...zoomStyle,
                        width: `${currentZoomSize}px`,  // Size of the zoomed square
                        height: `${currentZoomSize}px`,
                    }}
                ></div>
            )}
        </div>
    );
};

export default ImageZoom;
