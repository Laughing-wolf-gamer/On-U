import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

const DraggingScrollView = ({ images,}) => {
    return (
        <div className="flex overflow-x-auto space-x-4 py-4">
            {images.map((image, index) => (
                <Link key={`image_icons${index}`} to='/products'><li className='w-max mr-2'><LazyLoadImage effect='blur' src={image} alt="image_icons" className="w-[18vw] min-h-[70px]" /></li></Link>
            ))}
        </div>
    )
}
export default DraggingScrollView