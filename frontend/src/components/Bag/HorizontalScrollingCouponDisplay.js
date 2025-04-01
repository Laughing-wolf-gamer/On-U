import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { fetchAllCoupons } from '../../action/common.action';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HorizontalScrollingCouponDisplay = ({ user, bag,totalProductSellingPrice }) => {
	const { loading,AllCoupons } = useSelector((state) => state.AllCoupons);
	const { checkAndCreateToast } = useSettingsContext();
	const dispatch = useDispatch();
  
	useEffect(() => {
	  // Fetch all coupons
	  const queryLink = ``;
	  dispatch(fetchAllCoupons(queryLink));
	}, [dispatch]);

	const sliderRef = useRef(null);

	const [dragState, setDragState] = useState({
		isDragging: false,
		startX: 0,
		startTouchX: 0,
		scrollLeft: 0,
	});
  
  
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
    
	return (
		<div className="grid grid-cols-1 min-h-[180px] relative px-4">	
			<div className="relative w-full flex justify-start items-center">
				{/* Left and Right Arrow Buttons */}
				<Fragment>
					<button
						onClick={() => scroll(-1)}
						className="absolute sm:h-[15%] md:h-[20%] left-4 rounded-md top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-500 hover:scale-105 opacity-90 hover:opacity-100 z-10"
					>
						<ChevronLeft />
					</button>

					<button
						onClick={() => scroll(1)}
						className="absolute sm:h-[15%] md:h-[20%] right-4 rounded-md top-1/2 transform bg-gray-900 -translate-y-1/2 text-white hover:text-purple-500 hover:scale-105 opacity-90 hover:opacity-100 z-10"
					>
						<ChevronRight />
					</button>
				</Fragment>


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
						style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab',userSelect: 'none'  }}
					>
						{loading ? (
							Array(10)
								.fill(0)
								.map((_, index) => (
									<div
										key={`skeleton_${index}`}
										className="m-2 md:h-[200px] md:w-[600px] p-2 h-[190px] w-[160px] 
											transform transition-transform duration-500 ease-in-out bg-neutral-100 rounded-lg animate-pulse"
									>
										<div className="h-[90%] w-[260px] bg-gray-300 rounded-md"></div>
									</div>
								))
							) : (
								<Fragment>
									{
										AllCoupons && AllCoupons.length > 0 && (
											AllCoupons.map((coupon, index) => (
												<div
													key={`q_banners_${index}`}
													className="min-h-full transform transition-transform duration-300 ease-in-out"
												>
													<CouponCard user = {user} bag = {bag} coupon={coupon} checkAndCreateToast={checkAndCreateToast} totalProductSellingPrice = {totalProductSellingPrice} />
												</div>
											))
										)
									}
								</Fragment>
							)
						}
					</ul>
				</div>
			</div>
		</div>
	);
};


  
const CouponCard = ({ coupon, checkAndCreateToast,bag,user,totalProductSellingPrice }) => {
	const tryCopyCode = (e)=>{
		e.preventDefault();
		if(!user){
			checkAndCreateToast("error", "Please login to copy Coupon code!");
            return;
		}
		if(bag?.Coupon){
			checkAndCreateToast("error", "Coupon Already Applied!");
            return;
		}
		const {MinOrderAmount} = coupon;
		// const{totalProductSellingPrice} = bag;
		if(MinOrderAmount > 0){
			if(totalProductSellingPrice < MinOrderAmount){
				const amountToAvailCoupon = MinOrderAmount - totalProductSellingPrice;
				checkAndCreateToast("error", `You need to purchase at least ${amountToAvailCoupon} to avail this coupon!`);
                return;
			}
		}

		navigator.clipboard.writeText(coupon?.CouponCode);
		checkAndCreateToast("success", "Coupon Code copied to clipboard!");
	}
	return (
		<div className="flex-shrink-0 w-72 font-kumbsan h-full justify-center flex flex-col bg-white p-1 transform transition-all duration-500 hover:shadow-md border-dashed border-[2px] border-gray-900 border-opacity-60 hover:bg-gray-100 hover:border-gray-500">
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
			{
				coupon && coupon.MinOrderAmount > 0 && totalProductSellingPrice < coupon.MinOrderAmount && (
					<span className='text-gray-600 animate-pulse text-sm mb-1'>Add ₹{(coupon?.MinOrderAmount - totalProductSellingPrice) || 0} more to Use this Coupon</span>
				)
			}

			<div className="flex items-center justify-between">
				<span className="text-sm sm:text-sm font-bold text-gray-900">
					{coupon?.CouponCode}
				</span>
				<button
					disabled = {bag?.Coupon != null}
					onClick={tryCopyCode}
					className="bg-black text-white disabled:bg-gray-300 disabled:text-black py-2 px-5 text-xs sm:text-xs md:text-sm transition-all ease-in-out duration-500 hover:bg-white hover:text-gray-800 hover:border-[1px] border-gray-900 rounded-full whitespace-nowrap"
				>
					<span>Copy Code</span>
				</button>
			</div>
		</div>
	);
};
  
  
export default HorizontalScrollingCouponDisplay