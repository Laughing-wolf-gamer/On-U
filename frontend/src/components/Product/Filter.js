import React, { useState } from "react";

const Filter = ({products,dispatchFetchAllProduct}) => {
  const [showCategory, setShowCategory] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  const toggleCategory = () => setShowCategory(!showCategory);
  const toggleGender = () => setShowGender(!showGender);
  const toggleColor = () => setShowColor(!showColor);
  const togglePrice = () => setShowPrice(!showPrice);

  return (
    <div className="w-64 p-4 bg-gray-50 rounded-lg shadow-md">
      {/* Category Filter */}
      <div className="mb-4">
          <button
            className="w-full text-left bg-green-500 text-white py-2 px-4 rounded-md focus:outline-none"
            onClick={toggleCategory}
          >
            Category
          </button>
          {showCategory && (
            <div className="mt-2 space-y-2">
              <label className="block">
                <input type="checkbox" /> Electronics
              </label>
              <label className="block">
                <input type="checkbox" /> Clothing
              </label>
              <label className="block">
                <input type="checkbox" /> Books
              </label>
            </div>
          )}
      </div>

      {/* Gender Filter */}
      <div className="mb-4">
        <button
          className="w-full text-left bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none"
          onClick={toggleGender}
        >
          Gender
        </button>
        {showGender && (
          <div className="mt-2 space-y-2">
            <label className="block">
              <input type="checkbox" /> Male
            </label>
            <label className="block">
              <input type="checkbox" /> Female
            </label>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <button
          className="w-full text-left bg-red-500 text-white py-2 px-4 rounded-md focus:outline-none"
          onClick={toggleColor}
        >
          Color
        </button>
        {showColor && (
          <div className="mt-2 space-y-2">
            <label className="block">
              <input type="checkbox" /> Red
            </label>
            <label className="block">
              <input type="checkbox" /> Blue
            </label>
            <label className="block">
              <input type="checkbox" /> Green
            </label>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-4">
        <button
          className="w-full text-left bg-yellow-500 text-white py-2 px-4 rounded-md focus:outline-none"
          onClick={togglePrice}
        >
          Price
        </button>
        {showPrice && (
          <div className="mt-2 space-y-2">
            <label className="block">
              <input type="radio" name="price" /> $0 - $50
            </label>
            <label className="block">
              <input type="radio" name="price" /> $50 - $100
            </label>
            <label className="block">
              <input type="radio" name="price" /> $100 - $200
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
