import React, { Fragment, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { capitalizeFirstLetterOfEachWord } from '@/config';
import BulletPointView from './BulletPointView';
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

  // Toggle function for expanding and collapsing the description
  const toggleDescription = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (selectedSize) {
      setSelectedColor(selectedSize?.colors);
      const color = selectedSize?.colors[0];
      console.log("Colors: ", color);
      setSelectedSize_color_Image_Array(color?.images);
      setSelectedColorId(color?.id);
      setSelectedImage(color?.images[0]);
    }
  }, [selectedSize]);

  // Stock Amount Low Indicator
  const stockAmountLowThreshold = 10; // You can change this to any value based on your requirements
  const isStockLow = product?.totalStock < stockAmountLowThreshold;

  return (
    <Card
      
      className="w-full lg:w-auto h-auto justify-start items-center lg:p-8 p-6 flex-col bg-gray-50 shadow-lg rounded-xl transition-transform hover:scale-105 hover:shadow-xl"
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden rounded-lg mb-4">
        {
          selectedSize_color_Image_Array && selectedSize_color_Image_Array.length && selectedSize_color_Image_Array.length > 0 && <img
          src={selectedSize_color_Image_Array[0].url ? selectedSize_color_Image_Array[0].url : selectedSize_color_Image_Array[0]}
          alt={product?.title}
          className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-110"
        />
        }
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>
      </div>

      {/* Title and Price */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {product?.title?.length > 20 ? `${product?.title.slice(0, 20)}` : product?.title}
      </h2>
      <div className="flex items-center justify-between mb-4">
        <span
          className={`${
            product?.salePrice > 0 ? 'line-through text-gray-500' : 'text-gray-700'
          } text-lg font-semibold`}
        >
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
          <span className="text-sm text-gray-800">
            {capitalizeFirstLetterOfEachWord(product?.category)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">SubCategory:</span>
          <span className="text-sm text-gray-800">
            {capitalizeFirstLetterOfEachWord(product?.subCategory)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Materials & Care:</span>
          <span className="text-sm text-gray-800">
            {capitalizeFirstLetterOfEachWord(product?.material)}
          </span>
        </div>
      </div>

      {/* Stock Amount Low Indicator */}
      {isStockLow && (
        <div className="mb-4">
          <Badge className="text-sm bg-yellow-500 text-white">
            Stock Low ({product?.totalStock} left)
          </Badge>
        </div>
      )}

      {isExpanded && (
        <Fragment>
          {/* Description */}
          <div className="w-full space-y-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Description:</h3>
            <p className="text-sm text-gray-600">
              {isExpanded ? product?.description : `${product?.description?.slice(0, 100)}...`}
            </p>
          </div>

          {/* Bullet Points */}
          {product?.bulletPoints && product?.bulletPoints.length > 0 && (
            <BulletPointView points={product?.bulletPoints} />
          )}

          {/* Sizes and Colors */}
          <div className="mt-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Sizes:</h3>
              <div className="flex flex-wrap gap-2">
                {product?.size?.map((size, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-full"
                  >
                    {size?.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm mt-4 font-semibold text-gray-700 mb-1">Colors:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedColor && selectedColor.length > 0 && selectedColor.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color?.label }}
                    ></span>
                    <span className="text-sm text-gray-700">{color?.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Fragment>
      )}

      <div className="w-full h-fit justify-center items-center flex">
        <Button
          onClick={(e) => {
            e.preventDefault();
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
};

// Grid item classes for the images
const getGridItemClasses = (index) => {
  if (index % 5 === 0) return 'col-span-2 row-span-2'; // Span 2 columns and 2 rows
  if (index % 3 === 0) return 'col-span-1 row-span-2'; // Span 1 column, 2 rows
  if (index % 4 === 0) return 'col-span-2 row-span-1'; // Span 2 columns, 1 row
  return 'col-span-1 row-span-1'; // Default: 1 column, 1 row
};

export default AdminProductTile;
