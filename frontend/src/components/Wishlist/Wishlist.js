import React, { Fragment, useEffect, useState } from 'react'
import Single_product from '../Product/Single_product'
import { useDispatch, useSelector } from 'react-redux'
import { deletewish, getwishlist } from '../../action/orderaction'
import { MdClear } from 'react-icons/md'
import wish from '../images/emptywish.PNG'
import { Link, useNavigate } from 'react-router-dom'
import { getuser, clearErrors } from '../../action/useraction'
import { useAlert } from 'react-alert'
import { useSessionStorage } from '../../Contaxt/SessionStorageContext'

const Wishlist = () => {
    const { sessionData,setWishListProductInfo } = useSessionStorage();
    const[currentWishListItem,setCurrentWishListItem] = useState([]);
    const Alert = useAlert()
    const navigation = useNavigate()
    const dispatch = useDispatch()
    const { wishlist, loading: loadingWishList } = useSelector(state => state.wishlist_data)
    const { isAuthentication, loading: userloading, error, user } = useSelector(state => state.user)
    const [state, setState] = useState(false)
    const [state1, setState1] = useState(false)
    const [state2, setState2] = useState(false)

    const handleDelWish = async (e, productId,product) => {
        e.stopPropagation()
        if (user) {
            await dispatch(deletewish({ deletingProductId: productId }))
            dispatch(getwishlist())
        } else {
            setWishListProductInfo(product,productId);
        }
        setState2(false)
    }

    useEffect(() => {
        if (state1 === false) {
            if (!user) {
                dispatch(getuser())
            }
            setState1(true)
        }

        if (error) {
            dispatch(clearErrors())
        }

        if (state === false) {
            if (userloading === false) {
                if (isAuthentication === false) {
                    setState(true)
                } else {
                    setState(true)
                }
            }
        }

        dispatch(getwishlist())
    }, [dispatch, error, userloading, isAuthentication, user]);
    useEffect(()=>{
        if (isAuthentication) {
            setCurrentWishListItem(wishlist && wishlist?.orderItems || [])
        } else {
            setCurrentWishListItem(sessionData);
        }
    },[dispatch,sessionData])
    

    return (
        <Fragment>
            {
                loadingWishList ? (
                    <div className="bg-slate-200 text-gray-700 overflow-y-auto h-screen flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-semibold text-gray-200 mb-6">Loading your Wishlist...</h1>
                        <div className="w-full px-4 mt-6 grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {/* Skeleton Loader for Product Cards */}
                        {Array(6).fill().map((_, index) => (
                            <div key={index} className="bg-gray-300 p-4 rounded-lg shadow-md animate-pulse">
                            <div className="h-36 bg-gray-500 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-500 mb-2"></div>
                            <div className="h-4 bg-gray-500 mb-2"></div>
                            <div className="w-20 h-8 bg-gray-500 rounded-md"></div>
                            </div>
                        ))}
                        </div>
                    </div>
                ) : (
                <Fragment>
                    {(currentWishListItem && currentWishListItem.length > 0) ? (
                        <div className='w-screen h-screen gap-1 px-10 mb-10'>
                            <h1 className="font1 text-2xl font-semibold gap-3 px-10 text-slate-800 flex flex-row justify-start items-center">
                                <span>My Wishlist</span>
                                <span className="font-medium text-sm text-slate-500">
                                    ({currentWishListItem.length} items)
                                </span>
                            </h1>

                            {/* <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                                {currentWishListItem.map((pro) => (
                                    <div key={pro._id} className="w-full min-h-[10vw] max-w-xs m-1"> 
                                        <Single_product pro={pro?.productId} user={user} showWishList={false} />
                                    </div>
                                ))}
                            </ul> */}
                            {/* Wishlist Grid */}
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                                {currentWishListItem && currentWishListItem.length > 0 && currentWishListItem.map((pro) => (
                                    <li
                                        key={pro?.productId?._id || pro?.productId}
                                        className="w-full h-fit max-w-sm m-4 group"  // Reduced height (e.g., 120px for each item)
                                    >
                                        <div className="shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl relative">
                                            <div
                                                className="w-full h-full"  // Adjusted height for the inner content
                                                onClick={(e) => {
                                                    const productId = pro?.productId?._id || pro?.productId;
                                                    navigation(`/products/${productId}`);
                                                }}
                                            >
                                                <Single_product pro={pro?.productId} user={user} showWishList={false} />
                                            </div>

                                            {/* The remove button will be visible on hover on larger screens, and visible by default on smaller screens */}
                                            <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-2 z-10 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                                <MdClear className="md:text-xl text-sm" onClick={(e) => handleDelWish(e, pro?.productId._id || pro?.productId, pro)} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>


                        </div>
                    ) : (
                    <Fragment>
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
                    </Fragment>
                    )}
                </Fragment>
                )
            }
            </Fragment>

    )
}

export default Wishlist
