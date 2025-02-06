import React, { useState } from 'react'

const StarRatingInput = ({onChangeValue}) => {
    const [ratingData, setRatingData] = useState(0);

    const handleStarClick = (value) => {
        // setRatingData({ ...ratingData, rating: value });
        onChangeValue(value);
        setRatingData(value);
    };

    return (
        <div className='mb-4 font-kumbsan'>
            
            {/* Rating Stars */}
            <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star,i) => (
                    <div

                        key={i}
                        className={`stars cursor-pointer w-10 h-10 text-3xl flex justify-center items-center ${
                            ratingData >= star ? 'text-black' : 'text-gray-300'
                        }`}
                        onClick={() => handleStarClick(star)}
                    >
                        <span className="star hover:-translate-y-1 duration-300 ease-in-out transition-transform">★</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StarRatingInput
