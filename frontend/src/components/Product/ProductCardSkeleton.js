import React from 'react'

const ProductCardSkeleton = () => {
    return (
        <div
            className="w-full h-full min-h-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px] 2xl:w-[260px] 
            sm:h-[380px] md:h-[390px] lg:h-[430px] xl:h-[460px] 2xl:h-[510px] 
            border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300 cursor-pointer"
        >
            {/* Product Image Carousel Skeleton */}
            <div className="w-full bg-gray-300 animate-pulse flex h-[66%] justify-center items-center">
                <div className="w-[95%] h-[95%] bg-gray-400 rounded-lg"></div>
            </div>
    
            {/* Product Details Section Skeleton */}
            <div className="relative pb-3 flex-col flex justify-between items-start gap-3 p-1">
                {/* Title Skeleton */}
                <div className="w-[70%] h-[20px] bg-gray-400 rounded-md animate-pulse mb-2"></div>
                {/* Subcategory Skeleton */}
                <div className="w-[50%] h-[16px] bg-gray-300 rounded-md animate-pulse mb-2"></div>
                {/* Price Skeleton */}
                <div className="w-[60%] h-[20px] bg-gray-400 rounded-md animate-pulse"></div>
            </div>
        </div>
    );
}


export default ProductCardSkeleton