import React, { Fragment, useEffect, useState } from 'react';
import HomeProductsPreview from './HomeProductsPreview';
import { calculateDiscountPercentage, generateArrayOfRandomItems } from '../../config';
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
            const itemsOfCategory = product.filter(p => p.specialCategory === previewProductsTitle).slice(0, 5); // filter by bestSeller and take first 6 items
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
        <div className='md:py-8 py-7 flex flex-col justify-center space-y-5 items-center bg-slate-200'>
            {/* Preview Headers Section */}
            <div className="min-w-fit grid grid-cols-3 justify-center items-center gap-5 mb-6 font1 px-5 my-4">
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
                            className={`border-2 border-gray-600 border-opacity-70 p-3 sm:p-4 md:p-6 lg:p-6 2xl:p-6 px-3 py-3 flex items-center justify-center md:w-full xl:w-[200px] 2xl:w-[200px] sm:w-[170px] sm:h-[40px] w-[90px] h-[40px] transform font-sans transition-transform duration-300 ease-out hover:scale-110 cursor-pointer rounded-full ${activePreview === h.id ? 'bg-black text-white' : 'bg-neutral-50'}`}
                        >
                            <span className="inline text-center text-[10px] sm:text-[15px] md:text-[16px]">
                                {h?.title}
                            </span>
                        </button>

                    ))
                }
            </div>




            {/* Product Previews Section */}
            <div className="w-full flex flex-row justify-center items-center bg-slate-200 ">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-5 2xl:space-x-4 md:space-x-1 sm:space-x-4 gap-2 justify-center items-center">
                {previewProducts && previewProducts.length > 0 &&
                    [1,2,3,4,5].map((_, index) => {
                        const p = previewProducts[0];
                        const selectedColor = selectedColors[p._id] || p.AllColors[0].images;
                        return (
                            <div className="2xl:w-[317px] 2xl:h-[580px] xl:w-[254px] xl:h-[480px] md:w-[194px] md:h-[395px] w-full h-fit rounded-md bg-gray-200 relative flex flex-col justify-between items-center hover:shadow-md transform transition-all duration-300 ease-in-out hover:scale-105" key={p._id}>
                                <HomeProductsPreview product={p} selectedColorImages={selectedColor} user={user} wishlist={wishlist} dispatch = {dispatch}/>
                                <div className="w-full h-fit p-2 px-3 bg-white flex flex-col justify-center items-start hover:shadow-md space-y-2">
                                    <h2 className="font1 text-[12px] md:text-base font-semibold font-sans text-gray-800 text-left truncate">
                                        {p?.shortTitle?.length > 26 ? `${p?.shortTitle.slice(0, 10)}` : p?.shortTitle}
                                    </h2>
                                    
                                    <div className="w-full justify-start gap-y-1 items-start flex flex-row space-x-2">
                                        {/* Sale Price */}
                                        <div className="text-xs md:text-sm font-light md:font-medium font-sans text-slate-700">
                                            {p.salePrice && p.salePrice > 0 && (
                                                <span className="text-sm md:text-base font-bold text-gray-900">
                                                    ₹{p.salePrice}
                                                </span>
                                            )}
                                        </div>
                                        {/* Regular Price */}
                                        <div className="text-xs md:text-sm font-light md:font-medium font-sans text-slate-700 hover:animate-bounce">
                                            {p.salePrice && p.salePrice > 0 ? (
                                                <span className="line-through text-gray-500">
                                                    ₹{p.price}
                                                </span>
                                            ) : (
                                                <span className="text-xs md:text-sm font-normal md:font-medium font-sans">
                                                    ₹{p.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Discount Percentage for small screens */}
                                    <div className='block md:hidden font-light md:font-semiBold font-sans text-slate-700'>
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
            </div>

            <div className='w-full text-center flex flex-row justify-center items-center text-white font-sans text-xl relative transform transition-all pt-10'>
                <div onClick={handleMoveToQuery} className='px-8 w-fit flex text-sm md:text-lg bg-gray-900 rounded-full hover:bg-gray-700 p-4 cursor-pointer hover:scale-110 duration-300 hover:animate-shine'>
                    <span className='hover:animate-vibrateScale'>VIEW MORE</span>
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
