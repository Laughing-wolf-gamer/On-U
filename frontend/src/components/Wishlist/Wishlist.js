import React, { Fragment, useEffect, useState } from 'react'
import Single_product from '../Product/Single_product'
import { useDispatch, useSelector } from 'react-redux'
import { deletewish, getwishlist } from '../../action/orderaction'
import { MdClear } from 'react-icons/md'
import wish from '../images/emptywish.PNG'
import { Link, useNavigate } from 'react-router-dom'
import { getuser, clearErrors } from '../../action/useraction'
import { getLocalStorageWishListItem } from '../../config'
import { useToast } from '../../Contaxt/ToastProvider'
import toast from 'react-hot-toast'

const Wishlist = () => {
    const { activeToast, showToast } = useToast();
    const checkAndCreateToast = (type,message) => {
        console.log("check Toast: ",type, message,activeToast);
        if(!activeToast){
            switch(type){
                case "error":
                    toast.error(message)
                    break;
                case "warning":
                    toast.warning(message)
                    break;
                case "info":
                    toast.info(message)
                    break;
                case "success":
                    toast.success(message)
                    break;
                default:
                    toast.info(message)
                    break;
            }
            showToast(message);
        }
    }
    const navigation = useNavigate()
    const dispatch = useDispatch()
    const { wishlist, loading: loadingWishList } = useSelector(state => state.wishlist_data)
    const { isAuthentication, loading: userloading, error, user } = useSelector(state => state.user)
    const [state, setState] = useState(false)
    const [state1, setState1] = useState(false)
    const [state2, setState2] = useState(false)
    const [sessionStorageWishList, setSessionStorageWishList] = useState(getLocalStorageWishListItem())

    const handleDelWish = async (e, product) => {
        e.stopPropagation()
        if (user) {
            await dispatch(deletewish({ deletingProductId: product }))
            dispatch(getwishlist())
        } else {
            if (sessionStorageWishList.length > 0) {
                const itemsToDelete = sessionStorageWishList.find(s => s.productId?._id === product);
                if (itemsToDelete) {
                    sessionStorageWishList.splice(sessionStorageWishList.indexOf(itemsToDelete), 1);
                    sessionStorage.setItem('wishListItem', JSON.stringify(sessionStorageWishList));
                    setSessionStorageWishList(getLocalStorageWishListItem());
                    checkAndCreateToast("info",'Product removed successfully from wishlist')
                }
            }
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

    let currentWishListItem = wishlist && wishlist?.orderItems;
    if (isAuthentication) {
        currentWishListItem = wishlist && wishlist?.orderItems || [];
    } else {
        currentWishListItem = sessionStorageWishList;
    }

    return (
        <Fragment>
            {
                loadingWishList ? (
                    <div className="bg-gray-900 text-white overflow-y-auto h-screen flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-semibold text-gray-200 mb-6">Loading your Wishlist...</h1>
                        <div className="w-full px-4 mt-6 grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {/* Skeleton Loader for Product Cards */}
                            {Array(6).fill().map((_, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
                                    <div className="h-36 bg-gray-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-600 mb-2"></div>
                                    <div className="h-4 bg-gray-600 mb-2"></div>
                                    <div className="w-20 h-8 bg-gray-600 rounded-md"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Fragment>
                        {(currentWishListItem && currentWishListItem.length > 0) ? (
                            <Fragment>
                                <h1 className="font1 text-2xl font-semibold text-slate-800 px-4">
                                    My Wishlist <span className="font-medium text-sm text-slate-500">({currentWishListItem.length} items)</span>
                                </h1>
                                <div className="px-4 mt-6">
                                    <ul className="grid grid-cols-2 gap-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                        {currentWishListItem.map((pro) => (
                                            <li key={pro?.productId?._id || pro?.productId} className="relative group">
                                                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                                    <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-2 z-10 md:opacity-0 opacity-100 group-hover:opacity-100 transition duration-300 cursor-pointer">
                                                        <MdClear className="md:text-xl text-sm" onClick={(e) => handleDelWish(e, pro?.productId._id || pro?.productId)} />
                                                    </div>
                                                    <div className="cursor-pointer" onClick={(e) => {
                                                        if(pro?.productId?._id){
                                                            navigation(`/products/${pro?.productId?._id}`);
                                                        }else{
                                                            navigation(`/products/${pro?.productId}`);
                                                        }
                                                    }}>
                                                        <Single_product pro={pro?.productId} user={user} showWishList={false} />
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="w-full h-screen flex justify-center items-center">
                                    <div className="text-center">
                                        <h1 className="font1 font-semibold text-2xl text-slate-700">Your Wishlist is Empty</h1>
                                        <p className="mt-2 text-slate-400">Add items you like to your wishlist and review them later.</p>
                                        <img src={wish} alt="Empty Wishlist" className="mt-8 w-32 mx-auto" />
                                        <Link to="/products">
                                            <button className="mt-6 py-3 px-12 bg-gray-900 text-white rounded font-medium hover:bg-gray-700 transition duration-200">Continue Shopping</button>
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
