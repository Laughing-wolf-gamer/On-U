import React, { Fragment } from 'react';
import './Single_product.css';
import { BiRupee } from 'react-icons/bi';
import { IoIosHeartEmpty } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, getImagesArrayFromProducts } from '../../config';
import AutoSlidingCarousel from './AutoSlidingCarousel';

const Single_product = ({ pro }) => {
    const imageArray = getImagesArrayFromProducts(pro);

    return (
        <Fragment>
            {imageArray && imageArray.length > 0 && (
                <Fragment>
                    <Link to={`/products/${pro._id}`}>
                        <li className='w-full border-[3px] border-slate-300 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300'>
                            {/* Carousel */}
                            <AutoSlidingCarousel pro={pro} />
                            <div className='relative pb-6'>
                                {/* Product Title */}
                                <p className='font1 text-base px-2 text-gray-800 font-semibold'>
                                    {pro?.title?.length > 20 ? `${capitalizeFirstLetterOfEachWord(pro?.title.slice(0, 20))}...` : capitalizeFirstLetterOfEachWord(pro?.title)}
                                </p>
                                {/* Product Sub-Category */}
                                <p className='overflow-hidden px-2 text-xs text-left text-ellipsis h-4 whitespace-nowrap text-slate-500'>{capitalizeFirstLetterOfEachWord(pro?.subCategory)}</p>
                                {/* Price Section */}
                                <p className='flex px-2'>
                                    <span className='flex items-center text-sm font-medium text-black'>
                                        <BiRupee />{pro?.salePrice ? pro.salePrice : pro?.price}
                                    </span>
                                    {pro.salePrice && (
                                        <>
                                            <span className='flex items-center text-sm font-medium text-slate-400 line-through ml-2'>
                                                <BiRupee />{Math.round(pro?.price)}
                                            </span>
                                            <span className='flex items-center text-xs font-medium text-[#f26a10] ml-2'>
                                                ( {-Math.round(pro?.salePrice / pro?.price * 100 - 100)}% OFF )
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Hover Details */}
                            <div className={`${pro._id}hover hidden absolute pb-6 bottom-0 w-full bg-slate-400 transition-all duration-300 ease-in-out`}>
                                <div className='w-12/12 text-center flex items-center justify-center py-1 font1 border-[1px] border-slate-300 cursor-pointer hover:bg-[#f26a10] hover:text-white'>
                                    <IoIosHeartEmpty className='text-lg mr-1' />
                                    <span>ADD TO CART</span>
                                </div>
                                <div className='relative p-4'>
                                    {/* Size Options */}
                                    <div className='justify-start items-center w-auto h-auto flex-row flex'>
                                        <p className='font1 text-xm px-2 text-[#5f5f5f9e]'>Sizes:</p>
                                        {pro?.size && pro.size.map((item, i) => (
                                            <span key={i} className='font1 text-xs px-2 text-[#5f5f5f9e]'>{item.label}</span>
                                        ))}
                                    </div>

                                    {/* Price & Sale Price */}
                                    <p className='flex px-2'>
                                        <span className='flex items-center text-sm font-medium text-black'>
                                            <BiRupee />{Math.round(pro.price)}
                                        </span>
                                        {pro?.salePrice && (
                                            <>
                                                <span className='flex items-center text-sm font-medium text-slate-400 line-through ml-2'>
                                                    <BiRupee />{Math.round(pro?.price)}
                                                </span>
                                                <span className='flex items-center text-xs font-medium text-[#f26a10] ml-2'>
                                                    ({calculateDiscountPercentage(pro.price,pro.salePrice)}% OFF)
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </li>
                    </Link>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Single_product;
