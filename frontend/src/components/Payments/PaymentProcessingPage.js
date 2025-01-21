import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCouponToBag, create_order, createPaymentOrder, fetchAllOrders, removeCouponFromBag } from "../../action/orderaction";
import { useAlert } from "react-alert";
import { BASE_API_URL, BASE_CLIENT_URL, DevMode, headerConfig } from "../../config";
import { cashfree } from "../../utils/pgUtils";
import axios from "axios";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { X } from "lucide-react";

const PaymentProcessingPage = ({ isOpen, selectedAddress, bag, totalAmount,originalsAmount, closePopup, user }) => {
    const { error, isLoading, Razorpay } = useRazorpay();
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const alert = useAlert();
    // const originalPrice = 1000;

    // Apply coupon discount
    const applyCoupon = async (e) => {
        e.preventDefault();
        if (bag && coupon) {
            await dispatch(applyCouponToBag({ bagId: bag._id, couponCode: coupon }));
            closePopup();
        } else {
            alert.info("Please select a coupon and apply it before proceeding with payment");
        }
    };

    const removeCoupon = async (e, code) => {
        e.preventDefault();
        if (bag) {
            await dispatch(removeCouponFromBag({ bagId: bag._id, couponCode: code }));
            closePopup();
        }
    }

    // Handle payment selection
    const HandleSetPayment = (e, paymentMode) => {
        setPaymentMethod(paymentMode);
    };

    const handleCashFreePayment = async () => {
        if (!bag.orderItems || !bag.orderItems.length || bag.orderItems.length <= 0) {
            alert("Your cart is empty, please add items to proceed");
            return;
        }
        if (selectedAddress === null) {
            alert("Please select an address to proceed");
            return;
        }

        const data = {
            userId: user?.id,
            bagId: bag?._id,
            orderItems: bag.orderItems.map(item => {
                return {
                    productId: item.productId._id,
                    title: item.productId.title,
                    price: item.productId?.salePrice > 0 ? item.productId.salePrice : item.productId.price,
                    quantity: item.quantity,
                }
            }),
            address: selectedAddress,
            orderStatus: 'pending',
            paymentMode: paymentMethod,
            paymentMethods: 'Cashfree',
            totalAmount: totalAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: '',
        }
        try {
            setIsPaymentStart(true);
            const responseResult = await dispatch(createPaymentOrder(data));
            const orderDetails = bag.orderItems.map((item) => ({ productId: item.productId, color: item.color, size: item.size.label, quantity: item.quantity }));
            sessionStorage.setItem("checkoutData", JSON.stringify({ paymentData: responseResult?.result, bagId: bag?._id, SelectedAddress: selectedAddress, totalAmount, orderDetails }));
            if (responseResult?.success) {
                alert.success(`Order Placed Successfully ${responseResult?.message}`);
                const ReturnUrlBase = DevMode ? "http://localhost:3000" : "https://on-u-frontend-website.onrender.com";
                let checkoutOptions = {
                    paymentSessionId: responseResult?.result?.payment_session_id,
                    redirectTarget: '_self',
                    returnUrl: `${ReturnUrlBase}/bag`,
                }

                cashfree?.checkout(checkoutOptions).then(function (result) {
                    if (result.error) {
                        alert.error(result.error.message);
                        setIsPaymentStart(false);
                    }
                    if (result.redirect) {
                        alert.info("Redirecting to Payment Gateway");
                    }
                });
            }
        } catch (error) {
            console.error(`Error creating order: `, error);
        } finally {
            setIsPaymentStart(false);
        }
    }

    const handleRazerPayPayment = async () => {
        try {
            const { data } = await axios.post(`${BASE_API_URL}/api/payment/razerypay/order`, {
                amount: totalAmount,
                customer_id: user.id,
                contact: user?.user?.phoneNumber,
                email: user?.user?.email,
                callback_url: `${BASE_CLIENT_URL}/bag`
            }, headerConfig());
            if (!data.success) {
                alert.error("Failed to create order, please try again later");
                return;
            }
            const options = {
                key: data.keyId,
                amount: data.order.amount,
                currency: "INR",
                name: "On-U",
                description: "Test Transaction",
                order_id: data.order.id,
                handler: function (response) {
                    sessionStorage.setItem("checkoutData", JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        bagId: bag?._id,
                        selectedAddress: selectedAddress,
                        totalAmount,
                        orderDetails: bag.orderItems.map((item) => ({ productId: item.productId, color: item.color, size: item.size.label, quantity: item.quantity })),
                    }));
                    alert.success("RazerPay Payment Success");
                    window.open(`${BASE_CLIENT_URL}/bag`, "_self");
                },
                prefill: {
                    name: user?.user?.name,
                    email: user?.user?.email,
                    contact: user?.user?.phoneNumber,
                },
                notes: {
                    selectedAddress,
                },
                theme: {
                    color: "#45D347",
                },
            };
            const razor = new Razorpay(options);
            razor.on("payment.failed", function (response) {
                alert.error("Payment Failed, Please try again");
            });
            razor.open();
        } catch (error) {
            console.error("Payment Failed", error);
        }
    }

    // Confirm payment
    const confirmPayment = async () => {
        if (paymentMethod) {
            if (paymentMethod === "COD") {
                const orderDetails = bag.orderItems.map((item) => ({ productId: item.productId, color: item.color, size: item.size.label, quantity: item.quantity }));
                const orderData = {
                    bagId: bag?._id,
                    orderItems: orderDetails,
                    paymentMode: paymentMethod,
                    TotalAmount: totalAmount,
                    Address: selectedAddress,
                    status: 'Order Confirmed'
                };
                dispatch(create_order(orderData));
                closePopup();
            } else {
                handleRazerPayPayment();
            }
        } else {
            alert("Please select a payment method.");
        }
    };

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white text-gray-900 p-6 rounded-lg relative shadow-xl w-full max-w-md mx-4 sm:mx-0">
                {/* Header Section */}
                <div className="w-full bg-black justify-center flex flex-col relative items-center shadow-md p-4 mb-6 rounded-lg ">
                    <button
                        onClick={closePopup}
                        className="absolute top-2 right-2 cursor-pointer text-white hover:text-gray-400"
                    >
                        <X size={20}/>
                    </button>
                    <h2 className="text-center text-2xl font-semibold text-white">Payment Details</h2>
                </div>

                {/* Payment Options */}
                <div className="space-y-4 text-gray-800">
                    {['Prepaid', 'COD'].map((payment) => (
                        <label key={payment} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={payment}
                                checked={paymentMethod === payment}
                                onChange={(e) => HandleSetPayment(e, payment)}
                                className="text-black"
                            />
                            <span className="text-lg">{payment}</span>
                        </label>
                    ))}
                </div>

                {/* Coupon Section */}
                {bag && bag.Coupon ? (
                    <Fragment>
                        <div className="mt-6 bg-black p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-semibold text-white">Applied Coupon!</label>
                                    <span className="text-gray-400">Coupon Code: {bag?.Coupon?.CouponCode}</span>
                                </div>
                                <button
                                    className="text-red-500 font-semibold hover:text-red-700"
                                    onClick={(e) => removeCoupon(e, bag?.Coupon?.CouponCode)}
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    </Fragment>
                ) : (
                    <div className="mt-6">
                        <label className="block text-sm font-semibold">Have a coupon?</label>
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="w-full p-3 border border-gray-300 bg-gray-100 text-black rounded-md mt-2 focus:ring-2 focus:ring-black"
                            placeholder="Enter Coupon Code"
                        />
                        <button
                            onClick={applyCoupon}
                            className="w-full bg-black text-white p-3 rounded-md mt-3 hover:bg-gray-800 focus:ring-2 focus:ring-black"
                        >
                            Apply Coupon
                        </button>
                    </div>
                )}

                {/* Total Amount Calculation */}
                <div className="mt-6 space-y-4">
                    <p className="flex justify-between text-sm">
                        <span className="font-semibold">Original Price:</span>
                        <span>₹{originalsAmount}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                        <span className="font-semibold">Discount:</span>
                        <span>{discount}</span>
                    </p>
                    <p className="flex justify-between text-lg font-semibold text-gray-800">
                        <span>Total Amount:</span>
                        <span>₹{totalAmount}</span>
                    </p>
                </div>

                {/* Confirm Payment Button */}
                <button
                    disabled={isPaymentStart}
                    onClick={confirmPayment}
                    className="w-full bg-black text-white p-4 rounded-md mt-6 hover:bg-gray-800 focus:ring-2 focus:ring-black"
                >
                    {isPaymentStart ? "Payment Started" : "Confirm Payment"}
                </button>
            </div>
        </div>
    );
};

export default PaymentProcessingPage;
