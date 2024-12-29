import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create_order, fetchAllOrders } from "../../action/orderaction";

const PaymentProcessingPage = ({ isOpen,selectedAddress,bag, totalAmount, closePopup }) => {
    const dispatch = useDispatch();
    const{allorder} = useSelector(state => state.getallOrders);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

    const originalPrice = 1000;
    let couponDiscount = 0;

    // Apply coupon discount
    const applyCoupon = (e) => {
        e.stopPropagation();
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
        e.stopPropagation();
        e.preventDefault();

        // Check if the selected payment method is different from the current one
        if (paymentMethod !== paymentMode) {
            setPaymentMethod(paymentMode);
        }
    };

    const processPayment = async (e) => {
        e.stopPropagation();
        try {
            // Handle the actual payment processing logic here
        } catch (error) {
            console.error("Error processing payment: ", error);
        }
    };

    // Confirm payment
    const confirmPayment = async () => {
        if (paymentMethod) {
            if(paymentMethod === "COD"){
                const orderDetails = bag.orderItems.map((item)=>({productId:item.productId,color:item.color,size:item.size.label, quantity:item.quantity}))
                // Order Confirmed Imminently
                console.log("Bag Id: ",bag._id);
                const orderData = {
                    bagId:bag?._id,
                    orderItems:orderDetails,
                    paymentMode:paymentMethod,
                    TotalAmount:totalAmount,
                    Address:selectedAddress,
                    status:'Processing'
                }
                console.log("OrderData: ",orderData);
                await dispatch(create_order(orderData))
                closePopup();
            }else{
                // Order confirm after Payment...
                processPayment();
            }
            // alert(`Payment Method: ${paymentMethod} | Total Amount: ₹${totalAmount}`);
            // console.log("Bag Data: ",bag);
            // closePopup();
        } else {
            alert("Please select a payment method.");
        }
    };
    useEffect(()=>{
        dispatch(fetchAllOrders());
    },[dispatch])
    console.log("All Orders: ",allorder);
    return (
        <div>
            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={(e) => {
                    // e.preventDefault();
                    // console.log("Clicked Background: ");
                    // closePopup();
                }}
            >
                <div className="bg-white p-6 rounded-lg relative shadow-lg w-96">
                    <button
                        onClick={closePopup}
                        className="absolute top-2 right-2 text-4xl cursor-pointer"
                    >
                        ×
                    </button>
                    <h2 className="text-center text-2xl font-semibold mb-4">Payment Details</h2>

                    {/* Payment Options */}
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={paymentMethod === "UPI"}
                                onChange={(e) => HandleSetPayment(e, "UPI")}
                                className="mr-2"
                            />
                            UPI
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Card"
                                checked={paymentMethod === "Card"}
                                onChange={(e) => HandleSetPayment(e, "Card")}
                                className="mr-2"
                            />
                            Card
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="Netbanking"
                                checked={paymentMethod === "Netbanking"}
                                onChange={(e) => HandleSetPayment(e, "Netbanking")}
                                className="mr-2"
                            />
                            Netbanking
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={(e) => HandleSetPayment(e, "COD")}
                                className="mr-2"
                            />
                            Cash On Delivery
                        </label>
                    </div>

                    {/* Coupon Section */}
                    <div className="mt-4">
                        <label className="block text-sm font-semibold">Have a coupon?</label>
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                            placeholder="Enter Coupon Code"
                        />
                        <button
                            onClick={applyCoupon}
                            className="w-full bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600"
                        >
                            Apply Coupon
                        </button>
                    </div>

                    {/* Total Amount Calculation */}
                    <div className="mt-6">
                        <p className="flex justify-between">
                            <span className="font-semibold">Original Price:</span>
                            <span>₹{originalPrice}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-semibold">Discount:</span>
                            <span>₹{discount}</span>
                        </p>
                        <p className="flex justify-between">
                            <span className="font-semibold">Coupon Discount:</span>
                            <span>₹{couponDiscount}</span>
                        </p>
                        <p className="flex justify-between font-semibold text-lg">
                            <span>Total Amount:</span>
                            <span>₹{totalAmount}</span>
                        </p>
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={confirmPayment}
                        className="w-full bg-green-500 text-white p-3 rounded-md mt-6 hover:bg-green-600"
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentProcessingPage;
