import React, { Fragment, useEffect, useState } from 'react';
import HomeProductsPreview from './HomeProductsPreview';
import { calculateDiscountPercentage, formattedSalePrice, generateArrayOfRandomItems } from '../../config';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getwishlist } from '../../action/orderaction';

const previewHeader = [
  { id: 'topPicks', title: 'Top Picks' },
  { id: 'bestSeller', title: 'Best Sellers' },
  { id: 'luxuryItems', title: 'Luxury Items' }
];

const ProductPreviewFull = ({ product ,user}) => {
    const dispatch = useDispatch();
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const navigation = useNavigate();
    const [previewProducts, setSelectedPreviewProducts] = useState([]);
    const [activePreview, setActivePreviews] = useState('topPicks');

    const getRandomArrayOfProducts = (previewProductsTitle) => {
        if (product) {
            // const randomizes = generateArrayOfRandomItems(product, 6);
            console.log("Products: ",product);
            const maxProductsAmount = window.screen.width > 1024 ? 5 : 4;
            const itemsOfCategory = product.filter(p => p.specialCategory === previewProductsTitle).slice(0, maxProductsAmount); // filter by bestSeller and take first 6 items
            // const itemsOfCategory = generateArrayOfRandomItems(product, maxProductsAmount); // filter by bestSeller and take first 6 items
            setSelectedPreviewProducts(itemsOfCategory);
            setActivePreviews(previewProductsTitle);
        }
    };

    useEffect(() => {
        getRandomArrayOfProducts('topPicks');
    }, [product]);
    const [selectedColors, setSelectedColors] = useState({});

    const handleColorChange = (productId, colorImages) => {
        setSelectedColors(prevState => ({
            ...prevState,
            [productId]: colorImages
        }));
    };
    useEffect(()=>{
    dispatch(getwishlist());
    },[dispatch])
    const handleMoveToQuery = ()=>{
        const queryParams = new URLSearchParams();
        
        if (activePreview) queryParams.set('specialCategory', activePreview);
        if(!activePreview) {
            navigation("/products")
            return;
        };
        const url = `/products?${queryParams.toString()}`;
        navigation(url);
        
    }

    return (
        <div className='max-w-screen-2xl font-kumbsan w-full flex flex-col justify-self-center justify-center space-y-5 items-center bg-slate-200'>
            {/* Preview Headers Section */}
            <div className="min-w-fit font-kumbsan flex justify-center items-center gap-3 sm:gap-4 md:gap-5 mb-6 font1 px-6 my-4 max-w-full">
                {previewHeader && previewHeader.length > 0 &&
                    previewHeader.map((h, index) => (
                        <button
                            onClick={(e) => {
                                if (h?.id !== activePreview) {
                                    console.log("Selected New");
                                    getRandomArrayOfProducts(h?.id);
                                } else {
                                    e.preventDefault();
                                }
                            }}
                            key={index}
                            className={`border-2 border-gray-600 border-opacity-70 p-2 sm:p-3 md:p-4 lg:p-4 xl:p-5 px-5 py-2 sm:px-6 sm:py-3 flex items-center justify-center md:w-[130px] lg:w-[150px] xl:w-[180px] 2xl:w-[200px] sm:w-[120px] sm:h-[35px] h-[40px] transform font-kumbsan transition-transform duration-300 ease-out hover:scale-110 cursor-pointer rounded-full ${activePreview === h.id ? 'bg-black text-white' : 'bg-neutral-50'}`}
                        >
                            <span className="inline-block text-center text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
                                {h?.title}
                            </span>
                        </button>
                    ))
                }
            </div>
            {/* Product Previews Section */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 2xl:grid-cols-5 justify-center md:px-12 lg:px-12 2xl:px-12 xl:px-12 px-2 gap-2 md:gap-3 items-center">
                {previewProducts && previewProducts.length > 0 &&
                    previewProducts.map((p, index) => {
                        // const p = previewProducts[0];
                        const selectedColor = selectedColors[p._id] || p.AllColors[0]?.images;
                        return (
                            <div key={p._id} className={`w-full h-full rounded-md bg-gray-200 relative flex flex-col justify-start items-center hover:shadow-md transform transition-all duration-300 ease-in-out ${window.screen.width > 1024 ? "hover:scale-105":""}`}>
                                <HomeProductsPreview product={p} selectedColorImages={selectedColor} user={user} wishlist={wishlist} dispatch = {dispatch}/>
                                <div className="w-full h-fit p-2 px-3 bg-white flex flex-col justify-center items-start hover:shadow-md space-y-2">
                                    <h2 className="font1 text-[12px] md:text-base md:font-semibold sm:font-semibold font-normal 2xl:font-semibold xl:font-semibold font-kumbsan text-gray-800 text-left truncate">
                                        {p?.shortTitle?.length > 26 ? `${p?.shortTitle.slice(0, 10)}` : p?.shortTitle}
                                    </h2>
                                    
                                    <div className="w-full justify-start gap-y-1 items-start flex flex-row space-x-2">
                                        {/* Sale Price */}
                                        <div className="text-xs md:text-sm font-light md:font-medium font-kumbsan text-slate-700">
                                            {p.salePrice && p.salePrice > 0 && (
                                                <span className="text-sm md:text-base font-bold text-gray-900">
                                                    ₹{formattedSalePrice(p.salePrice)}
                                                </span>
                                            )}
                                        </div>
                                        {/* Regular Price */}
                                        <div className="text-xs md:text-sm font-light md:font-medium font-kumbsan text-slate-700 hover:animate-bounce">
                                            {p.salePrice && p.salePrice > 0 ? (
                                                <span className="line-through text-gray-500">
                                                    ₹{formattedSalePrice(p.price)}
                                                </span>
                                            ) : (
                                                <span className="text-xs md:text-sm font-normal md:font-medium font-kumbsan">
                                                    ₹{formattedSalePrice(p.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Discount Percentage for small screens */}
                                    <div className='block md:hidden font-light md:font-semiBold font-kumbsan text-slate-700'>
                                        {p.salePrice && p.salePrice > 0 && (
                                            <span className="text-xs font-light text-orange-400">
                                            ({calculateDiscountPercentage(p.price, p.salePrice)}% OFF)
                                            </span>
                                        )}
                                    </div>

                                    {/* Color Options */}
                                    {p.AllColors && p.AllColors.length > 0 && (
                                        <div className="mt-2 flex space-x-2">
                                            {p.AllColors.slice(0, 7).map((color, colorIndex) => (
                                                <div
                                                    onClick={() => handleColorChange(p._id, color.images)} // Update color for this product
                                                        key={colorIndex}
                                                        className={`w-4 h-4 md:w-6 md:h-6 shadow-md rounded-full hover:outline outline-offset-2 outline-gray-900 hover:shadow-md hover:-translate-y-1 transform duration-300 ease-out`}
                                                        style={{
                                                        backgroundColor: color.label, // Assuming color is a hex or RGB string
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className='w-full text-center flex flex-row justify-center items-center text-white font-kumbsan text-xl relative transform transition-all py-4'>
                <div onClick={handleMoveToQuery} className='px-8 w-fit flex text-sm md:text-lg bg-gray-900 rounded-full hover:bg-gray-700 p-4 cursor-pointer hover:scale-110 duration-300 hover:animate-shine'>
                    <span className='hover:animate-vibrateScale text-[15px] sm:text-[15px] md:text-[16px]'>View More</span>
                </div>
            </div>
        </div>
    );
};
const renderStars = (p) => {
  let rating = Math.floor(Math.random() * 5) + 1;
  if (p && p.Rating && p.Rating.length) {
    const totalStars = p.Rating.reduce((acc, review) => acc + review.rating, 0);
    const avgStars = totalStars / p.Rating.length;
    const roundedAvg = Math.round(avgStars * 10) / 10;
    rating = roundedAvg;
  }
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${i <= rating ? 'text-gray-900' : 'text-slate-400'} hover:animate-vibrateScale`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 17.75l-5.47 3.06 1.43-6.12L2.5 9.75l6.26-.52L12 2l2.74 6.23 6.26.52-4.42 4.94 1.43 6.12z" />
      </svg>
    );
  }
  return stars;
};

export default ProductPreviewFull;
