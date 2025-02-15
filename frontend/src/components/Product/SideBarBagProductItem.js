import React, { memo, useEffect, useMemo, useState } from 'react';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, getImagesArrayFromProducts } from '../../config';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import AutoSlidingCarousel from './AutoSlidingCarousel';

const SideBarBagProductItem = memo(({pro , user}) => {
    const { updateRecentlyViewProducts } = useSessionStorage();
    const navigation = useNavigate();
    const imageArray = useMemo(() => getImagesArrayFromProducts(pro), [pro]);

    if (!pro || !imageArray?.length || imageArray.length === 0) {
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
    };

    const renderPrice = () => (
		<div className="flex items-center font-kumbsan space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-3 xl:space-x-3 2xl:space-x-3 whitespace-nowrap">
			<span
				className="text-[10px] sm:text-[12px] md:text-[16px] font-normal text-black
				hover:translate-y-1 transition-all duration-300 ease-in-out"
			>
				₹{formattedSalePrice(salePrice || price)}
			</span>
			{salePrice && (
				<span
					className="text-[10px] sm:text-[12px] md:text-[16px] font-normal text-slate-400 line-through
					hover:translate-y-1 transition-all duration-300 ease-in-out"
				>
					₹{Math.round(formattedSalePrice(price))}
				</span>
			)}
		</div>
	);



    const renderSizeOptions = () => (
        <div className="flex-row font-kumbsan flex justify-start items-center">
            <p className="text-[12px] sm:text-sm px-2 text-[#2a29299e]">Sizes:</p>
            {pro?.size?.map((item, i) => (
                <span key={i} className="text-[10px] sm:text-xs px-2 text-[#2d2a2a9e]">{item.label}</span>
            ))}
        </div>
    );

    return (
        <div
            onClick={handleNavigation}
            className="w-full h-full my-3 font-kumbsan sm:w-[180px] md:w-full md:h-[290px] lg:w-full lg:h-[420px] 2xl:w-full 2xl:h-[470px] sm:h-[360px] border border-gray-600 border-opacity-25 shadow-lg rounded-lg grid-cols-1 relative overflow-hidden hover:shadow-xl transition-all ease-in-out duration-300 cursor-pointer"
        >
            {/* Product Image */}
            <div className="w-full h-[70%] bg-gray-100 flex justify-center items-center overflow-hidden">
                {<img
                    src={imageArray[0].url}
                    alt='imgaeArray'
                    className="w-full h-full object-cover rounded-md hover:scale-105 transition-all duration-500 ease-in-out"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />}
				{/* <AutoSlidingCarousel
					pro={pro}
					user={user}
					wishlist={[]}
					showWishList = {false}
				/> */}
            </div>
			{/* <ImageSlideshow imageArray={imageArray}/> */}

            {/* Product Details Section */}
            <div className="flex-col flex justify-between items-start gap-2 mt-1 px-2">
				<p className="text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-gray-800 font-semibold truncate">
					{productTitle.slice(0, 10)}
				</p>
				<p className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] overflow-hidden text-left text-ellipsis h-fit whitespace-nowrap text-slate-500">
					{productSubCategory}
				</p>
				{renderPrice()}
				{/* {renderSizeOptions()} */}
			</div>

        </div>
    );
});
const ImageSlideshow = ({ imageArray }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isBlurred, setIsBlurred] = useState(true); // Track the blur state

	// Handle next image
	const nextImage = () => {
		setIsBlurred(true); // Apply blur effect on change
		setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
	};

	// Handle previous image
	const prevImage = () => {
		setIsBlurred(true); // Apply blur effect on change
		setCurrentIndex((prevIndex) => (prevIndex - 1 + imageArray.length) % imageArray.length);
	};

	// Optional: Automatically change image every 5 seconds
	useEffect(() => {
		const interval = setInterval(nextImage, 5000);
		return () => clearInterval(interval); // Cleanup interval on unmount
	}, []);

	useEffect(() => {
		// Once the image is changed, remove the blur effect with a slight delay
		const timer = setTimeout(() => {
		setIsBlurred(false);
		}, 500); // Delay to match transition time

		return () => clearTimeout(timer);
	}, [currentIndex]);

	return (
		<div className="w-full h-[25vh] xs:h-[30vh] sm:h-[50vh] md:h-[50vh] lg:h-[40vh] xl:h-[50vh] 2xl:h-[22vh] bg-gray-100 flex justify-center items-center overflow-hidden relative">
			<img
				src={imageArray[currentIndex]?.url}
					alt={`image-${currentIndex}`}
					className={`w-full h-full object-cover rounded-md hover:scale-105 transition-all duration-500 ease-in-out ${
					isBlurred ? 'filter blur-lg' : 'filter blur-0'
				}`}
				style={{
					maxWidth: '100%',
					maxHeight: '100%',
					objectFit: 'cover',
				}}
			/>
		</div>


	);
};
export default SideBarBagProductItem;
