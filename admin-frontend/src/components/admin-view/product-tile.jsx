import React, { useState, memo, useEffect, useRef, useMemo } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { capitalizeFirstLetterOfEachWord } from '@/config';
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
        <Card className="md:w-[300px] 2xl:w-[300px] w-full h-full justify-start items-center p-2 flex-col bg-gray-50 shadow-lg">
            {/* Image Section */}
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg mb-4 bg-gray-100">
                <MemoizedImage
                    imageUrl={selectedSizeColorImageArray[0]?.url}
                    altText={product?.title}
                />
            </div>

            {/* Title and Price */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {product?.title?.length > 20 ? `${product?.title.slice(0, 20)}.` : product?.title}
            </h2>
            <div className="flex items-center justify-between mb-4">
                <span className={`text-lg font-semibold ${product?.salePrice > 0 ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    ₹{product?.price}
                </span>
                {product?.salePrice > 0 && (
                    <span className="text-red-600 text-xl font-bold">
                        ₹{product?.salePrice}
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
            {isStockLow && !isStockLowCritical && (
                <div className="mb-4">
                    <Badge className="text-sm bg-yellow-500 text-white">
                        Stock Low ({product?.totalStock} left)
                    </Badge>
                </div>
            )}
            {isStockLow && isStockLowCritical && (
                <div className="mb-4">
                    <Badge className="text-sm bg-red-500 text-white">
                        Stock Critical ({product?.totalStock} left)
                    </Badge>
                </div>
            )}

            {/* View More / Less Button */}
            <div className="w-full h-fit justify-center items-center flex">
                <Button
                    title = {"View More"}
                    onClick={() => {
                        setOpenProductPreview(product._id);
                        togglePopUp();
                    }}
                    className="text-sm text-white bg-gray-700 hover:bg-gray-800 transition-colors"
                >
                    
                </Button>
            </div>
        </Card>
    );
};

// Memoized Image Component
const MemoizedImage = memo(({ imageUrl, altText }) => {
    const imageRef = useRef(null);

    useLazyLoadImage(imageRef, imageUrl);

    return (
        <img
            ref={imageRef}
            data-src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
            loading="lazy"
            style={{ opacity: 0 }}
            onLoad={() => {
                imageRef.current.style.opacity = 1;
            }}
        />
    );
});

// Lazy load custom hook
function useLazyLoadImage(ref, imageUrl) {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target) {
                    const imageElement = entry.target;
                    const imageUrl = imageElement.dataset.src;
                    if (imageUrl) {
                        imageElement.src = imageUrl;
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
