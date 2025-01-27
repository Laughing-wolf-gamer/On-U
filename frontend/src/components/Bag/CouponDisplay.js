import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCoupons } from '../../action/common.action';

// Sample coupon data
const coupons = [
    {
        id: 1,
        code: 'SAVE20',
        discount: '20% Off',
        expiryDate: '2025-02-28',
        description: 'Get 20% off your next purchase!',
    },
    {
        id: 2,
        code: 'FREESHIP',
        discount: 'Free Shipping',
        expiryDate: '2025-01-31',
        description: 'Enjoy free shipping on orders over $50.',
    },
    {
        id: 3,
        code: 'WELCOME10',
        discount: '10% Off',
        expiryDate: '2025-03-15',
        description: 'New customers get 10% off their first order.',
    },
];

const CouponsDisplay = () => {
    const{AllCoupons} = useSelector(state=>state.AllCoupons);
    const dispatch = useDispatch();
    useEffect(()=>{
        // Fetch all coupons
        const queryLink = `Status=Active&Date=${Date.now().toLocaleString()}`;
        dispatch(fetchAllCoupons(queryLink));
    },[dispatch])
    console.log("All Coupons: ",AllCoupons);
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-center">All Coupons</h2>

            {/* Coupons grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.id}
                        className="bg-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
                    >
                        {/* Coupon Info */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{coupon.discount}</h3>
                            <span className="text-sm text-gray-500">{coupon.expiryDate}</span>
                        </div>
                        <p className="text-gray-600 mb-4">{coupon.description}</p>

                        {/* Coupon Code */}
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-600">{coupon.code}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(coupon.code)}
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg text-sm transition-colors hover:bg-gray-600"
                            >
                                Copy Code
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CouponsDisplay;
