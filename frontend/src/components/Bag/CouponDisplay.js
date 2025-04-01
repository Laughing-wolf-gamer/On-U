import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons } from '../../action/common.action';
import { useSettingsContext } from '../../Contaxt/SettingsContext';

const CouponsDisplay = ({user,bag,totalProductSellingPrice}) => {
    const{AllCoupons} = useSelector(state=>state.AllCoupons);
    const {checkAndCreateToast} = useSettingsContext();
    const dispatch = useDispatch();
    useEffect(()=>{
        // Fetch all coupons
        const queryLink = ``;
        dispatch(fetchAllCoupons(queryLink));
    },[dispatch])
    return (
        <div className="font-kumbsan justify-center items-center flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {AllCoupons && AllCoupons.length > 0 ? (
                    AllCoupons.map((coupon, index) => <CouponCard key={coupon._id || index} coupon={coupon} checkAndCreateToast={checkAndCreateToast} user ={user} bag = {bag} totalProductSellingPrice = {totalProductSellingPrice} />)
                ) : (
                    <div className="col-span-full text-center text-gray-600">
                        <p>No coupons available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
const CouponCard = ({ coupon ,checkAndCreateToast,user,bag,totalProductSellingPrice}) => {
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
		// console.log("Bag Coupon: ",coupon);
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
        <div
            className="w-full font-kumbsan h-full justify-center flex flex-col bg-white p-2 transform transition-all duration-500 hover:shadow-md border-dashed border-[2px] border-gray-900 border-opacity-60 hover:bg-gray-100 hover:border-gray-500"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                    {coupon?.FreeShipping ? (
                        "Free shipping"
                    ) : (
                        <Fragment>
                            {coupon.CouponType === 'Percentage'
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
					<span className='text-gray-600 animate-pulse text-sm mb-1'>Add ₹{coupon?.MinOrderAmount - totalProductSellingPrice} more to Use this Coupon</span>
				)
			}

            <div className="flex items-center justify-between">
                <span className="text-sm sm:text-sm font-bold text-gray-900">{coupon?.CouponCode}</span>
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

export default CouponsDisplay;
