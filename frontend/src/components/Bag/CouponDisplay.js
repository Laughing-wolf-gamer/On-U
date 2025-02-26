import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons } from '../../action/common.action';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import toast from 'react-hot-toast';
// Sample coupon data
const coupons = [
    {
        id: 1,
        CouponCode: 'SAVE20',
        Discount: '20',
        ValidDate: '2025-02-28',
        Description: 'Get 20% off your next purchase!',
    },
    {
        id: 2,
        CouponCode: 'FREESHIP',
        Discount: 'Free Shipping',
        ValidDate: '2025-01-31',
        Description: 'Enjoy free shipping on orders over $50.',
    },
    {
        id: 3,
        CouponCode: 'WELCOME10',
        Discount: '10',
        ValidDate: '2025-03-15',
        Description: 'New customers get 10% off their first order.',
    },
    {
        id: 4,
        CouponCode: 'SUMMER15',
        Discount: '15',
        ValidDate: '2025-06-30',
        Description: 'Save 15% on all summer collection items!',
    },
    {
        id: 5,
        CouponCode: 'BFCM25',
        Discount: '25',
        ValidDate: '2025-11-30',
        Description: 'Black Friday & Cyber Monday special! 25% off.',
    },
    {
        id: 6,
        CouponCode: 'WINTER30',
        Discount: '30',
        ValidDate: '2025-12-31',
        Description: 'Stay cozy with 30% off on winter gear!',
    },
    {
        id: 7,
        CouponCode: 'BUY1GET1',
        Discount: 'Buy 1 Get 1 Free',
        ValidDate: '2025-04-15',
        Description: 'Buy one item, get another one free! Limited time offer.',
    },
    {
        id: 8,
        CouponCode: 'STUDENT10',
        Discount: '10',
        ValidDate: '2025-09-01',
        Description: 'Students get 10% off with a valid student ID.',
    },
    {
        id: 9,
        CouponCode: 'FIRSTPURCHASE5',
        Discount: '5',
        ValidDate: '2025-07-15',
        Description: '5% off your first purchase. Welcome!',
    },
    {
        id: 10,
        CouponCode: 'VIP40',
        Discount: '40',
        ValidDate: '2025-05-01',
        Description: 'VIP Members get 40% off everything!',
    },
];


const CouponsDisplay = ({user,bag}) => {
    const{AllCoupons} = useSelector(state=>state.AllCoupons);
    const {checkAndCreateToast} = useSettingsContext();
    const dispatch = useDispatch();
    useEffect(()=>{
        // Fetch all coupons
        const queryLink = ``;
        dispatch(fetchAllCoupons(queryLink));
    },[dispatch])
    console.log("All Coupons: ",AllCoupons);
    return (
        <div className="font-kumbsan justify-center items-center flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {AllCoupons && AllCoupons.length > 0 ? (
                    AllCoupons.map((coupon, index) => <CouponCard key={coupon._id || index} coupon={coupon} checkAndCreateToast={checkAndCreateToast} user ={user} bag = {bag} />)
                ) : (
                    <div className="col-span-full text-center text-gray-600">
                        <p>No coupons available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
const CouponCard = ({ coupon ,checkAndCreateToast,user,bag}) => {
	const tryCopyCode = (e)=>{
		e.preventDefault();
		if(!user){
			checkAndCreateToast("error", "Please login to copy Coupon code!");
            return;
		}
		if(bag.Coupon){
			checkAndCreateToast("error", "Coupon Already Applied!");
            return;
		}
		const {MinOrderAmount} = coupon;
		console.log("Bag Coupon: ",coupon);
		const{totalProductSellingPrice} = bag;
		if(MinOrderAmount > 0){
			if(totalProductSellingPrice < MinOrderAmount){
				checkAndCreateToast("error", `You need to purchase at least ${MinOrderAmount} to avail this coupon!`);
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

            <div className="flex items-center justify-between">
                <span className="text-sm sm:text-sm font-bold text-gray-900">{coupon?.CouponCode}</span>
                <button
					disabled = {bag.Coupon != null}
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
