import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons } from '../../action/common.action';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
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
];

const CouponsDisplay = ({user}) => {
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
        <div className="font-sans justify-center items-center flex flex-col px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">All Coupons</h2>

            {/* Coupons grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {AllCoupons && AllCoupons.length > 0 ? (
                    AllCoupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="bg-white min-w-[600px] p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Coupon Info */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {
                                        coupon.FreeShipping ? "Free shipping" : <Fragment>
                                            {
                                                coupon.CouponType === 'Percentage'
                                                ? `${coupon.Discount} % OFF`
                                                    : `��${coupon.Discount} OFF`
                                            }
                                        </Fragment>
                                    }
                                    
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {new Date(coupon.ValidDate).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Coupon Description */}
                            <p className="text-gray-600 mb-4 break-words whitespace-normal">{coupon.Description}</p>


                            {/* Coupon Code */}
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-600">{coupon.CouponCode}</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(coupon.CouponCode)
                                        checkAndCreateToast("success", "Coupon Code copied to clipboard!");
                                    }}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg text-sm transition-colors hover:bg-gray-600"
                                >
                                    Copy Code
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-600">
                        <p>No coupons available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponsDisplay;
