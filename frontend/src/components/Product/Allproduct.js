import React, { useEffect, useRef, useState } from 'react';
import Single_product from './Single_product';
import { useDispatch, useSelector } from 'react-redux';
import { Allproduct as getproduct, clearErrors } from '../../action/productaction';
import { IoIosArrowDown, IoIosArrowDropright } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import './allproduct.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import MFilter from './MFilter';
import Footer from '../Footer/Footer';
import FilterView from './FilterView';
import { getwishlist } from '../../action/orderaction';
import ProductCardSkeleton from './ProductCardSkeleton';
import { ChevronRight } from 'lucide-react';
import BackToTopButton from '../Home/BackToTopButton';
import Loader from '../Loader/Loader';

const maxAmountPerPage = 20;
const Allproductpage = ({user}) => {
    const scrollableDivRef = useRef(null); // Create a ref to access the div element
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
        dispatch(getwishlist())
    }, [dispatch, error, state, productLoading, state1]);

    useEffect(() => {
        window.scrollTo(0, 0);
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
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-200 scrollbar-thumb-gray-600 2xl:pr-10">
            <div className='w-full max-w-screen-2xl justify-self-center'>
                <div className='text-black 2xl:ml-10 ml-7 font-semibold 2xl:px-10'>
                    <div className="hidden 2xl:block xl:block lg:block font2 text-sm py-2">
                        <span className=''>Home</span>
                        <span className='font-light capitalize'>{window.location.pathname}</span>
                    </div>
                </div>

                <div className='text-slate-900 2xl:ml-10 ml-7 font-semibold 2xl:px-10'>
                    <div className="hidden 2xl:block xl:block lg:block font2 pb-2">
                        <span className=" text-sm capitalize">NO OF ITEMS</span>
                        <span className="text-gray-700 font-light">- {productLoading === false ? pro?.length : '...'} items</span>
                    </div>
                </div>
                <FilterTitle sortvalue={sortvalue} handleSortChange={handleSortChange} setSortValue = {setSortValue} />

                <div className="w-full 2xl:grid xl:grid lg:grid 2xl:grid-cols-12 xl:grid-cols-12 lg:grid-cols-12 bg-white 2xl:px-10">
                    {/* Filter */}
                    <div className="hidden 2xl:col-span-2 xl:col-span-2 lg:col-span-2 2xl:block xl:block lg:block border-r-[1px] border-gray-700 border-opacity-25 h-max sticky top-0 bg-gray-50">
                        <div className='2xl:px-1 pb-4'>
                            {product && product.length > 0 && <FilterView product={product} dispatchFetchAllProduct={dispatchFetchAllProduct} />}
                        </div>
                    </div>

                    <div className="w-full 2xl:col-span-10 xl:col-span-10 lg:col-span-10 2xl:p-4 xl:p-4 lg:p-4 bg-gray-50 text-slate-900 2xl:ml-7 lg:ml-5">
                        {productLoading ? (
                            <Loader/>
                        ) : (
                            <div className='min-h-[200vw] flex mt-[45px] sm:mt-[45px] md:mt-0 lg:mt-0 xl:mt-0 2xl:mt-0 flex-col justify-between items-start 2xl:px-3 sm:px-3 md:px-4 lg:px-2'>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-2 sm:gap-5 md:gap-5 lg:gap-5 xl:gap-5 px-2 py-3 md:px-1 lg:px-1 sm:px-1 2xl:px-0">
                                    {pro && pro.length > 0 && pro.map((p, index) => (
                                        <li key={`productId_${p._id}_${index}`} className="w-full">
                                            <Single_product pro={p} user={user} wishlist={wishlist} />
                                        </li>
                                    ))}
                                </ul>



                                <div className="paginationBox  border-t-[0.5px] border-gray-700 border-opacity-25 py-4 relative flex flex-col sm:flex-row items-center justify-center sm:justify-between">
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
            {(window.screen.width < 1024 && product) && <MFilter scrollableDivRef = {scrollableDivRef} product={product} handleSortChange={handleSortChange} />}
            <Footer />
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
        </div>
    );
};
/*  <div className='min-h-[100vw] flex flex-col justify-between items-start 2xl:px-3 sm:px-3 md:px-4 lg:px-2'>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-7 sm:gap-5 md:gap-6 lg:gap-12 2xl:gap-14 px-2 py-3 md:px-1 lg:px-1 sm:px-1 2xl:px-0">
                                    {Array(10).fill(0).map((_, index) => (
                                        <li key={`productId_Skeleton_${index}`} className="w-full">
                                            <ProductCardSkeleton/>
                                        </li>
                                    ))}
                                </ul>
                            </div> */
const FilterTitle = ({ sortvalue, handleSortChange, setSortValue }) => {
    const [openView,setOpenView] = useState(false);
    return (
        <div className="hidden font-kumbsan 2xl:ml-10 ml-7 2xl:grid xl:grid lg:grid grid-cols-12 font2 border-b-[1px] border-gray-700 border-opacity-25 py-4 items-center 2xl:px-10">
            {/* Filters Title */}
            <div className="col-span-2 font-semibold text-base  text-slate-900">FILTERS</div>
    
            {/* Sort Dropdown */}
            <div className="col-span-3 relative group cursor-pointer" onMouseLeave={()=> setOpenView(false)}>
                <div onMouseEnter={()=> setOpenView(true)}  className="h-12 w-[260px] border-[1px] border-gray-600 rounded-md bg-white flex items-center px-4 justify-between hover:shadow-md transition-all duration-300">
                    <span className="text-sm font-semibold text-gray-800">Sort by: <span className="text-gray-600">{sortvalue}</span></span>
                    <ChevronRight
                        className={`text-gray-600 text-xl transition-all opacity-50 ${openView ? "rotate-90 opacity-100":""}`} />
                </div>
    
                {/* Dropdown Content */}
                <div onMouseLeave={()=> setOpenView(false)}  className={`absolute left-0 top-8 w-full bg-white border-[1px] border-gray-600 rounded-md mt-2 ${openView ? "opacity-100":"opacity-0 pointer-events-none"} transform group-hover:translate-y-2 transition-all duration-300 z-10`}>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("newest"), setSortValue('What`s New'))}>
                        <span className=" text-gray-800">What`s New</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("popularity"), setSortValue('Popularity'))}>
                        <span className=" text-gray-800">Popularity</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("discount"), setSortValue('Better Discount'))}>
                        <span className=" text-gray-800">Better Discount</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("price-high-to-low"), setSortValue('Price: High To Low'))}>
                        <span className=" text-gray-800">Price: High To Low</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("price-low-to-high"), setSortValue('Price: Low To High'))}>
                        <span className=" text-gray-800">Price: Low To High</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("rating-high-to-low"), setSortValue('Rating: High To Low'))}>
                        <span className=" text-gray-800">Rating: High To Low</span>
                    </div>
                    <div className="text-sm w-full px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={(e) => (e.stopPropagation(), handleSortChange("rating-low-to-high"), setSortValue('Rating: Low To High'))}>
                        <span className=" text-gray-800">Rating: Low To High</span>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

const NoProductsFoundOverlay = ({ isOpen }) => {
    if (!isOpen) return null;  // Don't render anything if the overlay is not open.
  
    return (
        <div className="fixed font-kumbsan inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
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
