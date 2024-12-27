import React, { Fragment, useState } from 'react';
import { AiOutlineFire, AiOutlineStar } from 'react-icons/ai';
import Per from '../images/per.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Allproduct as getproduct } from '../../action/productaction';
import Slider from '@mui/material/Slider';

const MFilter = ({ product, dispatchFetchAllProduct }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState('hidden');
  const [sortVisible, setSortVisible] = useState('hidden');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [color, setColor] = useState('');

  // Function to apply filters
  const applyFilter = (filterType, value) => {
    let url = new URL(window.location.href);
    url.searchParams.set(filterType, value);
    window.history.replaceState(null, "", url.toString());
    dispatchFetchAllProduct && dispatchFetchAllProduct();
  };

  const toggleFilterVisibility = () => setFilterVisible(prevState => prevState === 'hidden' ? 'block' : 'hidden');
  const toggleSortVisibility = () => setSortVisible(prevState => prevState === 'hidden' ? 'block' : 'hidden');

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    
  };
  const applyPriceFilter = () => {
    console.log("Price: ", priceRange);
    applyFilter('price', priceRange.join(','));
  }

  const handleGenderChange = (genderValue) => {
    setGender(genderValue);
    applyFilter('gender', genderValue);
  };

  const handleCategoryChange = (categoryValue) => {
    setCategory(categoryValue);
    applyFilter('category', categoryValue);
  };

  const handleSubCategoryChange = (subCategoryValue) => {
    setSubCategory(subCategoryValue);
    applyFilter('subCategory', subCategoryValue);
  };

  const handleColorChange = (colorValue) => {
    setColor(colorValue);
    applyFilter('color', colorValue);
  };

  return (
    <Fragment>
      <div className="mobile-filter fixed bottom-0 w-full">
        <div className="grid grid-cols-12 bg-white py-3 border-t-[0.5px] border-slate-200 relative z-10">
          <div className="col-span-6 text-lg flex justify-center items-center" onClick={toggleSortVisibility}>
            <AiOutlineFire className="mr-2" /> SORT
          </div>
          <div className="col-span-6 text-lg flex justify-center text-center" onClick={toggleFilterVisibility}>
            <AiOutlineStar className="mr-2" /> FILTER
          </div>
          <span className="absolute h-[24px] border-r-[1px] border-slate-300 justify-self-center top-[33.33%]"></span>
        </div>
      </div>

      {/* SORT Modal */}
      <div className={`${sortVisible} z-20 bg-[#18181846] w-full h-full fixed top-0`} onClick={toggleSortVisibility}>
        <div className="absolute bottom-0 h-[45%] w-full bg-white">
          <h1 className="font-semibold text-base py-3 px-6 border-b-[0.5px] border-slate-200">SORT BY</h1>
          <h1 className="text-base py-3 px-6 flex items-center" onClick={() => applyFilter('sort', 'popularity')}>
            <AiOutlineFire className="mr-2" /> Popularity
          </h1>
          <h1 className="text-base py-3 px-6 flex items-center" onClick={() => applyFilter('sort', 'latest')}>
            <AiOutlineStar className="mr-2" /> Latest
          </h1>
          <h1 className="text-base py-3 px-6 flex items-center" onClick={() => applyFilter('sort', 'discount')}>
            <img src={Per} width="28px" alt="discount" /> Discount
          </h1>
          <h1 className="text-base py-3 px-6 flex items-center" onClick={() => applyFilter('sort', 'priceHighToLow')}>
            Price: High To Low
          </h1>
          <h1 className="text-base py-3 px-6 flex items-center" onClick={() => applyFilter('sort', 'priceLowToHigh')}>
            Price: Low To High
          </h1>
        </div>
      </div>

      <div className={`${filterVisible} z-20 bg-[#18181846] w-full h-full fixed top-0`} onClick={toggleFilterVisibility}>
  <div className="absolute bottom-0 h-[45%] w-full bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    {/* Title */}
    <h1 className="font-semibold text-base py-3 px-6 border-b-[0.5px] border-slate-200">FILTER BY</h1>

    {/* Gender Filter */}
    <div className="py-4">
      <h2 className="text-lg font-semibold px-6">Gender</h2>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleGenderChange('male')}>
        Male
      </h1>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleGenderChange('female')}>
        Female
      </h1>
    </div>

    {/* Category Filter */}
    <div className="py-4">
      <h2 className="text-lg font-semibold px-6">Category</h2>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleCategoryChange('electronics')}>
        Electronics
      </h1>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleCategoryChange('fashion')}>
        Fashion
      </h1>
    </div>

    {/* Subcategory Filter (Wearing Location) */}
    <div className="py-4">
      <h2 className="text-lg font-semibold px-6">Wearing Location</h2>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleSubCategoryChange('top-wear')}>
        Top-Wear
      </h1>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleSubCategoryChange('bottom-wear')}>
        Bottom-Wear
      </h1>
      <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleSubCategoryChange('footwear')}>
        Footwear
      </h1>
    </div>

      {/* Color Filter */}
        {/* <div className="py-4">
          <h2 className="text-lg font-semibold px-6">Color</h2>
          <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleColorChange('red')}>
            Red
          </h1>
          <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleColorChange('blue')}>
            Blue
          </h1>
          <h1 className="text-base py-3 px-6 flex items-center cursor-pointer" onClick={() => handleColorChange('black')}>
            Black
          </h1>
        </div> */}

        {/* Price Range Slider */}
        <div className="py-4">
          <h2 className="text-lg font-semibold px-6">Price Range</h2>
          <h1 className="text-base py-3 px-6 flex items-center">
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              max={1000}
            />
          </h1>
          <button className='bg-[#f26a10] text-white w-full py-2' onClick={() => applyPriceFilter()}>Apply</button>
        </div>
      </div>
    </div>

    </Fragment>
  );
};

export default MFilter;
