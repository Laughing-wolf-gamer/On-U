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
import Footer from '../Footer/Footer';

const Wishlist = () => {
   	const { sessionData, sessionRecentlyViewProducts, setWishListProductInfo } = useSessionStorage();
	const [currentWishListItem, setCurrentWishListItem] = useState([]);
	const { wishlist, loading: loadingWishList } = useSelector(state => state.wishlist_data);
	const { isAuthentication, loading: userloading, error, user } = useSelector(state => state.user);
	const { randomProducts, loading: RandomProductLoading, error: errorRandomProductLoading } = useSelector(state => state.RandomProducts);

	const navigation = useNavigate();
	const dispatch = useDispatch();
	const [state, setState] = useState(false);
	const [state1, setState1] = useState(false);

	const handleDelWish = async (e, productId, product) => {
		e.stopPropagation();
		if (isAuthentication && user) {
			console.log("WishList: ", product);
			await dispatch(deletewish({ deletingProductId: productId || product._id }));
			dispatch(getwishlist()); // Call this once after deletion
		} else {
			setWishListProductInfo(product, productId);
		}
	};

	useEffect(() => {
		if (!state1) {
			// Fetch user data only once when the component mounts and user is not authenticated
			if (!user && !userloading) {
				dispatch(getuser());
			}
			setState1(true);
		}

		if (error) {
			dispatch(clearErrors());
		}

		if (!state && !userloading) {
			// Update state based on user authentication status
			setState(true);
		}
	}, [dispatch, error, userloading, isAuthentication, user, state, state1]);

	useEffect(() => {
		/* if (user) {
			// Fetch wishlist only once when the user is authenticated
			if (!wishlist?.orderItems?.length) {
				dispatch(getwishlist());
			}
		} */
		dispatch(getwishlist());
		// Fetch random products if not already loaded
		dispatch(getRandomArrayOfProducts());
	}, []);

	useEffect(() => {
		// Update the wishlist items based on user authentication status or session data
		if (isAuthentication) {
			setCurrentWishListItem(wishlist?.orderItems || []);
		} else {
			setCurrentWishListItem(sessionData);
		}
	}, [dispatch, sessionData, user, wishlist, isAuthentication]);



    return (
        <div className="w-screen font-kumbsan h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-200 scrollbar-thumb-gray-600 pb-3 2xl:pr-10">
            <div className="w-full justify-self-center max-w-screen-2xl justify-center items-center px-4">
                {loadingWishList ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-6 md:gap-8 lg:gap-10 mt-6 md:px-5 lg:px-6 2xl:px-6">
                        {Array(20).fill().map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </ul>
                ) : (
                    <Fragment>
                        {currentWishListItem && currentWishListItem.length > 0 ? (
                            <div className="w-full flex-col mt-5">
                                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 flex justify-start items-center space-x-4">
                                    <span>My Wishlist</span>
                                    <span className="text-sm sm:text-base font-medium text-slate-500">
                                        ({currentWishListItem.length} items)
                                    </span>
                                </h1>
                                <div className="w-full flex justify-start items-start">
                                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 md:gap-10 mt-5">
                                        {currentWishListItem.map((pro) => (
                                            <li
                                                key={pro?.productId?._id || pro?.productId}
                                                className="w-full h-full group relative"
                                            >
                                                <div className="shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl">
                                                    <div
                                                        className="w-full h-full flex-1"
                                                        onClick={(e) => {
                                                            const productId = pro?.productId?._id || pro?.productId;
                                                            navigation(`/products/${productId}`);
                                                        }}
                                                    >
														{pro && pro.productId && <Single_product pro={pro.productId} user={user} showWishList={false} />}
                                                        
                                                    </div>

                                                    {/* Remove button */}
                                                    <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer group sm:block hidden">
                                                        <MdClear className="text-base sm:text-lg" onClick={(e) => handleDelWish(e, pro?.productId?._id || pro?.productId, pro)} />
                                                    </div>
                                                    <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer group sm:hidden block">
                                                        <MdClear className="text-base sm:text-lg" onClick={(e) => handleDelWish(e, pro?.productId?._id || pro?.productId, pro)} />
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full h-screen items-center justify-center text-center px-6 py-12">
								<div className="w-full max-w-md p-10 rounded-xl">
									<img
									src={wish} // Replace with your actual image path
									alt="Empty Bag"
									className="mx-auto mb-8 w-24 h-24 sm:w-36 sm:h-36 object-contain hover:animate-bounce"
									/>
									<h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">No Wish List Products</h2>
									<p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed">It looks like you haven't added anything yet. Browse our collection!</p>
									<button
									onClick={() => navigation('/products')}
									className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all hover:scale-105 duration-300 text-base sm:text-lg shadow-md"
									>
									Continue Shopping
									</button>
								</div>
							</div>

                        )}
                    </Fragment>
                )}

                {sessionRecentlyViewProducts && sessionRecentlyViewProducts.length > 0 && (
                    <div className="w-full justify-center items-center flex flex-col mb-5">
                        <h1 className=" flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8">RECENTLY VIEWED</h1>
                        <div className="w-full flex justify-start items-start">
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 md:gap-10 mt-5">
                                {sessionRecentlyViewProducts.slice(0, 20).map((pro) => (
                                    <Single_product pro={pro} user={user} key={pro._id} />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {randomProducts && randomProducts.length > 0 && (
                    <div className="w-full justify-center items-center flex flex-col mb-10">
                        <h1 className=" flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8">DISCOVER MORE</h1>
                        <div className="w-full flex justify-start items-start">
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8 md:gap-10 mt-5">
                                {RandomProductLoading ? (
                                    <ProductCardSkeleton />
                                ) : (
                                    randomProducts.map((pro) => (
                                        <Single_product pro={pro} user={user} key={pro._id} />
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
			<Footer/>
        </div>
    );
};

export default Wishlist;
