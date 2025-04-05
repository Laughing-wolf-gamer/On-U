import React, { useState, memo, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { Button } from '../ui/button';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice } from '@/config';
import { Badge } from '../ui/badge';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
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
        <li className="w-full h-full justify-center items-center p-2 flex-col border border-gray-600 rounded-md bg-gray-50">
            {/* Image Section */}
            <div className="w-full h-[400px] overflow-hidden rounded-lg mb-4 bg-gray-300">
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
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 font-medium">Total Sold:</span>
						<span className="text-sm text-gray-800">{product?.TotalSoldAmount}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-600 font-medium">Total Stock:</span>
						<span className="text-sm text-gray-800">{product?.totalStock}</span>
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
        </li>
    );
};

// Memoized Media Component
const MemoizedMedia = memo(({ mediaUrl, altText, isStockLow, isStockLowCritical, totalStock }) => {
    const mediaRef = useRef(null);
    const isVideo = typeof mediaUrl === 'string' && mediaUrl.match(/\.(mp4|webm|ogg)$/i);

    // Lazy load image/video
    useLazyLoadImage(mediaRef, mediaUrl);

    if (isVideo) {
        return (
            <div className="relative">
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
                    loop={true}
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
            <div className="relative w-full h-full">
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
                <LazyLoadImage
                    ref={mediaRef}
					effect="blur"
                    src={mediaUrl}
                    alt={altText}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300"
					useIntersectionObserver
					loading="lazy"
					wrapperProps={{
						// If you need to, you can tweak the effect transition using the wrapper style.
						style: {transitionDelay: "1s"},
					}}
                    onContextMenu={(e) => e.preventDefault()}  // Disable right-click
                />
            </div>
        );
    }
});


// Lazy load custom hook
function useLazyLoadImage(ref, imageUrl) {
    useLayoutEffect(() => {
        // Ensure that the ref is pointing to a valid DOM element
        const element = ref.current;

        // If ref is not attached to a DOM element, skip observing
        if (!element || !(element instanceof HTMLElement)) {
            console.warn('Ref is not attached to a valid DOM element');
            return;
        }

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
                    observer.unobserve(entry.target); // Unobserve once the element is loaded
                }
            });
        }, {
            threshold: 0.1,
        });

        // Start observing the element only if it's valid
        observer.observe(element);

        // Cleanup the observer on unmount or when ref changes
        return () => {
            if (element && element.isConnected) {
                observer.unobserve(element);
            } else {
                console.warn('Element is no longer connected, unable to unobserve');
            }
        };
    }, [imageUrl, ref]); // Re-run the effect if ref or imageUrl changes
}


export default AdminProductTile;
