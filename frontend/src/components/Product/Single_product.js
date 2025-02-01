import React, { useMemo } from 'react';
import './Single_product.css';
import { IoIosHeartEmpty } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, getImagesArrayFromProducts } from '../../config';
import AutoSlidingCarousel from './AutoSlidingCarousel';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';

const SingleProduct = React.memo(({ pro, user, wishlist = [], showWishList = true }) => {
    const{updateRecentlyViewProducts} = useSessionStorage();
    const navigation = useNavigate();
    const imageArray = useMemo(() => getImagesArrayFromProducts(pro), [pro]);

    if (!pro || !imageArray?.length) {
        // If no product data is available, show skeleton loader
        return (
            <div className="w-full h-fit border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden animate-pulse">
                {/* Skeleton Image Carousel */}
                <div className="w-full bg-gray-200 min-h-[200px] rounded-md"></div>

                {/* Skeleton Product Details */}
                <div className="relative pb-3 flex-col flex justify-between items-left gap-3 p-4">
                    <div className="w-3/4 h-6 bg-gray-200 rounded-md"></div> {/* Skeleton for title */}
                    <div className="w-1/2 h-4 bg-gray-200 rounded-md mt-2"></div> {/* Skeleton for sub-category */}
                    <div className="w-1/3 h-6 bg-gray-200 rounded-md mt-2"></div> {/* Skeleton for price */}
                </div>
            </div>
        );
    }

    const productTitle = pro?.title?.length > 20
        ? `${capitalizeFirstLetterOfEachWord(pro?.title.slice(0, 20))}...`
        : capitalizeFirstLetterOfEachWord(pro?.title);

    const productSubCategory = capitalizeFirstLetterOfEachWord(pro?.subCategory);
    const { salePrice, price } = pro;

    const handleNavigation = () => {
        navigation(`/products/${pro._id}`);
        updateRecentlyViewProducts(pro);
        window.location.reload();
    };

    const renderPrice = () => (
        <p className="flex items-center px-1 space-x-3">
            <span className="text-[12px] sm:text-base font-medium text-black">
                ₹{salePrice || price}
            </span>
            {salePrice && (
                <div className="w-full justify-start space-x-3 flex flex-row items-center">
                    <span className="text-[12px] sm:text-base font-medium text-slate-400 line-through">
                        ₹{Math.round(price)}
                    </span>
                    <span className="text-[10px] sm:text-sm font-medium text-red-500 hover:animate-vibrateScale">
                        ({calculateDiscountPercentage(price,salePrice)}% OFF)
                    </span>
                </div>
            )}
        </p>
    );

    const renderSizeOptions = () => (
        <div className="flex-row flex justify-start items-center">
            <p className="font1 text-sm px-2 text-[#5f5f5f9e]">Sizes:</p>
            {pro?.size?.map((item, i) => (
                <span key={i} className="font1 text-xs px-2 text-[#5f5f5f9e]">{item.label}</span>
            ))}
        </div>
    );

    const renderHoverDetails = () => (
        <div className={`${pro._id}hover hidden absolute pb-6 bottom-0 w-full bg-white transition-all duration-300 ease-in-out sm:hidden md:block`}>
            <div className="w-full text-center flex items-center justify-center py-1 font1 border-[1px] border-slate-300 cursor-pointer hover:bg-[#f26a10] hover:text-white">
                <IoIosHeartEmpty className="text-lg mr-1" />
                <span className="text-sm sm:text-base md:text-lg lg:text-xl">ADD TO CART</span>
            </div>
            {renderPrice()}
            <div className="relative p-4 flex justify-start items-start">
                {/* Any additional content or components you want to include */}
            </div>
        </div>
    );

    return (
        <div 
            onClick={handleNavigation} 
            className="2xl:w-[260px] md:h-[430px] md:w-[210px] lg:w-[205px] lg:h-[410px] 2xl:h-[510px] sm:h-[410px] sm:w-[205px] h-fit w-full border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300 cursor-pointer"
        >
            {/* Product Image Carousel */}
            <div className="w-full bg-gray-300 flex h-fit justify-center items-center">
                <AutoSlidingCarousel pro={pro} user={user} showWishList={showWishList} wishlist={wishlist} />
            </div>

            {/* Product Details Section */}
            <div className="relative pb-3 flex-col flex justify-between items-left gap-3 p-1">
                <p className="font1 text-base sm:text-lg overflow-hidden md:text-xl px-2 text-gray-800 font-semibold">{productTitle.slice(0,10)}</p>
                <p className="overflow-hidden px-2 text-xs text-left text-ellipsis h-4 whitespace-nowrap text-slate-500">{productSubCategory}</p>
                {renderPrice()}
            </div>

            {/* Hover Details */}
            {/* {renderHoverDetails()} */}
        </div>
    );
});

export default SingleProduct;
