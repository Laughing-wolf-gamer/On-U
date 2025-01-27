import React, { useEffect, useState } from 'react';
import Single_product from './Single_product';
import { useDispatch, useSelector } from 'react-redux';
import { Allproduct as getproduct, clearErrors } from '../../action/productaction';
import { IoIosArrowDown } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
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
    const [sortBy, setSortBy] = useState('averageReview');  // Default value
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
        setSortBy(newSortBy);
      
        // Get the current URL
        const currentUrl = new URL(window.location.href);
      
        // Get the query parameters from the current URL
        const urlParams = new URLSearchParams(currentUrl.search);
      
        // Set or update the sortBy query parameter
        urlParams.set('sortBy', newSortBy);
      
        // Generate the new URL with the updated query parameters
        const newUrl = `${currentUrl.pathname}?${urlParams.toString()}`;
      
        console.log('New URL:', newUrl);
      
        // Update the URL without refreshing the page
        window.history.pushState({}, '', newUrl);
        dispatchFetchAllProduct();
    };


    /* const datefun = (e) => {
        let url = window.location.search;
        if (url.includes('?')) {
            if (url.includes('date')) {
                let newurl = url.includes(`&date=1`) ? url.replace(`&date=1`, `&date=${e}`) : null;
                let newurl2 = url.includes(`&date=-1`) ? url.replace(`&date=-1`, `&date=${e}`) : null;
                let newurlsuccess = (newurl === null ? newurl2 : newurl);
                Redirect(newurlsuccess);
                dispatch(getproduct());
            }
        }
    }; */

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

    return (
        <div className="w-screen h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-200 scrollbar-thumb-gray-600 pb-3">
            <div className="hidden 2xl:block xl:block lg:block font2 text-sm px-8 py-2 bg-gray-300 text-slate-900">
                <span className='font-light'>Home</span>
                <span className='font-light capitalize'>{window.location.pathname}</span>
            </div>
            <div className="hidden 2xl:block xl:block lg:block font2 px-8 pb-2 bg-neutral-100 text-slate-900">
                <span className="font1 text-sm capitalize">NO OF ITEMS</span>
                <span className="text-gray-700 font-light">- {productLoading === false ? pro?.length : '...'} items</span>
            </div>

            {/* Filter__title div */}
            <div className="hidden 2xl:grid xl:grid lg:grid grid-cols-12 font2 px-8 border-b-[1px] border-gray-700 py-2 items-center bg-slate-100">
                <div className="col-span-2 font-semibold text-base font1 text-slate-900">FILTERS</div>
                <div className="col-span-7 text-gray-500 text-xs">SIZE</div>
                <div className="col-span-3 relative cursor-pointer pb-4">
                    <div className='h-10 overflow-hidden hover:overscroll-none hover:h-max z-[5] border-[1px] border-gray-600 w-[260px] absolute top-[-22px] bg-white'>
                        <div className=' text-sm w-max pl-4 pr-24 py-2 float-right relative items-center'>
                            Sort by: <span className='font1 font-semibold text-gray-800'>{sortvalue}</span>
                            <span className='absolute right-4 font-serif text-lg text-gray-600'>
                                <IoIosArrowDown />
                            </span>
                        </div>

                        <div className='text-sm w-full pl-5 py-2 mt-12 hover:bg-gray-200' onClick={(e) => (e.stopPropagation(), handleSortChange("newItems"), setSortValue('What`s New'))}>
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
            </div>

            <div className="w-full 2xl:grid xl:grid lg:grid 2xl:grid-cols-12 xl:grid-cols-12 lg:grid-cols-12 pb-5 shadow-md shadow-black">
                {/* Filter */}
                <div className="hidden 2xl:col-span-2 xl:col-span-2 lg:col-span-2 2xl:block xl:block lg:block border-r-[1px] border-gray-700 h-max sticky top-0 bg-gray-200 text-slate-900">
                    {product && product.length > 0 && <FilterView product={product} dispatchFetchAllProduct={dispatchFetchAllProduct} />}
                </div>

                <div className="w-full 2xl:col-span-10 xl:col-span-10 lg:col-span-10 2xl:p-4 xl:p-4 lg:p-4 bg-gray-50 text-slate-900">
                    {productLoading ? (
                        <div className='min-h-[100vw] flex flex-col justify-between items-start'>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                                {Array(10).fill(0).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className='min-h-[100vw] flex flex-col justify-between items-start'>
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                                {pro && pro.length > 0 && pro.map((p) => (
                                    <div key={p._id} className="w-full min-h-[10vw] max-w-xs m-1">
                                        <Single_product pro={p} user={user} wishlist={wishlist} />
                                    </div>
                                ))}
                            </ul>

                            <div className="paginationBox font1 border-t-[1px] border-gray-700 py-4 relative flex flex-col sm:flex-row items-center justify-center sm:justify-between">
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
                pro && <NoProductsFoundOverlay isOpen={!productLoading && pro.length <= 0} onClose={() => { }} />
            }

            {(window.screen.width < 1024 && product) && <MFilter product={product} handleSortChange={handleSortChange} />}
            <Footer />
        </div>

    );
};

const NoProductsFoundOverlay = ({ isOpen, onClose }) => {
    if (!isOpen) return null;  // Don't render anything if the overlay is not open.
  
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                No Products Matched with Filters
            </h2>
            <p className="text-gray-600 mb-6 text-center">
                We couldn’t find any products matching your filters. Please try adjusting the filters or clear them to see all products.
            </p>
            
            <div className="flex justify-center space-x-4">
                <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                Try Different Filters
                </button>
    
                <button
                onClick={() => window.location.href = '/products'}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition duration-300"
                >
                View All Products
                </button>
            </div>
    
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
        </div>
    );
};

export default Allproductpage;
