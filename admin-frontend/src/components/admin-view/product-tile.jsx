import React, { useEffect, useState, memo, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import { Badge } from '../ui/badge'; // Assuming you are using Badge component for indicators

const AdminProductTile = ({
    setOpenProductPreview,
    togglePopUp,
    product,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedSize, setSelectedSize] = useState(product?.size[0]);
    const [selectedColor, setSelectedColor] = useState(product?.size[0]?.colors[0] || []);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize_color_Image_Array, setSelectedSize_color_Image_Array] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState(null);

    const imageRef = useRef(null); // Reference for the image element to observe

    // Toggle function for expanding and collapsing the description

    useEffect(() => {
        if (selectedSize) {
            setSelectedColor(selectedSize?.colors);
            const color = selectedSize?.colors[0];
            setSelectedSize_color_Image_Array(color?.images);
            setSelectedColorId(color?.id);
            setSelectedImage(color?.images[0]);
        }
    }, [selectedSize]);

    // Lazy load the image or video when the component comes into view
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target) {
                    const imageElement = entry.target;
                    const imageUrl = imageElement.dataset.src;
                    if (imageUrl) {
                        imageElement.src = imageUrl; // Set the real image URL to trigger load
                    }
                    observer.unobserve(entry.target); // Stop observing once the image is loaded
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the image is in the viewport
        });

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, [product]);

    // Stock Amount Low Indicator
    const stockAmountLowThreshold = 10;
    const stockAmountLowThresholdCritical = 5;
    const isStockLow = product?.totalStock < stockAmountLowThreshold;
    const isStockLowCritical = product?.totalStock < stockAmountLowThresholdCritical;

    // Memoized Image Component
    /* const MemoizedImage = memo(({ imageUrl, altText }) => {
        return (
            <img
                ref={imageRef} // Add the ref for intersection observer
                data-src={imageUrl} // Use data-src to set the real image URL on intersection
                alt={altText}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                loading="lazy" // Lazy loading for the image
                style={{ opacity: 0 }} // Start with opacity 0, and fade in once loaded
                onLoad={() => {
                    imageRef.current.style.opacity = 1; // Fade-in effect after loading
                }}
            />
        );
    }); */

    return (
        <Card className="md:w-[300px] 2xl:w-[300px] w-full h-full justify-start items-center p-2 flex-col bg-gray-50 shadow-lg">
            {/* Image Section */}
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg mb-4 bg-blue-300">
                {selectedSize_color_Image_Array?.[0]?.url ? (
                    <MemoizedImage
                        imageUrl={selectedSize_color_Image_Array[0].url}
                        altText={product?.title}
                    />
                ) : (
                    <MemoizedImage
                        imageUrl={selectedSize_color_Image_Array?.[0]}
                        altText={product?.title}
                    />
                )}
                
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
                    <Badge className="text-sm bg-yellow-500 text-white">
                        Stock Low Critical ({product?.totalStock} left)
                    </Badge>
                </div>
            )}
            {/* View More / Less Button */}
            <div className="w-full h-fit justify-center items-center flex">
                <Button
                    onClick={(e) => {
                        setOpenProductPreview(product._id);
                        togglePopUp();
                    }}
                    className="text-sm text-white bg-gray-700 hover:bg-gray-800 transition-colors"
                >
                    {isExpanded ? 'View Less' : 'View More'}
                </Button>
            </div>
        </Card>
    );
}
const MemoizedImage = memo(({ imageUrl, altText }) => {
    const imageRef = useRef(null); // Ref for each image

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.target) {
                    const imageElement = entry.target;
                    const imageUrl = imageElement.dataset.src;
                    if (imageUrl) {
                        imageElement.src = imageUrl; // Set the real image URL to trigger load
                    }
                    observer.unobserve(entry.target); // Stop observing once the image is loaded
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the image is in the viewport
        });

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, []);

    return (
        <img
            ref={imageRef} // Add the ref for intersection observer
            data-src={imageUrl} // Use data-src to set the real image URL on intersection
            alt={altText}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
            loading="lazy" // Lazy loading for the image
            style={{ opacity: 0 }} // Start with opacity 0, and fade in once loaded
            onLoad={() => {
                imageRef.current.style.opacity = 1; // Fade-in effect after loading
            }}
        />
    );
});
/* {
    selectedSize_color_Image_Array && selectedSize_color_Image_Array.length && selectedSize_color_Image_Array.length > 0 && <img
    src={selectedSize_color_Image_Array[0].url ? selectedSize_color_Image_Array[0].url : selectedSize_color_Image_Array[0]}
    alt={`Preview Image:_${selectedSize_color_Image_Array}`}
    loading='lazy'
    className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-110"
    />
} */
// Grid item classes for the images
const getGridItemClasses = (index) => {
    if (index % 5 === 0) return 'col-span-2 row-span-2'; // Span 2 columns and 2 rows
    if (index % 3 === 0) return 'col-span-1 row-span-2'; // Span 1 column, 2 rows
    if (index % 4 === 0) return 'col-span-2 row-span-1'; // Span 2 columns, 1 row
    return 'col-span-1 row-span-1'; // Default: 1 column, 1 row
};

export default AdminProductTile;
