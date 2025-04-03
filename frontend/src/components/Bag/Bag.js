import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getqtyupdate, deleteBag, itemCheckUpdate } from '../../action/orderaction';
import { getAddress, getConvinceFees, updateAddress } from "../../action/useraction";
import { useNavigate } from 'react-router-dom';
import './bag.css';
import { getOriginalAmount } from '../../config';
import Footer from '../Footer/Footer';
import { getRandomArrayOfProducts } from '../../action/productaction';
import SingleProduct from '../Product/Single_product';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import ProductCardSkeleton from '../Product/ProductCardSkeleton';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import BagContent from './BagContent';
import OfflineBagContent from './OfflineBagContent';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';


const Bag = () => {
    const{deleteBagResult} = useSelector(state => state.deletebagReducer)
    const { sessionBagData,updateBagQuantity,toggleBagItemCheck,removeBagSessionStorage,sessionRecentlyViewProducts } = useSessionStorage();
	const{userLoading,user, isAuthentication,checkAuthUser} = useServerAuth();
	const{bag,bagLoading,fetchBag,randomProducts,RandomProductLoading} = useServerWishList();
    const {allAddresses} = useSelector(state => state.getAllAddress)
    const {checkAndCreateToast} = useSettingsContext();
    const navigation = useNavigate()
    const dispatch = useDispatch();

    const[convenienceFees,setConvenienceFees] = useState(-1);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
    const[totalSellingPrice,setTotalMRP] = useState(0)
    const [discountedAmount, setDiscountAmount] = useState(0);
    const [allgst, setTotalGST] = useState(0);
    const [address, setAddress] = useState(null);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showPayment,setShowPayment] = useState(false);
	const[allBagData,setAllBagData] = useState(null);
    const[allSizes,setAllSizes] = useState(null)

    const handleOpenPopup = () => setIsAddressPopupOpen(true);
    const handleClosePopup = () => {
        setIsAddressPopupOpen(false)
        // dispatch(getbag());
        dispatch(getAddress())
    };
    const handleSaveAddress = async (newAddress) => {
        // const updatedAddresses = [...user.user.addresses, newAddress];
        // Assuming you have a function to update the user's address in the backend
        await dispatch(updateAddress(newAddress));
        // dispatch(getuser());
		checkAuthUser();
        checkAndCreateToast("success",'Address added successfully');
    };

	useEffect(()=>{
		if(bag){
			setAllSizes(bag.orderItems.reduce((acc,item)=>{
				acc[`${item.productId._id}-${item.size._id}-${item.color._id}`] = item.quantity || 0;
				return acc;
			},{}))
		}
	},[bag])
	useEffect(()=>{
		if(bag){
			setAllBagData(bag)
		}else{
			setAllBagData(null)
		}
	},[bag])
	const UpdateSizeQtn = (id,change,size,color)=>{
		console.log("Updating Qty:",id,size,color)
		setAllSizes(prev => {
			const newQty = prev[`${id}-${size._id}-${color._id}`] + change;
			updateQty({ target: { value: newQty } }, id,size,color)
			return {
				...prev,
				[`${id}-${size._id}-${color._id}`]:newQty
			}
		})
		const updatedData = {...allBagData,orderItems:allBagData.orderItems.map(item=>item.productId._id === id ? {...item,quantity:allSizes[`${item.productId._id}-${item.size._id}-${item.color._id}`] + change} : item)}
		setAllBagData(updatedData)
	}
    useEffect(() => {
        if (user) {
            if (allBagData && allBagData.orderItems) {
                let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
                let totalMRP = 0,totalGst = 0;
        
                allBagData.orderItems.forEach(item => {
                    const { productId, quantity,isChecked } = item;
					console.log("Updated Bags Data: ",productId,quantity);
					if(isChecked){
						const { salePrice, price,gst } = productId;
						// const priceWithoutGst = getOriginalAmount(gst,price);
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
						totalGst += gst;
					}
                });
        
                // Add convenience fees to the total product selling price (only once, not for each item)
                totalProductSellingPrice += (allBagData?.ConvenienceFees || 0);
				let couponDiscountedAmount = 0;

				// Coupon logic
				const applyCouponDiscount = () => {
					let discountedAmount = totalProductSellingPrice;

					if (typeof allBagData.Coupon?.Discount !== 'number' || allBagData.Coupon.Discount < 0) {
						console.error('Invalid discount value.');
						return discountedAmount; // Return the original price if discount is invalid.
					}

					const { CouponType, Discount } = allBagData.Coupon;

					if (CouponType === "Percentage") {
						// Ensure totalProductSellingPrice is positive
						if (discountedAmount > 0) {
							const discountAmount = discountedAmount * (Discount / 100);
							discountedAmount -= discountAmount;
							couponDiscountedAmount += discountAmount; // Add to couponDiscountedAmount
						}
					} else {
						// Ensure discount does not exceed the total price
						if (discountedAmount > Discount) {
							discountedAmount -= Discount;
							couponDiscountedAmount += Discount; // Add to couponDiscountedAmount
						} else {
							couponDiscountedAmount += discountedAmount; // Apply the full amount if it's less than the discount
							discountedAmount = 0; // Avoid negative prices
						}
					}

					return discountedAmount;
				};
                // console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
                if (allBagData.Coupon) {
                    const coupon = allBagData.Coupon;
                    const { MinOrderAmount } = coupon;
					// Apply coupon discount only if applicable
                    if (MinOrderAmount > 0 && totalProductSellingPrice >= MinOrderAmount) {
							totalProductSellingPrice = applyCouponDiscount();
						} else if (MinOrderAmount <= 0) {
							totalProductSellingPrice = applyCouponDiscount();
						}
        
                    // Apply free shipping discount (only if coupon is valid)
                }
				if (allBagData?.ConvenienceFees > 0 && !allBagData?.Coupon?.FreeShipping) {
					totalProductSellingPrice += bag.ConvenienceFees;
				}
				totalDiscount += couponDiscountedAmount;
                // Add convenience fees to the total product selling price (only once, not for each item)
                // Set the final values for the product selling price, discount, and MRP
                setTotalProductSellingPrice(totalProductSellingPrice);
                setDiscountAmount(totalDiscount);
                setTotalMRP(totalMRP);
				setTotalGST(totalGst);
            }
        } else if (sessionBagData) {
            let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
            let totalMRP = 0,totalGst = 0;
            if(sessionBagData){
                sessionBagData.forEach(item => {
                    const { ProductData, quantity,isChecked } = item;
					if(isChecked){
						const { salePrice, price,gst} = ProductData;
						const priceWithoutGst = getOriginalAmount(gst,price);
						
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
						totalGst += gst;
					}
                });
                // Add convenience fees to the total product selling price (only once, not for each item)
                totalProductSellingPrice += (sessionBagData?.ConvenienceFees || 0);
            
                // console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
                setTotalProductSellingPrice(totalProductSellingPrice);
                setDiscountAmount(totalDiscount || 0);
                setTotalMRP(totalMRP);
				setTotalGST(totalGst);
            }
        }
        
    }, [bag,sessionBagData,allSizes,allBagData]);


    const updateQty = async (e, itemId,size,color) => {
        console.log("Item ID: ", itemId);
        console.log("Qty Value: ", e.target.value);
        if(isAuthentication){
            dispatch(getqtyupdate({ id: itemId,size,color, qty: Number(e.target.value) }));
            // dispatch(getbag());
        }else{
            updateBagQuantity(itemId,size,color, e.target.value)
        }
    };
	const updateChecked = async (e, itemId,size,color) => {
		console.log("Item ID: ", itemId);
		e.stopPropagation();
		if(isAuthentication){
			await dispatch(itemCheckUpdate({ id: itemId,size,color }));
			// dispatch(getbag());
			fetchBag();
		}else{
			// updateBagQuantity(itemId, e.target.value)
			toggleBagItemCheck(itemId,size,color)
		}
	};

    const handleDeleteBag = async (productId,bagOrderItemId,size,color) => {
        if(isAuthentication){
            await dispatch(deleteBag({productId,bagOrderItemId,size,color}));
            // dispatch(getbag());
			fetchBag();
        }else{
            removeBagSessionStorage(productId,size,color)
        }
    };

    const handleAddressSelection = (address) => {
        setSelectedAddress(address);
    };
    

    const placeOrder = () => {
        if (selectedAddress) {
            setShowPayment(true);
        } else {
            checkAndCreateToast("error",'Please select a delivery address');
        }
    };
    useEffect(() => {
        if (user) {
            if (isAuthentication) {
                dispatch(getAddress())
                // dispatch(getbag());
            }
            setAddress(user?.user?.addresses[0]);
            // dispatch(getuser());
        }else{
			checkAuthUser();
		}
    }, [dispatch,deleteBagResult, user, isAuthentication]);
    useEffect(()=>{
        dispatch(getRandomArrayOfProducts())
    },[])
    const handleConvenienceFeesChange = async () => {
        try {
            const fees = await dispatch(getConvinceFees())
            setConvenienceFees(fees);
        } catch (error) {
            console.error("Error Fetching Convenience Data: ",error);
        }
    };
    useEffect(()=> {
        // verifyAnyOrdersPayment();
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
    console.log("All Sizes Data ",allSizes);
    const scrollableDivRef = useRef(null); // Create a ref to access the div element
    return (
        <div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto scrollbar overflow-x-hidden scrollbar-track-gray-400 scrollbar-thumb-gray-600 pb-3">
            <div className="w-full max-w-screen-2xl justify-self-center ">
                {isAuthentication ? (
                    <BagContent 
                        bag={allBagData}
						allSizes={allSizes}
						totalGst = {allgst}
						UpdateSizeQtn = {UpdateSizeQtn}
                        bagLoading={bagLoading}
                        totalSellingPrice={totalSellingPrice}
                        discountAmount={discountedAmount}
                        convenienceFees={convenienceFees}
                        user={user}
                        showPayment={showPayment}
                        selectedAddress={selectedAddress}
                        handleProceedToPayment={handleProceedToPayment}
                        handleOpenPopup={handleOpenPopup}
                        handleClosePopup={handleClosePopup}
                        isAddressPopupOpen={isAddressPopupOpen}
                        handleSaveAddress={handleSaveAddress}
                        setShowPayment={setShowPayment}
                        setSelectedAddress={setSelectedAddress}
                        totalProductSellingPrice={totalProductSellingPrice}
                        updateQty = {updateQty}
						updateChecked = {updateChecked}
                        handleDeleteBag = {handleDeleteBag}
                        allAddresses={allAddresses}
                        buttonPressed = {buttonPressed}
                        handleAddressSelection = {handleAddressSelection}
                    />
                  
                ) : (
                    <OfflineBagContent
                        bag = {bag}
                        discountedAmount = {discountedAmount}
                        sessionBagData={sessionBagData}
                        showPayment={showPayment}
						totalGst={allgst}
                        selectedAddress={selectedAddress}
                        bagLoading = {bagLoading}
                        totalSellingPrice={totalSellingPrice}
                        totalProductSellingPrice={totalProductSellingPrice}
                        convenienceFees={convenienceFees}
                        navigation={navigation}
                        handleDeleteBag={handleDeleteBag}
                        updateQty = {updateQty}
						updateChecked = {updateChecked}
                    />

                )}
            </div>
            {sessionRecentlyViewProducts && sessionRecentlyViewProducts.length > 0 && (
                <div className='w-full justify-center items-center flex flex-col mb-5'>
                    <h1 className='flex items-center justify-center text-center mt-4 font-semibold text-2xl p-8'>RECENTLY VIEWED</h1>
                    <div className='w-full flex justify-start items-start '>
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
                <div className='w-full justify-center items-center flex flex-col mb-10'>
                    <h1 className='flex items-center justify-center text-center mt-4 font-semibold text-2xl'>DISCOVER MORE</h1>
                    <div className='w-full flex justify-start items-start'>
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
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
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