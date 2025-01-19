import React, { Fragment, useEffect, useState } from 'react';
import Single_product from './Single_product';
import { useDispatch, useSelector } from 'react-redux';
import { Allproduct as getproduct, clearErrors } from '../../action/productaction';
import Loader from '../Loader/Loader';
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import './allproduct.css';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import MFilter from './MFilter';
import Footer from '../Footer/Footer';
import Filter from './Filter';
import FilterView from './FilterView';

const Allproductpage = ({user}) => {
    const dispatch = useDispatch();
    const { product, pro, loading, error, length } = useSelector(state => state.Allproducts);
    const [sortvalue, setSortValue] = useState('Recommended');
    const Redirect = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
        dispatch(getproduct(e));
    };

    const dispatchFetchAllProduct = () => {
        dispatch(getproduct(currentPage));
    };

    const pricefun = (e) => {
        let url = window.location.search;
        if (url.includes('?')) {
            if (url.includes('low')) {
                let newurl = url.includes(`&low=1`) ? url.replace(`&low=1`, `&low=${e}`) : null;
                let newurl2 = url.includes(`&low=-1`) ? url.replace(`&low=-1`, `&low=${e}`) : null;
                let newurlsuccess = (newurl === null ? newurl2 : newurl);
                Redirect(newurlsuccess);
                dispatch(getproduct());
            }
        } else {
            let newurl = window.location.search += `&low=${e}`;
            Redirect(newurl);
            dispatch(getproduct());
        }
    };

    const datefun = (e) => {
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
            if (loading === false) {
                if (window.scroll > 0) {
                    document.documentElement.scrollTo = 0;
                }
                setstate(true);
            }
        }
    }, [dispatch, error, state, loading, state1]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-screen h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            <div className="hidden 2xl:block xl:block lg:block font2 text-sm px-8 py-2 bg-slate-200 text-slate-900">
                <span className='font-light'>Home</span>
                <span className='font-light capitalize'>{window.location.pathname}</span>
            </div>
            <div className="hidden 2xl:block xl:block lg:block font2 px-8 pb-2 bg-gray-200 text-slate-900">
                <span className=" font1  text-sm capitalize">NO OF ITEMS</span>
                <span className="text-gray-700 font-light">- {loading === false ? pro?.length : '...'} items</span>
            </div>

            {/* Filter__title div */}
            <div className="hidden 2xl:grid xl:grid lg:grid grid-cols-12 font2 px-8 border-b-[1px] border-gray-700 py-2 items-center bg-slate-200">
                <div className="col-span-2 font-semibold text-base font1 text-slate-900">FILTERS</div>
                <div className="col-span-7 text-gray-400 text-xs">SIZE</div>
                <div className="col-span-3 relative cursor-pointer">
                    <div className='h-10 overflow-hidden hover:overscroll-none hover:h-max z-[5] border-[1px] border-gray-600 w-[260px] absolute top-[-22px] bg-white'>
                        <div className=' text-sm w-max pl-4 pr-24 py-2 float-right relative items-center'>
                            Sort by :<span className='font1 font-semibold text-gray-800'>{sortvalue}</span>
                            <span className='absolute right-4 font-serif text-lg text-gray-600'>
                                <IoIosArrowDown />
                            </span>
                        </div>

                        <div className='text-sm w-max pl-5 py-2 mt-12 hover:bg-gray-200' onClick={() => (datefun(1), setSortValue('What`s New'))}>
                            <span className='font1 text-gray-800'>What`s New</span>
                        </div>
                        <div className='text-sm w-max pl-5 py-2 hover:bg-gray-200' onClick={() => (setSortValue('Popularity'))}>
                            <span className='font1 text-gray-800'>Popularity</span>
                        </div>
                        <div className='text-sm w-max pl-5 py-2 hover:bg-gray-200' onClick={() => (pricefun(-1), setSortValue('Better Discount'))}>
                            <span className='font1 text-gray-800'>Better Discount</span>
                        </div>
                        <div className='text-sm w-max pl-5 py-2 hover:bg-gray-200' onClick={() => (pricefun(-1), setSortValue('Price: High To Low'))}>
                            <span className='font1 text-gray-800'>Price: High To Low</span>
                        </div>
                        <div className='text-sm w-max pl-5 py-2 hover:bg-gray-200' onClick={() => (pricefun(1), setSortValue('Price: Low To High'))}>
                            <span className='font1 text-gray-800'>Price: Low To High</span>
                        </div>
                        <div className='text-sm w-max pl-5 py-2 hover:bg-gray-200' onClick={() => (setSortValue('Customer Rating'))}>
                            <span className='font1 text-gray-800'>Customer Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full 2xl:grid xl:grid lg:grid 2xl:grid-cols-12 xl:grid-cols-12 lg:grid-cols-12 mb-10 bg-gray-900'>
                {/* Filter */}
                <div className="hidden 2xl:col-span-2 xl:col-span-2 lg:col-span-2 2xl:block xl:block lg:block border-r-[1px] border-gray-700 h-max sticky top-0 bg-slate-200 text-slate-900">
                    {loading === false && product && product.length > 0 && <FilterView product={product} dispatchFetchAllProduct={dispatchFetchAllProduct} />}
                </div>
                <div className="w-full 2xl:col-span-10 xl:col-span-10 lg:col-span-10 2xl:p-4 xl:p-4 lg:p-4 bg-slate-200 text-slate-900">
                    {loading === true ? (<Loader />) :
                        (loading === false &&
                            <Fragment>
                                <ul className='grid grid-cols-2 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 2xl:gap-10 xl:gap-10 lg:gap-10 '>
                                    {pro && pro?.map((p) => (<Single_product pro={p} user = {user} key={p._id} />))}
                                </ul>
                                {window.screen.width >= 1024 && length && length > 50 &&
                                    <div className='paginationBox font1 border-t-[1px] border-gray-700 py-4 hidden 2xl:block xl:block lg:block relative'>
                                        <span className='left-0 absolute text-sm text-gray-500'>Page {currentPage} of {Math.ceil(length / 50)}</span>
                                        {currentPage === 1 ? "" :
                                            <button className='mr-10 text-lg flex items-center border-[1px] border-gray-500 py-1 px-5 rounded-[4px] hover:border-black' onClick={() => (setCurrentPage(currentPage - 1), setCurrentPageNo(currentPage - 1))}>
                                                <IoIosArrowBack /><h1>Previous</h1>
                                            </button>
                                        }

                                        <Pagination
                                            activePage={currentPage}
                                            itemsCountPerPage={50}
                                            totalItemsCount={length}
                                            onChange={setCurrentPageNo}
                                            nextPageText={false}
                                            prevPageText={false}
                                            firstPageText={false}
                                            lastPageText={false}
                                            itemClassFirst='hidden'
                                            itemClassPrev='hidden'
                                            itemClassNext='hidden'
                                            itemClassLast='hidden'
                                            itemClass="page-item"
                                            linkClass="page-link"
                                            activeClass="pageItemActive"
                                            activeLinkClass="pageLinkActive"
                                        />
                                        {currentPage === Math.ceil(length / 50) ? '' :
                                            <button className='ml-10 text-lg flex items-center border-[1px] border-gray-500 py-1 px-5 rounded-[4px] hover:border-black' onClick={() => (setCurrentPage(currentPage + 1), setCurrentPageNo(currentPage + 1))}>
                                                <h1>Next</h1> <IoIosArrowForward />
                                            </button>
                                        }
                                    </div>
                                }
                            </Fragment>
                        )}
                </div>
            </div>
            {(window.screen.width < 1024 && product) && <MFilter product={product} />}
            <Footer />
        </div>
    );
};

export default Allproductpage;
