import React, { Fragment, useEffect, useState } from 'react';

const FilterView = ({ product, dispatchFetchAllProduct }) => {
    console.log("Fillter PRoducts array: ",product)
    const [colorul, setcolorul] = useState('max-h-72');
    const [colorulbtn, setcolorulbtn] = useState('block');
  
    let category = [];
    let gender = [];
    let color = [];
    let spARRAY = [];

    // Generate category, gender, color, and price arrays
    const categoriesarray = () => {
        if(product && product.length > 0){
            product.forEach(p => category.push(p.category));
        }
    };

    const genderarray = () => {
        if(product && product.length > 0){
            product.forEach(p => gender.push(p.gender));
        }
    };

  const colorarray = () => {
        // Assuming each product has a color field that contains an array of colors.
        if(product && product.length > 0){
            product.forEach(p => {
                p.size.forEach(s => {
                    if (s.colors) {
                        s.colors.forEach(c => color.push(c));
                    }
                })
            });
        }
        console.log("All Colors: ",color)
    };

    const sparray = () => {
        product.forEach(p => {
            spARRAY.push(p.salePrice || p.price);
        });
    };

    categoriesarray();
    genderarray();
    colorarray();
    sparray();

    // Remove duplicates and sort price array
    let Categorynewarray = [...new Set(category)];
    let gendernewarray = [...new Set(gender)];
    let colornewarray = [...new Set(color)];
    let sp = [...new Set(spARRAY.sort((a, b) => a - b))];

    // Update the URL based on the selected category
    const categoryfun = (e) => {
        let url = new URL(window.location.href);
        if (url.searchParams.has('category')) {
        url.searchParams.set('category', e);
        } else {
        url.searchParams.append('category', e);
        }
        window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    // Update the URL for color filter
    const colorfun = (e) => {
        let url = new URL(window.location.href);
        if (url.searchParams.has('color')) {
        if (url.searchParams.get('color') === e) {
            url.searchParams.delete('color');
        } else {
            url.searchParams.set('color', e);
        }
        } else {
        url.searchParams.append('color', e);
        }
        window.history.replaceState(null, "", url.toString());
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
        url.searchParams.set('gender', e);
        window.history.replaceState(null, "", url.toString());
        if (dispatchFetchAllProduct) {
            dispatchFetchAllProduct();
        }
    };

    // Check if any filters are selected from URL and update UI accordingly
    const check = () => {
        const params = new URLSearchParams(window.location.search);
        const selectedCategories = params.getAll('category');
        selectedCategories.forEach((cat) => {
        const checkbox = document.getElementById(`id${cat}`);
        if (checkbox) checkbox.checked = true;
        });
    };

    // Split the price array into chunks for filtering
    const n = 3;
    const result = [[], [], []];
    const wordsPerLine = Math.ceil(sp.length / 3);
    
    for (let line = 0; line < n; line++) {
        for (let i = 0; i < wordsPerLine; i++) {
        const value = sp[i + line * wordsPerLine];
        if (value) result[line].push(value);
        }
    }

    // Filter price array based on selected price range
    const sparraynew = () => {
        const filteredSp = spARRAY.filter((f) => f <= Math.max(...result[1]));
        return filteredSp.length;
    };

    // Run check on component mount to initialize UI with selected filters
    useEffect(() => {
        check();
    }, []);

    return (
        <Fragment>
        <div>
            {/* Gender Filter */}
            <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
            {gendernewarray.map((e, i) => (
                <li key={i} className='items-center'>
                <input
                    type="radio"
                    name="gender"
                    value={e}
                    className='mb-2 accent-pink-500'
                    id={`id${i}`}
                    onClick={() => genderfun(e)}
                />
                <label className='font1 text-sm font-semibold ml-2 mr-4 mb-2'>{e}</label>
                </li>
            ))}
            </ul>

            {/* Categories Filter */}
            <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
            <h1 className='font1 text-base font-semibold mb-2'>CATEGORIES</h1>
            {Categorynewarray.map((e, i) => (
                <li key={i} onClick={(event) => {
                event.preventDefault();
                categoryfun(e);
                }}>
                <input type="checkbox" name="categories" value={e} id={`id${e}`} className='mb-2 accent-pink-500' />
                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                    {e} <span className='text-xs font-serif font-normal text-slate-400'> ({category.filter((f) => f === e).length})</span>
                </label>
                </li>
            ))}
            </ul>

            {/* Color Filter */}
            <ul className={`pl-8 border-b-[1px] border-slate-200 py-4 ${colorul} overflow-hidden relative`}>
            <h1 className='font1 text-base font-semibold mb-2'>COLOR</h1>
            {colornewarray.map((e, i) => (
                <li key={i} className='items-center justify-start flex flex-row'>
                    <input
                        type="checkbox"
                        name="color"
                        value={e.label}
                        id={`id${e.id}`}
                        className='mb-2 accent-pink-500'
                        onClick={() => colorfun(e.label)}
                    />
                    <label className='font1 text-sm ml-2 mr-4 mb-2'>{e.label}</label>
                </li>
            ))}
            <button className={`absolute bottom-1 right-2 font1 text-[#ff3f6c] ${colorulbtn}`} onClick={() => {
                setcolorul('max-h-max');
                setcolorulbtn('hidden');
            }}> + more</button>
            </ul>

            {/* Price Filter */}
            <ul className='pl-8 border-b-[1px] border-slate-200 py-4'>
            <h1 className='font1 text-base font-semibold mb-2'>PRICE</h1>
            <li className='items-center'>
                <input
                type="checkbox"
                className='mb-2 accent-pink-500'
                onClick={() => price1fun(Math.max(...result[0]))}
                id={`id${Math.max(...result[0]) + 1}`}
                />
                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                Rs. {Math.floor(Math.min(...result[0]))} to Rs. {Math.floor(Math.max(...result[0]))}
                <span className='text-xs font-serif font-normal text-slate-400'>
                    ({spARRAY.filter((f) => f <= Math.max(...result[0])).length})
                </span>
                </label>
            </li>
            <li className='items-center'>
                <input
                type="checkbox"
                className='mb-2 accent-pink-500'
                onClick={() => price2fun(Math.min(...result[1]), Math.max(...result[1]))}
                id={`id${Math.max(...result[1]) + 1}`}
                />
                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                Rs. {Math.floor(Math.min(...result[1]))} to Rs. {Math.floor(Math.max(...result[1]))}
                <span className='text-xs font-serif font-normal text-slate-400'>
                    ({sparraynew()})
                </span>
                </label>
            </li>
            <li className='items-center'>
                <input
                type="checkbox"
                className='mb-2 accent-pink-500'
                onClick={() => price3fun(Math.min(...result[2]))}
                id={`id${Math.min(...result[2])}`}
                />
                <label className='font1 text-sm ml-2 mr-4 mb-2'>
                Rs. {Math.floor(Math.min(...result[2]))} +
                <span className='text-xs font-serif font-normal text-slate-400'>
                    ({sparraynew()})
                </span>
                </label>
            </li>
            </ul>
        </div>
        </Fragment>
    );
};

export default FilterView;
