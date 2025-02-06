import React, { useState, useEffect, Fragment } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux';
import { getbag, getqtyupdate, deleteBag } from '../../action/orderaction';
import { getAddress, getConvinceFees, getuser, updateAddress } from "../../action/useraction";
import { useNavigate, Link } from 'react-router-dom';
import './bag.css';
import AddAddressPopup from './AddAddressPopup';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';
import Emptybag from './Emptybag';
import { BASE_API_URL, calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, headerConfig } from '../../config';
import { X } from 'lucide-react';
import axios from 'axios';
import Footer from '../Footer/Footer';
import { getRandomArrayOfProducts } from '../../action/productaction';
import SingleProduct from '../Product/Single_product';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import CouponsDisplay from './CouponDisplay';
import ProductCardSkeleton from '../Product/ProductCardSkeleton';
import { useSettingsContext } from '../../Contaxt/SettingsContext';


const Bag = () => {
    const{deleteBagResult} = useSelector(state => state.deletebagReducer)
    const { sessionBagData,updateBagQuantity,removeBagSessionStorage,sessionRecentlyViewProducts } = useSessionStorage();
    const { user, isAuthentication } = useSelector(state => state.user);
    const { randomProducts,loading:RandomProductLoading, error } = useSelector(state => state.RandomProducts);
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const {allAddresses} = useSelector(state => state.getAllAddress)
    const {checkAndCreateToast} = useSettingsContext();
    /* const { activeToast, showToast } = useToast();
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
    } */
    const navigation = useNavigate()
    const dispatch = useDispatch();

    const[convenienceFees,setConvenienceFees] = useState(-1);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
    const[totalSellingPrice,setTotalMRP] = useState(0)
    const [discountedAmount, setDiscountAmount] = useState(0);
    const [address, setAddress] = useState(null);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const handleOpenPopup = () => setIsAddressPopupOpen(true);
    const handleClosePopup = () => {
        setIsAddressPopupOpen(false)
        dispatch(getbag({ userId: user.id }));
        dispatch(getAddress())
    };
    const handleSaveAddress = async (newAddress) => {
        // const updatedAddresses = [...user.user.addresses, newAddress];
        // Assuming you have a function to update the user's address in the backend
        await dispatch(updateAddress(newAddress));
        dispatch(getuser());
        checkAndCreateToast("success",'Address added successfully');
    };

    /* useEffect(()=>{
        console.log("Recently View Products Session Storage: ",sessionRecentlyViewProducts);
    },[sessionRecentlyViewProducts]) */


    useEffect(() => {
        if (bag) {
            if (bag?.orderItems) {
                let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
                let totalMRP = 0;
        
                bag.orderItems.forEach(item => {
                    const { productId, quantity } = item;
                    const { salePrice, price } = productId;
                    
                    // Use salePrice if available, else fallback to regular price
                    const productSellingPrice = salePrice || price;
        
                    // Calculate the total sale price (totalSP) based on salePrice or regular price
                    const itemTotalPrice = (salePrice > 0 ? salePrice : price) * quantity;
                    totalSP += itemTotalPrice;
        
                    // Calculate the discount only if there is a sale price
                    if (salePrice && price > 0) {
                        const discount = price - salePrice;
                        totalDiscount += discount * quantity; // Multiply discount by quantity to account for multiple items
                    }
        
                    // Total product selling price includes salePrice or regular price
                    totalProductSellingPrice += productSellingPrice * quantity;
        
                    // Calculate the total MRP (Maximum Retail Price) based on regular price
                    totalMRP += price * quantity;
                });
        
                // Add convenience fees to the total product selling price (only once, not for each item)
                totalProductSellingPrice += (bag?.ConvenienceFees || 0);
        
                // console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
                if (bag.Coupon) {
                    const coupon = bag.Coupon;
                    const { CouponType, Discount, MinOrderAmount } = coupon;
        
                    const applyCouponDiscount = () => {
                        if (CouponType === "Percentage") {
                            totalProductSellingPrice -= totalProductSellingPrice * (Discount / 100);
                        } else {
                            totalProductSellingPrice -= Discount;
                        }
                    };
        
                    // Apply coupon discount only if applicable
                    if (MinOrderAmount > 0) {
                        if (totalProductSellingPrice >= MinOrderAmount) {
                            applyCouponDiscount();
                        }
                    } else {
                        applyCouponDiscount();
                    }
        
                    // Apply free shipping discount (only if coupon is valid)
                    if (bag.Coupon.FreeShipping && totalProductSellingPrice >= MinOrderAmount) {
                        totalProductSellingPrice -= bag?.ConvenienceFees || 0; // Remove convenience fees if coupon applies free shipping
                    }
                }
        
                // Set the final values for the product selling price, discount, and MRP
                setTotalProductSellingPrice(totalProductSellingPrice);
                setDiscountAmount(totalDiscount);
                setTotalMRP(totalMRP);
            }
        } else if (sessionBagData) {
            let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
            let totalMRP = 0;
        
            sessionBagData.forEach(item => {
                const { ProductData, quantity } = item;
                const { salePrice, price } = ProductData;
                
                // Use salePrice if available, else fallback to regular price
                const productSellingPrice = salePrice || price;
        
                // Calculate the total sale price (totalSP) based on salePrice or regular price
                const itemTotalPrice = (salePrice > 0 ? salePrice : price) * quantity;
                totalSP += itemTotalPrice;
        
                // Calculate the discount only if there is a sale price
                if (salePrice && price > 0) {
                    const discount = price - salePrice;
                    totalDiscount += discount * quantity; // Multiply discount by quantity to account for multiple items
                }
        
                // Total product selling price includes salePrice or regular price
                totalProductSellingPrice += productSellingPrice * quantity;
        
                // Calculate the total MRP (Maximum Retail Price) based on regular price
                totalMRP += price * quantity;
            });
        
            // Add convenience fees to the total product selling price (only once, not for each item)
            totalProductSellingPrice += (sessionBagData?.ConvenienceFees || 0);
        
            // console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
            setTotalProductSellingPrice(totalProductSellingPrice);
            setDiscountAmount(totalDiscount);
            setTotalMRP(totalMRP);
        }
        
    }, [bag,sessionBagData]);


    const updateQty = async (e, itemId) => {
        console.log("Item ID: ", itemId);
        console.log("Qty Value: ", e.target.value);
        if(isAuthentication){
            await dispatch(getqtyupdate({ id: itemId, qty: Number(e.target.value) }));
            dispatch(getbag({ userId: user.id }));
        }else{
            updateBagQuantity(itemId, e.target.value)
        }
    };

    const handleDeleteBag = async (productId,bagOrderItemId) => {
        if(isAuthentication){
            await dispatch(deleteBag({productId,bagOrderItemId}));
            dispatch(getbag({ userId: user.id }));
        }else{
            removeBagSessionStorage(productId)
        }
    };

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
    };
    const [showPayment,setShowPayment] = useState(false);

    const placeOrder = () => {
        if (selectedAddress) {
            // navigate('/processPayment');
            setShowPayment(true);
        } else {
            checkAndCreateToast("error",'Please select a delivery address');
        }
    };
    useEffect(() => {
        if (!user) {
            dispatch(getuser());
        }
        if (user) {

            if (!isAuthentication) {
                checkAndCreateToast("info",'Log in to access BAG');
            } else {
                dispatch(getbag({ userId: user.id }));
                dispatch(getAddress())
            }
            setAddress(user?.user?.addresses[0]);
        }
        dispatch(getRandomArrayOfProducts());
    }, [dispatch,deleteBagResult, user, isAuthentication]);

    
    const verifyAnyOrdersPayment = async()=>{
        if(!sessionStorage.getItem("checkoutData")) return;
        try {
            const data = JSON.parse(sessionStorage.getItem("checkoutData"))
            const response = await axios.post(`${BASE_API_URL}/api/payment/razerypay/paymentVerification`,data,headerConfig())
            console.log("Verifying Order Response: ",response.data);
            sessionStorage.removeItem("checkoutData")
            if(response?.data.success){
                checkAndCreateToast("success","Payment Successful");
                if(user){
                    setTimeout(() => {
                        dispatch(getbag({ userId: user.id }));
                    }, 1000);
                }
            }else{
                checkAndCreateToast("error","Payment Failed");
            }
            
        } catch (error) {
            console.error(`Error Verifying order: `,error);
        }
    }
    const handleConvenienceFeesChange = async () => {
        try {
            const fees = await dispatch(getConvinceFees())
            setConvenienceFees(fees);
        } catch (error) {
            console.error("Error Fetching Convenience Data: ",error);
        }
    };
    useEffect(()=> {
        verifyAnyOrdersPayment();
        handleConvenienceFeesChange();
    },[dispatch])
    useEffect(()=>{
        if(allAddresses){
            if(allAddresses.length > 0){
                // setSelectedAddress(allAddresses[0]);
            }
        }
    },[allAddresses,dispatch])
    const [buttonPressed, setButtonPressed] = useState(false);  // Track the button press state

    const handleProceedToPayment = () => {
        if (selectedAddress) {
            placeOrder();  // Place the order if an address is selected
        } else {
            checkAndCreateToast("error", 'Please select a delivery address');
            setButtonPressed(true);  // Highlight the address section if no address is selected
            setTimeout(()=>{
                setButtonPressed(false);
            },400)
        }
    };
    return (
        <div className="w-screen font-sans h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-400 scrollbar-thumb-gray-600 pb-3">
            <div className="w-full max-w-screen-2xl justify-self-center">
                {isAuthentication ? (
                    <div>
                        
                        {!bagLoading && bag?.orderItems?.length > 0 ? (
                            <div className="relative w-full px-10 mx-auto">

                                {/* Navigation */}
                                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-8">
                                    <div className="flex space-x-8 text-gray-800">
                                        <span className={`font-semibold text-lg ${!showPayment ? "text-blue-600" : "text-gray-400"}`}>BAG</span>
                                        <span className="text-gray-400">|</span>
                                        <span className={`font-semibold text-lg ${!showPayment && selectedAddress ? "text-blue-600" : "text-gray-400"}`}>ADDRESS</span>
                                        <span className="text-gray-400">|</span>
                                        <span className={`font-semibold text-lg ${showPayment && selectedAddress ? "text-blue-600" : "text-gray-400"}`}>PAYMENT</span>
                                    </div>
                                <div className="flex items-center space-x-3">
                                    <BsShieldFillCheck className="text-blue-400 text-3xl" />
                                    <span className="ml-2 text-[#535766] text-xs">100% SECURE</span>
                                </div>
                                </div>
                            
                                {/* Main Content */}
                                <div className="flex flex-col lg:flex-row gap-12 mt-12">
                                    {/* Product Listing */}
                                    <div className="flex-1 space-y-6">
                                        {bag?.orderItems?.length > 0 ? (
                                        bag?.orderItems?.map((item, i) => (
                                            <div key={i} className="flex items-center border-b py-6 space-x-6">
                                            <Link to={`/products/${item.productId?._id}`} className="w-28 h-28">
                                                <img src={item?.color?.images[0]?.url} alt={item?.productId?.title} className="w-full h-full object-contain rounded-lg" />
                                            </Link>
                                            <div className="ml-6 flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">{item?.productId?.title}</h3>
                                                    <p className="text-sm text-gray-600">Size: {item?.size?.label}</p>
                                                <div className="flex items-center space-x-4 text-sm text-blue-400 mt-2">
                                                    {item?.productId?.salePrice ? (
                                                        <>
                                                        <span>₹{Math.round(formattedSalePrice(item?.productId?.salePrice))}</span>
                                                        <span className="line-through text-[#94969f]">₹{item.productId.price}</span>
                                                        <span className="text-[#f26a10] font-normal">(₹{calculateDiscountPercentage(item.productId?.price,item.productId?.salePrice)}% OFF)</span>
                                                        </>
                                                    ) : (
                                                        <span>₹ {Math.round(formattedSalePrice(item.productId.price))}</span>
                                                    )}
                                                </div>
                                                <div className="mt-4 flex items-center space-x-4">
                                                    <label className="text-sm">Qty:</label>
                                                    <select
                                                        value={item?.quantity}
                                                        onChange={(e) => updateQty(e, item.productId._id)}
                                                        className="h-10 w-16 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {[...Array(item?.size?.quantity || 0).keys()].map((num) => (
                                                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <X
                                                className="text-xl text-gray-700 hover:text-red-500 cursor-pointer"
                                                onClick={(e) => {
                                                    handleDeleteBag(item.productId._id, item._id);
                                                }}
                                            />
                                            </div>
                                        ))
                                        ) : (
                                            <div className="text-center text-gray-500 text-lg">Your bag is empty.</div>
                                        )}
                                    </div>
                                
                                    {/* Price Details */}
                                    <div className="w-full lg:w-1/3 bg-gray-50 p-8 rounded-lg shadow-md">
                                        <h3 className="font-semibold text-xl text-gray-800 mb-6">PRICE DETAILS ({bag?.orderItems.length} items)</h3>
                                        <div className="space-y-5">
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Total MRP</span>
                                            <span>₹{bag?.totalMRP || totalSellingPrice}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>You Saved</span>
                                            <span>₹{Math.round(bag?.totalDiscount || discountedAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Coupon</span>
                                            <span className={`${bag?.Coupon?.CouponCode ? "text-red-600" : "text-gray-500"}`}>
                                            {bag?.Coupon?.CouponCode || "No Coupon Applied"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700 mb-5">
                                            <span>Convenience Fee</span>
                                            <span className={`${bag?.Coupon?.FreeShipping ? "line-through text-gray-400" : "text-gray-700"}`}>
                                                ₹{convenienceFees}
                                            </span>
                                        </div>
                                        <div className="flex justify-between space-x-4 rounded-xl py-4 bg-white text-gray-900 text-2xl font-semibold transition-colors">
                                            <span>Total</span>
                                            <span>₹ {Math.round(bag?.totalProductSellingPrice || totalProductSellingPrice)}</span>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-1 gap-6">
                                    {/* Address List */}
                                    <div className={`mt-6 bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out border-2 ${buttonPressed && !selectedAddress ? 'border-opacity-100 border-gray-900 scale-105' : 'border-opacity-0 scale-100'}`}>

                                        <h3 className="font-semibold mb-4">Your Addresses</h3>
                                        <div className={`space-y-4 `}>
                                            {user && user.user && allAddresses?.length > 0 ? (
                                                allAddresses.map((addr, index) => (
                                                    <div
                                                        key={index}
                                                        className={`p-4 border rounded-lg ${selectedAddress === addr ? 'bg-gray-500 text-white' : 'bg-white'}`}
                                                        onClick={() => handleAddressSelection(addr)}
                                                    >
                                                        {Object.entries(addr).map(([key, value]) => (
                                                            <div key={key} className="flex justify-between">
                                                                <span className="font-semibold">{capitalizeFirstLetterOfEachWord(key)}:</span>
                                                                <span>{value}</span>
                                                            </div>
                                                        ))}
                                                        {selectedAddress === addr && <span className="text-xs text-white">Default Address</span>}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bg-gray-100 p-4 rounded-lg text-center">
                                                    <p className="text-gray-700 mb-4">No addresses available.</p>
                                                    <button
                                                        onClick={handleOpenPopup}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                                                    >
                                                        Add New Address
                                                    </button>
                                                </div>
                                            )}
                                            {user && user.user && allAddresses?.length < 2 && (
                                                <div className="mt-4 text-center">
                                                    <button
                                                        onClick={handleOpenPopup}
                                                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                                                    >
                                                        Add New Address
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Checkout Section */}
                                    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
                                        <h3 className="font-semibold mb-6 text-center">Payment Checkout</h3>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span>Order Total:</span>
                                                <span className="font-semibold text-xl">₹ {bag?.totalProductSellingPrice || totalProductSellingPrice}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Selected Address:</span>
                                                <span className="text-sm">
                                                    {selectedAddress
                                                        ? Object.keys(selectedAddress).slice(0, 4).map((key, index) => (
                                                            <div key={index}>
                                                                <strong>{capitalizeFirstLetterOfEachWord(key)}:</strong> {selectedAddress[key]}
                                                            </div>
                                                        ))
                                                        : "No address selected"
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex flex-col space-y-4">
                                                <button
                                                    onClick={handleProceedToPayment}
                                                    className="w-full bg-gray-700 hover:bg-gray-800 duration-300 ease-in-out transition-all text-white py-2 rounded-lg"
                                                >
                                                    Proceed to Payment
                                                </button>
                                                <button
                                                    onClick={handleOpenPopup}
                                                    className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg"
                                                >
                                                    Add New Address
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Add Address Popup */}
                                <AddAddressPopup
                                    isOpen={isAddressPopupOpen}
                                    onClose={handleClosePopup}
                                    onSave={handleSaveAddress}
                                />
                            </div>
                        
                        ) : (
                            <Fragment>
                                {bagLoading ?  <SkeletonLoader />:
                                    <div className="min-h-screen flex justify-center items-center bg-slate-100">
                                        <Emptybag/>                                   
                                    </div>
                                }
                            </Fragment>
                        )}
                        {user && showPayment && selectedAddress && bag && <PaymentProcessingPage selectedAddress = {selectedAddress} user={user} bag={bag} totalAmount={totalProductSellingPrice} originalsAmount = {totalSellingPrice} closePopup={() => {
                            dispatch(getbag({ userId: user.id }));
                            dispatch(getAddress())
                            setShowPayment(false)
                            setSelectedAddress(null);
                        }} />}
                    </div>
                ) : (
                    <div>
                        {sessionBagData && sessionBagData.length > 0 ? (
                            <div className="relative w-full px-10 mx-auto">
                                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-8">
                                    <div className="flex space-x-8 text-gray-800">
                                        <span className={`font-semibold text-lg ${!showPayment ? "text-blue-600" : "text-gray-400"}`}>BAG</span>
                                        <span className="text-gray-400">|</span>
                                        <span className={`font-semibold text-lg ${!showPayment && selectedAddress ? "text-blue-600" : "text-gray-400"}`}>ADDRESS</span>
                                        <span className="text-gray-400">|</span>
                                        <span className={`font-semibold text-lg ${showPayment && selectedAddress ? "text-blue-600" : "text-gray-400"}`}>PAYMENT</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <BsShieldFillCheck className="text-blue-600 text-2xl" />
                                        <span className="text-xs text-gray-600">100% SECURE</span>
                                    </div>
                                </div>
                            
                                {/* Main Content */}
                                <div className="flex flex-col lg:flex-row gap-12 mt-12">
                                {/* Product Listing */}
                                <div className="flex-1 space-y-6">
                                    {sessionBagData && sessionBagData.length > 0 ? sessionBagData.map((item, i) => (
                                        <div key={i} className="flex items-center border-b py-6 space-x-8">
                                            <Link to={`/products/${item.ProductData?._id}`} className="w-28 h-28">
                                                <img src={item?.color?.images[0]?.url} alt={item?.ProductData?.title} className="w-full h-full object-contain rounded-lg" />
                                            </Link>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">{item?.ProductData?.title}</h3>
                                                <p className="text-sm text-gray-600">Size: {item?.size?.label}</p>
                                                <div className="flex items-center space-x-4 text-sm text-blue-500 mt-2">
                                                    {item?.ProductData?.salePrice ? (
                                                    <>
                                                        <span>₹{Math.round(formattedSalePrice(item?.ProductData?.salePrice))}</span>
                                                        <span className="line-through text-gray-400">₹{Math.round(formattedSalePrice(item.ProductData.price))}</span>
                                                        <span className="text-orange-600">({calculateDiscountPercentage(item.ProductData?.price,item.ProductData?.salePrice)}% OFF)</span>
                                                    </>
                                                    ) : (
                                                    <span>₹ {Math.round(formattedSalePrice(item.ProductData.price))}</span>
                                                    )}
                                                </div>
                                                <div className="mt-4 flex items-center space-x-4">
                                                    <label className="text-sm">Qty:</label>
                                                    <select
                                                    value={item?.quantity}
                                                    onChange={(e) => updateQty(e, item.ProductData._id)}
                                                    className="h-10 w-16 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                    {[...Array(item?.size?.quantity || 0).keys()].map((num) => (
                                                        <option key={num + 1} value={num + 1}>{num + 1}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <X
                                                className="text-xl text-gray-700 hover:text-red-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteBag(item.ProductData._id, item._id);
                                                }}
                                            />
                                        </div>
                                    )) : (
                                        <div className="text-center text-gray-500 text-lg">Your bag is empty.</div>
                                    )}
                                </div>
                            
                                {/* Price Details */}
                                <div className="w-full lg:w-1/3 bg-gray-50 p-8 rounded-xl shadow-md">
                                    <h3 className="font-semibold text-xl text-gray-800 mb-6">PRICE DETAILS ({sessionBagData.length} items)</h3>
                                    <div className="space-y-5">
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Total MRP</span>
                                            <span>₹{Math.round(formattedSalePrice(bag?.totalMRP || totalSellingPrice))}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>You Saved</span>
                                            <span>₹{Math.round(bag?.totalDiscount || discountedAmount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Coupon</span>
                                                <span className={`${bag?.Coupon?.CouponCode ? "text-red-600" : "text-gray-500"}`}>
                                                {bag?.Coupon?.CouponCode || "No Coupon Applied"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700 mb-5">
                                            <span>Convenience Fee</span>
                                            <span className={`${bag?.Coupon?.FreeShipping ? "line-through text-gray-400" : "text-gray-700"}`}>
                                            ₹{convenienceFees}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-xl text-gray-900">
                                            <span>Total</span>
                                            <span>₹{Math.round(totalProductSellingPrice)}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => navigation("/Login")}
                                            className="w-full rounded-xl py-4 bg-black text-white text-lg font-semibold hover:bg-gray-800 transition-colors"
                                        >
                                            Log In To Process Payment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>           
                        ) : (
                            <Fragment>
                                {bagLoading ?  <SkeletonLoader />:
                                    <div className="min-h-screen flex justify-center items-center">
                                        <Emptybag/>                                   
                                    </div>
                                }
                            </Fragment>
                        )}
                        
                    </div>
                )}
            </div>
            <CouponsDisplay user={user} />
            {sessionRecentlyViewProducts && sessionRecentlyViewProducts.length > 0 && (
                <div className='w-full 2xl:px-12 justify-center items-center flex flex-col'>
                    <h1 className='font1 flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>RECENTLY VIEWED</h1>
                    <div className='w-full flex justify-start items-start 2xl:px-10'>
                        <ul className='grid grid-cols-2 xl:grid-cols-6 lg:grid-cols-6 p-4 gap-6 2xl:p-6 mx-auto'>
                            {
                                sessionRecentlyViewProducts.slice(0, 20).map((pro) => (
                                    <SingleProduct pro={pro} user={user} key={pro._id} />
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
                                            <SingleProduct pro={pro} user={user} key={pro._id} />
                                        ))
                                    }
                                </Fragment>
                            }
                        </ul>
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
};

const SkeletonLoader = () => {
    return (
        <Fragment>
            <div className="relative max-w-screen-lg mx-auto">
                {/* Step Indicator */}
                <div className="flex justify-between md:flex-row flex-col gap-3 p-2 items-center mt-6">
                    <div className="flex space-x-2 text-[#696B79]">
                        <span className="font-semibold w-20 h-4 bg-gray-300 animate-pulse"></span>
                        <span>--------</span>
                        <span className="font-semibold w-20 h-4 bg-gray-300 animate-pulse"></span>
                        <span>--------</span>
                        <span className="font-semibold w-20 h-4 bg-gray-300 animate-pulse"></span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                        <span className="ml-2 w-24 h-3 bg-gray-300 animate-pulse"></span>
                    </div>
                </div>

                {/* Bag and Price Details */}
                <div className="flex flex-col lg:flex-row mt-4 gap-6">
                    <div className="flex-1 space-y-4">
                        {/* Loading Items */}
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="flex items-center border-b py-4 space-x-4">
                                <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-lg"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="w-full h-6 bg-gray-300 animate-pulse"></div>
                                    <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                                    <div className="flex space-x-4">
                                        <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                                        <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                                    </div>
                                    <div className="w-24 h-6 bg-gray-300 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg space-y-4">
                        {/* Price Details Skeleton */}
                        <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
                        <div className="flex justify-between mb-2">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between mb-2">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between mb-2">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between mb-4">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between font-semibold text-xl">
                            <div className="w-24 h-6 bg-gray-300 animate-pulse"></div>
                            <div className="w-16 h-6 bg-gray-300 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Address List */}
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 w-24 h-4 bg-gray-300 animate-pulse"></h3>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-2">
                                <div className="w-full h-4 bg-gray-300 animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-300 animate-pulse"></div>
                                <div className="w-full h-4 bg-gray-300 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Checkout Section */}
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-4 text-center w-32 h-4 bg-gray-300 animate-pulse"></h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            <div className="w-16 h-6 bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse"></div>
                            <div className="w-32 h-4 bg-gray-300 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <div className="w-full h-10 bg-gray-300 animate-pulse rounded-lg"></div>
                            <div className="w-full h-10 bg-gray-300 animate-pulse rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}


export default Bag;