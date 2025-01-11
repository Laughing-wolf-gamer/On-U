import React, { useState, useEffect, Fragment } from 'react';
import { BsShieldFillCheck } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';
import { useSelector, useDispatch } from 'react-redux';
import { getbag, getqtyupdate, deletebag, deleteBag, verifyingOrder } from '../../action/orderaction';
import { getAddress, getConvinceFees, getuser, updateAddress } from "../../action/useraction";
import { useAlert } from 'react-alert';
import { useNavigate, Link } from 'react-router-dom';
import './bag.css';
import { Select } from '@mui/material';
import AddAddressPopup from './AddAddressPopup';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';
import LoadingSpinner from '../Product/LoadingSpinner';
import Emptybag from './Emptybag';
import { BASE_API_URL, capitalizeFirstLetterOfEachWord, headerConfig } from '../../config';
import { Circle, X } from 'lucide-react';
import LoadingOverlay from '../../utils/LoadingOverLay';
import axios from 'axios';
import Footer from '../Footer/Footer';
const handelGetAmountAfterApplyingCoupon = (coupon,bag,user)=>{
    let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
    let totalMRP = 0;
    bag.orderItems.forEach(item => {
        // Check if salePrice is available, else fallback to regular price
        const productSellingPrice = item.productId.salePrice || item.productId.price;

        // Calculate total sale price (totalSP) - salePrice multiplied by quantity (if salePrice exists)
        if (item.productId.salePrice && item.productId.price > 0) {
            totalSP += item.productId.salePrice * item.quantity; // salePrice * quantity
        } else {
            totalSP += item.productId.price * item.quantity; // If no salePrice, use regular price
        }

        // Calculate the discount only if there is a sale price
        let discount = 0;
        if(item.productId.salePrice && item.productId.price > 0){
            discount = item.productId.price - item.productId.salePrice; // Calculate discount percentage and multiply by quantity to account for multiple items
            // console.log("Discount: ", discount);  // This is the discount percentage for each item
        }
        totalDiscount += discount * item.quantity; // Multiply by quantity to account for multiple items

        // Add the regular price or sale price multiplied by quantity for MRP

        totalProductSellingPrice += (productSellingPrice * item.quantity) + bag?.ConvenienceFees; // Regular price or salePrice * quantity
        totalMRP += item.productId.price * item.quantity;
        const setCouponDiscountAmount = ()=>{
            if(coupon.CouponType === "Percentage"){
                totalProductSellingPrice = totalProductSellingPrice - (totalProductSellingPrice * (coupon.Discount / 100));
            }else{
                totalProductSellingPrice = totalProductSellingPrice - coupon.Discount;
            }
        }
        if(coupon.MinOrderAmount > 0){
            if(coupon.MinOrderAmount > totalProductSellingPrice){
                setCouponDiscountAmount();
            }
        }else{
            totalProductSellingPrice -= bag?.ConvenienceFees;
        }
        /*
            CouponCode: "ABCDH12"
            CouponName: "Coupon1"
            CouponType: "Percentage"
            CustomerLogin: false
            Discount: 10
            FreeShipping: true
            MinOrderAmount: 0
            Status: "Inactive"
            ValidDate: "2025-01-09T18:48:22.540Z"
         */
    });
}
const Bag = () => {
    const navigation = useNavigate()
    const dispatch = useDispatch();
    const[convenienceFees,setConvenienceFees] = useState(-1);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const{deleteBagResult} = useSelector(state => state.deletebagReducer)
    const { loading: userLoading, user, isAuthentication } = useSelector(state => state.user);
    const {allAddresses} = useSelector(state => state.getAllAddress)
    const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
    const alert = useAlert();
    const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
    const[totalSellingPrice,setTotalMRP] = useState(0)
    const [discountedAmount, setDiscountAmount] = useState(0);
    const[couponDiscountData,setCouponDiscountData] = useState(null);
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
        alert.success('Address added successfully');
    };

    


    useEffect(() => {
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

                // Total product selling price includes salePrice or regular price + convenience fees
                totalProductSellingPrice += (productSellingPrice * quantity) + (bag?.ConvenienceFees || 0);

                // Calculate the total MRP (Maximum Retail Price) based on regular price
                totalMRP += price * quantity;
            });
            console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
            if (bag.Coupon) {
                const coupon = bag.Coupon;
                const { CouponType, Discount, MinOrderAmount } = coupon;

                const applyCouponDiscount = () => {
                    if (CouponType === "Percentage") {
                        totalProductSellingPrice -= totalProductSellingPrice * (Discount / 100);
                        setCouponDiscountData({})
                    } else {
                        totalProductSellingPrice -= Discount;
                    }
                };

                // Apply coupon discount only if applicable
                if (MinOrderAmount > 0) {
                    if(totalProductSellingPrice >= MinOrderAmount){
                        applyCouponDiscount();
                    }
                }else{
                    applyCouponDiscount();
                }
                if (bag.Coupon.FreeShipping) {
                    totalProductSellingPrice -= bag?.ConvenienceFees || 0; // Remove convenience fees if no minimum order amount
                }
            }

            // Log the results to check the calculations
            console.log("Total Product Selling Price: ", totalProductSellingPrice);
            console.log("Total Discount: ", totalDiscount);
            console.log("Total MRP: ", totalMRP);

            // Update state
            setTotalProductSellingPrice(totalProductSellingPrice);
            setDiscountAmount(totalDiscount);
            setTotalMRP(totalMRP);
        }
    }, [bag]);


    const updateQty = async (e, itemId) => {
        console.log("Item ID: ", itemId);
        console.log("Qty Value: ", e.target.value);
        await dispatch(getqtyupdate({ id: itemId, qty: Number(e.target.value) }));
        dispatch(getbag({ userId: user.id }));
    };

    const handleDeleteBag = async (productId,bagOrderItemId) => {
        await dispatch(deleteBag({productId,bagOrderItemId}));
        dispatch(getbag({ userId: user.id }));
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleAddressSubmit = () => {
        if (Object.values(address).every(value => value.trim() !== '')) {
            setIsAddressFilled(true);
            alert.success('Address added successfully');
        } else {
            alert.error('Please fill out all the fields');
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
            alert.error('Please select a delivery address');
        }
    };
    useEffect(() => {
        if (!user) {
            dispatch(getuser());
        }
        if (user) {

            if (!isAuthentication) {
                alert.info('Log in to access BAG');
            } else {
                dispatch(getbag({ userId: user.id }));
                dispatch(getAddress())
            }
            setAddress(user?.user?.addresses[0]);
        }
    }, [dispatch,deleteBagResult, user, isAuthentication, alert]);

    
    const verifyAnyOrdersPayment = async()=>{
        if(!sessionStorage.getItem("checkoutData")) return;
        try {
            const data = JSON.parse(sessionStorage.getItem("checkoutData"))
            const response = await axios.post(`${BASE_API_URL}/api/payment/razerypay/paymentVerification`,data,headerConfig())
            console.log("Verifying Order Response: ",response.data);
            sessionStorage.removeItem("checkoutData")
            if(response?.data.success){
                alert.success("Payment Successful");
                if(user){
                    setTimeout(() => {
                        dispatch(getbag({ userId: user.id }));
                    }, 1000);
                }
            }else{
                alert.error("Payment Failed");
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
    console.log("bag Data: ",bag?.Coupon);
    
    return (
        <>
            {isAuthentication ? (
                <div>
                    
                    {!bagLoading && bag?.orderItems?.length > 0 ? (
                        <div className="relative max-w-screen-lg mx-auto">
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
                                                                <span className="text-[#f26a10] font-normal">( ₹{-Math.round(item.productId?.salePrice / item.productId?.price * 100 - 100)}% OFF )</span>
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
                                        <span>₹{totalSellingPrice}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>You Saved</span>
                                        <span>₹{Math.round(discountedAmount)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Coupon</span>
                                        <span>{bag?.Coupon?.CouponCode ? bag?.Coupon?.CouponCode:"No Coupon Applied"}</span>
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        <span>Convenience Fee</span>
                                        <span className={`${bag.Coupon && bag.Coupon.FreeShipping ? "line-through":""}`}>₹{convenienceFees}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-xl">
                                        <span>Total</span>
                                        <span>₹{Math.round(totalProductSellingPrice)}</span>
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
                                        <span className="font-semibold text-xl">₹ {Math.round(totalProductSellingPrice)}</span>
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
                                                    alert.error('Please select a delivery address');
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
                            {bagLoading ?  <LoadingOverlay isLoading={bagLoading} />:
                                <div className="min-h-screen flex justify-center items-center bg-gray-50">
                                    <Emptybag/>                                   
                                </div>
                            }
                        </Fragment>
                    )}
                </div>
            ) : (
                <div className='flex w-full h-screen justify-center items-center'>
                    <div className="bg-white flex flex-col p-6 rounded-lg shadow-md w-[90%] sm:w-[400px]">
                            <h2 className="text-xl font-semibold text-gray-800">Please log in to access your bag</h2>
                            <p className="text-gray-500 mt-4">You must be logged in to view and manage your shopping bag.</p>
                        <div className="mt-6">
                            <button
                                onClick={(e)=>navigation('/Login')}
                                className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {user && showPayment && selectedAddress && bag && <PaymentProcessingPage selectedAddress = {selectedAddress} user={user} bag={bag} totalAmount={totalProductSellingPrice} closePopup={() => {
                dispatch(getbag({ userId: user.id }));
                dispatch(getAddress())
                setShowPayment(false)
            }} />}
            <Footer/>
        </>
    );
};


export default Bag;