import React, { Fragment, useEffect, useState } from 'react'
import Single_product from '../Product/Single_product'
import { useDispatch, useSelector } from 'react-redux'
import { createbag, deletewish, getwishlist,  } from '../../action/orderaction'
import { MdClear } from 'react-icons/md'
import wish from '../images/emptywish.PNG'
import { Link, useNavigate } from 'react-router-dom'
import { getuser, clearErrors } from '../../action/useraction'
import {useAlert} from 'react-alert'
import Nowishlist from './Nowishlist'


const Wishlist = () => {
    const Alert = useAlert()
    const redirect = useNavigate()
    const dispatch = useDispatch()
    const { wishlist, loading:loadingWishList } = useSelector(state => state.wishlist_data)
    const { isAuthentication, loading: userloading, error, user } = useSelector(state => state.user)
    const [state, setstate] = useState(false)
    const [state1, setstate1] = useState(false)
    const [state2, setstate2] = useState(false)
    const {deletewish:dellll} = useSelector(state=>state.deletewish)



    function delwish(e,product) {
        e.stopPropagation()
        dispatch(deletewish({deletingProductId: product}))
        setstate2(false)
    }
    if (state2=== false && dellll === true) {
        dispatch(getwishlist())
        setstate2(true)
    }


    function movetobag(user, product) {
        console.log("User", user)
        if (user) {
            /* const orderData ={
                userId:user.id,
                productId:product, 
                quantity:1,
                color:currentColor,
                size:currentSize,
            } */
            // console.log("Order Data: ",orderData)
            // dispatch(createbag(orderData))
            // Alert.success('Product added successfully in Bag')
        }else{
            Alert.show('You have To Login To Add This Product Into Bag')
        }
        /* const option ={
            user:user,
            orderItems:[
              {product:product, qty:1}
            ]}
        dispatch(createbag(option)) */
        Alert.success('Product added successfully in Bag')

        delwish(user,product)
    }

    useEffect(() => {

        if (state1 === false) {
            if (!user) {
                dispatch(getuser())
            }
            setstate1(true)
        }
        
    
        if (error) {
            dispatch(clearErrors())
        }
        if (state === false) {
            if (userloading === false) {
                if (isAuthentication === false) {
                    Alert.info('Log in to access wishlist')
                    setstate(true)
                } else {
                    setstate(true)
                }

            }
        }

        dispatch(getwishlist())
    }, [dispatch, error, userloading, isAuthentication, user]);
    console.log("Wish List Data: ",wishlist);
    return (
        <Fragment>
        {
           
            isAuthentication === true ?

            <Fragment>
            {
                loadingWishList === false &&
                <Fragment>
                    {(wishlist && wishlist?.orderItems && wishlist?.orderItems.length > 0)  ?
                        <Fragment>
                            <h1 className='font1 text-lg font-semibold px-4'>My Wishlist <span className='font-sans font-normal'> {wishlist.orderItems.length} items</span></h1>
                            <br />
                            <div className='2xl:px-4 xl:px-4 lg:px-4 '>
                                <ul className='grid grid-cols-2 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 2xl:gap-10 xl:gap-10 lg:gap-10 '>
                                    {user && wishlist && wishlist.orderItems.map((pro) => (
                                        <div key={pro?.productId?._id}  onClick={(e)=>{
                                            redirect(`/products/${pro?.productId?._id}`);
                                        }} className='border-[0.5px] border-slate-300 relative'>
                                            <div className='text-xl cursor-pointer text-white bg-gray-900 rounded-full absolute right-3 top-3 z-[5] h-max w-max' onClick={(e)=>delwish(e,pro?.productId._id)}><MdClear className='font-extralight '/></div>
                                            <Single_product pro={pro?.productId} user = {user} showWishList = {false}/>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <div className='w-full h-screen '>
                                <div className='mx-auto w-max text-center mt-[10.33%] '>
                                    <h1 className='font1 font-semibold text-lg text-slate-700'>YOUR WISHLIST IS EMPTY</h1>
                                    <p className='w-full mt-2 text-slate-400'>Add items that you like to your wishlist. Review <br /> them anytime and easily move them to the bag.</p>
                                    <img src={wish} alt="" className='mt-10 mb-10 w-[130px] mx-auto min-h-[150px]' />
                                    <Link to='/products'> <button className='py-4 px-14 text-[#3466e8] border-[1px] border-[#3466e8] font1 font-semibold'>CONTINUE SHOPPING</button></Link>
                                </div>
                            </div>
                        </Fragment>
                    }
    
                </Fragment>
            }
            </Fragment>
            :
            <Nowishlist/>
        }
        </Fragment>
    )
}

export default Wishlist