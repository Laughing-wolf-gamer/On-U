import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Filter = ({products}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initial state for filters
  const [filters, setFilters] = useState({
    gender: 'all',
    category: 'all',
    subcategory: 'all',
    sizes: [],
    colors: [],
    specialCategory:[],
    priceRange: [0, 1000],
  });

  // Helper function to parse the query string into an object
  const parseQueryParams = (queryString) => {
    const urlParams = new URLSearchParams(queryString);
    const params = {
      gender: urlParams.get('gender') || 'all',
      category: urlParams.get('category') || 'all',
      subcategory: urlParams.get('subcategory') || 'all',
      sizes: urlParams.getAll('sizes'),
      colors: urlParams.getAll('colors'),
      priceRange: [
        parseInt(urlParams.get('minPrice') || '0', 10),
        parseInt(urlParams.get('maxPrice') || '1000', 10),
      ],
    };
    return params;
  };

  // Update state based on query params in URL
  useEffect(() => {
    const params = parseQueryParams(location.search);
    setFilters(params);
  }, [location.search]);

  // Handle the changes of filters and update the URL
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      // For checkboxes (sizes, colors)
      const updatedValues = checked
        ? [...filters[name], value]
        : filters[name].filter((item) => item !== value);

      setFilters({ ...filters, [name]: updatedValues });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Update the query string in the URL when a filter changes
  const updateUrlQuery = () => {
    const queryParams = new URLSearchParams();

    // Add query params to URL
    queryParams.set('gender', filters.gender);
    queryParams.set('specialCategory', filters.specialCategory);
    queryParams.set('category', filters.category);
    queryParams.set('subcategory', filters.subcategory);
    filters.sizes.forEach((size) => queryParams.append('sizes', size));
    filters.colors.forEach((color) => queryParams.append('colors', color));
    queryParams.set('minPrice', filters.priceRange[0]);
    queryParams.set('maxPrice', filters.priceRange[1]);

    // Update the browser URL
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [prevFilters.priceRange[0], value],
    }));
  };

  // Handle the filter submission
  useEffect(() => {
    updateUrlQuery();
  }, [filters]);

  return (
    <div className="w-80 p-5 bg-gray-50 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-5">Filter Products</h3>

      {/* Gender Filter */}
      <div className="mb-4">
        <label htmlFor="gender" className="block font-medium text-sm mb-2">Gender</label>
        <select
          id="gender"
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label htmlFor="category" className="block font-medium text-sm mb-2">Category</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="clothing">Clothing</option>
          <option value="footwear">Footwear</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Subcategory Filter */}
      <div className="mb-4">
        <label htmlFor="subcategory" className="block font-medium text-sm mb-2">Subcategory</label>
        <select
          id="subcategory"
          name="subcategory"
          value={filters.subcategory}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="shirts">Shirts</option>
          <option value="pants">Pants</option>
          <option value="shoes">Shoes</option>
        </select>
      </div>

      {/* Sizes Filter */}
      <div className="mb-4">
        <label className="block font-medium text-sm mb-2">Sizes</label>
        <div className="flex flex-wrap gap-3">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={size}
                checked={filters.sizes.includes(size)}
                onChange={handleChange}
                name="sizes"
                className="h-4 w-4"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="mb-4">
        <label className="block font-medium text-sm mb-2">Colors</label>
        <div className="flex flex-wrap gap-3">
          {['Red', 'Blue', 'Black', 'White'].map((color) => (
            <label key={color} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={color}
                checked={filters.colors.includes(color)}
                onChange={handleChange}
                name="colors"
                className="h-4 w-4"
              />
              {color}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label htmlFor="price-range" className="block font-medium text-sm mb-2">Price Range</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={handlePriceRangeChange}
          className="w-full h-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-center mt-2">{`$0 - $${filters.priceRange[1]}`}</div>
      </div>
    </div>
  );
};

export default Filter;
