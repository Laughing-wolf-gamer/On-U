import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Assuming you're using lazy loading for images

const DraggingScrollView = ({ images }) => {
    return (
        <div className="flex overflow-x-auto bg-slate-200 pt-6 items-start scrollbar-hide">
            {images.map((image, index) => (
                <li key={`image_icons${index}`} className="flex-shrink-0 w-24 px-0.5 justify-center items-center"> {/* Fixed width for images */}
                    <Link to="/products">
                        <LazyLoadImage
                            effect="blur"
                            src={image}
                            alt={`image_icons_${index}`}
                            className="w-full h-fit min-h-[110px] object-fill" 
                        />
                    </Link>
                </li>
            ))}
        </div>

    );
}

export default DraggingScrollView;
