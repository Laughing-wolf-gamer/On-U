import React, { Fragment, useState } from 'react'
import EmptyBag from './Emptybag';
import { calculateDiscountPercentage, formattedSalePrice } from '../../config';
import { Minus, Plus, Trash, X } from 'lucide-react';
import { BsCurrencyRupee, BsShieldFillCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import CouponsDisplay from './CouponDisplay';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { applyCouponToBag, removeCouponFromBag } from '../../action/orderaction';
import { useDispatch } from 'react-redux';

const OfflineBagContent = ({ 
	bag,
	sessionBagData, 
	showPayment, 
	totalGst,
	selectedAddress, 
	bagLoading, 
	totalSellingPrice, 
	discountedAmount, 
	totalProductSellingPrice, 
	convenienceFees, 
	navigation, 
	handleDeleteBag, 
	updateQty,
	updateChecked,
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
							updateChecked = {updateChecked}
							handleDeleteBag={handleDeleteBag}
						/>
						<PriceDetails
							sessionBagData={sessionBagData}
							bag={bag}
							totalGst = {totalGst}
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
				<span className={`font-semibold text-lg ${!showPayment ? "text-gray-800" : "text-gray-400"}`}>BAG</span>
				<span className="text-gray-400">|</span>
				<span className={`font-semibold text-lg ${!showPayment && selectedAddress ? "text-gray-800" : "text-gray-400"}`}>ADDRESS</span>
				<span className="text-gray-400">|</span>
				<span className={`font-semibold text-lg ${showPayment && selectedAddress ? "text-gray-800" : "text-gray-400"}`}>PAYMENT</span>
			</div>
			<div className="flex items-center space-x-3">
				<BsShieldFillCheck className="text-blue-600 text-2xl" />
				<span className="text-xs text-gray-600">100% SECURE</span>
			</div>
		</div>
	);
}

// ProductListing Component
const ProductListing = ({ sessionBagData, updateQty,updateChecked, handleDeleteBag,setCoupon,applyCoupon,coupon  }) => {
	return (
		<div className="flex-1 space-y-6 max-h-[700px]">
			<div className="flex-1 space-y-6 max-h-[400px] overflow-y-auto">
				{sessionBagData.map((item, i) => {
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
						<div key={i} className="relative flex flex-row w-full items-center justify-between border-b py-6 space-y-6 sm:space-y-0 sm:space-x-6">
							<div className="relative flex-row flex border-2 rounded-lg flex-shrink-0 w-20 sm:w-36 h-28 sm:h-36">
								<div className='w-fit flex flex-row justify-start items-start space-x-4'>
									{/* Product Image */}
									<div className="w-20 sm:w-36 h-28 sm:h-36 relative bg-black border-2 rounded-lg flex-shrink-0">
										<Link to={`/products/${active?.ProductData?._id}`} className="block bg-black w-full h-full">
											<div className="relative w-full h-full">
												<img
													src={validImage?.url}
													alt={active?.ProductData?.shortTitle}
													className="object-cover w-full h-full bg-gray-50 transition-all duration-500 ease-in-out hover:scale-105"
												/>
												<div onClick={(e) => {
													updateChecked(e, active.ProductData?._id);
												}} className="absolute top-2 left-2 w-5 h-5">
													<input
														type="checkbox"
														className="w-full h-full cursor-pointer"
														checked={active?.isChecked} // Set checkbox checked if it's selected in the URL
														onChange={(e) => {}}
													/>
												</div>
											</div>
										</Link>

										{/* Delete Button on the Image (Mobile) */}
										<div
											className="absolute top-[-10px] right-[-10px] text-white bg-black p-1 rounded-full cursor-pointer sm:hidden"
											onClick={(e) => {
												e.stopPropagation();
												handleDeleteBag(active.ProductData._id, active._id);
											}}
										>
											<Trash size={15} />
										</div>
									</div>

									{/* Product Details */}
									<div className="flex-1 space-y-2 text-left whitespace-nowrap sm:text-left px-2">
										<h3 className="font-semibold text-sm sm:text-lg lg:text-xl text-gray-800">{active?.ProductData?.title}</h3>
										<p className="text-xs sm:text-sm lg:text-base text-gray-600">Size: {active?.size?.label}</p>

										{/* Price and Discount Info */}
										<div className="flex items-center justify-center sm:justify-start space-x-4 text-xs sm:text-sm lg:text-base text-blue-500 mt-2">
											{active?.ProductData?.salePrice ? (
												<Fragment>
													<span>₹{Math.round(formattedSalePrice(active?.ProductData?.salePrice))}</span>
													<span className="line-through text-gray-400">₹{Math.round(formattedSalePrice(active.ProductData.price))}</span>
													<span className="text-gray-700">({calculateDiscountPercentage(active.ProductData?.price, active.ProductData?.salePrice)}% OFF)</span>
												</Fragment>
											) : (
												<span>₹ {Math.round(formattedSalePrice(active.ProductData.price))}</span>
											)}
										</div>

										{/* Quantity Selector */}
										<div className="mt-4 w-fit flex flex-row items-center justify-center space-x-1 shadow-md rounded-full border-gray-700 border">
											<button
												onClick={() => updateQty({ target: { value: Math.max(active?.quantity - 1, 1) } }, active.ProductData._id)}
												className="p-2 rounded-full text-sm sm:text-base disabled:text-gray-300"
												disabled={active?.quantity <= 1}
											>
												<Minus className=' justify-self-center' strokeWidth={3} />
											</button>

											<span className="text-sm sm:text-base lg:text-lg">{active?.quantity}</span>

											<button
												onClick={() => updateQty({ target: { value: active?.quantity + 1 } }, active.ProductData._id)}
												className="p-2 rounded-full text-sm sm:text-base disabled:text-gray-300"
												disabled={active?.quantity >= active?.size?.quantity}
											>
												<Plus className=' justify-self-center' strokeWidth={3} />
											</button>
										</div>
									</div>
								</div>
							</div>
							{/* Delete Button (Large Screens) */}
							<Trash
								className="text-xl text-gray-700 hover:text-gray-500 cursor-pointer sm:block hidden mt-4 sm:mt-0"
								onClick={(e) => {
									handleDeleteBag(active.ProductData._id, active._id);
								}}
							/>
						</div>
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
			</div>
			<CouponsDisplay />
		</div>

	);
}

// PriceDetails Component
const PriceDetails = ({ sessionBagData, bag,totalGst, totalSellingPrice, discountedAmount, totalProductSellingPrice, convenienceFees, navigation }) => {
	console.log("Converenece Fees: ", convenienceFees);
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
				{/* <div className="flex justify-between text-sm text-gray-700 border-b border-gray-300 pb-2">
					<span>Total GST</span>
					<span>+ {Math.round(totalGst)} %</span>
				</div> */}
				<div className="flex justify-between text-sm text-gray-700 border-b border-gray-300 pb-2">
					<span>Saved</span>
					<span>₹{Math.round(bag?.totalDiscount || discountedAmount)}</span>
				</div>

				{/* Convenience Fee Section */}
				<div className="flex justify-between text-sm text-gray-700 border-b border-gray-300 pb-2 mb-5">
					<span>Convenience Fee</span>
					<span className={`${bag?.Coupon?.FreeShipping ? "line-through text-gray-400" : "text-gray-700"}`}>
						{convenienceFees <= 0 ? "Free" : `₹${formattedSalePrice(convenienceFees)}`}
					</span>
				</div>

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