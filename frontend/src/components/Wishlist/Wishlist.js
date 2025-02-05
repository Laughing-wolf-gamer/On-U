import React, { Fragment, useEffect, useState } from 'react';
import Single_product from '../Product/Single_product';
import { useDispatch, useSelector } from 'react-redux';
import { deletewish, getwishlist } from '../../action/orderaction';
import { MdClear } from 'react-icons/md';
import wish from '../images/wishlist-bag.png';
import { Link, useNavigate } from 'react-router-dom';
import { getuser, clearErrors } from '../../action/useraction';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import ProductCardSkeleton from '../Product/ProductCardSkeleton';
import { getRandomArrayOfProducts } from '../../action/productaction';

const Wishlist = () => {
    // const { sessionBagData,updateBagQuantity,removeBagSessionStorage,sessionRecentlyViewProducts } = useSessionStorage();
    const { sessionData,sessionBagData,updateBagQuantity,removeBagSessionStorage,sessionRecentlyViewProducts, setWishListProductInfo } = useSessionStorage();
    const [currentWishListItem, setCurrentWishListItem] = useState([]);
    const { wishlist, loading: loadingWishList } = useSelector(state => state.wishlist_data);
    const { isAuthentication, loading: userloading, error, user } = useSelector(state => state.user);
    const { randomProducts,loading:RandomProductLoading, error:errorRandomProductLoading } = useSelector(state => state.RandomProducts);

    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState(false);
    const [state1, setState1] = useState(false);

    const handleDelWish = async (e, productId, product) => {
        e.stopPropagation();
        if (isAuthentication && user) {
            await dispatch(deletewish({ deletingProductId: productId }));
            dispatch(getwishlist());
        } else {
            setWishListProductInfo(product, productId);
        }
    };

    useEffect(() => {
        if (state1 === false) {
            if (!user) {
                dispatch(getuser());
            }
            setState1(true);
        }

        if (error) {
            dispatch(clearErrors());
        }

        if (state === false) {
            if (userloading === false) {
                if (isAuthentication === false) {
                    setState(true);
                } else {
                    setState(true);
                }
            }
        }

        dispatch(getwishlist());
        dispatch(getRandomArrayOfProducts());
    }, [dispatch, error, userloading, isAuthentication, user]);

    useEffect(() => {
        if (isAuthentication) {
            setCurrentWishListItem(wishlist?.orderItems || []);
        } else {
            setCurrentWishListItem(sessionData);
        }
    }, [dispatch, sessionData, user, wishlist]);

    return (
        <div className="w-screen h-screen overflow-y-auto justify-start scrollbar overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
            {loadingWishList ? (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-6 md:gap-8 lg:gap-10 mt-6 md:px-5 lg:px-6 2xl:px-6">
                    {Array(20).fill().map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </ul>
            ) : (
                <div className='w-full max-w-screen-2xl justify-self-center'>
                    {currentWishListItem && currentWishListItem.length > 0 ? (
                        <div className="w-full sm:px-6 lg:px-10 mt-5">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 flex justify-start items-center space-x-4">
                                <span>My Wishlist</span>
                                <span className="text-sm sm:text-base font-medium text-slate-500">
                                    ({currentWishListItem.length} items)
                                </span>
                            </h1>
                        
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-6 md:gap-8 lg:gap-10 mt-6">
                                {currentWishListItem.map((pro) => (
                                    <li
                                        key={pro?.productId?._id || pro?.productId}
                                        className="w-full h-fit max-w-sm group relative"
                                    >
                                        <div className="shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl">
                                            <div
                                                className="w-full h-full"
                                                onClick={(e) => {
                                                    const productId = pro?.productId?._id || pro?.productId;
                                                    navigation(`/products/${productId}`);
                                                }}
                                            >
                                                <Single_product pro={pro?.productId} user={user} showWishList={false} />
                                            </div>
                                            
                                            {/* Remove button */}
                                            {<div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer group sm:block hidden">
                                                <MdClear className="text-base sm:text-lg" onClick={(e) => handleDelWish(e, pro?.productId?._id || pro?.productId, pro)} />
                                            </div>}
                                            <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer group sm:hidden block">
                                                <MdClear className="text-base sm:text-lg" onClick={(e) => handleDelWish(e, pro?.productId?._id || pro?.productId, pro)} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                      </div>
                      
                    ) : (
                        <div>
                            <div className="w-full h-screen flex justify-center items-center">
                                <div className="text-center">
                                    <h1 className="font1 font-semibold text-2xl text-slate-700">Your Wishlist is Empty</h1>
                                    <p className="mt-2 text-slate-400">Add items you like to your wishlist and review them later.</p>
                                    <img src={wish} alt="Empty Wishlist" className="mt-8 w-32 mx-auto" />
                                    <Link to="/products">
                                        <button className="mt-6 py-3 px-12 bg-gray-900 text-white rounded font-medium hover:bg-gray-700 transition duration-200">
                                            Continue Shopping
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {sessionRecentlyViewProducts && sessionRecentlyViewProducts.length > 0 && (
                <div className='w-full 2xl:px-12 justify-center items-center flex flex-col'>
                    <h1 className='font1 flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>RECENTLY VIEWED</h1>
                    <div className='w-full flex justify-start items-start 2xl:px-10'>
                        <ul className='grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 p-4 gap-6 2xl:p-6 mx-auto'>
                            {
                                sessionRecentlyViewProducts.slice(0, 20).map((pro) => (
                                    <Single_product pro={pro} user={user} key={pro._id} />
                                ))
                            }
                        </ul>
                    </div>
                </div>
            )}
            {randomProducts && randomProducts.length > 0 && (
                <div className='w-full 2xl:px-12 justify-center items-center flex flex-col'>
                    <h1 className='font1 flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>DISCOVER MORE</h1>
                    <div className='w-full flex justify-start items-start 2xl:px-10'>
                        <ul className='grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 p-4 gap-6 2xl:p-6 mx-auto'>
                            {
                                RandomProductLoading ? <ProductCardSkeleton/>:<Fragment>
                                    {
                                        randomProducts.map((pro) => (
                                            <Single_product pro={pro} user={user} key={pro._id} />
                                        ))
                                    }
                                </Fragment>
                            }
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
