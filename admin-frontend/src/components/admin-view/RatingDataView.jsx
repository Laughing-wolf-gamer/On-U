import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; // You can use any icon or button

const RatingDataView = ({ isOpen, onClose, ratings, onDeleteRating,addNewRating }) => {
    if (!isOpen) return null; // Don't render if the modal is not open
    console.log("ratings Data: ",ratings);
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">All Ratings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        X
                    </button>
                </div>
                
                {/* Ratings List */}
                <div className="space-y-4">
                    {ratings.map((rating) => (
                        <div key={rating?._id} className="flex justify-between items-center border-b pb-2">
                            <div className="flex items-center space-x-2">
                                <div className="font-semibold">{rating?.userId?.name}</div> {/* Assuming `name` exists on user */}
                                <div className="text-gray-500">({rating?.rating} stars)</div>
                            </div>
                            <div className="space-y-1">
                                <p>{rating?.comment}</p>
                                <button
                                    onClick={() => onDeleteRating(rating?._id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <StarRatingInput onChangeValue={(ratingData)=>{
                    console.log("Rating Setting: ",ratingData)
                    if(addNewRating){
                        addNewRating(ratingData);
                    }
                }}/>
            </div>
        </div>
    );
};
const StarRatingInput = ({onChangeValue}) => {
    const [ratingData, setRatingData] = useState({comment:'',rating:1});

    const handleStarClick = (value) => {
        setRatingData({...ratingData,rating:value});
    };
    const handleSetRatingComment = (value)=>{
        setRatingData({...ratingData,comment:value});
    }
    const handleSubmitRating = (e) => {
        e.preventDefault();
        onChangeValue(ratingData);
        setRatingData({comment:'',rating:1});
    }

    return (
        <div className='mb-4'>
            {/* Rating Stars */}
            <label htmlFor='reviewStars' className='block text-sm font-semibold text-gray-700'>Review Stars:</label>
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
            <label htmlFor='reviewText' className='block text-sm font-semibold text-gray-700'>Review Text:</label>
            <textarea
                onChange={(e) => handleSetRatingComment(e.target.value)}
                id='reviewText'
                name='reviewText'
                rows='4'
                placeholder='Write your review here...'
                className='mt-2 p-2 w-full border border-gray-300 rounded-md'
            />
            <button
                onClick={handleSubmitRating}
                className='mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md'
            >
                Submit Review
            </button>
        </div>
    );
}

export default RatingDataView