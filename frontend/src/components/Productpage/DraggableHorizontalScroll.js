import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation
import { LazyLoadImage } from 'react-lazy-load-image-component'; // Assuming you're using lazy loading for images

const DraggingScrollView = ({ images, customClass }) => {
    return (
        <div className="flex overflow-x-auto py-4 scrollbar-hide">
            {images.map((image, index) => (
                <Link key={`image_icons${index}`} to='/products'>
                    <li className='w-max mr-2'>
                        <LazyLoadImage
                            effect='blur'
                            src={image}
                            alt={`image_icons_${index}`}
                            className={customClass ? customClass : "w-[18vw] min-h-[70px] object-cover"}
                        />
                    </li>
                </Link>
            ))}
        </div>
    );
}

export default DraggingScrollView;
