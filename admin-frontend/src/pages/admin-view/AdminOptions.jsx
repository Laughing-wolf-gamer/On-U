import { useToast } from '@/hooks/use-toast';
import { addNewOption, deleteOption, fetchAllOptions, setConvenienceFees } from '@/store/common-slice';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AdminOptions = () => {
  const { AllOptions,convenienceFees } = useSelector(state => state.common);

  const{toast} = useToast();
  const [dropdowns, setDropdowns] = useState({
    categories: false,
    subcategories: false,
    genders: false,
    clothingWearSizes: false,
    footWearSizes: false,
    colors: false
  });

  // Toggle dropdown visibility
  const toggleDropdown = (section) => {
    setDropdowns(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };
  const dispatch = useDispatch();
  const[convenienceFeesAmount,setConvenienceFeesAmount] = useState(0)
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [color, setColor] = useState('');
  const [footWearSize, setFootWearSize] = useState('');
  const [clothingWearSize, setClothingWearSize] = useState('');
  const [gender, setGender] = useState('');

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [footWearSizes, setFootWearSizes] = useState([]);
  const [clothingWearSizes, setClothingWearSizes] = useState([]);
  const [genders, setGenders] = useState([]);

  const handleAddOption = async (type, value) => {
    if (value.trim() === '') return;
    await dispatch(addNewOption({ type, value }));
    dispatch(fetchAllOptions());
    switch (type) {
      case 'category':
        setCategory('');
        break;
      case'subcategory':
        setSubcategory('');
        break;
      case 'color':
        setColor('');
        break;
      case 'footWearSize':
        setFootWearSize('');
        break;
      case 'clothingSize':
        setClothingWearSize('');
        break;
      case 'gender':
        setGender('');
        break;
      default:
        break;
    }
    toast({title:"Updated New Options"});
  };

  const handleRemoveOption = async (type, value) => {
    await dispatch(deleteOption({ type: type, value: value.value }));
    dispatch(fetchAllOptions());
    toast({title:`Removed New ${type}`,type:"error"});
  };

  useEffect(() => {
    dispatch(fetchAllOptions());
  }, [dispatch]);

  useEffect(() => {
    setAllOptions();
  }, [AllOptions, dispatch]);

  const setAllOptions = () => {
    if (AllOptions && AllOptions.length > 0) {
      AllOptions.map(item => {
        switch (item.type) {
          case 'category':
            setCategories(AllOptions.filter(item => item.type === 'category'));
            break;
          case 'subcategory':
            setSubcategories(AllOptions.filter(item => item.type === 'subcategory'));
            break;
          case 'color':
            setColors(AllOptions.filter(item => item.type === 'color') || []);
            break;
          case 'footWearSize':
            setFootWearSizes(AllOptions.filter(item => item.type === 'footWearSize'));
            break;
          case 'clothingSize':
            setClothingWearSizes(AllOptions.filter(item => item.type === 'clothingSize'));
            break;
          case 'gender':
            setGenders(AllOptions.filter(item => item.type === 'gender'));
            break;
        }
      });
    }
  };
  const updateConvenienceFees = async()=>{
    try {
      if(convenienceFeesAmount <= 0){
        toast({title:'Please enter a Number greater than zero'})
        return;
      }
      dispatch(setConvenienceFees({convenienceFees:convenienceFeesAmount}));
      setConvenienceFeesAmount(0);
    } catch (error) {
      console.error("Failed to set convenience: " + amount, error);
    }
  }
  console.log("All Options: ",AllOptions);

  return (

    <div className="p-8 space-y-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-900">Admin Product Options</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Options Form */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6 transform transition-transform hover:shadow-xl hover:bg-indigo-50">
          <h2 className="text-2xl font-semibold text-indigo-700">Create New Option</h2>
          <div>
            <label className="block font-medium text-gray-700">Add Products Purchase Convenience Fees</label>
              <input
                type="number"
                value={convenienceFeesAmount}
                onChange={(e) => setConvenienceFeesAmount(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={() => updateConvenienceFees()}
                className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
              >
                Add Convenience Fees
              </button>
          </div>
          {/* Product Category */}
          <div>
            <label className="block font-medium text-gray-700">Product Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => handleAddOption('category', category)}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Add Category
            </button>
          </div>

          {/* Product Subcategory */}
          <div>
            <label className="block font-medium text-gray-700">Product Subcategory</label>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => handleAddOption('subcategory', subcategory)}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Add Subcategory
            </button>
          </div>

          {/* Product Color */}
          <div>
            <label className="block font-medium text-gray-700">Product Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-2 w-full h-16 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => handleAddOption('color', color)}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Add Color
            </button>
          </div>

          {/* Product Size */}
          <div>
            <label className="block font-medium text-gray-700">Product FootWear Size</label>
            <input
              type="text"
              value={footWearSize}
              onChange={(e) => setFootWearSize(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => handleAddOption('footWearSize', footWearSize)}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Add Foot Wear Size
            </button>
          </div>
          <div>
            <label className="block font-medium text-gray-700">Product Cloth Size</label>
            <input
              type="text"
              value={clothingWearSize}
              onChange={(e) => setClothingWearSize(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => handleAddOption('clothingSize', clothingWearSize)}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Add Clothing Size
            </button>
          </div>

          {/* Product Gender */}
          <div>
            <label className="block font-medium text-gray-700">Product Gender</label>
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => handleAddOption('gender', gender)}
              className="mt-4 w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
            >
              Add Gender
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-700">Manage Options</h2>
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Categories
        </h3>
        <span>{convenienceFees}</span>
      </div>
      {/* Categories List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Categories
          <button onClick={() => toggleDropdown('categories')} className="text-indigo-600">
            {dropdowns.categories ? 'Hide' : 'Show'}
          </button>
        </h3>
          {dropdowns.categories && (
            <ul className="mt-2 space-y-2">
              {categories.map((item, index) => (
                <li key={index} className="flex justify-between items-center transition-transform hover:scale-105 hover:bg-indigo-50 transform duration-300">
                  <span className='font-sans'>{item?.value}</span>
                  <button
                    onClick={() => handleRemoveOption('category', item)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
        )}
      </div>

      {/* Subcategories List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Subcategories
          <button onClick={() => toggleDropdown('subcategories')} className="text-indigo-600">
            {dropdowns.subcategories ? 'Hide' : 'Show'}
          </button>
        </h3>
        {dropdowns.subcategories && (
          <ul className="mt-2 space-y-2">
            {subcategories.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className='font-sans'>{item?.value}</span>
                <button
                  onClick={() => handleRemoveOption('subcategory', item)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Genders List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Genders
          <button onClick={() => toggleDropdown('genders')} className="text-indigo-600">
            {dropdowns.genders ? 'Hide' : 'Show'}
          </button>
        </h3>
        {dropdowns.genders && (
          <ul className="mt-2 space-y-2">
            {genders.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className='font-sans'>{item?.value}</span>
                <button
                  onClick={() => handleRemoveOption('gender', item)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clothing Size List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Clothing Size
          <button onClick={() => toggleDropdown('clothingWearSizes')} className="text-indigo-600">
            {dropdowns.clothingWearSizes ? 'Hide' : 'Show'}
          </button>
        </h3>
        {dropdowns.clothingWearSizes && (
          <ul className="mt-2 space-y-2">
            {clothingWearSizes.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className='font-sans'>{item?.value}</span>
                <button
                  onClick={() => handleRemoveOption('clothingSize', item)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footwear Size List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Footwear Size
          <button onClick={() => toggleDropdown('footWearSizes')} className="text-indigo-600">
            {dropdowns.footWearSizes ? 'Hide' : 'Show'}
          </button>
        </h3>
        {dropdowns.footWearSizes && (
          <ul className="mt-2 space-y-2">
            {footWearSizes.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className='font-sans'>{item?.value}</span>
                <button
                  onClick={() => handleRemoveOption('footWearSize', item)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Colors List */}
      <div>
        <h3 className="text-xl font-medium text-gray-800 flex items-center justify-between">
          Product Colors
          <button onClick={() => toggleDropdown('colors')} className="text-indigo-600">
            {dropdowns.colors ? 'Hide' : 'Show'}
          </button>
        </h3>
        {dropdowns.colors && (
          <ul className="mt-2 space-y-2">
            {colors.map((item, index) => (
              <li key={index} className="flex justify-between items-center space-x-4">
                <div
                  className='w-full h-10 border border-gray-800 shadow-md border-spacing-4 hover:scale-y-105 transition-transform duration-300 p-3'
                  style={{ backgroundColor: item?.value }}
                ></div>
                <button
                  onClick={() => handleRemoveOption('color', item)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
      </div>
    </div>
  );
};

export default AdminOptions;
