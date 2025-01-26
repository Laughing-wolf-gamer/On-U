import React, { Fragment, useEffect, useState } from 'react';
import { capitalizeFirstLetterOfEachWord } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOptions } from '../../action/productaction';

const FilterView = ({ product, dispatchFetchAllProduct }) => {
    const{options} = useSelector(state => state.AllOptions);
    const dispatch = useDispatch();
    const [colorul, setcolorul] = useState('max-h-72');
    const [colorulbtn, setcolorulbtn] = useState('block');
  
    let category = [];
    let subcategory = [];
    let size = []
    let gender = [];
    let color = [];
    let specialCategory = [];
    let spARRAY = [];
    const n = 3
    const result = [[], [], []] //we create it, then we'll fill it    
    // Generate category, gender, color, and price arrays
    const categoriesarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => category.push(p.category));
        }
    };
    const specialCategoryArray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p.specialCategory !== "none" && p.specialCategory !== undefined){
                    specialCategory.push(p.specialCategory)
                }
            });
        }
    };
    const subcategoryarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => subcategory.push(p.subCategory));
        }
    };


    const genderarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => gender.push(p.gender));
        }
    };
    function sizearray() {
        if (product && product.length > 0) {
            product.forEach(p => {
                if(p){
                    p.size.forEach(s => {
                        if(!size.includes(s.label)){
                            size.push(s.label);
                        }
                    })
                }
            });
        }
      }

    const colorarray = () => {
        if (product && product.length > 0) {
            product.forEach(p => {
                p.AllColors.forEach(c => {
                    const alreadyExists = color.find((col) => col.label === c.label);
                    if(!alreadyExists){
                        color.push(c);
                    }
                });
            });
        }
    };

    const sparray = () => {
        product.forEach(p => {
            spARRAY.push(p.price);
        });
        // console.log("SubCategory: ", subcategory);
    };
    useEffect(()=>{
        categoriesarray();
        subcategoryarray();
        genderarray();
        colorarray();
        sparray();
        sizearray();
        specialCategoryArray();
    },[
        product
    ])
    categoriesarray();
    subcategoryarray();
    genderarray();
    colorarray();
    sparray();
    sizearray();
    specialCategoryArray();
    
    // Remove duplicates and sort price array
    let Categorynewarray = [...new Set(category)];
    let gendernewarray = [...new Set(gender)];
    let colornewarray = [...new Set(color)];
    let subcategorynewarray = [...new Set(subcategory)];
    let specialCategorynewarray = [...new Set(specialCategory)];
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

    const colorfun = (e) => {
        let url = new URL(window.location.href);

        // Get the current 'subcategory' array from the URL (if any)
        let selectedSubcategories = url.searchParams.getAll('color'); // This will return an array
    
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
        url.searchParams.delete('color');
        selectedSubcategories.forEach(sub => {
            url.searchParams.append('color', sub);
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
        /* let url = new URL(window.location.href);
        url.searchParams.set('gender', e);
        window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        } */
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
    };

    // Check if any filters are selected from URL and update UI accordingly
    const check = () => {
        const params = new URLSearchParams(window.location.search);
        console.log("Params: ",params);
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
    console.log("All options: ",specialCategory);
    

    return (
        <Fragment>
            <div>
                {/* Gender Filter */}
                <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
                    <h1 className='font1 text-base font-normal mb-2'>GENDER</h1>
                    {gendernewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('gender'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i} onClick={(event) => {
                                event.preventDefault();
                                genderfun(e); // This will update the URL with the selected gender
                            }}>
                                <input
                                    type="checkbox"
                                    name="gender"
                                    value={e}
                                    id={`cat_${e}`}
                                    className='mb-2 accent-gray-500'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {}} // We can add the change handler if needed, or leave empty
                                />
                                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                                    {e?.length > 20 ? `${capitalizeFirstLetterOfEachWord(e.slice(0,5))}` :capitalizeFirstLetterOfEachWord(e)} 
                                    <span className='text-xs font-sans font-normal text-slate-400'> 
                                        ({gender.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul>
                <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
                    <h1 className='font1 text-base font-normal mb-2'>SPECIAL CATEGORY</h1>
                    {specialCategorynewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('specialCategory'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i} onClick={(event) => {
                                event.preventDefault();
                                specialCategoryFun(e); // This will update the URL with the selected gender
                            }}>
                                <input
                                    type="checkbox"
                                    name="specialCategory"
                                    value={e}
                                    id={`cat_${e}`}
                                    className='mb-2 accent-gray-500'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {}} // We can add the change handler if needed, or leave empty
                                />
                                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                                    {e?.length > 20 ? `${capitalizeFirstLetterOfEachWord(e.slice(0,5))}` :capitalizeFirstLetterOfEachWord(e)} 
                                    <span className='text-xs font-sans font-normal text-slate-400'> 
                                        ({specialCategorynewarray.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul>

                {/* Categories Filter */}
                <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
                    <h1 className='font1 text-base font-semibold mb-2'>CATEGORIES</h1>
                    {Categorynewarray.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('category'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i} onClick={(event) => {
                                event.preventDefault();
                                categoryfun(e); // This will update the URL with the selected category
                            }}>
                                <input
                                    type="checkbox"
                                    name="categories"
                                    value={e}
                                    id={`cat_${e}`}
                                    className='mb-2 accent-gray-500'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {}} // We can add the change handler if needed, or leave empty
                                />
                                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                                    {e?.length > 20 ? `${capitalizeFirstLetterOfEachWord(e.slice(0,5))}` :capitalizeFirstLetterOfEachWord(e)} 
                                    <span className='text-xs font-serif font-normal text-slate-400'> 
                                        ({category.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul>
                {/* Categories Filter */}
                <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
                    <h1 className='font1 text-base font-semibold mb-2'>SIZE</h1>
                    {size.map((e, i) => {
                        // Check if the current category 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedCategories = params.getAll('size'); // Get all categories from URL

                        const isChecked = selectedCategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <div key={i} onClick={(event) => {
                                event.preventDefault();
                                sizefun(e); // This will update the URL with the selected category
                            }}>
                                <input
                                    type="checkbox"
                                    name="categories"
                                    value={e}
                                    id={`cat_${e}`}
                                    className='mb-2 accent-gray-500'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {}} // We can add the change handler if needed, or leave empty
                                />
                                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                                    {e?.length > 20 ? `${capitalizeFirstLetterOfEachWord(e.slice(0,5))}` :capitalizeFirstLetterOfEachWord(e)} 
                                    <span className='text-xs font-serif font-normal text-slate-400'> 
                                        ({size.filter((f) => f === e).length})
                                    </span>
                                </label>
                            </div>
                        );
                    })}
                </ul>
                {/* Subcategories Filter */}
                <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
                    <h1 className='font1 text-base font-semibold mb-2'>SUBCATEGORIES</h1>
                    {subcategorynewarray && subcategorynewarray.length > 0 && subcategorynewarray.map((e, i) => {
                        // Check if the current subcategory 'e' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedSubcategories = params.getAll('subcategory'); // Get all subcategories from URL

                        const isChecked = selectedSubcategories.includes(e); // Check if current 'e' is selected in the URL

                        return (
                            <li key={i} onClick={(event) => {
                                event.preventDefault();
                                subcategoryfun(e); // This will update the URL with the selected subcategory
                            }}>
                                <input
                                    type="checkbox"
                                    name="subcategories"
                                    value={e}
                                    id={`id_${e}`}
                                    className='mb-2 accent-gray-500'
                                    checked={isChecked} // Set checkbox checked if it's selected in the URL
                                    onChange={() => {}} // We can add the change handler if needed, or leave empty
                                />
                                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                                    {e?.length > 20 ? `${capitalizeFirstLetterOfEachWord(e.slice(0,20))}...` :capitalizeFirstLetterOfEachWord(e)} <span className='text-xs font-serif font-normal text-slate-400'> ({subcategory.filter((f) => f === e).length})</span>
                                </label>
                            </li>
                        );
                    })}
                </ul>


                {/* Color Filter */}
                <ul className={`pl-8 border-b-[1px] border-slate-200 py-4 ${colorul} overflow-hidden relative`}>
                    <h1 className='font1 text-base font-semibold mb-2'>COLOR</h1>
                    {colornewarray.slice(0, colorul === 'max-h-max' ? colornewarray.length : 5).map((e, i) => {
                        // Check if the current color 'e.label' exists in the URL parameters
                        const params = new URLSearchParams(window.location.search);
                        const selectedColors = params.getAll('color'); // Get all color values from URL

                        const isChecked = selectedColors.includes(e.label); // Check if current color is selected

                        return (
                            <li key={i} className='items-center justify-start flex flex-row space-x-7 p-2'>
                                <input
                                    type="checkbox"
                                    name="color"
                                    value={e.label}
                                    id={`id_${i}`}
                                    className='mb-2 accent-gray-500'
                                    checked={isChecked} // Set checkbox checked if color is selected in the URL
                                    onClick={(event) => {
                                        event.preventDefault();
                                        colorfun(e.label); // This will update the URL with the selected color
                                    }}
                                />
                                <div style={{ backgroundColor: e.label }} className='w-10 h-5 border border-slate-400'></div>
                            </li>
                        );
                    })}
                    
                    {/* Show "+ More" button if the number of colors exceeds 5 */}
                    {colornewarray.length > 5 && colorul !== 'max-h-max' && (
                        <button 
                            className={`absolute bottom-1 right-2 font1 text-gray-600 ${colorulbtn}`} 
                            onClick={() => {
                                setcolorul('max-h-max');
                                setcolorulbtn('hidden');
                            }}>
                            + More
                        </button>
                    )}
                </ul>
                <PriceFilter result={result} spARRAY={spARRAY} sparraynew={sparraynew} dispatchFetchAllProduct={dispatchFetchAllProduct}/>
                <button className='bg-slate-900 text-white text-sm p-2 h-10 pb-3 text-center mx-auto mt-5 justify-center items-center flex w-[50%]' onClick={clearAllFilters}>
                    <span className='w-full h-full text-center font-bold'>Clear</span>
                </button>
            </div>
        </Fragment>
    );
};

const PriceFilter = ({ result, spARRAY, sparraynew ,dispatchFetchAllProduct}) => {
    const [selectedPriceRange, setSelectedPriceRange] = useState({
      price1: false,
      price2: false,
      price3: false,
    });
  
    useEffect(() => {
      // Get the price parameters from the URL
      const url = new URL(window.location.href);
      const maxPrice = url.searchParams.get('sellingPrice[$lte]');
      
      // Check which price range matches the URL's 'sellingPrice[$lte]'
      setSelectedPriceRange({
        price1: maxPrice && maxPrice >= Math.min(...result[0]) && maxPrice <= Math.max(...result[0]),
        price2: maxPrice && maxPrice >= Math.min(...result[1]) && maxPrice <= Math.max(...result[1]),
        price3: maxPrice && maxPrice >= Math.min(...result[2]) && maxPrice <= Math.max(...result[2]),
      });
    }, [result]); // Run this whenever the 'result' changes (which is likely to happen when data is fetched or updated)
  
    const price1fun = (maxPrice) => {
      // Set the URL search parameter
      const url = new URL(window.location.href);
      url.searchParams.set('sellingPrice[$lte]', maxPrice);
      window.history.replaceState(null, "", url.toString());
  
      if (dispatchFetchAllProduct) {
        dispatchFetchAllProduct();
      }
    };
  
    const price2fun = (minPrice, maxPrice) => {
      const url = new URL(window.location.href);
      url.searchParams.set('sellingPrice[$lte]', maxPrice);
      window.history.replaceState(null, "", url.toString());
  
      if (dispatchFetchAllProduct) {
        dispatchFetchAllProduct();
      }
    };
  
    const price3fun = (minPrice) => {
      const url = new URL(window.location.href);
      url.searchParams.set('sellingPrice[$lte]', minPrice);
      window.history.replaceState(null, "", url.toString());
  
      if (dispatchFetchAllProduct) {
        dispatchFetchAllProduct();
      }
    };
  
    return (
        <ul className={`pl-8 border-b-[1px] border-slate-200 py-4 overflow-hidden relative`}>
            <h1 className="font1 text-base font-semibold mb-2">PRICE</h1>
    
            <li className="items-center">
            <input
                type="checkbox"
                name="color"
                value={`price1`}
                className="mb-2 accent-pink-500"
                onClick={() => price1fun(Math.max(...result[0]))}
                checked={selectedPriceRange.price1}
                id={`id${Math.max(...result[0]) + 1}`}
            />
            <label className="font1 text-sm ml-2 mr-4 mb-2">
                Rs. {Math.floor(Math.min(...result[0]))} to Rs. {Math.floor(Math.max(...result[0]))}{' '}
                <span className="text-xs font-serif font-normal text-slate-400">
                ({spARRAY.filter((f) => f <= Math.max(...result[0])).length})
                </span>
            </label>
            </li>
    
            <li className="items-center">
            <input
                type="checkbox"
                name="color"
                value={`price2`}
                className="mb-2 accent-pink-500"
                onClick={() => price2fun(Math.min(...result[1]), Math.max(...result[1]))}
                checked={selectedPriceRange.price2}
                id={`id${Math.max(...result[1]) + 1}`}
            />
            <label className="font1 text-sm ml-2 mr-4 mb-2">
                Rs. {Math.floor(Math.min(...result[1]))} to Rs. {Math.floor(Math.max(...result[1]))}{' '}
                <span className="text-xs font-serif font-normal text-slate-400">({sparraynew()})</span>
            </label>
            </li>
    
            <li className="items-center">
            <input
                type="checkbox"
                name="color"
                value={`price3`}
                className="mb-2 accent-pink-500"
                onClick={() => price3fun(Math.min(...result[2]))}
                checked={selectedPriceRange.price3}
                id={`id${Math.min(...result[2]) + 1}`}
            />
            <label className="font1 text-sm ml-2 mr-4 mb-2">
                Rs. {Math.floor(Math.min(...result[2]))} to Rs. {Math.floor(Math.max(...result[2]))}{' '}
                <span className="text-xs font-serif font-normal text-slate-400">
                ({spARRAY.filter((f) => f >= Math.min(...result[2])).length})
                </span>
            </label>
            </li>
        </ul>
    );
};

export default FilterView;
