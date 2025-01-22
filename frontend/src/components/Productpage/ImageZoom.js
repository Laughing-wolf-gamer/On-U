import React, { useState } from "react";

const ImageZoom = ({ imageSrc }) => {
  const zoomSize = 120; // Size of the zoomed square
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect(); // Get the position of the image
    const x = e.clientX - rect.left; // Mouse position relative to the image
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    
    const bgX = (x / width) * 100; // Calculate background position as percentage
    const bgY = (y / height) * 100;

    // Center the zoom square on the mouse position
    setZoomStyle({
      top: `${y - zoomSize / 2}px`,  // Center the zoom box vertically on the mouse
      left: `${x - zoomSize / 2}px`, // Center the zoom box horizontally on the mouse
      backgroundPosition: `${bgX}% ${bgY}%`, // Set the background position to follow the mouse
      backgroundImage: `url(${imageSrc})`,  // Apply the original image as background
      backgroundSize: `${width * 2}px ${height * 2}px`, // Adjust zoom level (double the image size)
    });
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  return (
    <div className="relative h-full p-1 w-full border-[0.5px] justify-center items-center overflow-hidden hover:shadow-md">
      <img
        src={imageSrc}
        alt="Zoomable"
        className="w-full h-full object-cover"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Zoom Square */}
      {showZoom && (
        <div
          className="absolute pointer-events-none border-2 border-gray-300 rounded"
          style={{
            ...zoomStyle,
            width: `${zoomSize}px`,  // Size of the zoomed square
            height: `${zoomSize}px`,
          }}
        ></div>
      )}
    </div>
  );
};

export default ImageZoom;
