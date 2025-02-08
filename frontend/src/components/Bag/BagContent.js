import React, { Fragment } from 'react';
import EmptyBag from './Emptybag';
import { BsShieldFillCheck } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { getbag } from '../../action/orderaction';
import { getAddress } from '../../action/useraction';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { calculateDiscountPercentage, capitalizeFirstLetterOfEachWord, formattedSalePrice } from '../../config';
import AddAddressPopup from './AddAddressPopup';
import PaymentProcessingPage from '../Payments/PaymentProcessingPage';
const BagContent = ({ 
	bag, 
	bagLoading, 
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
	return (
		<div className="relative font-kumbsan w-full px-10 mx-auto">
			{/* Conditionally render the bag content based on loading state and items */}
			{!bagLoading && bag?.orderItems?.length > 0 ? (
				<Fragment>
					{/* Navigation Section */}
					<NavigationComponent showPayment={showPayment} selectedAddress={selectedAddress} />
		
					{/* Main Content Section */}
					<div className="flex flex-col lg:flex-row gap-12 mt-12">
					<ProductListingComponent bag={bag} updateQty={updateQty} handleDeleteBag={handleDeleteBag} />
		
					{/* Price Details */}
					<PriceDetailsComponent 
						bag={bag} 
						totalSellingPrice={totalSellingPrice} 
						discountedAmount={discountedAmount} 
						convenienceFees={convenienceFees} 
						totalProductSellingPrice={totalProductSellingPrice}
					/>
					</div>
		
					{/* Address and Payment Section */}
					<AddressAndPaymentComponent 
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
					/>
					
					{/* Add Address Popup */}
					<AddAddressPopup
						isOpen={isAddressPopupOpen}
						onClose={handleClosePopup}
						onSave={handleSaveAddress}
					/>
				</Fragment>
			) : (
				<Fragment>
					{bagLoading ? <SkeletonLoader /> : 
						<div className="min-h-screen flex justify-center items-center bg-slate-100">
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
const ProductListingComponent = ({ bag, updateQty, handleDeleteBag }) => (
	<div className="flex-1 font-kumbsan space-y-6">
		{bag?.orderItems?.map((item, i) => (
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
						<span className="line-through text-[#94969f]">₹{formattedSalePrice(item.productId.price)}</span>
						<span className="text-[#f26a10] font-normal">(₹{calculateDiscountPercentage(item.productId?.price, item.productId?.salePrice)}% OFF)</span>
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
				onClick={(e) => handleDeleteBag(item.productId._id, item._id)}
			/>
			</div>
		))}
	</div>
);
const PriceDetailsComponent = ({ bag, totalSellingPrice, discountedAmount, convenienceFees, totalProductSellingPrice }) => (
	<div className="w-full font-kumbsan lg:w-1/3 bg-gray-50 p-8 rounded-lg shadow-md">
	  <h3 className="font-semibold text-xl text-gray-800 mb-6">PRICE DETAILS ({bag?.orderItems.length} items)</h3>
	  <div className="space-y-5">
		<div className="flex justify-between text-sm text-gray-700">
		  <span>Total MRP</span>
		  <span>₹{formattedSalePrice(bag?.totalMRP || totalSellingPrice)}</span>
		</div>
		<div className="flex justify-between text-sm text-gray-700">
		  <span>You Saved</span>
		  <span>₹{formattedSalePrice(bag?.totalDiscount || discountedAmount)}</span>
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
		  <span>₹ {formattedSalePrice(bag?.totalProductSellingPrice || totalProductSellingPrice)}</span>
		</div>
	  </div>
	</div>
);
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