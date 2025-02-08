import React, { Fragment, useEffect, useState } from 'react';
import { useSessionStorage } from '../../Contaxt/SessionStorageContext';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { applyCouponToBag, deleteBag, getbag, getqtyupdate, removeCouponFromBag } from '../../action/orderaction';
import { getAddress, getConvinceFees, getuser, updateAddress } from '../../action/useraction';
import { getRandomArrayOfProducts } from '../../action/productaction';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import axios from 'axios';
import { BASE_API_URL, calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice, headerConfig } from '../../config';
import CouponsDisplay from './CouponDisplay';
import { X } from 'lucide-react';
import HorizontalScrollingCouponDisplay from './HorizontalScrollingCouponDisplay';

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
			if(sessionBagData){
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
				setDiscountAmount(totalDiscount || 0);
				setTotalMRP(totalMRP);
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
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [country, setCountry] = useState('');
	const [state, setState] = useState('');
	const [city, setCity] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');

	return (
		<div className="w-full max-w-screen-xl mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
			
			<div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 2xl:grid-cols-2 xl:grid-cols-2 gap-8">
				{/* Left Side: Address and Payment */}
				<div className="lg:col-span-1 space-y-8">
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
				<section className="flex flex-col ">
					<div>
					<h3 className="text-xl font-semibold mb-4">Your Information</h3>
					<form>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* First Name */}
							<div className="flex flex-col">
								<label className="text-sm font-medium">First Name*</label>
								<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="border p-2 rounded-md mt-1"
								required
								/>
							</div>
							{/* Last Name */}
							<div className="flex flex-col">
								<label className="text-sm font-medium">Last Name*</label>
								<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="border p-2 rounded-md mt-1"
								required
								/>
							</div>
							{/* Email */}
							<div className="flex flex-col col-span-2">
								<label className="text-sm font-medium">Email Address*</label>
								<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="border p-2 rounded-md mt-1"
								required
								/>
							</div>
							{/* Phone Number */}
							<div className="flex flex-col col-span-2">
								<label className="text-sm font-medium">Phone Number*</label>
								<input
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="border p-2 rounded-md mt-1"
								required
								/>
						</div>
						{/* Street Address */}
						<div className="flex flex-col col-span-2">
							<label className="text-sm font-medium">Street Address*</label>
							<input
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className="border p-2 rounded-md mt-1"
							required
							/>
						</div>
						{/* Town/City and State */}
						<div className="flex flex-col sm:flex-row col-span-2 gap-6">
							<div className="flex flex-col w-full">
							<label className="text-sm font-medium">Town/City*</label>
							<input
								type="text"
								value={city}
								onChange={(e) => setCity(e.target.value)}
								className="border p-2 rounded-md mt-1"
								required
							/>
							</div>
							<div className="flex flex-col w-full">
							<label className="text-sm font-medium">State*</label>
							<input
								type="text"
								value={state}
								onChange={(e) => setState(e.target.value)}
								className="border p-2 rounded-md mt-1"
								required
							/>
							</div>
						</div>
						{/* Postal Code */}
						<div className="flex flex-col col-span-2">
							<label className="text-sm font-medium">Postal Code*</label>
							<input
							type="text"
							className="border p-2 rounded-md mt-1"
							required
							/>
						</div>
						{/* Note */}
						<div className="flex flex-col col-span-2">
							<label className="text-sm font-medium">Write note...</label>
							<textarea
							className="border p-2 rounded-md mt-1"
							rows="4"
							/>
						</div>
						</div>
					</form>
					</div>
				</section>
				</div>

				{/* Right Side: Shopping Cart */}
				<div className="lg:col-span-1">
				<h3 className="text-xl font-semibold mb-4">Shopping Cart</h3>
				<ProductListingComponent
					bag={bag}
					handleDeleteBag={handleDeleteBag}
					user={user}
					setCoupon={setCoupon}
					applyCoupon={applyCoupon}
					coupon={coupon}
				/>
				</div>
			</div>
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
							className={`p-4 border rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 ${selectedAddress === addr ? 'bg-gray-500 text-white' : 'bg-white hover:bg-gray-100'}`}
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
const ProductListingComponent = ({ bag, updateQty, handleDeleteBag,user,setCoupon,applyCoupon,coupon }) => (
	<div className="flex-1 font-kumbsan space-y-6">
		{bag?.orderItems?.map((item, i) => (
			<div key={i} className="relative flex flex-col sm:flex-row items-center border-b py-6 space-y-6 sm:space-y-0 sm:space-x-6">
				{/* Product Image */}
				<div className="w-fit h-28 sm:w-40 sm:h-40 relative border-2 rounded-lg">
				<Link to={`/products/${item.productId?._id}`}>
					<img
						src={item?.color?.images[0]?.url}
						alt={item?.productId?.title}
						className="w-full h-full object-contain"
					/>
				</Link>
				{/* Delete Button on the Image (visible on small screens only) */}
				<div
					className="absolute top-[-10px] right-[-10px] text-white bg-gray-200 p-1 Hover:text-black rounded-full cursor-pointer sm:hidden"
					onClick={(e) => {
						e.stopPropagation();
						handleDeleteBag(item.productId._id, item._id);
					}}
				>
					<X size={15} />
				</div>
				</div>
			
				{/* Product Info */}
				<div className="ml-6 flex-1 w-full">
				<h3 className="font-semibold text-lg text-gray-800">{item?.productId?.title}</h3>
				<p className="text-sm text-gray-600">Size: {item?.size?.label}</p>
			
				{/* Price and Discount Info */}
				<div className="flex items-center whitespace-nowrap space-x-4 text-sm text-blue-400 mt-2">
					{item?.productId?.salePrice ? (
					<>
						<span>₹ {formattedSalePrice(item?.productId?.salePrice)}</span>
						<span className="line-through whitespace-nowrap text-gray-400">₹{formattedSalePrice(item.productId.price)}</span>
						<span className="text-gray-700 whitespace-nowrap font-normal">
						(₹{calculateDiscountPercentage(item.productId?.price, item.productId?.salePrice)}% OFF)
						</span>
					</>
					) : (
					<span>₹ {formattedSalePrice(item?.productId?.price)}</span>
					)}
				</div>
			
				{/* Quantity Selector */}
				<div className="mt-4 flex items-center space-x-4">
					<label className="text-sm">Qty:</label>
					<select
					value={item?.quantity}
					onChange={(e) => updateQty(e, item.productId._id)}
					className="h-10 w-16 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
					{[...Array(item?.size?.quantity || 0).keys()].map((num) => (
						<option key={num + 1} value={num + 1}>
						{num + 1}
						</option>
					))}
					</select>
				</div>
				</div>
			
				{/* Delete Button for larger screens */}
				<X
				className="text-xl text-gray-700 hover:text-gray-500 cursor-pointer sm:block hidden mt-4 sm:mt-0"
				onClick={(e) => handleDeleteBag(item.productId._id, item._id)}
				/>
			</div>
		  
		  
		))}

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

export default CheckoutPage;
