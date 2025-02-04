import React, { useEffect, useState } from 'react';
import Single_product from './Single_product';
import { useDispatch, useSelector } from 'react-redux';
import { Allproduct as getproduct, clearErrors } from '../../action/productaction';
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import './allproduct.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import MFilter from './MFilter';
import Footer from '../Footer/Footer';
import FilterView from './FilterView';
import { getwishlist } from '../../action/orderaction';
import ProductCardSkeleton from './ProductCardSkeleton';


const maxAmountPerPage = 20;
const Allproductpage = ({user}) => {
    const dispatch = useDispatch();
    const[isNoProductsFound,setIsNoProductsFound] = useState(false);
    // const [sortBy, setSortBy] = useState('newest');  // Default value
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const { product, pro, loading:productLoading, error, length } = useSelector(state => state.Allproducts);
    const [sortvalue, setSortValue] = useState('What`s New');
    const Redirect = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
        dispatch(getproduct(e));
    };

    const dispatchFetchAllProduct = () => {
        dispatch(getproduct(currentPage));
    };
    /* const pricefun = (e) => {
        let url = window.location.search;
        if (url.includes('?')) {
            if (url.includes('sortBy')) {
                let newurl = url.includes(`&low=1`) ? url.replace(`&low=1`, `&low=${e}`) : null;
                let newurl2 = url.includes(`&low=-1`) ? url.replace(`&low=-1`, `&low=${e}`) : null;
                let newurlsuccess = (newurl === null ? newurl2 : newurl);
                // Redirect(newurlsuccess);
                dispatch(getproduct());
            }
        } else {
            let newurl = window.location.search += `&low=${e}`;
            // Redirect(newurl);
            dispatch(getproduct());
        }
    }; */
    const handleSortChange = (newSortBy) => {
        // Set the new sortBy value in your component state
        // setSortBy(newSortBy);
      
        // Get the current URL
        const currentUrl = new URL(window.location.href);
      
        // Get the query parameters from the current URL
        const urlParams = new URLSearchParams(currentUrl.search);
      
        // Set or update the sortBy query parameter
        urlParams.set('sortBy', newSortBy);
      
        // Generate the new URL with the updated query parameters
        const newUrl = `${currentUrl.pathname}?${urlParams.toString()}`;
      
        // console.log('New URL:', newUrl);
      
        // Update the URL without refreshing the page
        window.history.pushState({}, '', newUrl);
        dispatchFetchAllProduct();
    };



    const [state, setstate] = useState(false);
    const [state1, setstate1] = useState(false);

    useEffect(() => {
        if (state1 === false) {
            dispatch(getproduct());
            setstate1(true);
        }

        if (error) {
            dispatch(clearErrors());
        }
        if (state === false) {
            if (productLoading === false) {
                if (window.scroll > 0) {
                    document.documentElement.scrollTo = 0;
                }
                setstate(true);
            }
        }
    }, [dispatch, error, state, productLoading, state1]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getwishlist())
    }, []);
    useEffect(()=>{
        if(pro){
            if(!productLoading && pro.length <= 0 ){
                setIsNoProductsFound(!productLoading && pro.length <= 0);
            }
        }
    },[pro])
    console.log("All product: ",product);
    return (
        <div className="w-screen h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-200 scrollbar-thumb-gray-600 pb-3 2xl:pr-10">
            <div className='w-full 2xl:w-[2000px] 2xl:justify-start 2xl:items-center'>
                <div className='text-black 2xl:ml-10 ml-7 font-semibold 2xl:px-10'>
                    <div className="hidden 2xl:block xl:block lg:block font2 text-sm py-2">
                        <span className=''>Home</span>
                        <span className='font-light capitalize'>{window.location.pathname}</span>
                    </div>
                </div>

                <div className='text-slate-900 2xl:ml-10 ml-7 font-semibold 2xl:px-10'>
                    <div className="hidden 2xl:block xl:block lg:block font2 pb-2">
                        <span className="font1 text-sm capitalize">NO OF ITEMS</span>
                        <span className="text-gray-700 font-light">- {productLoading === false ? pro?.length : '...'} items</span>
                    </div>
                </div>
                {/* <div className="hidden 2xl:ml-10 ml-7 2xl:grid xl:grid lg:grid grid-cols-12 font2 border-b-[1px] border-gray-700 py-2 items-center 2xl:px-10">
                    <div className="col-span-2 font-semibold text-base font1 text-slate-900">FILTERS</div>
                    <div className="col-span-3 relative cursor-pointer pb-4">
                        <div className='h-10 overflow-hidden hover:overscroll-none hover:h-max z-[5] border-[1px] border-gray-600 w-[260px] absolute top-[-22px] bg-white'>
                            <div className='text-sm w-max pl-4 pr-24 py-2 float-right relative items-center'>
                                Sort by: <span className='font1 font-semibold text-gray-800'>{sortvalue}</span>
                                <span className='absolute right-4 font-serif text-lg text-gray-600'>
                                    <IoIosArrowDown />
                                </span>
                            </div>

                            <div className='text-sm w-full pl-5 py-2 mt-12 hover:bg-gray-200' onClick={(e) => (e.stopPropagation(), handleSortChange("newest"), setSortValue('What`s New'))}>
                                <span className='font1 text-gray-800'>What`s New</span>
                            </div>
                            <div className='text-sm w-full pl-5 py-2 hover:bg-gray-200' onClick={(e) => (e.stopPropagation(), handleSortChange("Popularity"), setSortValue('Popularity'))}>
                                <span className='font1 text-gray-800'>Popularity</span>
                            </div>
                            <div className='text-sm w-full pl-5 py-2 hover:bg-gray-200' onClick={(e) => (e.stopPropagation(), handleSortChange("discount"), setSortValue('Better Discount'))}>
                                <span className='font1 text-gray-800'>Better Discount</span>
                            </div>
                            <div className='text-sm w-full pl-5 py-2 hover:bg-gray-200' onClick={(e) => (e.stopPropagation(), handleSortChange("high-to-low"), setSortValue('Price: High To Low'))}>
                                <span className='font1 text-gray-800'>Price: High To Low</span>
                            </div>
                            <div className='text-sm w-full pl-5 py-2 hover:bg-gray-200' onClick={(e) => (e.stopPropagation(), handleSortChange("low-to-high"), setSortValue('Price: Low To High'))}>
                                <span className='font1 text-gray-800'>Price: Low To High</span>
                            </div>
                        </div>
                    </div>
                </div> */}
                <FilterTitle sortvalue={sortvalue} handleSortChange={handleSortChange} setSortValue = {setSortValue} />

                <div className="w-full 2xl:grid xl:grid lg:grid 2xl:grid-cols-12 xl:grid-cols-12 lg:grid-cols-12 bg-white 2xl:px-10">
                    {/* Filter */}
                    <div className="hidden 2xl:col-span-2 xl:col-span-2 lg:col-span-2 2xl:block xl:block lg:block border-r-[1px] border-gray-700 h-max sticky top-0 bg-gray-50">
                        <div className='2xl:px-10 pb-4'>
                            {product && product.length > 0 && <FilterView product={product} dispatchFetchAllProduct={dispatchFetchAllProduct} />}
                        </div>
                    </div>

                    <div className="w-full 2xl:col-span-10 xl:col-span-10 lg:col-span-10 2xl:p-4 xl:p-4 lg:p-4 bg-gray-50 text-slate-900 2xl:ml-7 lg:ml-5">
                        {productLoading ? (
                            <div className='min-h-[100vw] flex flex-col justify-between items-start 2xl:px-3 sm:px-3 md:px-4 lg:px-2'>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8 2xl:gap-10 px-2 py-3 md:px-1 lg:px-1 sm:px-1 2xl:px-0">
                                    {Array(10).fill(0).map((_, index) => (
                                        <li key={`productId_Skeleton_${index}`} className="w-full">
                                            <ProductCardSkeleton/>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className='min-h-[200vw] flex flex-col justify-between items-start 2xl:px-3 sm:px-3 md:px-4 lg:px-2'>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8 2xl:gap-10 px-2 py-3 md:px-1 lg:px-1 sm:px-1 2xl:px-0">
                                    {pro && pro.length > 0 && pro.map((p, index) => (
                                        <li key={`productId_${p._id}_${index}`} className="w-full">
                                            <Single_product pro={p} user={user} wishlist={wishlist} />
                                        </li>
                                    ))}
                                </ul>



                                <div className="paginationBox font1 border-t-[0.5px] border-gray-700 py-4 relative flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                                    {/* Pagination Info */}
                                    <span className="text-sm text-gray-500 mb-2 sm:mb-0 sm:absolute sm:left-0 sm:text-base">
                                        Page {currentPage} of {Math.ceil(length / maxAmountPerPage)}
                                    </span>

                                    {/* Previous Button */}
                                    {currentPage === 1 ? "" : (
                                        <button
                                            className="mb-2 sm:mb-0 sm:mr-5 text-lg flex items-center border-[1px] border-gray-500 py-1 px-5 rounded-[4px] hover:border-black"
                                            onClick={() => (setCurrentPage(currentPage - 1), setCurrentPageNo(currentPage - 1))}
                                        >
                                            <IoIosArrowBack /><h1>Previous</h1>
                                        </button>
                                    )}

                                    {/* Pagination Component */}
                                    <Pagination
                                        activePage={currentPage}
                                        itemsCountPerPage={maxAmountPerPage}
                                        totalItemsCount={length}
                                        onChange={setCurrentPageNo}
                                        nextPageText={false}
                                        prevPageText={false}
                                        firstPageText={false}
                                        lastPageText={false}
                                        itemClassFirst="hidden"
                                        itemClassPrev="hidden"
                                        itemClassNext="hidden"
                                        itemClassLast="hidden"
                                        itemClass="page-item"
                                        linkClass="page-link"
                                        activeClass="pageItemActive"
                                        activeLinkClass="pageLinkActive"
                                    />

                                    {/* Next Button */}
                                    {currentPage === Math.ceil(length / maxAmountPerPage) ? '' : (
                                        <button
                                            className="mb-2 sm:mb-0 sm:ml-5 text-lg flex items-center border-[1px] border-gray-500 py-1 px-5 rounded-[4px] hover:border-black"
                                            onClick={() => (setCurrentPage(currentPage + 1), setCurrentPageNo(currentPage + 1))}
                                        >
                                            <h1>Next</h1> <IoIosArrowForward />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {
                    pro && <NoProductsFoundOverlay isOpen={isNoProductsFound}/>
                }

            </div>
            {(window.screen.width < 1024 && product) && <MFilter product={product} handleSortChange={handleSortChange} />}
            <Footer />
        </div>
    );
};
const FilterTitle = ({ sortvalue, handleSortChange, setSortValue }) => {
    return (
        <div className="hidden 2xl:ml-10 ml-7 2xl:grid xl:grid lg:grid grid-cols-12 font2 border-b-[1px] border-gray-700 py-4 items-center 2xl:px-10">
            {/* Filters Title */}
            <div className="col-span-2 font-semibold text-base font1 text-slate-900">FILTERS</div>

            {/* Sort Dropdown */}
            <div className="col-span-3 relative group cursor-pointer">
                <div className="h-12 w-[260px] border-[1px] border-gray-600 rounded-md bg-white flex items-center px-4 justify-between hover:shadow-md transition-all duration-300">
                    <span className="text-sm font-semibold text-gray-800">Sort by: <span className="text-gray-600">{sortvalue}</span></span>
                    <IoIosArrowDown className="text-gray-600 text-xl transition-transform group-hover:rotate-180" />
                </div>

                {/* Dropdown Content */}
                <div className="absolute left-0 w-full bg-white border-[1px] border-gray-600 rounded-md mt-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-2 transition-all duration-300 z-10">
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("newest"), setSortValue('What`s New'))}>
                        <span className="font1 text-gray-800">What`s New</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("Popularity"), setSortValue('Popularity'))}>
                        <span className="font1 text-gray-800">Popularity</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("discount"), setSortValue('Better Discount'))}>
                        <span className="font1 text-gray-800">Better Discount</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("high-to-low"), setSortValue('Price: High To Low'))}>
                        <span className="font1 text-gray-800">Price: High To Low</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("low-to-high"), setSortValue('Price: Low To High'))}>
                        <span className="font1 text-gray-800">Price: Low To High</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NoProductsFoundOverlay = ({ isOpen }) => {
    if (!isOpen) return null;  // Don't render anything if the overlay is not open.
  
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-4 transform transition-all duration-300 scale-95 hover:scale-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    No Products Found
                </h2>
                <p className="text-lg text-gray-500 mb-6 text-center">
                    We couldn't find any products matching your filters. Try adjusting them or clear all filters to see everything.
                </p>
                
                <div className="flex justify-center space-x-6">
                    <button
                        onClick={() => window.location.href = '/products'}
                        className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-300 text-lg font-medium"
                    >
                        View All Products
                    </button>
                </div>
    
                {/* Close Button */}
                <button
                    onClick={() => window.location.href = '/products'}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-300"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};


export default Allproductpage;
