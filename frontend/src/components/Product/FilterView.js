import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../action/productaction';
import { Slider } from '@mui/material';
import styled from '@emotion/styled';
import { ChevronUp } from 'lucide-react';

const FilterView = ({ product, dispatchFetchAllProduct,handleResetFilter }) => {

    const dispatch = useDispatch();
    const [colorul, setcolorul] = useState('max-h-80');
    const [colorulbtn, setcolorulbtn] = useState('block');
  
    let AllProductsCategory = [];
    let AllProductsSubcategory = [];
    let size = []
    let AllProductsGender = [];
    let AllProductsColor = [];
    let specialCategory = [];
    let spARRAY = [];
    let discountedPercentageAmount = [];
    let onSale = []
    const n = 3
    const result = [[], [], []] //we create it, then we'll fill it    
    // Generate category, gender, color, and price arrays
    const categoriesarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
				AllProductsCategory.push(p.category)
			});
        }
    };
    function SetOnSale (){
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p.salePrice && p.salePrice > 0){
					onSale.push(p.salePrice)
                }
            });
        }
    }
    function setDiscountedPercentage (){
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p.salePrice && p.salePrice > 0){
                    const amount = Math.floor(p.DiscountedPercentage);
					discountedPercentageAmount.push(amount)
                }
            });
        }
    }
    const specialCategoryArray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
				specialCategory.push(p.specialCategory)
                if(p.specialCategory !== "none" && p.specialCategory !== undefined){
                }
            });
        }
    };
    const subcategoryarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
				AllProductsSubcategory.push(p.subCategory)
			});
        }
    };


    const genderarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
				AllProductsGender.push(p.gender)
			});
        }
    };
    function sizearray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p){
                    p.size.forEach(s => {
						size.push(s.label);
                    })
                }
            });
        }
      }

    const colorarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                p.AllColors.forEach(c =>{
					AllProductsColor.push(c);
                })
            });
        }
    };

    const sparray = () => {
        product.forEach(p => {
            const currentPrice = p.price;
            if(!spARRAY.includes(currentPrice)){
                spARRAY.push(currentPrice);
            }
        });
        // console.log("SubCategory: ", subcategory);
    };
    useEffect(()=>{
        categoriesarray();
        subcategoryarray();
        genderarray();
        colorarray();
        sizearray();
        specialCategoryArray();
        sparray();
        SetOnSale();
        setDiscountedPercentage();
    },[product,window.location.search])
    categoriesarray();
    subcategoryarray();
    genderarray();
    colorarray();
    sizearray();
    SetOnSale();
    
    specialCategoryArray();
    setDiscountedPercentage();
    sparray();
    
    // Remove duplicates and sort price array
    let Categorynewarray = [...new Set(AllProductsCategory)];
    let sizenewarray = [...new Set(size)];
    let gendernewarray = [...new Set(AllProductsGender)];
    let colornewarray = [
		...new Map(AllProductsColor.map(item => [item.label, item])).values()
	];
    let subcategorynewarray = [...new Set(AllProductsSubcategory)];
    let specialCategorynewarray = [...new Set(specialCategory)];
    let discountedPercentageAmountnewarray = [...new Set(discountedPercentageAmount)];
    let sp = [...new Set(spARRAY.sort((a, b) => a - b))];
    
    const setPriceFilter= ()=>{
        const wordsPerLine = Math.ceil(sp.length / 3)
        for (let line = 0; line < n; line++) {
            for (let i = 0; i < wordsPerLine; i++) {
                const value = sp[i + line * wordsPerLine]
                if (!value) continue //avoid adding "undefined" values
                result[line].push(value)
            }
        }
    }
    // Update the URL based on the selected category
    const categoryfun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('category'); // This will return an array
    
        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);
    
        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }
    
        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('category');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('category', sub);
        });
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    const specialCategoryFun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSpecialCategory = url.searchParams.getAll('specialCategory'); // This will return an array
    
        // Check if the subcategory is already in the array
        const isSelected = selectedSpecialCategory.includes(e);
    
        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSpecialCategory = selectedSpecialCategory.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSpecialCategory.push(e);
        }
    
        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('specialCategory');
        selectedSpecialCategory.forEach(sub => {
            url.searchParams.append('specialCategory', sub);
        });
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    const discountedAmountFun = (e) => {
        let url = new URL(window.location.href);
    
        // Get the current 'discountedAmount' value from the URL (if any)
        let selectedDiscountedAmount = url.searchParams.get('discountedAmount'); // This will return a single string, not an array
        
        // Set the new value for 'discountedAmount' query parameter
        if (selectedDiscountedAmount === e) {
            // If the selected value is already in the URL, remove it (deselect it)
            url.searchParams.delete('discountedAmount');
        } else {
            // Otherwise, set the selected value
            url.searchParams.set('discountedAmount', e);
        }
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    
    const onSaleFun = ()=>{
        let url = new URL(window.location.href);
        let onSaleData = url.searchParams.get('onSale');
        // Check if 'onSale' parameter is present in the URL
        if (onSaleData === null) {
            // If 'onSale' doesn't exist, set it to 'true'
            url.searchParams.append("onSale", 'true');
        } else if (onSaleData === 'true') {
            // If 'onSale' exists and is 'true', set it to 'false'
            url.searchParams.set("onSale", 'false');
        } else {
            // If 'onSale' exists and is not 'true', set it to 'true'
            url.searchParams.set("onSale", 'true');
        }

        // Update the URL without reloading the page
        window.history.replaceState(null, "", url.toString());

        // If dispatchFetchAllProduct is a function, call it
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    }
    const sizefun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('size'); // This will return an array
    
        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);
    
        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }
    
        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('size');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('size', sub);
        });
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    const subcategoryfun = (e) => {
        let url = new URL(window.location.href);
    
        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('subcategory'); // This will return an array
    
        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);
    
        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }
    
        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('subcategory');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('subcategory', sub);
        });
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    const colorfun = (colorHex) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectColor = url.searchParams.getAll('color'); // This will return an array
    
        // Check if the subcategory is already in the array
        const isSelected = selectColor.includes(colorHex);
    
        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectColor = selectColor.filter(col => col !== colorHex);
        } else {
            // If the subcategory is not selected, add it to the array
            selectColor.push(colorHex);
        }
    
        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('color');
        selectColor.forEach(col => {
            url.searchParams.append('color', col);
        });
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    

    // Update the URL for price filter (single threshold)
    const price1fun = (e) => {
        let url = new URL(window.location.href);
        url.searchParams.set('sellingPrice[$lte]', e);
        window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    // Update the URL for price filter (range)
    const price2fun = (e, f) => {
        let url = new URL(window.location.href);
        url.searchParams.set('sellingPrice[$gte]', e);
        url.searchParams.set('sellingPrice[$lte]', f);
        window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    // Update the URL for price filter (lower threshold)
    const price3fun = (e) => {
        let url = new URL(window.location.href);
        url.searchParams.set('sellingPrice[$gte]', e);
        window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    // Handle gender filter
    const genderfun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('gender'); // This will return an array
    
        // Check if the subcategory is already in the array
        const isSelected = selectedSubcategories.includes(e);
    
        if (isSelected) {
            // If the subcategory is already selected, remove it from the array
            selectedSubcategories = selectedSubcategories.filter(sub => sub !== e);
        } else {
            // If the subcategory is not selected, add it to the array
            selectedSubcategories.push(e);
        }
    
        // Clear the existing 'subcategory' parameters and append the updated array
        url.searchParams.delete('gender');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('gender', sub);
        });
    
        // Update the URL in the browser's address bar without reloading the page
        window.history.replaceState(null, "", url.toString());
    
        // Fetch products based on the updated URL parameters
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    function sparraynew(){
        let filersp = spARRAY.filter((f)=>f <=  Math.max(...result[1]) )
        let newfiltersp = filersp.filter((f)=>f >=  Math.min(...result[1]))
        return newfiltersp.length
    } 

    // Function to clear all filters from the URL
    const clearAllFilters = () => {
        let url = new URL(window.location.href);
        url.search = ''; // This clears all the query parameters
        window.history.replaceState(null, "", url.toString());
        
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct(); // Fetch all products without filters
        }
		handleResetFilter();
    };

    // Check if any filters are selected from URL and update UI accordingly
    const check = () => {
        const params = new URLSearchParams(window.location.search);
        // console.log("Params: ",params);
        // Set category checkboxes based on URL params
        const selectedCategories = params.getAll('category');
        selectedCategories.forEach((cat) => {
            const checkbox = document.getElementById(`id${cat}`);
            if (checkbox) checkbox.checked = true;
        });

        // Set gender radio buttons based on URL params
        const selectedGender = params.get('gender');
        if (selectedGender) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${selectedGender}"]`);
            if (genderRadio) genderRadio.checked = true;
        };

        // Set color checkboxes based on URL params
        const selectedColor = params.get('color');
        if (selectedColor) {
            const colorCheckbox = document.getElementById(`id_${selectedColor}`);
            if (colorCheckbox) colorCheckbox.checked = true;
        }

        // Set price checkboxes based on URL params
        const priceMin = params.get('sellingPrice[$gte]');
        const priceMax = params.get('sellingPrice[$lte]');
        if (priceMin && priceMax) {
            // Set corresponding price range checkboxes based on selected range
            const priceRange = `${priceMin} to ${priceMax}`;
            const priceCheckbox = document.querySelector(`input[type="checkbox"][value="${priceRange}"]`);
            if (priceCheckbox) priceCheckbox.checked = true;
        }
    };

    // Run check on component mount to initialize UI with selected filters
    useEffect(() => {
        check();
    }, []);
    useEffect(()=>{
        dispatch(fetchAllOptions());
    },[dispatch])
    setPriceFilter();
    return (
        <div>
            <div className='space-y-4 uppercase font-kumbsan ml-6'>
				
                {/* Gender Filter */}
                {/* <ul className='pl-1 border-b-[1px] border-slate-200 py-1'>
                    <h1 className=' text-base font-semibold mb-2'>GENDER</h1>
                    {gendernewarray && gendernewarray.length > 0 && gendernewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('gender'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i}>
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value={e}
                                    id={`cat_${e}`}
                                    className='mb-2 accent-gray-500 cursor-pointer'
									checked = {isChecked}
                                    // defaultChecked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {
                                		genderfun(e); // This will update the URL with the selected gender
									}} // We can add the change handler if needed, or leave empty
                                />
                                <label className=' text-sm uppercase space-x-1 ml-2 mr-4 mb-2'>
                                    <span>{e}</span> 
                                    <span className='text-xs font-kumbsan font-normal text-slate-400'> 
                                        ({AllProductsGender.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul> */}
                {/* Categories Filter */}
                {/* <ul className='pl-1 border-b-[1px] border-slate-200 py-4'>
                    <h1 className=' text-base font-semibold mb-2'>CATEGORIES</h1>
                    {Categorynewarray && Categorynewarray.length > 0 && Categorynewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('category'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i}>
                                <input
                                    type="checkbox"
                                    name="categories"
                                    value={e}
                                    id={`cat_${e}`}
                                    className='mb-2 accent-gray-500 cursor-pointer'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
									onChange={() => {
										categoryfun(e); // This will update the URL with the selected category
									}}
                                />
                                <label className=' text-sm ml-2 space-x-1 mr-4 mb-2'>
                                    <span>{e}</span> 
                                    <span className='text-xs font-serif font-normal text-slate-400'> 
                                        ({AllProductsCategory.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul> */}
                {/* Subcategories Filter */}
                {/* <ul className='pl-1 border-b-[1px] border-slate-200 py-4'>
                    <h1 className=' text-base font-semibold mb-2'>SUBCATEGORIES</h1>
                    {subcategorynewarray && subcategorynewarray.length > 0 && subcategorynewarray.map((e, i) => {
                        // Check if the current subcategory 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedSubcategories = params.getAll('subcategory'); // Get all subcategories from URL

                        const isChecked = selectedSubcategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <li key={i}>
                                <input
                                    type="checkbox"
                                    name={`subcategories_${i}`}
                                    id={`id_${e}`}
                                    className='mb-2 accent-gray-500 cursor-pointer'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {
										subcategoryfun(e); // This will update the URL with the selected subcategory
									}} // We can add the change handler if needed, or leave empty
                                />
                                <label className='text-sm uppercase space-x-1 ml-2 mr-4 mb-2'>
                                    <span>{e}</span> <span className='text-xs font-serif font-normal text-slate-400'> ({AllProductsSubcategory.filter((f) => f === e).length})</span>
                                </label>
                            </li>
                        );
                    })}
                </ul> */}
                {/* Size Filter */}
                {/* <ul className='pl-1 border-b-[1px] border-slate-200 py-4'>
                    <h1 className=' text-base font-semibold mb-2'>SIZE</h1>
                    {sizenewarray && sizenewarray.length > 0 && sizenewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('size'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i} >
                                <input
                                    type="checkbox"
                                    name="categories"
                                    id={`size_${i}`}
                                    className='mb-2 accent-gray-500 cursor-pointer'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {
										sizefun(e); // This will update the URL with the selected category
									}} // We can add the change handler if needed, or leave empty
                                />
                                <label className=' text-sm ml-2 space-x-1 uppercase mr-4 mb-2'>
                                    <span>{e}</span> 
                                    <span className='text-xs font-serif font-normal text-slate-400'> 
                                        ({size.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul> */}
               {/*  <ul className='pl-1 border-b-[1px] border-slate-200 py-4'>
                    <h1 className=' text-base font-semibold mb-2'>SPECIAL CATEGORY</h1>
                    {specialCategorynewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('specialCategory'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL
						// console.log("Filter Amount: ",specialCategorynewarray);
                        return (
                            <div key={i} >
                                <input
                                    type="checkbox"
                                    name="specialCategory"
                                    id={`special_cat_${e}`}
                                    className='mb-2 accent-gray-500 cursor-pointer'
                                    checked={isChecked || false} // Set checkbox checked if it's selected in the URL
									onChange={() => {
										specialCategoryFun(e); // This will update the URL with the selected gender
									}}
                                />
                                <label className=' text-sm ml-2 space-x-1 mr-4 mb-2'>
                                    <span>{e}</span> 
                                    <span className='text-xs font-kumbsan font-normal text-slate-400'> 
                                        ({specialCategory.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul> */}
				{/* {discountedPercentageAmountnewarray && discountedPercentageAmountnewarray.length > 0 && (
					<ul className='pl-1 border-b-[1px] border-slate-200 py-4'>
						<h1 className=' text-base font-semibold mb-2'>DISCOUNT</h1>
						{discountedPercentageAmountnewarray.sort((a,b)=> a - b).map((amount, i) => {
							// Get the 'discountedAmount' value from the URL
							const params = new URLSearchParams(window.location.search);
							const currentAmount = params.get('discountedAmount'); // This will return the current discountedAmount in the URL
							// console.log("Current amount: " + currentAmount);
							// Determine if the current radio button should be checked based on the URL parameter
							const isChecked = Number(currentAmount) === amount;

							return (
								<div key={i}>
									<input
										type="radio" // Ensure it's a radio input
										name="discountedAmountPercentage" // All radios must have the same name for exclusive selection
										id={`discountedPercentageAmountnewarray_${amount}`}
										className="mb-2 accent-gray-500 cursor-pointer"
										checked={isChecked} // Radio button is checked if the URL's discountedAmount equals the current amount
										onChange={() => {
											discountedAmountFun(amount); // This will update the URL with the selected amount
										}}
									/>
									<label className=" text-sm ml-2 space-x-1 uppercase mr-4 mb-2">
										<span>UpTo {amount} %</span> 
										
										<span className="text-xs font-kumbsan font-normal text-slate-400"> 
											({discountedPercentageAmount.filter((f) => f === amount).length})
										</span>
									</label>
								</div>
							);
						})}

					</ul>
				)} */}
                

                
                {/* Color Filter */}
                {/* <ul className={`pl-1 border-b-[1px] border-slate-200 py-4 ${colorul} overflow-y-auto relative scrollbar-thin scrollbar-track-gray-400 scrollbar-thumb-gray-700`}>
                    <h1 className=" text-base font-semibold mb-2">COLOR</h1>
                    {colornewarray && colornewarray.length > 0 && 
                        colornewarray.slice(0, colorul === 'max-h-max' ? colornewarray.length : 5).map((e, i) => {
                            // Check if the current color 'e.label' exists in the URL parameters
                            const params = new URLSearchParams(window.location.search);
                            const selectedColors = params.getAll('color'); // Get all color values from URL

                            const isChecked = selectedColors.includes(e.label); // Check if current color is selected

                            return (
                                <li key={i} className="flex items-center w-full md:space-x-2 sm:space-x-2 xl:space-x-2 2xl:space-x-2 lg:space-x-3 p-2">
                                    <input
                                        type="checkbox"
                                        name="color"
                                        id={`color_${i}`}
                                        className="accent-gray-500 cursor-pointer"
                                        checked={isChecked} // Set checkbox checked if color is selected in the URL
                                        onChange={() => {
                                            colorfun(e.label); // This will update the URL with the selected color
                                        }}
                                    />
                                    <div
                                        style={{ backgroundColor: e.label }}
                                        className="w-7 h-7 border border-slate-400 rounded-md"
                                    ></div>
                                    <label className="flex flex-row whitespace-nowrap space-x-1 uppercase text-left text-sm">
                                        <span className="font-semibold">
                                            {e.name && (
                                                <span>
                                                    {e?.name}
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-xs font-normal text-slate-400">
                                            ({AllProductsColor.filter((f) => f.label === e.label).length})
                                        </span>
                                    </label>
                                </li>
                            );
                        })
                    }

                    {colornewarray.length > 5 && (
                        <div className="flex justify-center mt-5">
                            <button 
                                className={`text-gray-800 text-base font-medium hover:underline rounded-md px-5 py-1 space-x-2 flex flex-row justify-start items-center ${colorulbtn}`} 
                                onClick={() => {
									// Toggle between showing "+ More" and "- Less" button
									const expandedType = colorul === 'max-h-80' ? "max-h-max":'max-h-80';
                                    setcolorul(expandedType);
                                }}>
								<ChevronUp className={`w-5 h-5 ${colorul === 'max-h-80' ? "rotate-180":''}`}/>
								<span>
                                	{colorul === 'max-h-80'? 'More' : 'Less'} Colors
								</span>
                            </button>
                        </div>
                    )}
                </ul> */}
				{/* {
					onSale && onSale.length > 0 && (
						<ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
							<h1 className=' text-base font-semibold mb-2'>On Sale</h1>
							{[1].map((_, i) => {
								// Get the URL search parameters
								const params = new URLSearchParams(window.location.search);
								const selectedOnSale = params.getAll('onSale'); // Get all 'onSale' values from URL
								
								// Check if the URL contains 'onSale=true'
								const isChecked = selectedOnSale.includes('true');

								return (
									<div key={i}>
										<input
											type="checkbox"
											name="OnSale"
											id={`On_sale`}
											className='mb-2 accent-gray-500 cursor-pointer'
											checked={isChecked} // Set checkbox checked based on URL parameter
											onChange={() => {
												onSaleFun(); // This will update the URL with the selected sale status
											}}
										/>
										<label className='text-sm ml-2 space-x-1 uppercase mr-4 mb-2'>
											<span>On Sale</span>
											<span className='text-xs font-kumbsan font-normal text-slate-400'>
												({onSale.length})
											</span>
										</label>
									</div>
								)
							})}
						</ul>

					)
				} */}
				<FilterGroup
					title="Gender"
					name="gender"
					items={gendernewarray}
					selectedValues={new URLSearchParams(window.location.search).getAll("gender")}
					onChange={genderfun}
					getCount={(e) => AllProductsGender.filter((f) => f === e).length}
				/>

				<FilterGroup
					title="Categories"
					name="category"
					items={Categorynewarray}
					selectedValues={new URLSearchParams(window.location.search).getAll("category")}
					onChange={categoryfun}
					getCount={(e) => AllProductsCategory.filter((f) => f === e).length}
				/>

				<FilterGroup
					title="Subcategories"
					name="subcategory"
					items={subcategorynewarray}
					selectedValues={new URLSearchParams(window.location.search).getAll("subcategory")}
					onChange={subcategoryfun}
					getCount={(e) => AllProductsSubcategory.filter((f) => f === e).length}
				/>

				<FilterGroup
					title="Size"
					name="size"
					items={sizenewarray}
					selectedValues={new URLSearchParams(window.location.search).getAll("size")}
					onChange={sizefun}
					getCount={(e) => size.filter((f) => f === e).length}
				/>

				<FilterGroup
					title="Special Category"
					name="specialCategory"
					items={specialCategorynewarray}
					selectedValues={new URLSearchParams(window.location.search).getAll("specialCategory")}
					onChange={specialCategoryFun}
					getCount={(e) => specialCategory.filter((f) => f === e).length}
				/>

				<FilterGroup
					title="Discount"
					name="discountedAmount"
					type="radio"
					items={discountedPercentageAmountnewarray.sort((a,b) => a - b)}
					selectedValues={[parseInt(new URLSearchParams(window.location.search).get("discountedAmount"))]}
					onChange={discountedAmountFun}
					getLabel={(e) => `UpTo ${e} %`}
					getCount={(e) => discountedPercentageAmount.filter((f) => f === e).length}
				/>
				<PriceFilter result={result} sp={sp} spARRAY={spARRAY} sparraynew={sparraynew} dispatchFetchAllProduct={dispatchFetchAllProduct}/>
				<FilterGroup
					title="Color"
					name="color"
					type="checkbox"
					specialType = "color"
					items={colornewarray}
					selectedValues={new URLSearchParams(window.location.search).getAll("color")}
					onChange={(color) => colorfun(color)}
					getValue={(e) => e.label}
					getLabel={(e) => e.name}
					getCount={(e) => AllProductsColor.filter((f) => f.label === e.label).length}
					maxDisplay={5}
					showToggle={true}
					expanded={colorul === 'max-h-max'}
					onToggleExpand={() => setcolorul(colorul === 'max-h-max' ? 'max-h-80' : 'max-h-max')}
				/>

				{onSale.length > 0 && (
					<FilterGroup
						title="On Sale"
						name="onSale"
						items={["true"]}
						selectedValues={new URLSearchParams(window.location.search).getAll("onSale")}
						onChange={onSaleFun}
						getLabel={() => "On Sale"}
						getCount={() => onSale.length}
				/>
				)}
				<button
					className='bg-black hover:rounded-md ease-ease-out-expo duration-200 hover:scale-105 transition-all hover:bg-gray-800 text-white text-sm my-auto py-2 font-bold mx-auto text-center flex justify-center items-end min-w-[80%]'
					onClick={clearAllFilters}
				>
					Clear All Filter
				</button>
            </div>
        </div>
    );
};

const CustomSlider = styled(Slider)({
    '& .MuiSlider-thumb': {
        backgroundColor: '#333333', // Dark gray thumb color
        border: '2px solid #212121', // Darker gray border for the thumb
        '&:hover': {
            backgroundColor: '#555555', // Slightly lighter gray on hover
        },
    },
    '& .MuiSlider-rail': {
        backgroundColor: '#E0E0E0', // Light gray rail color
    },
    '& .MuiSlider-track': {
        backgroundColor: '#212121', // Dark gray track color
    },
    '& .MuiSlider-valueLabel': {
        backgroundColor: '#212121', // Dark gray background for the value label
        color: 'white', // White text for the value label
    },
});

const PriceFilter = ({ result, spARRAY, sparraynew, dispatchFetchAllProduct ,sp}) => {
    const[currentMinPrice,setCurrentMinPrice] = useState(0);
    const[currentMaxPrice,setCurrentMaxPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(Math.min(...result[0]));
    const [maxPrice, setMaxPrice] = useState(Math.max(...result[1]));
    const [price, setPrice] = useState([Math.floor(Math.min(...sp)), Math.floor(Math.max(...sp))])
    const priceHandler = (event, newPrice)=>{
        
        setPrice(newPrice)
        setCurrentMinPrice(newPrice[0]);
        setCurrentMaxPrice(newPrice[1]);
    }
    useEffect(() => {
        // Get the price parameters from the URL
        const url = new URL(window.location.href);
        const urlMinPrice = url.searchParams.get('sellingPrice[$gte]');
        const urlMaxPrice = url.searchParams.get('sellingPrice[$lte]');
        
        if (urlMinPrice && urlMaxPrice) {
            setMinPrice(Number(spARRAY[0]));
            setMaxPrice(Number(spARRAY[spARRAY.length - 1]));
            setPrice([Number(urlMinPrice), Number(urlMaxPrice)]);
        }
    }, [spARRAY]); // Run this whenever the 'result' changes
  
    const handlePriceChange = (e) => {
        // setMaxPrice(newMaxPrice);
    
        // Get the current URL
		const url = new URL(window.location.href);
		
		// Check if 'sellingPrice[$gte]' and 'sellingPrice[$lte]' already exist in the URL
		const existingMinPrice = url.searchParams.get('sellingPrice[$gte]');
		const existingMaxPrice = url.searchParams.get('sellingPrice[$lte]');

		// If both are already present, replace their values; otherwise, add them
		if (existingMinPrice && existingMaxPrice) {
			// If they exist, update the values
			url.searchParams.set('sellingPrice[$gte]', currentMinPrice);
			url.searchParams.set('sellingPrice[$lte]', currentMaxPrice);
		} else {
			// If they don't exist, create them
			url.searchParams.set('sellingPrice[$gte]', currentMinPrice);
			url.searchParams.set('sellingPrice[$lte]', currentMaxPrice);
		}

		// Replace the current URL in the browser with the updated one
		window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
  
    const handleMinPriceChange = (e) => {
        // const newMinPrice = Math.max(e.target.value, minRange);
        // setMinPrice(newMinPrice);
    
        const url = new URL(window.location.href);
        url.searchParams.set('sellingPrice[$gte]', minPrice);
        url.searchParams.set('sellingPrice[$lte]', maxPrice);
        window.history.replaceState(null, "", url.toString());
    
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };
    return (
      <div className="border-b-[1px] font-kumbsan border-slate-900 px-4 py-2 relative">
        <h1 className=" text-base font-semibold mb-2">PRICE</h1>
        <CustomSlider
            value={price}
            onChange={priceHandler}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={Math.floor(minPrice)}
            max={Math.floor(maxPrice)}
            onChangeCommitted={()=>{
                handlePriceChange();
            }}
        />
  
        <div className=" text-xs font-normal text-slate-400 justify-center items-center ">
            Showing products between Rs. {Math.floor(minPrice)} and Rs. {Math.floor(maxPrice)}.
            <br />
            <span>({sparraynew()})</span>
        </div>
      </div>
    );
};



const FilterGroup = ({
    title,
    items,
    type = "checkbox", // 'checkbox' | 'radio' | 'color'
	specialType,
    name,
    selectedValues = [],
    onChange,
    getValue = (item) => item,
    getLabel = (item) => item,
    getCount = (item) => 0,
    maxDisplay = Infinity,
    showToggle = false,
    expanded = true,
    onToggleExpand
}) => {
    const displayItems = expanded ? items : items.slice(0, maxDisplay);

    return (
        <ul className='pl-1 border-b-[1px] border-slate-200 py-4'>
            <h1 className='text-base font-semibold mb-2'>{title}</h1>
            {displayItems.map((item, i) => {
                const value = getValue(item);
                const label = getLabel(item);
                const isChecked = selectedValues.includes(value);

                return (
                    <div key={i} className="flex items-center mb-2">
                        <input
                            type={type}
                            name={name}
                            id={`${name}_${value}`}
                            className='accent-gray-500 cursor-pointer w-4 h-4 rounded-md'
                            value={value}
                            checked={isChecked}
                            onChange={() => onChange(value)}
                        />
                        {specialType === "color" ? (
                            <>
                                <div className='w-7 h-7 border border-slate-400 rounded-lg mx-2' style={{ backgroundColor: value }} />
                                <label htmlFor={`${name}_${value}`} className="text-sm uppercase space-x-1">
                                    <span>{label}</span>
                                    <span className='text-xs font-normal text-slate-400'>({getCount(item)})</span>
                                </label>
                            </>
                        ) : (
                            <label htmlFor={`${name}_${value}`} className='text-sm ml-2 space-x-1 uppercase'>
                                <span>{label}</span>
                                <span className='text-xs font-normal text-slate-400'>({getCount(item)})</span>
                            </label>
                        )}
                    </div>
                );
            })}

            {showToggle && items.length > maxDisplay && (
                <div className='flex justify-center mt-3'>
                    <button
                        onClick={onToggleExpand}
                        className="text-gray-800 text-sm font-medium hover:underline flex items-center space-x-1"
                    >
                        <span>{expanded ? 'Less' : 'More'} {title}</span>
                    </button>
                </div>
            )}
        </ul>
    );
};


  

export default FilterView;
