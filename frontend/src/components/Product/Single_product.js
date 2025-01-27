import React, { useMemo } from 'react';
import './Single_product.css';
import { BiRupee } from 'react-icons/bi';
import { IoIosHeartEmpty } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetterOfEachWord, getImagesArrayFromProducts } from '../../config';
import AutoSlidingCarousel from './AutoSlidingCarousel';

const SingleProduct = React.memo(({ pro, user, wishlist = [], showWishList = true }) => {
    const navigation = useNavigate();
    const imageArray = useMemo(() => getImagesArrayFromProducts(pro), [pro]);

    if (!imageArray?.length) return null;

    const productTitle = pro?.title?.length > 20
        ? `${capitalizeFirstLetterOfEachWord(pro?.title.slice(0, 20))}...`
        : capitalizeFirstLetterOfEachWord(pro?.title);

    const productSubCategory = capitalizeFirstLetterOfEachWord(pro?.subCategory);
    const { salePrice, price } = pro;

    const handleNavigation = () => {
        navigation(`/products/${pro._id}`);
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
                    <span className="text-[8px] sm:text-sm font-medium text-[#f26a10]">
                        ({-Math.round((salePrice / price) * 100 - 100)}% OFF)
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
        <div onClick={handleNavigation} className="w-full h-fit border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300 cursor-pointer">
            {/* Product Image Carousel */}
            <div className="w-full bg-blue-300 min-h-full justify-center items-center">
                <AutoSlidingCarousel pro={pro} user={user} showWishList={showWishList} wishlist={wishlist} />
            </div>
            
            {/* Product Details Section */}
            <div className="relative pb-3 flex-col flex justify-between items-left gap-3 p-1">
                <p className="font1 text-base sm:text-lg md:text-xl px-2 text-gray-800 font-semibold">{productTitle.slice(0,10)}</p>
                <p className="overflow-hidden px-2 text-xs text-left text-ellipsis h-4 whitespace-nowrap text-slate-500">{productSubCategory}</p>
                {renderPrice()}
            </div>

            {/* Hover Details */}
            {/* {renderHoverDetails()} */}
        </div>
    );
});

export default SingleProduct;
