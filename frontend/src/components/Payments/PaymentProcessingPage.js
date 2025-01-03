import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create_order, fetchAllOrders } from "../../action/orderaction";

const PaymentProcessingPage = ({ isOpen, selectedAddress, bag, totalAmount, closePopup }) => {
    const dispatch = useDispatch();
    const { allorder } = useSelector(state => state.getallOrders);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    const originalPrice = 1000;
    let couponDiscount = 0;

    // Apply coupon discount
    const applyCoupon = (e) => {
        // e.stopPropagation();
        e.preventDefault();
        if (coupon === "DISCOUNT10") {
            couponDiscount = 100;
        } else {
            couponDiscount = 0;
        }
        setDiscount(couponDiscount);
    };

    // Handle payment selection
    const HandleSetPayment = (e, paymentMode) => {
        e.preventDefault();

        setPaymentMethod(paymentMode);
    };

    const processPayment = async (e) => {
        // e.stopPropagation();
        try {
            // Handle the actual payment processing logic here
        } catch (error) {
            console.error("Error processing payment: ", error);
        }
    };

    // Confirm payment
    const confirmPayment = async () => {
        if (paymentMethod) {
            if (paymentMethod === "COD") {
                const orderDetails = bag.orderItems.map((item) => ({ productId: item.productId, color: item.color, size: item.size.label, quantity: item.quantity }));
                // Order Confirmed Imminently
                console.log("Bag Id: ", bag._id);
                const orderData = {
                    bagId: bag?._id,
                    orderItems: orderDetails,
                    paymentMode: paymentMethod,
                    TotalAmount: totalAmount,
                    Address: selectedAddress,
                    status: 'Processing'
                };
                console.log("OrderData: ", orderData);
                await dispatch(create_order(orderData));
                closePopup();
            } else {
                // Order confirm after Payment...
                processPayment();
            }
        } else {
            alert("Please select a payment method.");
        }
    };

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    console.log("paymentMethod: ", paymentMethod);

    return (
        <div>
            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={(e) => {
                    // e.preventDefault();
                    // closePopup();
                }}
            >
                <div className="bg-white p-6 rounded-lg relative shadow-lg w-full max-w-md mx-4 sm:mx-0">
                    <button
                        onClick={closePopup}
                        className="absolute top-4 right-4 text-3xl font-bold cursor-pointer hover:text-gray-600"
                    >
                        ×
                    </button>
                    <h2 className="text-center text-2xl font-semibold mb-6">Payment Details</h2>

                    {/* Payment Options */}
                    <div className="space-y-4">
                        {['UPI', 'Card', 'NetBanking', 'COD'].map((payment) => (
                            <label key={payment} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={payment}
                                    checked={paymentMethod === payment}
                                    onChange={(e) => HandleSetPayment(e, payment)}
                                    className="text-indigo-600"
                                />
                                <span className="text-lg">{payment}</span>
                            </label>
                        ))}
                    </div>

                    {/* Coupon Section */}
                    <div className="mt-6">
                        <label className="block text-sm font-semibold">Have a coupon?</label>
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mt-2"
                            placeholder="Enter Coupon Code"
                        />
                        <button
                            onClick={applyCoupon}
                            className="w-full bg-blue-500 text-white p-3 rounded-md mt-3 hover:bg-blue-600"
                        >
                            Apply Coupon
                        </button>
                    </div>

                    {/* Total Amount Calculation */}
                    <div className="mt-6 space-y-4">
                        <p className="flex justify-between text-sm">
                            <span className="font-semibold">Original Price:</span>
                            <span>₹{originalPrice}</span>
                        </p>
                        <p className="flex justify-between text-sm">
                            <span className="font-semibold">Discount:</span>
                            <span>₹{discount}</span>
                        </p>
                        <p className="flex justify-between text-sm">
                            <span className="font-semibold">Coupon Discount:</span>
                            <span>₹{couponDiscount}</span>
                        </p>
                        <p className="flex justify-between text-lg font-semibold text-gray-800">
                            <span>Total Amount:</span>
                            <span>₹{totalAmount}</span>
                        </p>
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={confirmPayment}
                        className="w-full bg-green-500 text-white p-4 rounded-md mt-6 hover:bg-green-600"
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentProcessingPage;
