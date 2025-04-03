import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { applyCouponToBag, deleteBag, getqtyupdate, itemCheckUpdate, removeCouponFromBag } from '../../action/orderaction';
import { getAddress, getConvinceFees, removeAddress, updateAddress } from '../../action/useraction';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import axios from 'axios';
import { BASE_API_URL, calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, headerConfig, removeSpaces } from '../../config';
import { ChevronUp, Minus, Plus, Trash, X } from 'lucide-react';
import HorizontalScrollingCouponDisplay from './HorizontalScrollingCouponDisplay';
import Footer from '../Footer/Footer';
import { FormControl, Input, InputLabel } from '@mui/material';
import { fetchAddressForm } from '../../action/common.action';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';
import BackToTopButton from '../Home/BackToTopButton';
import WhatsAppButton from '../Home/WhatsAppButton';
import { useEncryptionDecryptionContext } from '../../Contaxt/EncryptionContext';
import RandomProductsDisplay from '../Login/Dashboard/RandomProductsDisplay';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useServerWishList } from '../../Contaxt/ServerWishListContext';
import { useServerAuth } from '../../Contaxt/AuthContext';

const CheckoutPage = () => {
  	const{deleteBagResult} = useSelector(state => state.deletebagReducer)
	const { sessionBagData,updateBagQuantity,toggleBagItemCheck,removeBagSessionStorage } = useSessionStorage();
	const{userLoading,user, isAuthentication,checkAuthUser} = useServerAuth();
	// const { bag } = useSelector(state => state.bag_data);
	const{bag,fetchBag} = useServerWishList();
	const {allAddresses} = useSelector(state => state.getAllAddress)
	const {checkAndCreateToast} = useSettingsContext();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const[convenienceFees,setConvenienceFees] = useState(-1);
	const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
	const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
	const[totalSellingPrice,setTotalMRP] = useState(0)
	const [allgst, setTotalGST] = useState(0);
	const [discountedAmount, setDiscountAmount] = useState(0);
	const [address, setAddress] = useState(null);

	const [selectedAddress, setSelectedAddress] = useState(null);
	const [showPayment,setShowPayment] = useState(false);
	const [coupon, setCoupon] = useState(null);
	const scrollableDivRef = useRef(null); // Create a ref to access the div element
	const[allBagData,setAllBagData] = useState(null);
	const[allSizes,setAllSizes] = useState(null);

	
	const handleOpenPopup = () => setIsAddressPopupOpen(true);
	const handleClosePopup = () => {
		setIsAddressPopupOpen(false)
		// dispatch(getbag());
		fetchBag();
		dispatch(getAddress())
	};
	const handleSaveAddress = async (newAddress) => {
		await dispatch(updateAddress(newAddress));
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
				let totalMRP = 0, totalGst = 0;
		
				allBagData.orderItems.forEach(item => {
					const { productId, quantity,isChecked } = item;
					console.log("Updated Bags Data: ",productId,quantity);
					if(isChecked){
						const { salePrice, price,gst } = productId;
						
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
		
				// console.log("Before Coupon Total Product Selling Price: ", totalProductSellingPrice);
				if (allBagData.Coupon) {
					const coupon = allBagData.Coupon;
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
				setTotalGST(totalGst);
			}else{
				setTotalProductSellingPrice(0);
				setDiscountAmount(0);
				setTotalMRP(0);
				setTotalGST(0);
			}
		} else if (sessionBagData) {
			let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
			let totalMRP = 0, totalGst = 0;
			if(sessionBagData){
				sessionBagData.forEach(item => {
					const { ProductData, quantity,isChecked } = item;
					if(isChecked){
						const { salePrice, price,gst } = ProductData;
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
		
	}, [bag,allBagData,allSizes,sessionBagData]);


	const updateQty = async (e, itemId,size,color) => {
		if(isAuthentication){
			await dispatch(getqtyupdate({ id: itemId,size,color, qty: Number(e.target.value) }));
			// dispatch(getbag());
		}else{
			updateBagQuantity(itemId,size,color, e.target.value)
		}
	};
	const updateChecked = async (e, itemId,size,color) => {
		// console.log("Item ID: ", itemId);
		e.stopPropagation();
		// console.log("Is Checked Value: ", e.target.checked);
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
			dispatch(getAddress())
			setAddress(user?.user?.addresses[0]);
		}
	}, [dispatch,deleteBagResult, user]);
	useEffect(() => {
		if(!user && !userLoading){
			navigate("/Login");
		}
	},[user])	
	const verifyAnyOrdersPayment = async()=>{
		if(!sessionStorage.getItem("checkoutData")) return;
		try {
			const data = JSON.parse(sessionStorage.getItem("checkoutData"))
			const response = await axios.post(`${BASE_API_URL}/api/payment/razerypay/paymentVerification`,data,headerConfig())
			sessionStorage.removeItem("checkoutData")
			if(response?.data.success){
				checkAndCreateToast("success","Payment Successful");
				if(user){
					setTimeout(() => {
						fetchBag();
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
		// verifyAnyOrdersPayment();
		handleConvenienceFeesChange();
	},[dispatch])
	useEffect(()=>{
		if(allAddresses){
			if(allAddresses.length > 0){
				setSelectedAddress(allAddresses[0] || null);
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
	
	// Apply coupon discount
	const applyCoupon = async (e) => {
		e.preventDefault();
		if (bag && coupon) {
			await dispatch(applyCouponToBag({ bagId: bag._id, couponCode: coupon }));
			checkAndCreateToast("success","Coupon Applied");
			setCoupon(null);
			window.location.reload();
		} else {
			checkAndCreateToast("info","No Coupon Applied!");
		}
	};
	const removeCoupon = async (e, code) => {
		if (bag) {
			await dispatch(removeCouponFromBag({ bagId: bag._id, couponCode: code }));
			checkAndCreateToast("success","Coupon Removed");
			setCoupon(null);
			window.location.reload();
		}
	}
	

	return (
		<div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar bg-white overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
			<div className='max-w-screen-2xl w-full justify-self-center flex flex-col py-2 sm:px-3 md:px-8 lg:px-4 xl:px-3 pb-10'>
				<h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
				<div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-6 2xl:grid-cols-6 xl:grid-cols-6 gap-8 justify-start items-start px-4">
					{/* Left Side: Address and Payment */}
					<div className="col-span-5 lg:col-span-4 md:col-span-4 xl:col-span-4 2xl:col-span-4 space-y-8 md:pr-9 md:border-r-[1px]">
						{
							allAddresses && <AddressAndPaymentComponent
								totalProductSellingPrice={totalProductSellingPrice}
								buttonPressed={buttonPressed}
								allAddresses={allAddresses}
								handleProceedToPayment={handleProceedToPayment}
								handleOpenPopup={handleOpenPopup}
								handleClosePopup={handleClosePopup}
								selectedAddress={selectedAddress}
								isAddressPopupOpen={isAddressPopupOpen}
								handleSaveAddress={handleSaveAddress}
								user={user}
								handleAddressSelection={handleAddressSelection}
								onAddressDelete={()=> {
									setSelectedAddress(null);
									dispatch(getAddress())
								}}
							/>
						}
						{/* User Information Section */}
						<AddAddress onSave={handleSaveAddress} />
					</div>


					{/* Right Side: Shopping Cart */}
					<div className="col-span-5 font-kumbsan lg:col-span-2 md:col-span-2 xl:col-span-2 2xl:col-span-2">
						<div className='justify-start items-start flex space-x-1'>
							<h3 className="text-xl font-semibold mb-4">BAG ITEMS 
							</h3>
							<span className='text-gray-600 text-base'>
								{`[${allBagData?.orderItems?.length || 0}]`}
							</span> 
						</div>
						<ProductListingComponent
							allSizes = {allSizes}
							UpdateSizeQtn = {UpdateSizeQtn}
							updateQty={updateQty}
							updateChecked = {updateChecked}
							bag={allBagData}
							handleDeleteBag={handleDeleteBag}
							user={user}
							setCoupon={setCoupon}
							applyCoupon={applyCoupon}
							coupon={coupon}
							totalProductSellingPrice = {totalProductSellingPrice}
						/>
						<PriceDetailsComponent
							user={user}
							bag={bag}
							totalGst = {allgst}
							checkAndCreateToast = {checkAndCreateToast}
							selectedAddress={selectedAddress}
							totalSellingPrice={totalSellingPrice} 
							discountedAmount={discountedAmount} 
							convenienceFees={convenienceFees} 
							totalProductSellingPrice={totalProductSellingPrice}
							removeCoupon = {removeCoupon}
							showPayment={showPayment}
							setShowPayment = {setShowPayment}
						/>
					</div>
				</div>
				<RandomProductsDisplay label = {'Some More You May Like'}/> 
			</div>
			{user && showPayment && selectedAddress && bag && (
				<PaymentProcessingPage
					discountAmount = {bag?.totalDiscount || discountedAmount}
					selectedAddress={selectedAddress}
					user={user}
					bag={bag}
					totalAmount={totalProductSellingPrice}
					originalsAmount={totalSellingPrice}
					closePopup={() => {
						// dispatch(getbag());
						fetchBag();
						dispatch(getAddress());
						setShowPayment(false);
						setSelectedAddress(null);
					}}
				/>
			)}
			<Footer/>
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
			<WhatsAppButton scrollableDivRef={scrollableDivRef}/>
		</div>
	);
};
const AddressAndPaymentComponent = ({ 
	selectedAddress, 
	user, 
	allAddresses, 
	buttonPressed, 
	handleAddressSelection,
	onAddressDelete,
}) => {
	const dispatch = useDispatch();
	const{checkAndCreateToast} = useSettingsContext();
	const removeAddressByIndex = async (addressIndex) => {
        await dispatch(removeAddress(addressIndex));
        checkAndCreateToast("success",'Address removed successfully');
		if(onAddressDelete){
			onAddressDelete();
		}
    };
	return (
		<div className="flex flex-col w-full gap-6 font-kumbsan">
			{/* Address List */}
			<div className={`mt-6 bg-white p-6 rounded-lg shadow-md transition-all duration-500 ease-in-out border-2 ${buttonPressed && !selectedAddress ? 'border-opacity-100 border-gray-900 scale-105' : 'border-opacity-0 scale-100'}`}>
				<h3 className="text-lg font-semibold mb-4">
					{user?.user && allAddresses?.length > 0 ? "Your Addresses" : "No Addresses Available"}
				</h3>

				<div className={`space-y-4 max-h-[400px] bg-slate-50 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-200`}>
					{/* Address Display */}
					{allAddresses?.length > 0 && (
						allAddresses.map((addr, index) => {
							const active = addr;
							return (
								<div
									key={index}
									className={`p-4 border rounded-lg bg-gray-100 transition-transform duration-300 ease-in-out transform cursor-pointer ${selectedAddress === active ? 'border-white bg-gray-800 border-dashed text-white' : 'hover:bg-gray-100'}`}
									onClick={() => handleAddressSelection(active)}
								>
									{selectedAddress === active && <label className="text-xs text-white underline mt-4 block">Selected Address</label>}
									
									{Object.entries(active).map(([key, value]) => (
										<div key={key} className="flex justify-between m-1">
											<span className="font-medium text-[12px] sm:text-base md:text-base">{capitalizeFirstLetterOfEachWord(key)}:</span>
											<span className="text-[10px] sm:text-base md:text-base">{value}</span>
										</div>

									))}
									<button
										className="flex justify-self-center items-center bg-red-500 mt-2 text-white rounded-full w-fit px-3 py-1 text-xs sm:px-2 sm:py-1 sm:text-sm md:px-2 md:py-2 md:text-base hover:bg-red-600 transition-colors duration-300"
										onClick={(e) => removeAddressByIndex(index)}
									>
										Remove Address
									</button>
								</div>
							)
						})
					)}
				</div>
			</div>
		</div>
	);
}



const PriceDetailsComponent = ({user, bag,totalSellingPrice, discountedAmount, convenienceFees,checkAndCreateToast, totalProductSellingPrice,removeCoupon,selectedAddress,showPayment,setShowPayment }) => {
	const navigate = useNavigate();
	return (
		<div className="w-full font-kumbsan h-fit bg-gray-50 px-2 shadow-sm">
			<h3 className="font-semibold text-base sm:text-xl md:text-2xl text-gray-800 mb-6">
				<div className='justify-start items-start flex space-x-1'>
					<h3 className="text-xl font-semibold mb-4">
						ORDER DETAILS 
					</h3>
					<span className='text-gray-600 text-base'>
						{`[${bag?.orderItems?.length || 0}]`}
					</span> 
				</div>
			</h3>
			<div className="space-y-4 sm:space-y-5">
				<div className="flex justify-between text-sm sm:text-base text-gray-700">
					<strong className='font-semibold'>Total MRP</strong>
					<span>₹ {formattedSalePrice(totalSellingPrice || bag?.totalMRP) || 0}</span>
				</div>
				<div className="flex justify-between text-gray-700">
					<strong className='font-semibold text-left'>You Saved</strong>
					<span className='text-right text-xs sm:text-base'>
						{formattedSalePrice(bag?.totalDiscount || discountedAmount) > 0 ? <span>₹{formattedSalePrice(bag?.totalDiscount || discountedAmount) || 0}</span>:<span>No Discount! Try Some Coupons</span>}
					</span>
				</div>
				<div className="flex justify-between text-sm sm:text-base text-gray-700">
					<strong className='font-semibold'>Coupon</strong>
					<span className={`${bag?.Coupon?.CouponCode ? "text-red-600" : "text-gray-500"}`}>
						{bag?.Coupon?.CouponCode ? (
							<div className="space-y-1">
								<button
									className="flex items-center space-x-1 text-xs sm:text-sm"
									onClick={(e) => removeCoupon(e, bag?.Coupon?.CouponCode)}
								>
									<X size={20} />
									<span>{bag?.Coupon?.CouponCode}</span>
								</button>
								{/* Discount Information */}
								<span className="text-xs sm:text-sm text-gray-500 mt-1">
									{`Saved: ${bag?.Coupon?.CouponType === "Price" ? "₹" : ""} ${bag?.Coupon?.Discount} ${bag?.Coupon?.CouponType === "Percentage" ? "%" : ""}`}
								</span>
							</div>
						) : (
							<Fragment>
								<span>No Coupon Applied</span>
							</Fragment>
						)}
					</span>
					</div>

				<div className="flex justify-between text-gray-700 mb-5">
					<strong className='text-gray-800'>Convenience Fee</strong>
					<span className={`${bag?.Coupon?.FreeShipping ? "line-through text-gray-400" : "text-gray-700 text-xs sm:text-base"}`}>
						{convenienceFees <= 0 ? "Free" : `₹${formattedSalePrice(convenienceFees)}`}
					</span>
				</div>
				<div className="flex justify-between space-x-4 rounded-xl py-4 bg-white text-gray-900 text-xl sm:text-2xl font-semibold transition-colors">
					<span>Total</span>
					<span>₹ {formattedSalePrice(totalProductSellingPrice || bag?.totalProductSellingPrice) || 0}</span>
				</div>
				<div className="flex flex-col space-y-4 mt-6">
					<button
						// disabled ={showPayment || !selectedAddress || bag?.orderItems?.filter(item=>item.isChecked).length <= 0}
						onClick={()=> {
							if(user){
								if(!bag || bag?.orderItems?.length < 0){
									checkAndCreateToast("error","Please select an Atleast on Item")
									navigate('/products')
									return;
								}
								const checkItems = bag?.orderItems?.filter(item=>item.isChecked)
								if(checkItems.length <= 0){
									checkAndCreateToast("error","Please select an Atleast on Item")
									setShowPayment(false);
									return;
								}

								if(!selectedAddress){
									checkAndCreateToast("error","Please select an address")
									return;
								}
								setShowPayment(true);
							}else{
								navigate("/Login")
							}
						}}
						className={`w-full bg-black hover:bg-gray-900 focus:bg-gray-600 disabled:bg-gray-600 text-white py-3 rounded-lg shadow-lg justify-center items-center flex transition-all duration-300 ease-in-out transform ${showPayment || !selectedAddress || bag?.orderItems?.filter(item=>item.isChecked).length <= 0 ? "":"hover:scale-105"} text-sm sm:text-base`}
					>

						{!bag || bag?.orderItems?.length < 0 ? "Continue Shopping":<Fragment>
								{
									selectedAddress ? <Fragment>
										{showPayment ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>:<span>
												{user ? "Process Order":"Login"}
											</span>
										}
									</Fragment>: (
										<span>
											{user ? "Process Order":"Log In"}
										</span>
									) 
								}
							
							</Fragment>
						}
					</button>
				</div>
			</div>
		</div>

	);
}


const ProductListingComponent = ({ bag,UpdateSizeQtn,allSizes,updateChecked, handleDeleteBag,user,setCoupon,applyCoupon,coupon,totalProductSellingPrice }) => {
	const {encrypt} = useEncryptionDecryptionContext();
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
	const isValidImage = (url) => {
		return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
	};
	
	return(
		<div className="flex-1 font-kumbsan space-y-6">
			<div className='space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200'>
				{bag?.orderItems?.map((item, i) => {
					const active = item;
					const getImageExtensionsFile = () => {
						// Find the first valid image URL based on extensions
						return active?.color?.images.find((image) => 
							image.url && isValidImage(image.url)
						);
					};
					const validImage = getImageExtensionsFile();
					const productEncryption = encrypt(active.productId?._id);
					return(
						<div key={i} className="relative flex flex-row items-center border-b py-6 space-y-6 sm:space-y-0 sm:space-x-6">
							{/* Product Image */}
							<div className="relative w-28 h-28 sm:w-40 sm:h-40 border-2 rounded-lg">
								<Link to={`/products/${productEncryption}`}>
									{validImage ? (
										<div className="relative w-full h-full">
										<LazyLoadImage
											effect='blur'
											useIntersectionObserver
												wrapperProps={{
												// If you need to, you can tweak the effect transition using the wrapper style.
												style: {transitionDelay: "1s"},
											}}
											placeholder = {<div className="w-full h-full bg-gray-200 animate-pulse"></div>}	
											loading='lazy'
											src={validImage?.url}
											alt={active?.productId?.title}
											className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
										/>
											<div
												onClick={(e) => updateChecked(e, active.productId?._id,active.size,active.color)}
												className="absolute top-2 left-2 w-5 h-5"
											>
												<input
													type="checkbox"
													className="w-full h-full cursor-pointer"
													checked={active?.isChecked}
													onChange={() => {}}
												/>
											</div>
										</div>
									) : (
										<p>No valid image available</p>
									)}
								</Link>

								{/* Delete Button on the Image (Mobile Only) */}
								<div
									className="absolute top-[-10px] right-[-10px] text-white bg-black p-1 rounded-full cursor-pointer sm:hidden"
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteBag(active.productId._id, active._id,active.size,active.color);
									}}
								>
								<Trash size={15} />
								</div>
							</div>

							{/* Product Info */}
							<div className="ml-6 flex-1 w-full">
								<h3 className="font-semibold text-base sm:text-lg md:text-xl text-gray-800 truncate space-x-1 whitespace-nowrap"><span>{active?.color?.name}</span><span>{active?.productId?.title}</span></h3>
								<p className="text-xs sm:text-base md:text-lg text-gray-600">Size: {active?.size?.label}</p>
								<p className="text-xs sm:text-base md:text-lg text-gray-600">Color: {active?.color?.name}</p>

								{/* Price and Discount Info */}
								<div className="flex items-center md:space-x-4 space-x-2 xl:space-x-3 2xl:space-x-3 text-xs sm:text-sm lg:text-base text-red-500 mt-2">
								{active?.productId?.salePrice ? (
									<>
										<span>₹ {formattedSalePrice(active?.productId?.salePrice)}</span>
										<span className="line-through text-gray-400">₹{formattedSalePrice(active.productId.price)}</span>
										<span className="text-gray-700 font-normal">(₹{calculateDiscountPercentage(active.productId?.price, active.productId?.salePrice)}% OFF)</span>
									</>
								) : (
									<span>₹ {formattedSalePrice(active?.productId?.price)}</span>
								)}
								</div>


								{/* Quantity Selector */}
								<div className="mt-4 w-fit flex flex-row items-center justify-center space-x-1 shadow-md rounded-full border-gray-700 border">
									{/* Decrease Button */}
									<button
										// onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active.productId._id,active.size,active.color)}
										onClick={() => UpdateSizeQtn(active.productId._id,-1,active.size,active.color)}
										className="p-2 rounded-full text-sm sm:text-base disabled:text-gray-300 hover:scale-105 transition-all ease-in-out duration-300"
										disabled={allSizes[`${active?.productId._id}-${active?.size?._id}-${active?.color?._id}`] <= 1}
									>
										<Minus />
									</button>

									{/* Display Current Quantity */}
									{/* <span className="text-xs sm:text-sm">{active?.quantity}</span> */}
									<span className="text-xs sm:text-sm">{allSizes[`${active?.productId?._id}-${active?.size?._id}-${active?.color?._id}`]}</span>

									{/* Increase Button */}
									<button
										// onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active.productId._id,active.size,active.color)}
										onClick={() => UpdateSizeQtn(active.productId._id,1,active.size,active.color)}
										className="p-2 rounded-full text-sm sm:text-base disabled:text-gray-300 hover:scale-105 transition-all ease-in-out duration-300"
										disabled={allSizes[`${active?.productId?._id}-${active?.size?._id}-${active?.color?._id}`] >= active?.size?.quantity}
									>
										<Plus />
									</button>
								</div>
							</div>

							{/* Delete Button for larger screens */}
							<Trash
								className="text-xl text-black hover:text-gray-500 cursor-pointer sm:block hidden mt-4 sm:mt-0"
								onClick={() => handleDeleteBag(active.productId._id, active._id,active.size,active.color)}
							/>
						</div>

					)
				})}
			</div>

			{/* Coupon Section */}
			<div className="mt-6 space-y-2">
				<label className="block text-xs sm:text-sm md:text-base font-semibold">Have a coupon?</label>
				<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-2 sm:space-y-0">
					{/* Coupon Input */}
					<input
						type="text"
						value={coupon}
						onChange={(e) => setCoupon(e.target.value)}
						className="w-full h-12 border border-gray-300 bg-gray-50 text-black rounded-md px-2 focus:ring-black text-sm sm:text-base"
						placeholder="Add Voucher Code"
					/>

					{/* Apply Coupon Button */}
					<button
						onClick={applyCoupon}
						className="w-full sm:w-[40%] h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-black"
					>
						<span className="whitespace-nowrap text-[10px] sm:text-sm text-center">Apply Coupon</span>
					</button>
				</div>
			</div>

			{/* Display Coupons */}
			<HorizontalScrollingCouponDisplay user={user} bag={bag} totalProductSellingPrice = {totalProductSellingPrice} />
		</div>

	);
}
const AddAddress = ({ onSave }) => {
	const { checkAndCreateToast } = useSettingsContext();
	const [formInitState, setFormInitState] = useState(null);
	const [newAddress, setNewAddress] = useState({});
	const { formData } = useSelector(state => state.fetchFormBanners);
	const dispatch = useDispatch();
	const [error, setError] = useState('');
	const [isFormVisible, setIsFormVisible] = useState(window.screen.width > 1024); // State to control form visibility on small screens

	const fetchStateAndCountry = async (pincode) => {
		try {
			const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
			const responseData = response.data.length > 0 ? response.data[0] : null;
			if (!responseData) throw new Error("Invalid Pincode");
			if (responseData.PostOffice.length === 0) throw new Error("Invalid Pincode");
			const data = responseData?.PostOffice[0];
			console.log("Country Data: ", data);

			if (data && data.State && data.Country && data.District) {
				handleChange({ target: { name: 'state', value: data.State } });
				handleChange({ target: { name: 'City', value: data.District } });
				handleChange({ target: { name: 'country', value: data.Country } });
				setError(null); // Clear any previous errors
			} else {
				checkAndCreateToast('error', 'Invalid Pincode');
				setError({ errorTag: 'pincode', error: 'Invalid Pincode' });
			}
		} catch (error) {
			console.error("Error fetching state and country:", error);
			checkAndCreateToast('error', 'Failed to fetch state and country');
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNewAddress((prev) => ({
			...prev,
			[name]: value,
		}));
		if (name === 'pincode' && value.length === 6) {
			fetchStateAndCountry(value);
		}
	};

	const handleSave = () => {
		console.log("Check New Address! ", newAddress);
		if (Object.values(newAddress).every(value => value.trim() !== '')) {
			if (newAddress['address1'].length > 30) {
				checkAndCreateToast('error', 'Address should be less Than 30 Characters!');
				setError('Address should be 30 Characters!');
				return;
			}
			if (newAddress['address2'].length > 30) {
				checkAndCreateToast('error', 'Address should be Less than 30 Characters!');
				setError('Address should be 30 Characters!');
				return;
			}
			const digitsOnly = newAddress['phoneNumber'].replace(/\D/g, '');
			if (digitsOnly.length !== 10) {
				checkAndCreateToast('error', 'Phone number should be 10 digits or fewer!');
				setError('Phone number should be 10 digits or fewer!');
				return;
			}
			const pincodeDigistOnly = newAddress['pincode'].replace(/\D/g, '');
			if (pincodeDigistOnly.length !== 6) {
				checkAndCreateToast('error', 'Pincode should be 6 digits!');
				setError('Pincode should be 6 digits!');
				return;
			}
			onSave(newAddress);
			setNewAddress(formInitState || {}); // Reset form
			setError(null); // Clear any previous errors
		} else {
			setError('Please fill out all the fields.');
		}
	};

	const handleFormInit = () => {
		if (formData) {
			const formInit = {};
			formData.forEach(item => {
				const key = removeSpaces(item); // Replace spaces with empty string
				formInit[key] = '';
			});
			setFormInitState(formInit);
		}
	}

	useEffect(() => {
		handleFormInit();
	}, [formData]);

	useEffect(() => {
		dispatch(fetchAddressForm());
	}, [dispatch]);

	return (
		<div className='w-full flex flex-col items-start'>
			{window.screen.width > 1024 && (
				<h2 className="text-xl w-full font-semibold mb-4 text-left">Add New Address</h2>
			)}

			{/* Toggle Button for Smaller Screens */}
			<button 
				className="lg:hidden px-4 w-full py-2 justify-between items-center flex text-gray-700 font-bold text-xl border-gray-400 border-t border-b border-opacity-40"
				onClick={() => setIsFormVisible(!isFormVisible)}
			>
				<span>Add New Address</span> <ChevronUp className={`${isFormVisible && 'rotate-180'} transition-all duration-200 ease-in-out`}/>
			</button>

			{/* Form */}
			{isFormVisible && (
				<form onSubmit={handleSave} className="space-y-4 w-full flex flex-col">
					{formData && formData.map((item, index) => (
						<FormControl key={index} className='w-full flex flex-col space-y-3'>
							<InputLabel htmlFor={item} className="text-sm font-medium text-left">
								{capitalizeFirstLetterOfEachWord(item)}
								{!newAddress[removeSpaces(item)] && <span className='text-gray-800'>*</span>}
							</InputLabel>
							<Input
								type={item === 'phoneNumber' || item === 'pincode' ? 'number' : 'text'}
								value={newAddress[removeSpaces(item)] || ''}
								id={removeSpaces(item)}
								name={removeSpaces(item)}
								onChange={handleChange}
								className="p-2 rounded-md mt-1 w-full"
								required
								maxLength={'30'}
								placeholder={`Enter ${removeSpaces(item)}`}
							/>
						</FormControl>
					))}
				</form>
			)}

			{/* Save Button */}
			{isFormVisible && formData && formData.length > 0 && (
				<button
					type='submit'
					disabled={Object.values(newAddress).every(value => value.trim() === '')}
					onClick={handleSave}
					className={`px-4 text-center justify-center flex items-center min-w-full mt-4 py-2 w-full bg-black rounded-md hover:bg-gray-700 text-white disabled:bg-gray-600`}
				>
					<span>SAVE</span>
				</button>
			)}
		</div>
	);
};

export default CheckoutPage;
