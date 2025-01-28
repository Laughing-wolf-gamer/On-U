import React from 'react'

const ProductCardSkeleton = () => {
    return (
        <div
            className="2xl:w-[220px] w-full h-[400px] border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300"
        >
            {/* Product Image Carousel Skeleton */}
            <div className="w-full bg-gray-300 animate-pulse flex h-[250px] justify-center items-center">
                <div className="w-[80%] h-[80%] bg-gray-400 rounded-lg"></div>
            </div>
    
            {/* Product Details Section Skeleton */}
            <div className="relative pb-3 flex-col flex justify-between items-left gap-3 p-1">
                {/* Title Skeleton */}
                <div className="w-[70%] h-[20px] bg-gray-400 rounded-md animate-pulse mb-2"></div>
                {/* Subcategory Skeleton */}
                <div className="w-[50%] h-[16px] bg-gray-300 rounded-md animate-pulse mb-2"></div>
                {/* Price Skeleton */}
                <div className="w-[60%] h-[20px] bg-gray-400 rounded-md animate-pulse"></div>
            </div>
    
            {/* Hover Details Skeleton (if applicable) */}
            {/* <div className="w-full h-full bg-gray-400 animate-pulse rounded-lg"></div> */}
        </div>
    );
}

export default ProductCardSkeleton