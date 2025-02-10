import React, { Fragment, useState } from 'react';
import EmptyBag from './Emptybag';
import { BsShieldFillCheck } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { applyCouponToBag, getbag, removeCouponFromBag } from '../../action/orderaction';
import { getAddress } from '../../action/useraction';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash, X } from 'lucide-react';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice } from '../../config';
import AddAddressPopup from './AddAddressPopup';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import CouponsDisplay from './CouponDisplay';
const BagContent = ({ 
	bag, 
	bagLoading, 
	totalGst,
	totalSellingPrice, 
	discountedAmount, 
	convenienceFees, 
	user, 
	showPayment, 
	selectedAddress, 
	handleProceedToPayment, 
	handleOpenPopup, 
	handleClosePopup, 
	isAddressPopupOpen, 
	handleSaveAddress, 
	setShowPayment, 
	setSelectedAddress,
	totalProductSellingPrice,
	updateQty,
	handleDeleteBag,
	allAddresses,
	buttonPressed,
	handleAddressSelection
}) => {
	const dispatch = useDispatch();
	const [coupon, setCoupon] = useState(null);
	const [discount, setDiscount] = useState(0);
	const {checkAndCreateToast} = useSettingsContext();
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
		<div className="relative font-kumbsan w-full px-10 mx-auto">
			{/* Conditionally render the bag content based on loading state and items */}
			{!bagLoading && bag?.orderItems?.length > 0 ? (
				<Fragment>
					{/* Navigation Section */}
					<NavigationComponent showPayment={showPayment} selectedAddress={selectedAddress} />
		
					{/* Main Content Section */}
					<div className="flex flex-col lg:flex-row gap-12 mt-12">
						<ProductListingComponent 
							bag={bag} 
							updateQty={updateQty} 
							handleDeleteBag={handleDeleteBag} 
							applyCoupon={applyCoupon}
							user={user}
							setCoupon={setCoupon}
							coupon={coupon}
						/>
			
						{/* Price Details */}
						<PriceDetailsComponent 
							bag={bag}
							totalGst = {totalGst}
							totalSellingPrice={totalSellingPrice} 
							discountedAmount={discountedAmount} 
							convenienceFees={convenienceFees} 
							totalProductSellingPrice={totalProductSellingPrice}
							removeCoupon = {removeCoupon}
						/>
					</div>
		
					{/* Address and Payment Section */}
					{/* <AddressAndPaymentComponent 
						totalProductSellingPrice = {totalProductSellingPrice}
						buttonPressed = {buttonPressed}
						allAddresses={allAddresses}
						handleProceedToPayment={handleProceedToPayment} 
						handleOpenPopup={handleOpenPopup} 
						handleClosePopup={handleClosePopup} 
						selectedAddress={selectedAddress} 
						isAddressPopupOpen={isAddressPopupOpen} 
						handleSaveAddress={handleSaveAddress}
						user={user}
						handleAddressSelection = {handleAddressSelection}
					/> */}
					
					{/* Add Address Popup */}
					{/* <AddAddressPopup
						isOpen={isAddressPopupOpen}
						onClose={handleClosePopup}
						onSave={handleSaveAddress}
					/> */}
				</Fragment>
			) : (
				<Fragment>
					{bagLoading ? <SkeletonLoader /> : 
						<div className="min-h-screen flex justify-center items-center">
							<EmptyBag />
						</div>
					}
				</Fragment>
			)}
	
			{/* Payment Processing Page */}
			{user && showPayment && selectedAddress && bag && (
				<PaymentProcessingPage
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
		</div>
	);
};
const NavigationComponent = ({ showPayment, selectedAddress }) => (
	<div className="flex font-kumbsan flex-col md:flex-row justify-between items-center mt-6 gap-8">
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
);
const ProductListingComponent = ({ bag, updateQty, handleDeleteBag,user,setCoupon,applyCoupon,coupon }) => (
	<div className="flex-1 font-kumbsan space-y-6 border-r-[1px] border-r-gray-800 border-opacity-20 pr-5">
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
					<div className="w-fit h-28 sm:w-40 sm:h-40 relative bg-black border-2 rounded-lg">
						<Link Link to={`/products/${active.productId?._id}`}>
							{validImage ? <img 
								src={validImage?.url} 
								alt={active?.productId?.title} 
								className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
							/>:<p>No valid image available</p>}
							
						</Link>
						{/* Delete Button on the Image */}
						<div
							className="absolute top-[-10px] shadow-sm right-[-10px] text-white-700 bg-black p-1 text-white rounded-full cursor-pointer sm:hidden"
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteBag(active.productId._id, active._id)
							}}
						>
							<Trash size={15}/>
						</div>
					</div>
				
					{/* Product Info */}
					<div className="ml-6 flex-1 w-full justify-center items-start flex-col">
						<h3 className="font-semibold text-lg text-gray-800">{active?.productId?.title}</h3>
						<p className="text-sm text-gray-600">Size: {active?.size?.label}</p>
					
						{/* Price and Discount Info */}
						<div className="flex items-center space-x-4 text-sm text-blue-400 mt-2">
							{active?.productId?.salePrice ? (
								<Fragment>
									<span>₹ {formattedSalePrice(active?.productId?.salePrice)}</span>
									<span className="line-through text-gray-400">₹{formattedSalePrice(active.productId.price)}</span>
									<span className="text-gray-700 font-normal">(₹{calculateDiscountPercentage(active.productId?.price, active.productId?.salePrice)}% OFF)</span>
								</Fragment>
							) : (
								<span>₹ {formattedSalePrice(active?.productId?.price)}</span>
							)}
						</div>
					
						{/* Quantity Selector */}
						<div className="mt-4 flex w-fit items-center space-x-4 px-5 shadow-md justify-center rounded-full border-gray-700 border border-opacity-40 p-1">
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
					<Trash
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
					className="w-full sm:w-[20%] h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-black"
				>
					<span className="whitespace-nowrap text-[10px] sm:text-sm md:text-base text-center">Apply Coupon</span>
				</button>
			</div>
		</div>

		{/* Display Coupons */}
		<CouponsDisplay user={user} />
	</div>

);
const PriceDetailsComponent = ({ bag, totalSellingPrice,totalGst , discountedAmount, convenienceFees, totalProductSellingPrice,removeCoupon }) => {
	const navigation = useNavigate();
	return (
		<div className="w-full font-kumbsan lg:w-1/3 h-fit bg-gray-50 p-8 shadow-md">
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
					<span>+ {formattedSalePrice(bag?.totalGst || totalGst)}% </span>
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
								{/* Coupon and Remove Button */}
								<button 
									className="flex items-center space-x-1 text-xs sm:text-sm"
									onClick={(e) => removeCoupon(e, bag?.Coupon?.CouponCode)}
								>
									<X size={20} />
									<span className="text-sm">{bag?.Coupon?.CouponCode}</span>
								</button>
								{/* Discount Info */}
								<span className="text-xs sm:text-sm text-gray-500">
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
						onClick={()=> navigation('/bag/checkout')}
						className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
					>
						Proceed to Checkout
					</button>
				</div>
			</div>
		</div>

	);
}
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
	<div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-kumbsan">
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

				{/* Add New Address Button */}
				<div className="mt-4 flex justify-center items-center w-full">
					<button
						onClick={handleOpenPopup}
						className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
					>
						Add New Address
					</button>
				</div>
			</div>
		</div>

		{/* Payment Checkout Section */}
		<div className="mt-8 bg-white p-6 rounded-xl shadow-lg max-w-full transition-all duration-500 ease-in-out transform hover:scale-105">
			<h3 className="font-semibold text-2xl mb-8 text-center text-gray-900">Payment Checkout</h3>
			<div className="space-y-8">

				{/* Order Total */}
				<div className="flex justify-between items-center text-lg text-gray-700">
					<span>Order Total:</span>
					<span className="font-bold text-3xl text-indigo-600">₹ {formattedSalePrice(totalProductSellingPrice)}</span>
				</div>

				{/* Selected Address */}
				<div className="flex justify-between items-start text-sm text-gray-700">
				<span>Selected Address:</span>
				<div className="text-sm block">
					{selectedAddress
						? Object.keys(selectedAddress).slice(0, 4).map((key, index) => (
							<div key={index}>
								<strong className="text-gray-800">{capitalizeFirstLetterOfEachWord(key)}:</strong> {selectedAddress[key]}
							</div>
						))
					: <span className="italic text-gray-500">No address selected</span>
					}
				</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col space-y-4 mt-6">
					<button
						onClick={handleProceedToPayment}
						className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
					>
						Proceed to Payment
					</button>
				</div>
			</div>
		</div>
	</div>
);
  
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
export default BagContent;