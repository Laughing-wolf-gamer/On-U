import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { fetchAllCoupons } from '../../action/common.action';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HorizontalScrollingCouponDisplay = ({ user, showArrows }) => {
	const { AllCoupons, isLoading } = useSelector((state) => state.AllCoupons);
	const { checkAndCreateToast } = useSettingsContext();
	const dispatch = useDispatch();
	const navigation = useNavigate();
	const sliderRef = useRef(null);
  
	const [dragState, setDragState] = useState({
	  isDragging: false,
	  startX: 0,
	  startTouchX: 0,
	  scrollLeft: 0,
	});
  
	useEffect(() => {
	  // Fetch all coupons
	  const queryLink = ``;
	  dispatch(fetchAllCoupons(queryLink));
	}, [dispatch]);
  
	// Mouse Down, Mouse Move, Mouse Up Handlers
	const handleMouseDown = (e) => {
	  setDragState((prev) => ({
		...prev,
		isDragging: true,
		startX: e.clientX,
		scrollLeft: sliderRef.current.scrollLeft,
	  }));
	  e.preventDefault();
	};
  
	const handleMouseMove = (e) => {
	  if (!dragState.isDragging) return;
	  const moveX = e.clientX - dragState.startX;
	  sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
	};
  
	const handleMouseUp = () => setDragState((prev) => ({ ...prev, isDragging: false }));
	const handleMouseLeave = () => setDragState((prev) => ({ ...prev, isDragging: false }));
  
	// Touch Start, Touch Move, Touch End Handlers
	const handleTouchStart = (e) => {
	  setDragState((prev) => ({
		...prev,
		isDragging: true,
		startTouchX: e.touches[0].clientX,
		scrollLeft: sliderRef.current.scrollLeft,
	  }));
	};
  
	const handleTouchMove = (e) => {
	  if (!dragState.isDragging) return;
	  const moveX = e.touches[0].clientX - dragState.startTouchX;
	  sliderRef.current.scrollLeft = dragState.scrollLeft - moveX;
	};
  
	const handleTouchEnd = () => setDragState((prev) => ({ ...prev, isDragging: false }));
  
	// Scroll functionality for left and right arrows
	const scroll = (direction) => {
	  const slider = sliderRef.current;
	  const scrollAmount = 400; // Amount to scroll with each button click
	  slider.scrollTo({
		left: slider.scrollLeft + direction * scrollAmount,
		behavior: 'smooth', // This makes the scroll smooth
	  });
	};
  
	const handleImageClick = (e) => {
	  /* e.preventDefault();
	  if (!dragState.isDragging) {
		navigation('/products');
	  } */
	};
  
	return (
		<div className="w-full font-kumbsan max-w-screen-md mx-auto justify-self-center">
			<div className="grid grid-cols-1 min-h-[280px] relative px-1">	
			<div className="relative w-full flex justify-start items-center">
				{/* Left and Right Arrow Buttons */}
				{showArrows && (
					<Fragment>
						<button
						onClick={() => scroll(-1)}
						className="absolute h-[40%] left-4 rounded-md top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-500 hover:scale-110 opacity-90 hover:opacity-100 z-10 hover:border bg-transparent"
						>
						<ChevronLeft size={40} />
						</button>
		
						<button
						onClick={() => scroll(1)}
						className="absolute h-[40%] right-4 rounded-md top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-500 hover:scale-110 opacity-90 hover:opacity-100 z-10 hover:border bg-transparent"
						>
							<ChevronRight size={40} />
						</button>
					</Fragment>
				)}
	
				{/* Slider Container to hide overflow items */}
				<div className="w-full overflow-hidden">
					<ul
						ref={sliderRef}
						className="flex space-x-6 overflow-x-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseLeave}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						{!AllCoupons || AllCoupons.length <= 0 ? (
							Array(10)
								.fill(0)
								.map((_, index) => (
									<div
										key={`skeleton_${index}`}
										className="min-h-[200px] min-w-[200px] transform transition-transform duration-500 ease-in-out rounded-lg animate-pulse"
									>
										<div className="min-h-52 w-96 bg-gray-900 rounded-md"></div>
									</div>
								))
							) : (
								AllCoupons.map((coupon, index) => (
									<div
										key={`q_banners_${index}`}
										onClick={handleImageClick}
										className="min-h-fit transform transition-transform duration-500 ease-in-out hover:scale-105"
									>
									<CouponCard coupon={coupon} checkAndCreateToast={checkAndCreateToast} />
									</div>
								))
							)}
					</ul>
				</div>
			</div>
			</div>
		</div>
	);
};


{/* <div className="w-full overflow-x-auto">
				<div className="flex space-x-6">
					{AllCoupons && AllCoupons.length > 0 ? (
						AllCoupons.map((coupon, index) => (
						<CouponCard
							key={coupon._id || index}
							coupon={coupon}
							checkAndCreateToast={checkAndCreateToast}
						/>
						))
					) : (
						<div className="col-span-full text-center text-gray-600">
						<p>No coupons available.</p>
						</div>
					)}
				</div>
			</div> */}
  
const CouponCard = ({ coupon, checkAndCreateToast }) => {
	return (
		<div className="flex-shrink-0 w-64 font-kumbsan h-full justify-center flex flex-col bg-white p-4 transform transition-all duration-500 hover:shadow-md border-dashed border-[2px] border-gray-900 border-opacity-60 hover:bg-gray-100 hover:border-gray-500">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xs sm:text-sm font-bold text-gray-900">
				{coupon?.FreeShipping ? (
					"Free shipping"
				) : (
					<Fragment>
					{coupon.CouponType === "Percentage"
						? `${coupon?.Discount} % OFF`
						: `₹${coupon?.Discount} OFF`}
					</Fragment>
				)}
				</h3>
				<span className="text-xs sm:text-xs md:text-sm text-gray-700">
				{new Date(coupon?.ValidDate).toLocaleDateString()}
				</span>
			</div>

			<p className="text-xs sm:text-xs md:text-sm text-gray-700 mb-4 break-words whitespace-normal">
				{coupon?.Description}
			</p>

			<div className="flex items-center justify-between">
				<span className="text-sm sm:text-sm font-bold text-gray-900">
				{coupon?.CouponCode}
				</span>
				<button
				onClick={() => {
					navigator.clipboard.writeText(coupon?.CouponCode);
					checkAndCreateToast("success", "Coupon Code copied to clipboard!");
				}}
				className="bg-black text-white py-2 px-5 text-xs sm:text-xs md:text-sm transition-all ease-in-out duration-500 hover:bg-white hover:text-gray-800 hover:border-[1px] border-gray-900 rounded-full whitespace-nowrap"
				>
				<span>Copy Code</span>
				</button>
			</div>
		</div>
	);
};
  
  
export default HorizontalScrollingCouponDisplay