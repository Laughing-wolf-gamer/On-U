import React, { useMemo } from 'react';
import './Single_product.css';
import { BiRupee } from 'react-icons/bi';
import { IoIosHeartEmpty } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, getImagesArrayFromProducts } from '../../config';
import AutoSlidingCarousel from './AutoSlidingCarousel';

// Memoize the component to avoid unnecessary re-renders
const SingleProduct = React.memo(({ pro ,user,wishlist = [],showWishList = true}) => {
    const navigation = useNavigate();
    // Memoize the imageArray to avoid recalculating on every render
    const imageArray = useMemo(() => getImagesArrayFromProducts(pro), [pro]);

    // Early return if there are no images
    if (!imageArray || imageArray.length === 0) {
        return null;
    }

    const productTitle = pro?.title?.length > 20
        ? `${capitalizeFirstLetterOfEachWord(pro?.title.slice(0, 20))}...`
        : capitalizeFirstLetterOfEachWord(pro?.title);

    const productSubCategory = capitalizeFirstLetterOfEachWord(pro?.subCategory);
    const productSalePrice = pro?.salePrice;
    const productPrice = pro?.price;

    return (
        <div onClick={(e)=>{
            navigation(`/products/${pro._id}`)
            window.location.reload();
        }} className="w-full border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300 cursor-pointer">
            <div className='w-full min-h-[200px] justify-center items-center'>
                <AutoSlidingCarousel pro={pro} user={user} showWishList = {showWishList} wishlist = {wishlist}/>
            </div>

            <div className="relative pb-6 flex-col flex justify-start items-left gap-3">
                {/* Product Title */}
                <p className="font1 text-base px-2 text-gray-800 font-semibold">
                    {productTitle}
                </p>

                {/* Product Sub-Category */}
                <p className="overflow-hidden px-2 text-xs text-left text-ellipsis h-4 whitespace-nowrap text-slate-500">
                    {productSubCategory}
                </p>

                {/* Price Section */}
                <p className="flex flex-row justify-start items-center">
                    <span className="flex items-center text-sm font-medium text-black">
                        <BiRupee />{productSalePrice || productPrice}
                    </span>
                    {productSalePrice && (
                        <>
                            <span className="flex items-center text-sm font-medium text-slate-400 line-through">
                                <BiRupee />{Math.round(productPrice)}
                            </span>
                            <span className="flex items-center text-xs font-medium text-[#f26a10]">
                                ({-Math.round((productSalePrice / productPrice) * 100 - 100)}% OFF)
                            </span>
                        </>
                    )}
                </p>
            </div>

            {/* Hover Details */}
            <div className={`${pro._id}hover hidden absolute pb-6 bottom-0 w-full bg-white transition-all duration-300 ease-in-out`}>
                <div className="w-12/12 text-center flex items-center justify-center py-1 font1 border-[1px] border-slate-300 cursor-pointer hover:bg-[#f26a10] hover:text-white">
                    <IoIosHeartEmpty className="text-lg mr-1" />
                    <span>ADD TO CART</span>
                </div>

                <div className="relative p-4">
                    {/* Size Options */}
                    <div className="justify-start items-center w-auto h-auto flex-row flex">
                        <p className="font1 text-xm px-2 text-[#5f5f5f9e]">Sizes:</p>
                        {pro?.size && pro.size.map((item, i) => (
                            <span key={i} className="font1 text-xs px-2 text-[#5f5f5f9e]">{item.label}</span>
                        ))}
                    </div>

                    {/* Price & Sale Price */}
                    <p className="flex px-2">
                        <span className="flex items-center text-sm font-medium text-black">
                            <BiRupee />{Math.round(productPrice)}
                        </span>
                        {productSalePrice && (
                            <>
                                <span className="flex items-center text-sm font-medium text-slate-400 line-through ml-2">
                                    <BiRupee />{Math.round(productPrice)}
                                </span>
                                <span className="flex items-center text-xs font-medium text-[#f26a10] ml-2">
                                    ({calculateDiscountPercentage(productPrice, productSalePrice)}% OFF)
                                </span>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default SingleProduct;
