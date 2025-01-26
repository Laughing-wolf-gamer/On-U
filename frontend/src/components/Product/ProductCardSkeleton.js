import React from 'react'

const ProductCardSkeleton = () => {
  return (
    <div className="w-48 h-48 border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300 cursor-pointer animate-pulse">
      <div className='w-full min-h-fit justify-center items-center'>
        {/* Skeleton for the carousel */}
        <div className="w-full h-96 bg-gray-300 rounded-lg"></div>
      </div>

      <div className="relative pb-6 flex-col flex justify-start items-left gap-3">
        {/* Skeleton for Product Title */}
        <div className="w-3/4 h-5 bg-gray-300 rounded-md px-2"></div>

        {/* Skeleton for Product Sub-Category */}
        <div className="w-1/2 h-4 bg-gray-300 rounded-md px-2"></div>

        {/* Skeleton for Price Section */}
        <div className="flex flex-row justify-start items-center space-x-2">
          <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
          <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Skeleton for Hover Details */}
      <div className="absolute pb-6 bottom-0 w-full bg-white transition-all duration-300 ease-in-out opacity-0 hover:opacity-100">
        <div className="w-full h-12 bg-gray-300 rounded-md mx-auto mt-4"></div>

        <div className="relative p-4">
          {/* Skeleton for Size Options */}
          <div className="flex space-x-2 mb-4">
            <div className="w-1/4 h-6 bg-gray-300 rounded-md"></div>
            <div className="w-1/6 h-6 bg-gray-300 rounded-md"></div>
            <div className="w-1/6 h-6 bg-gray-300 rounded-md"></div>
          </div>

          {/* Skeleton for Price & Sale Price */}
          <div className="flex space-x-2">
            <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
            <div className="w-20 h-6 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton