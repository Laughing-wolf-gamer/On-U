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
import { BASE_API_URL, capitalizeFirstLetterOfEachWord, getLocalStorageBag, headerConfig } from '../../config';
import { X } from 'lucide-react';
import LoadingOverlay from '../../utils/LoadingOverLay';
import axios from 'axios';
import Footer from '../Footer/Footer';
import toast from 'react-hot-toast';
import { useToast } from '../../Contaxt/ToastProvider';
import { getRandomArrayOfProducts } from '../../action/productaction';
import SingleProduct from '../Product/Single_product';
import Loader from '../Loader/Loader';


const Bag = () => {
    const{deleteBagResult} = useSelector(state => state.deletebagReducer)
    const { loading: userLoading, user, isAuthentication } = useSelector(state => state.user);
    const { randomProducts,loading:productLoading, error } = useSelector(state => state.RandomProducts);
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const [sessionStorageBag,setSessionStorageItems] = useState(getLocalStorageBag());
    const {allAddresses} = useSelector(state => state.getAllAddress)

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
    const[convenienceFees,setConvenienceFees] = useState(-1);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
    const[totalSellingPrice,setTotalMRP] = useState(0)
    const [discountedAmount, setDiscountAmount] = useState(0);
    const[couponDiscountData,setCouponDiscountData] = useState(null);
    const navigation = useNavigate()
    const dispatch = useDispatch();
    // const [id, setId] = useState('');
    // const [initialized, setInitialized] = useState(false);

    const [address, setAddress] = useState(null);

    const [isAddressFilled, setIsAddressFilled] = useState(false);
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
        await dispatch(getuser());
        checkAndCreateToast("success",'Address added successfully');
    };

    


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
        } else if (sessionStorageBag) {
            let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
            let totalMRP = 0;
        
            sessionStorageBag.forEach(item => {
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
            totalProductSellingPrice += (sessionStorageBag?.ConvenienceFees || 0);
        
            console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
            setTotalProductSellingPrice(totalProductSellingPrice);
            setDiscountAmount(totalDiscount);
            setTotalMRP(totalMRP);
        }
        
    }, [bag,sessionStorageBag]);


    const updateQty = async (e, itemId) => {
        console.log("Item ID: ", itemId);
        console.log("Qty Value: ", e.target.value);
        if(isAuthentication){
            await dispatch(getqtyupdate({ id: itemId, qty: Number(e.target.value) }));
            dispatch(getbag({ userId: user.id }));
        }else{
            const itemsToUpdate = sessionStorageBag.find(item => item.productId === itemId);
            console.log("Items to update: ", itemsToUpdate)
            if(itemsToUpdate){
                itemsToUpdate.quantity = Number(e.target.value);
                sessionStorage.setItem("bagItem",JSON.stringify(sessionStorageBag));
                setSessionStorageItems(getLocalStorageBag());
            }
        }
    };

    const handleDeleteBag = async (productId,bagOrderItemId) => {
        if(isAuthentication){
            await dispatch(deleteBag({productId,bagOrderItemId}));
            dispatch(getbag({ userId: user.id }));
        }else{
            const itemsToDelete = sessionStorageBag.filter(item => item.productId!== productId);
            sessionStorage.setItem("bagItem",JSON.stringify(itemsToDelete));
            setSessionStorageItems(getLocalStorageBag());
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
                setSelectedAddress(allAddresses[0]);
            }
        }
    },[allAddresses,dispatch])
    console.log("Random Products: ",randomProducts);
    
    return (
        <div className="w-screen h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-400 scrollbar-thumb-gray-600 pb-3">
            {isAuthentication ? (
                <div>
                    
                    {!bagLoading && bag?.orderItems?.length > 0 ? (
                        <div className="relative w-screen px-5 mx-auto">
                            <div className="flex justify-between md:flex-row flex-col gap-3 p-2 items-center mt-6">
                                <div className="flex space-x-2 text-[#696B79]">
                                    <span className={`font-semibold ${!showPayment ? "text-blue-400":''}`}>BAG</span>
                                    <span>--------</span>
                                    <span className={`font-semibold ${!showPayment && selectedAddress ? "text-blue-400":''}`}>ADDRESS</span>
                                    <span>--------</span>
                                    <span className={`font-semibold ${showPayment && selectedAddress ? "text-blue-400":''}`}>PAYMENT</span>
                                </div>
                                <div className="flex items-center">
                                    <BsShieldFillCheck className="text-blue-400 text-3xl" />
                                    <span className="ml-2 text-[#535766] text-xs">100% SECURE</span>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row mt-4 gap-6">
                                <div className="flex-1">
                                    {bag && bag?.orderItems && bag?.orderItems?.length > 0 && bag?.orderItems?.map((item,i) => (
                                        <div key={i} className="flex items-center border-b py-4">
                                            <Link to={`/products/${item.productId?._id}`}>
                                                <img src={item?.color?.images[0]?.url} alt={item?.productId?.title} className="w-24 h-24 object-contain" />
                                            </Link>
                                            <div className="ml-4 flex-1">
                                                <h3 className="font-semibold">{item?.productId?.title}</h3>
                                                <p className="text-sm">Size: {item?.size?.label}</p>
                                                <div className="flex items-center space-x-2 text-sm text-blue-400">
                                                    {
                                                        item?.productId?.salePrice ? (
                                                            <>
                                                                <span>₹{Math.round(item.productId.salePrice)}</span>
                                                                <span className="line-through text-[#94969f]">₹{item.productId.price}</span>
                                                                <span className="text-[#f26a10] font-normal hover:animate-vibrateScale">( ₹{-Math.round(item.productId?.salePrice / item.productId?.price * 100 - 100)}% OFF )</span>
                                                            </>

                                                        ):(
                                                            <span>₹ {item.productId.price}</span>
                                                        )
                                                    }
                                                </div>
                                                <div className="mt-2">
                                                    Qty:
                                                    <select
                                                        value={item?.quantity}
                                                        onChange={(e) => updateQty(e, item.productId._id)}
                                                        className="ml-2 h-10 w-14 px-2 border rounded"
                                                    >
                                                        {/* Create options from 1 to item.size.quantity */}
                                                        {[...Array(item?.size?.quantity || []).keys()].map(num => (
                                                            <option key={num + 1} value={num + 1}>
                                                                {num + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                            </div>
                                            <X
                                                className="text-xl text-gray-700 hover:animate-vibrateScale transition-transform duration-300 hover:text-gray-600 cursor-pointer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteBag(item.productId._id,item._id);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">PRICE DETAILS ({bag.orderItems.length} items)</h3>
                                    <div className="flex justify-between mb-2">
                                        <span>Total MRP</span>
                                        <span>₹{bag?.totalMRP || totalSellingPrice}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>You Saved</span>
                                        <span>₹{Math.round(bag?.totalDiscount || discountedAmount)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Coupon</span>
                                        <span className={`${bag?.Coupon?.CouponCode ? "text-red-600":""}`} >{bag?.Coupon?.CouponCode ? bag?.Coupon?.CouponCode:"No Coupon Applied"}</span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <span>Convenience Fee</span>
                                        <span className={`${bag.Coupon && bag.Coupon.FreeShipping ? "line-through":""}`}>₹{convenienceFees}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-xl">
                                        <span>Total</span>
                                        <span>₹{Math.round(bag?.totalProductSellingPrice || totalProductSellingPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Address List */}
                            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Your Addresses</h3> 
                                <div className="space-y-4">
                                    {user && user.user && allAddresses && allAddresses.length > 0 ? (
                                        allAddresses.map((addr, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 border rounded-lg ${selectedAddress === addr ? 'bg-gray-500 text-white' : 'bg-white'}`}
                                                onClick={() => handleAddressSelection(addr)}
                                            >
                                            {/* Loop through each key-value pair in the address object */}
                                            {Object.entries(addr).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="font-semibold">{capitalizeFirstLetterOfEachWord(key)}:</span>
                                                    <span>{value}</span>
                                                </div>
                                            ))}

                                            {/* If the address is selected, show "Default Address" */}
                                            {selectedAddress === addr && <span className="text-xs text-white ">Default Address</span>}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No addresses available. Please add an address.</p>
                                    )}
                                </div>
                                </div>

                            {/* Payment Checkout Section */}
                            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                                <h3 className="font-semibold mb-4 text-center">Payment Checkout</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Order Total:</span>
                                        <span className="font-semibold text-xl">₹ {bag?.totalProductSellingPrice || totalProductSellingPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Selected Address:</span>
                                        <span className="text-sm">
                                            {selectedAddress
                                                ? Object.keys(selectedAddress).map((key, index) => (
                                                    <div key={index}>
                                                    <strong>{capitalizeFirstLetterOfEachWord(key)}:</strong> {selectedAddress[key]}
                                                    </div>
                                                ))
                                                : "No address selected"
                                            }
                                        </span>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => {
                                                if (selectedAddress) {
                                                    placeOrder();
                                                } else {
                                                    checkAndCreateToast("error",'Please select a delivery address');
                                                }
                                            }}
                                            className="w-full bg-gray-700 hover:bg-gray-400 text-white py-2 rounded-lg"
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
                    }} />}
                </div>
            ) : (
                <div>
                    {sessionStorageBag && sessionStorageBag.length > 0 ? (
                        <div className="relative w-screen px-5 mx-auto">
                            <div className="flex justify-between md:flex-row flex-col gap-3 p-2 items-center mt-6">
                                <div className="flex space-x-2 text-[#696B79]">
                                    <span className={`font-semibold ${!showPayment ? "text-blue-400":''}`}>BAG</span>
                                    <span>--------</span>
                                    <span className={`font-semibold ${!showPayment && selectedAddress ? "text-blue-400":''}`}>ADDRESS</span>
                                    <span>--------</span>
                                    <span className={`font-semibold ${showPayment && selectedAddress ? "text-blue-400":''}`}>PAYMENT</span>
                                </div>
                                <div className="flex items-center">
                                    <BsShieldFillCheck className="text-blue-400 text-3xl" />
                                    <span className="ml-2 text-[#535766] text-xs">100% SECURE</span>
                                </div>
                            </div>

                            <div className="flex flex-col lg:flex-row mt-4 gap-6">
                                <div className="flex-1">
                                    {sessionStorageBag  && sessionStorageBag.length > 0 && sessionStorageBag.map((item,i) => (
                                        <div key={i} className="flex items-center border-b py-4">
                                            <Link to={`/products/${item.ProductData?._id}`}>
                                                <img src={item?.color?.images[0]?.url} alt={item?.ProductData?.title} className="w-24 h-24 object-contain" />
                                            </Link>
                                            <div className="ml-4 flex-1">
                                                <h3 className="font-semibold">{item?.ProductData?.title}</h3>
                                                <p className="text-sm">Size: {item?.size?.label}</p>
                                                <div className="flex items-center space-x-2 text-sm text-blue-400">
                                                    {
                                                        item?.ProductData?.salePrice ? (
                                                            <>
                                                                <span>₹{Math.round(item.ProductData.salePrice)}</span>
                                                                <span className="line-through text-[#94969f]">₹{item.ProductData.price}</span>
                                                                <span className="text-[#f26a10] font-normal hover:animate-vibrateScale">( ₹{-Math.round(item.ProductData?.salePrice / item.ProductData?.price * 100 - 100)}% OFF )</span>
                                                            </>

                                                        ):(
                                                            <span>₹ {item.ProductData.price}</span>
                                                        )
                                                    }
                                                </div>
                                                <div className="mt-2">
                                                    Qty:
                                                    <select
                                                        value={item?.quantity}
                                                        onChange={(e) => updateQty(e, item.ProductData._id)}
                                                        className="ml-2 h-10 w-14 px-2 border rounded"
                                                    >
                                                        {/* Create options from 1 to item.size.quantity */}
                                                        {[...Array(item?.size?.quantity || []).keys()].map(num => (
                                                            <option key={num + 1} value={num + 1}>
                                                                {num + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                            </div>
                                            <X
                                                className="text-xl text-gray-700 hover:animate-vibrateScale transition-transform duration-300 hover:text-gray-600 cursor-pointer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteBag(item.ProductData._id,item._id);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">PRICE DETAILS ({sessionStorageBag.length} items)</h3>
                                    <div className="flex justify-between mb-2">
                                        <span>Total MRP</span>
                                        <span>₹{bag && bag?.totalMRP || totalSellingPrice}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>You Saved</span>
                                        <span>₹{Math.round(bag &&bag?.totalDiscount || discountedAmount)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Coupon</span>
                                        <span className={`${bag &&bag?.Coupon?.CouponCode ? "text-red-600":""}`} >{bag?.Coupon?.CouponCode ? bag?.Coupon?.CouponCode:"No Coupon Applied"}</span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <span>Convenience Fee</span>
                                        <span className={`${bag && bag.Coupon && bag.Coupon.FreeShipping ? "line-through":""}`}>₹{convenienceFees}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-xl">
                                        <span>Total</span>
                                        <span>₹{Math.round(totalProductSellingPrice)}</span>
                                    </div>
                                    <div className="flex justify-center items-center flex-row bg-black mt-5">
                                        <button onClick={()=>navigation("/Login")} className='w-full rounded-[60px] flex items-center justify-center p-3 font-semibold text-xl'>
                                            <span className='text-white'>Log In To Process Payment</span>
                                        </button>
                                    </div>
                                </div>
                            </div>                       
                            
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
                    
                </div>
            )}
            <div className='w-full justify-center flex flex-col'>
              <h1 className='font1 flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>DISCOVER MORE</h1>
              <ul className='grid grid-cols-2 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 2xl:gap-10 xl:gap-10 lg:gap-10 px-6 pb-8'>
                {randomProducts && randomProducts.length > 0 && randomProducts.slice(0,10).map((pro) => (<SingleProduct pro={pro} user ={user} key={pro._id}/>))}
              </ul>

            </div>
            <Footer/>
        </div>
    );
};
const ProductGrid = ({ randomProducts, user }) => {
    if (!randomProducts || randomProducts.length === 0) {
      return <div>No products available</div>;
    }
  
    return (
        <div className="grid grid-cols-4 gap-4 mt-4">
            {randomProducts.map((p, index) => (
                <div key={index} className="col-span-1">
                    <SingleProduct pro={p} user={user} showWishList={true} />
                </div>
            ))}
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