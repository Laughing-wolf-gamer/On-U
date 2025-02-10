import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { applyCouponToBag, deleteBag, getbag, getqtyupdate, removeCouponFromBag } from '../../action/orderaction';
import { getAddress, getConvinceFees, getuser, updateAddress } from '../../action/useraction';
import { getRandomArrayOfProducts } from '../../action/productaction';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import axios from 'axios';
import { BASE_API_URL, calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, getOriginalAmount, headerConfig, removeSpaces } from '../../config';
import CouponsDisplay from './CouponDisplay';
import { Minus, Plus, X } from 'lucide-react';
import HorizontalScrollingCouponDisplay from './HorizontalScrollingCouponDisplay';
import Footer from '../Footer/Footer';
import { FormControl, FormHelperText } from '@mui/material';
import { fetchAddressForm } from '../../action/common.action';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';
import BackToTopButton from '../Home/BackToTopButton';

const CheckoutPage = () => {
  	const{deleteBagResult} = useSelector(state => state.deletebagReducer)
	const { sessionBagData,updateBagQuantity,removeBagSessionStorage,sessionRecentlyViewProducts } = useSessionStorage();
	const { user, isAuthentication, loading:userLoading } = useSelector(state => state.user);
	const { randomProducts,loading:RandomProductLoading, error } = useSelector(state => state.RandomProducts);
	const { bag, loading: bagLoading } = useSelector(state => state.bag_data);
	const {allAddresses} = useSelector(state => state.getAllAddress)
	const {checkAndCreateToast} = useSettingsContext();
	const navigation = useNavigate()
	const dispatch = useDispatch();

	const[convenienceFees,setConvenienceFees] = useState(-1);
	const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
	const [totalProductSellingPrice, setTotalProductSellingPrice] = useState(0);
	const[totalSellingPrice,setTotalMRP] = useState(0)
	const [allgst, setTotalGST] = useState(0);
	const [discountedAmount, setDiscountAmount] = useState(0);
	const [address, setAddress] = useState(null);

	const [selectedAddress, setSelectedAddress] = useState(null);
	const [showPayment,setShowPayment] = useState(false);

	
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
	const scrollableDivRef = useRef(null); // Create a ref to access the div element

	useEffect(() => {
		if (bag) {
			if (bag?.orderItems) {
				let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
				let totalMRP = 0, totalGst = 0;
		
				bag.orderItems.forEach(item => {
					const { productId, quantity } = item;
					const { salePrice, price,gst } = productId;
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
					totalMRP += priceWithoutGst * quantity;
					totalGst += gst;
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
				setTotalGST(totalGst);
			}
		} else if (sessionBagData) {
			let totalProductSellingPrice = 0, totalSP = 0, totalDiscount = 0;
			let totalMRP = 0, totalGst = 0;
			if(sessionBagData){
				sessionBagData.forEach(item => {
					const { ProductData, quantity } = item;
					const { salePrice, price,gst } = ProductData;
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
					totalMRP += priceWithoutGst * quantity;
					totalGst += gst;
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
	console.log("Discounted Amount: ",discountedAmount)
	const [coupon, setCoupon] = useState(null);
	const [discount, setDiscount] = useState(0);
	// Apply coupon discount
	const applyCoupon = async (e) => {
		e.preventDefault();
		if (bag && coupon) {
			await dispatch(applyCouponToBag({ bagId: bag._id, couponCode: coupon }));
			checkAndCreateToast("success","Coupon Applied");
			setCoupon(null);
			// closePopup();
			// dispatch(getbag({ userId: user.id }));
			window.location.reload();
		} else {
			checkAndCreateToast("info","Please select a coupon and apply it before proceeding with payment");
		}
	};
	const removeCoupon = async (e, code) => {
		// e.preventDefault();
		if (bag) {
			await dispatch(removeCouponFromBag({ bagId: bag._id, couponCode: code }));
			checkAndCreateToast("success","Coupon Removed");
			setCoupon(null);
			// dispatch(getbag({ userId: user.id }));
			window.location.reload();
		}
	}

	return (
		<div ref={scrollableDivRef} className="w-screen font-kumbsan h-screen overflow-y-auto justify-start scrollbar bg-white overflow-x-hidden scrollbar-track-gray-800 scrollbar-thumb-gray-300 pb-3">
			<div className='max-w-screen-2xl w-full justify-self-center flex flex-col py-2 sm:px-3 md:px-8 lg:px-4 xl:px-3 pb-10'>
				<h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
				
				<div className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-6 2xl:grid-cols-6 xl:grid-cols-6 gap-8">
					{/* Left Side: Address and Payment */}
					<div className="col-span-5 lg:col-span-4 md:col-span-4 xl:col-span-4 2xl:col-span-4 space-y-8 pr-9 border-r-[1px]">
						<AddressAndPaymentComponent
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
						/>
						
						{/* User Information Section */}
						<section className="flex flex-col mb-10">
							<h3 className="text-xl font-semibold mb-4">Your Information</h3>
							<AddAddress
								onSave={handleSaveAddress}
							/>
						</section>
					</div>

					{/* Right Side: Shopping Cart */}
					<div className="col-span-5 lg:col-span-2 md:col-span-2 xl:col-span-2 2xl:col-span-2">
						<h3 className="text-xl font-semibold mb-4">Shopping Cart</h3>
						<ProductListingComponent
							updateQty={updateQty}
							bag={bag}
							handleDeleteBag={handleDeleteBag}
							user={user}
							setCoupon={setCoupon}
							applyCoupon={applyCoupon}
							coupon={coupon}
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
			</div>
			{user && showPayment && selectedAddress && bag && (
				<PaymentProcessingPage
					discountAmount = {discountedAmount}
					selectedAddress={selectedAddress}
					user={user}
					bag={bag}
					totalAmount={totalProductSellingPrice}
					originalsAmount={totalSellingPrice}
					closePopup={() => {
						dispatch(getbag({ userId: user.id }));
						dispatch(getAddress());
						setShowPayment(false);
						setSelectedAddress(null);
					}}
				/>
			)}
			<Footer/>
			<BackToTopButton scrollableDivRef={scrollableDivRef} />
		</div>
	);
};
const AddressAndPaymentComponent = ({ 
	handleProceedToPayment, 
	handleOpenPopup, 
	selectedAddress, 
	isAddressPopupOpen, 
	handleSaveAddress, 
	user, 
	allAddresses, 
	buttonPressed, 
	handleAddressSelection, 
	totalProductSellingPrice 
}) => (
	<div className="flex flex-col w-full gap-6 font-kumbsan">
		{/* Address List */}
		<div className={`mt-6 bg-white p-6 rounded-lg shadow-md transition-all duration-500 ease-in-out border-2 ${buttonPressed && !selectedAddress ? 'border-opacity-100 border-gray-900 scale-105' : 'border-opacity-0 scale-100'}`}>
			<h3 className="text-lg font-semibold mb-4">{user?.user && allAddresses?.length > 0 ? "Your Addresses" : "No Addresses Available"}</h3>

			<div className="space-y-4">
				{/* Address Display */}
				{user?.user && allAddresses?.length > 0 && (
					allAddresses.map((addr, index) => (
						<div
							key={index}
							className={`p-4 border rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 ${selectedAddress === addr ? 'border-white bg-gray-800 border-dashed text-white' : 'hover:bg-gray-100'}`}
							onClick={() => handleAddressSelection(addr)}
						>
							{Object.entries(addr).map(([key, value]) => (
								<div key={key} className="flex justify-between mb-1">
									<span className="font-medium text-sm">{capitalizeFirstLetterOfEachWord(key)}:</span>
									<span className="text-sm">{value}</span>
								</div>
							))}
							{selectedAddress === addr && <span className="text-xs text-white mt-2 block">Default Address</span>}
						</div>
					))
				)}
			</div>
		</div>
	</div>
);
const PriceDetailsComponent = ({user, bag,totalGst, totalSellingPrice, discountedAmount, convenienceFees,checkAndCreateToast, totalProductSellingPrice,removeCoupon,selectedAddress,showPayment,setShowPayment }) => {
	const navigate = useNavigate();
	return (
		<div className="w-full font-kumbsan h-fit bg-gray-50 p-8 shadow-md">
			<h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800 mb-6">
				ORDER DETAILS ({bag?.orderItems.length} items)
			</h3>
			<div className="space-y-4 sm:space-y-5">
				<div className="flex justify-between text-sm sm:text-base text-gray-700">
					<span>Total MRP</span>
					<span>₹{formattedSalePrice(bag?.totalMRP || totalSellingPrice)}</span>
				</div>
				<div className="flex justify-between text-sm sm:text-base text-gray-700">
					<span>Total GST</span>
					<span>+ {formattedSalePrice(bag?.totalGst || totalGst)}%</span>
				</div>
				<div className="flex justify-between text-sm sm:text-base text-gray-700">
					<span>You Saved</span>
					<span>₹{formattedSalePrice(bag?.totalDiscount || discountedAmount)}</span>
				</div>
				<div className="flex justify-between text-sm sm:text-base text-gray-700">
					<span>Coupon</span>
					<span className={`${bag?.Coupon?.CouponCode ? "text-red-600" : "text-gray-500"}`}>
						{bag?.Coupon?.CouponCode ? (
							<div className="space-y-1">
								{/* Coupon Code and Remove Button */}
								<button
									className="flex items-center space-x-1 text-xs sm:text-sm"
									onClick={(e) => removeCoupon(e, bag?.Coupon?.CouponCode)}
								>
									<X size={20} />
									<span>{bag?.Coupon?.CouponCode}</span>
								</button>
								{/* Discount Information */}
								<span className="text-xs sm:text-sm text-gray-500 mt-1">
								{`Discount: ${bag?.Coupon?.CouponType === "Price" ? "₹" : ""} ${bag?.Coupon?.Discount} ${bag?.Coupon?.CouponType === "Percentage" ? "%" : ""}`}
								</span>
							</div>
						) : (
							<Fragment>
								<span>No Coupon Applied</span>
							</Fragment>
						)}
					</span>
					</div>

				{convenienceFees && <div className="flex justify-between text-sm sm:text-base text-gray-700 mb-5">
					<span>Convenience Fee</span>
					<span className={`${bag?.Coupon?.FreeShipping ? "line-through text-gray-400" : "text-gray-700"}`}>
						₹{convenienceFees}
					</span>
				</div>} 
				<div className="flex justify-between space-x-4 rounded-xl py-4 bg-white text-gray-900 text-xl sm:text-2xl font-semibold transition-colors">
					<span>Total</span>
					<span>₹ {formattedSalePrice(bag?.totalProductSellingPrice || totalProductSellingPrice)}</span>
				</div>
				<div className="flex flex-col space-y-4 mt-6">
					<button
						// disabled ={showPayment || !selectedAddress}
						onClick={()=> {
							if(user){
								if(selectedAddress){
									setShowPayment(true);
								}else{
									checkAndCreateToast("error","Please select an address")
								}
							}else{
								navigate("/Login")
							}
						}}
						className={`w-full bg-black hover:bg-gray-900 focus:bg-gray-600 text-white py-3 rounded-lg shadow-lg justify-center items-center flex transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base`}
					>
						{
							selectedAddress ? <Fragment>
								{showPayment ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>:<span>
										{user ? "Process Payment":"Login"}
									</span>
								}
							</Fragment>:(
								<span>
									{user ? "Process Payment":"Log In"}
								</span>
							)
						}
					</button>
				</div>
			</div>
		</div>

	);
}


const ProductListingComponent = ({ bag, updateQty, handleDeleteBag,user,setCoupon,applyCoupon,coupon }) => (
	<div className="flex-1 font-kumbsan space-y-6">
		{bag?.orderItems?.map((item, i) => {
			const active = item;
			const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
			const isValidImage = (url) => {
				return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
			};
			const getImageExtensionsFile = () => {
				
				// Find the first valid image URL based on extensions
				return active?.color?.images.find((image) => 
				  	image.url && isValidImage(image.url)
				);
			};
			const validImage = getImageExtensionsFile();
			return(
				<div key={i} className="relative flex flex-col sm:flex-row items-center border-b py-6 space-y-6 sm:space-y-0 sm:space-x-6">
					{/* Product Image */}
					<div className="w-fit h-28 sm:w-40 sm:h-40 relative border-2 rounded-lg">
						<Link to={`/products/${active.productId?._id}`}>
							{validImage ? <img 
								src={validImage?.url} 
								alt={active?.productId?.title} 
								className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
							/>:<p>No valid image available</p>}
						</Link>
						{/* Delete Button on the Image (visible on small screens only) */}
						<div
							className="absolute top-[-10px] right-[-10px] text-white bg-gray-200 p-1 Hover:text-black rounded-full cursor-pointer sm:hidden"
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteBag(active.productId._id, active._id);
							}}
						>
							<X size={15} />
						</div>
						</div>
					
						{/* Product Info */}
						<div className="ml-6 flex-1 w-full">
						<h3 className="font-semibold text-lg text-gray-800">{active?.productId?.title}</h3>
						<p className="text-sm text-gray-600">Size: {active?.size?.label}</p>
					
						{/* Price and Discount Info */}
						<div className="flex items-center whitespace-nowrap space-x-4 text-sm text-blue-400 mt-2">
							{active?.productId?.salePrice ? (
								<Fragment>
									<span>₹ {formattedSalePrice(active?.productId?.salePrice)}</span>
									<span className="line-through whitespace-nowrap text-gray-400">₹{formattedSalePrice(active.productId.price)}</span>
									<span className="text-gray-700 whitespace-nowrap font-normal">
									(₹{calculateDiscountPercentage(active.productId?.price, active.productId?.salePrice)}% OFF)
									</span>
								</Fragment>
							) : (
								<span>₹ {formattedSalePrice(active?.productId?.price)}</span>
							)}
						</div>
					
						{/* Quantity Selector */}
						<div className="mt-4 flex w-fit items-center space-x-4 shadow-md justify-between rounded-full p-3">
							<div className="flex items-center space-x-2 justify-between">
								{/* Decrease Button */}
								<button
									onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active.productId._id)}
									className="h-10 w-10 px-2 rounded-full disabled:text-gray-300"
									disabled={active?.quantity <= 1}
								>
								<Minus/>
								</button>
								
								{/* Display Current Quantity */}
								<span className="text-sm">{active?.quantity}</span>
								
								{/* Increase Button */}
								<button
									onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active.productId._id)}
									className="h-10 w-10 px-2 rounded-full disabled:text-gray-300"
									disabled={active?.quantity >= active?.size?.quantity}
								>
								<Plus/>
								</button>
							</div>
						</div>
					</div>
				
					{/* Delete Button for larger screens */}
					<X
					className="text-xl text-gray-700 hover:text-gray-500 cursor-pointer sm:block hidden mt-4 sm:mt-0"
					onClick={(e) => handleDeleteBag(active.productId._id, active._id)}
					/>
				</div>
			)
		})}

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
					placeholder="Add Voucher Code."
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
		<HorizontalScrollingCouponDisplay user={user} />
	</div>

);
const AddAddress = ({onSave }) => {
    const [formInitState, setFormInitState] = useState(null);
    const [newAddress, setNewAddress] = useState({});
    const { formData } = useSelector(state => state.fetchFormBanners);
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    // Handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        if (Object.values(newAddress).every(value => value.trim() !== '')) {
            onSave(newAddress);
            setNewAddress(formInitState || {}); // Reset form
            // onClose(); // Close modal
            setError(''); // Clear any previous errors
        } else {
            setError('Please fill out all the fields.');
        }
    };

    const handleFormInit = () => {
        if (formData) {
            const formInit = {};
            formData.forEach(item => {
                // Remove spaces from the key (item)
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
		<div>
			<h2 className="text-xl font-semibold mb-4 text-center">Add New Address</h2>
			<form className="space-y-4 flex flex-col">
				{formData && formData.map((item, index) => (
					<Fragment key={index}>
						<div className="flex flex-col">
							<FormControl fullWidth error={error}>
								<label className="text-sm font-medium">{item}*</label>
								<input
									type="text"
									value={newAddress[removeSpaces(item)] || ''}
									id={removeSpaces(item)}
									name={removeSpaces(item)}
									onChange={handleChange}
									className="border p-2 rounded-md mt-1"
									required
									placeholder={`Enter ${removeSpaces(item)}`}
								/>
								{error && (
									<FormHelperText>{error}</FormHelperText>
								)}
							</FormControl>
						</div>
					</Fragment>
				))}
			</form>
			{
				formData && formData.length > 0 && <div className="flex justify-end mt-4 space-x-2">
					<button
						disabled = {Object.values(newAddress).every(value => value.trim() === '')}
						onClick={handleSave}
						color="primary"
						className={`px-4 py-2 w-full bg-black rounded-md hover:bg-gray-700 text-white disabled:bg-gray-600`}
					>
						Save
					</button>
				</div>
			}
		</div>
    );
};

export default CheckoutPage;
