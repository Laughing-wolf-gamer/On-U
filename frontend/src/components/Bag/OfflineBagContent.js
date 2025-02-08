import React, { Fragment, useState } from 'react'
import EmptyBag from './Emptybag';
import { calculateDiscountPercentage, formattedSalePrice } from '../../config';
import { X } from 'lucide-react';
import { BsShieldFillCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import CouponsDisplay from './CouponDisplay';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { applyCouponToBag, removeCouponFromBag } from '../../action/orderaction';
import { useDispatch } from 'react-redux';

const OfflineBagContent = ({ 
	bag,
	sessionBagData, 
	showPayment, 
	selectedAddress, 
	bagLoading, 
	totalSellingPrice, 
	discountedAmount, 
	totalProductSellingPrice, 
	convenienceFees, 
	navigation, 
	handleDeleteBag, 
	updateQty,
}) => {
	console.log("discountedAmount: ",discountedAmount);
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
	return(
		<div className="relative w-full px-10 mx-auto">
			
			{sessionBagData && sessionBagData.length > 0 ? (
				<div>
					<NavigationBar showPayment={showPayment} selectedAddress={selectedAddress} />
					<div className="flex flex-col lg:flex-row gap-12 mt-12">
					<ProductListing
						sessionBagData={sessionBagData}
						updateQty={updateQty}
						handleDeleteBag={handleDeleteBag}
					/>
					<PriceDetails
						sessionBagData={sessionBagData}
						bag={bag}
						totalSellingPrice={totalSellingPrice}
						discountedAmount={discountedAmount}
						totalProductSellingPrice={totalProductSellingPrice}
						convenienceFees={convenienceFees}
						navigation={navigation}
					/>
				</div>
				</div>
			) : (
				<Fragment>
					{bagLoading ? (
						<SkeletonLoader />
					) : (
						<div className="min-h-screen flex justify-center items-center">
							<EmptyBag />
						</div>
					)}
				</Fragment>
			)}
		</div>
	)
}

// NavigationBar Component
const NavigationBar = ({ showPayment, selectedAddress }) => {
	return (
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
	);
}

// ProductListing Component
const ProductListing = ({ sessionBagData, updateQty, handleDeleteBag,setCoupon,applyCoupon,coupon  }) => {
	return (
		<div className="flex-1 space-y-6">
			{sessionBagData.map((item, i) => {
				const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
				const isValidImage = (url) => {
					return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
				};
				const getImageExtensionsFile = () => {
					
					// Find the first valid image URL based on extensions
					return item?.color?.images.find((image) => 
						image.url && isValidImage(image.url)
					);
				};
				const validImage = getImageExtensionsFile();
				return(
					(
						<div key={i} className="flex flex-col sm:flex-row items-center border-b py-6 space-y-4 sm:space-x-8 sm:space-y-0">
							{/* Product Image */}
							<div className="w-28 h-28">
								<Link to={`/products/${item.ProductData?._id}`} className="block w-full h-full">
									<img
                                        src={validImage?.url}
                                        alt={item?.ProductData?.title}
                                        className="object-contain w-full h-full bg-gray-50 transition-all duration-500 ease-in-out hover:scale-105"
                                    />
								</Link>
							</div>
		
							{/* Product Details */}
							<div className="flex-1 space-y-2">
								<h3 className="font-semibold text-sm sm:text-lg text-gray-800">{item?.ProductData?.title}</h3>
								<p className="text-xs sm:text-sm text-gray-600">Size: {item?.size?.label}</p>
								<div className="flex items-center space-x-4 text-xs sm:text-sm text-blue-500 mt-2">
									{item?.ProductData?.salePrice ? (
										<Fragment>
											<span>₹{Math.round(formattedSalePrice(item?.ProductData?.salePrice))}</span>
											<span className="line-through text-gray-400">₹{Math.round(formattedSalePrice(item.ProductData.price))}</span>
											<span className="text-gray-700">({calculateDiscountPercentage(item.ProductData?.price, item.ProductData?.salePrice)}% OFF)</span>
										</Fragment>
									) : (
										<span>₹ {Math.round(formattedSalePrice(item.ProductData.price))}</span>
									)}
								</div>
		
								{/* Quantity Selector */}
								<div className="mt-4 flex items-center space-x-4">
									<label className="text-xs sm:text-sm">Qty:</label>
									<select
										value={item?.quantity}
										onChange={(e) => updateQty(e, item.ProductData._id)}
										className="h-10 w-16 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
									>
										{[...Array(item?.size?.quantity || 0).keys()].map((num) => (
											<option key={num + 1} value={num + 1}>{num + 1}</option>
										))}
									</select>
								</div>
							</div>
		
							{/* Delete Button */}
							<X
								className="text-xl text-gray-700 hover:text-gray-500 cursor-pointer mt-4 sm:mt-0"
								onClick={(e) => {
									handleDeleteBag(item.ProductData._id, item._id);
								}}
							/>
						</div>
					)
				)
			})}

			{/* Coupon Section */}
			{/* <div className="mt-6 space-y-2">
				<label className="block text-xs sm:text-sm md:text-base font-semibold">Have a coupon?</label>
				<div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-2 sm:space-y-0">
					<input
						type="text"
						value={coupon}
						onChange={(e) => setCoupon(e.target.value)}
						className="w-full h-12 border border-gray-300 bg-gray-50 text-black rounded-md px-2 focus:ring-black text-sm sm:text-base"
						placeholder="Add Voucher Code."
					/>
					<button
						onClick={applyCoupon}
						className="w-full sm:w-[20%] h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-black"
					>
						<span className="whitespace-nowrap text-[10px] sm:text-sm md:text-base text-center">Apply Coupon</span>
					</button>
				</div>
			</div> */}

			{/* Coupons Display */}
			<CouponsDisplay />
		</div>

	);
}

// PriceDetails Component
const PriceDetails = ({ sessionBagData, bag, totalSellingPrice, discountedAmount, totalProductSellingPrice, convenienceFees, navigation }) => {
	return(
		<div className="w-full h-fit lg:w-1/3 bg-gray-100 p-8 shadow-md">
			<h3 className="font-semibold text-xl text-gray-800 mb-6">ORDER DETAILS ({sessionBagData.length} items)</h3>
			<div className="space-y-5">
				{/* Total MRP Section */}
				<div className="flex justify-between text-sm text-gray-700 border-b border-gray-300 pb-2">
					<span>Total MRP</span>
					<span>₹{formattedSalePrice(bag?.totalMRP || totalSellingPrice)}</span>
				</div>

				{/* Saved Section */}
				<div className="flex justify-between text-sm text-gray-700 border-b border-gray-300 pb-2">
					<span>Saved</span>
					<span>₹{Math.round(bag?.totalDiscount || discountedAmount)}</span>
				</div>

				{/* Convenience Fee Section */}
				{convenienceFees && (
					<div className="flex justify-between text-sm text-gray-700 border-b border-gray-300 pb-2 mb-5">
						<span>Convenience Fee</span>
						<span className={`${bag?.Coupon?.FreeShipping ? "line-through text-gray-400" : "text-gray-700"}`}>
							₹{convenienceFees}
						</span>
					</div>
				)}

				{/* Total Section */}
				<div className="flex justify-between font-semibold text-xl text-gray-900">
					<span>Total</span>
					<span>₹{Math.round(totalProductSellingPrice)}</span>
				</div>
			</div>

			<br/>
			<div className="mt-6">
				<button
					onClick={() => navigation("/Login")}
					className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-sm sm:text-base"
				>
					Process To Checkout
				</button>
			</div>
		</div>
	)
}
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

export default OfflineBagContent