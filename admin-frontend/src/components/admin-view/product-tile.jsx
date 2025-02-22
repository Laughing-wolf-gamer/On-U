import React, { useState, memo, useEffect, useRef, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice } from '@/config';
import { Badge } from '../ui/badge';

const AdminProductTile = ({
    setOpenProductPreview,
    togglePopUp,
    product,
}) => {
    const selectedSize = product?.size[0];
    const [selectedColor, setSelectedColor] = useState(product?.size[0]?.colors[0] || []);

    const selectedSizeColorImageArray = useMemo(() => selectedColor?.images || [], [selectedColor]);
    const stockAmountLowThreshold = 10;
    const stockAmountLowThresholdCritical = 5;
    const isStockLow = product?.totalStock < stockAmountLowThreshold;
    const isStockLowCritical = product?.totalStock < stockAmountLowThresholdCritical;

    // When the selected size changes, update the colors and images
    useEffect(() => {
        if (selectedSize) {
            setSelectedColor(selectedSize?.colors[0]);
        }
    }, [selectedSize]);

    return (
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl h-full justify-start items-center p-4 flex-col bg-gray-50 shadow-lg">
            {/* Image Section */}
            <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-lg mb-4 bg-gray-100">
				
                {selectedSizeColorImageArray[0] && <MemoizedMedia
                    mediaUrl={selectedSizeColorImageArray[0].url}
                    altText={product?.title}
					isStockLow = {isStockLow}
					isStockLowCritical = {isStockLowCritical}
					totalStock = {product?.totalStock}
                />}
            </div>

            {/* Title and Price */}
            <div className='h-full space-y-2 justify-start flex-col flex'>
				<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 truncate">
					{product?.title?.length > 20 ? `${product?.title.slice(0, 20)}...` : product?.title}
				</h2>
				<div className="flex items-center justify-between mb-4">
					<span className={`text-lg font-semibold ${product?.salePrice > 0 ? 'line-through text-gray-500' : 'text-gray-700'}`}>
						₹{formattedSalePrice(product?.price)}
					</span>
					{product?.salePrice > 0 && (
						<span className="text-red-600 text-xl font-bold">
							₹{formattedSalePrice(product?.salePrice)}
						</span>
					)}
				</div>

				{/* Category, SubCategory, Material */}
				<div className="w-full space-y-2 mb-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 font-medium">Category:</span>
						<span className="text-sm text-gray-800">{capitalizeFirstLetterOfEachWord(product?.category)}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 font-medium">SubCategory:</span>
						<span className="text-sm text-gray-800">{capitalizeFirstLetterOfEachWord(product?.subCategory)}</span>
					</div>
				</div>

				{/* Stock Amount Low Indicator */}
				

				{/* View More / Less Button */}
				<div className="w-full h-fit justify-center items-center flex">
					<Button
						title={"View More"}
						onClick={() => {
							setOpenProductPreview(product._id);
							togglePopUp();
						}}
						className="text-sm text-white bg-gray-700 hover:bg-gray-800 transition-colors"
					>
						View More
					</Button>
				</div>
			</div>
        </Card>
    );
};

// Memoized Media Component
const MemoizedMedia = memo(({ mediaUrl, altText,isStockLow,isStockLowCritical,totalStock }) => {
    const mediaRef = useRef(null);

    // Check if the URL corresponds to a video
    const isVideo = typeof mediaUrl === 'string' && mediaUrl.match(/\.(mp4|webm|ogg)$/i);

    useLazyLoadImage(mediaRef, mediaUrl);

    if (isVideo) {
        return (
			<div className=' relative'>
				{isStockLow && !isStockLowCritical && (
					<div className="mb-4">
						<Badge className="text-sm bg-yellow-500 hover:bg-yellow-500 absolute animate-pulse text-white top-0 right-2">
							Stock Low ({totalStock} left)
						</Badge>
					</div>
				)}
				{isStockLow && isStockLowCritical && (
					<div className="mb-4">
						<Badge className="text-sm bg-red-500 hover:bg-red-700 text-white absolute top-0 animate-pulse right-2">
							Stock Critical ({totalStock} left)
						</Badge>
					</div>
				)}
				<video
					src={mediaUrl}

					loop = {true}
					muted={true}
					autoPlay={false}
					ref={mediaRef}
					className="w-full h-full object-cover rounded-lg transition-transform duration-300"
					loading="lazy"
					style={{ opacity: 0 }}
					onLoadedData={() => {
						mediaRef.current.style.opacity = 1;
					}}
					controls
					controlsList="nodownload nofullscreen nopictureinpicture"
					onContextMenu={(e) => e.preventDefault()}  // Disable right-click
				>
					<source data-src={mediaUrl} />
					Your browser does not support the video tag.
				</video>
			</div>
        );
    } else {
        return (
			<div className='relative w-full h-full'>
				{isStockLow && !isStockLowCritical && (
					<div className="mb-4">
						<Badge className="text-sm bg-yellow-500 hover:bg-yellow-500 text-white animate-pulse absolute top-0 right-2">
							Stock Low ({totalStock} left)
						</Badge>
					</div>
				)}
				{isStockLow && isStockLowCritical && (
					<div className="mb-4">
						<Badge className="text-sm bg-red-500 hover:bg-red-700 text-white animate-pulse absolute top-0 right-2">
							Stock Critical ({totalStock} left)
						</Badge>
					</div>
				)}
				<img
					ref={mediaRef}
					data-src={mediaUrl}
					alt={altText}
					className="w-full h-full object-cover rounded-lg transition-transform duration-300"
					loading="lazy"
					style={{ opacity: 0 }}
					onLoad={() => {
						mediaRef.current.style.opacity = 1;
					}}
					
					onContextMenu={(e) => e.preventDefault()}  // Disable right-click
				/>
			</div>
        );
    }
});

// Lazy load custom hook
function useLazyLoadImage(ref, imageUrl) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target) {
                    const mediaElement = entry.target;
                    const mediaUrl = mediaElement.dataset.src || mediaElement.querySelector('source')?.dataset.src;
                    if (mediaUrl) {
                        if (mediaElement.tagName === 'VIDEO') {
                            mediaElement.querySelector('source').src = mediaUrl;
                        } else {
                            mediaElement.src = mediaUrl;
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [imageUrl]);
}

export default AdminProductTile;
