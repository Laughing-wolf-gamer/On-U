import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCouponToBag, create_order, createPaymentOrder, fetchAllOrders, removeCouponFromBag } from "../../action/orderaction";
import { useAlert } from "react-alert";
import { BASE_CLIENT_URL, DevMode } from "../../config";
import { cashfree } from "../../utils/pgUtils";

const PaymentProcessingPage = ({ isOpen, selectedAddress, bag, totalAmount, closePopup ,user}) => {
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const[isPaymentStart,setIsPaymentStart] = useState(false);
    const alert = useAlert();
    const originalPrice = 1000;

    // Apply coupon discount
    const applyCoupon = async (e) => {
        e.preventDefault();
        if(bag && coupon){
            await dispatch(applyCouponToBag({bagId:bag._id,couponCode:coupon}))
            closePopup();
        }else{
            alert.info("Please select a coupon and apply it before proceeding with payment");
        }
    };
    const removeCoupon = async(e,code)=>{
        e.preventDefault();
        if(bag){
            await dispatch(removeCouponFromBag({bagId:bag._id,couponCode:code}))
            closePopup();
        }
    }

    // Handle payment selection
    const HandleSetPayment = (e, paymentMode) => {
        e.preventDefault();
        setPaymentMethod(paymentMode);
    };

    const handleCashFreePayment = async ()=>{
        if(!bag.orderItems || !bag.orderItems.length || bag.orderItems.length <= 0){
            alert("Your cart is empty, please add items to proceed");
            return;
        }
        if(selectedAddress === null){
            alert("Please select an address to proceed");
            return;
        }
        console.log("Bag Data: ",bag);
        // Call API to make cash free payment and update order status
        const data = {
            userId:user?.id,
            bagId:bag?._id,
            orderItems: bag.orderItems.map(item =>{
                return {
                    productId:item.productId._id,
                    title:item.productId.title,
                    price:item.productId?.salePrice > 0 ? item.productId.salePrice : item.productId.price,
                    quantity:item.quantity,
                }
            }),

            address:selectedAddress,
            orderStatus:'pending',
            paymentMode:paymentMethod,
            paymentMethods:'Cashfree',
            totalAmount:totalAmount,
            orderDate:new Date(),
            orderUpdateDate:new Date(),
            paymentId:'',
            payerId:'',
        }
        try {
            setIsPaymentStart(true);
            const responseResult = await dispatch(createPaymentOrder(data))
            console.log("Generating Payment Response: ",responseResult);
            const orderDetails = bag.orderItems.map((item) => ({ productId: item.productId, color: item.color, size: item.size.label, quantity: item.quantity }));
            sessionStorage.setItem("checkoutData",JSON.stringify({paymentData:responseResult?.result,bagId:bag?._id,SelectedAddress:selectedAddress,totalAmount,orderDetails}));
            if(responseResult?.success){
                alert.success(`Order Placed Successfully ${responseResult?.message}`);
                const ReturnUrlBase = DevMode ? "http://localhost:3000" : "https://on-u-frontend-website.onrender.com";
                let checkoutOptions = {
                    paymentSessionId: responseResult?.result?.payment_session_id,
                    redirectTarget:'_self',// _self, _modal
                    returnUrl:`${ReturnUrlBase}/bag`,
                }
                // console.log("responseResult: ",checkoutOptions);
                cashfree?.checkout(checkoutOptions).then(function(result){
                    if(result.error){
                        alert.error(result.error.message)
                        setIsPaymentStart(false);
                    }
                    if(result.redirect){
                        console.log("Redirection: ")
                        alert.info("Redirecting to Payment Gateway")
                    }
                });
            }
        } catch (error) {
          console.error(`Error creating order: `,error);
        }finally{
            setIsPaymentStart(false);
            // closePopup();
        }
    }
    

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
                    status: 'Order Confirmed'
                };
                // console.log("OrderData: ", orderData);
                dispatch(create_order(orderData));
                closePopup();
            } else {
                // Order confirm after Payment...
                handleCashFreePayment();
            }
        } else {
            alert("Please select a payment method.");
        }
    };

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    console.log("Bag Coupon: ", bag.Coupon);

    return (
        <div>
            <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                    {bag && bag.Coupon ? (
                        <Fragment>
                        <div className="mt-6">
                          {bag && bag?.Coupon ? (
                            <div className="flex items-center justify-between p-4 bg-green-100 border border-green-300 rounded-lg">
                              <div>
                                <label className="block text-sm font-semibold">Applied Coupon!</label>
                                <span className="text-gray-600">Coupon Code: {bag?.Coupon?.CouponCode}</span>
                              </div>
                              <button
                                className="text-red-500 font-semibold hover:text-red-700"
                                onClick={(e)=> removeCoupon(e,bag?.Coupon?.CouponCode)}
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-600">No coupon applied</span>
                          )}
                        </div>
                      </Fragment>
                    ):(
                        <>
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
                                    className="w-full bg-gray-600 text-white p-3 rounded-md mt-3 hover:bg-gray-800"
                                >
                                    Apply Coupon
                                </button>
                            </div>
                        </>
                    )}

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
                        {/* <p className="flex justify-between text-sm">
                            <span className="font-semibold">Coupon Discount:</span>
                            <span>₹{couponDiscount}</span>
                        </p> */}
                        <p className="flex justify-between text-lg font-semibold text-gray-800">
                            <span>Total Amount:</span>
                            <span>₹{totalAmount}</span>
                        </p>
                    </div>

                    {/* Confirm Button */}
                    <button
                        disabled = {isPaymentStart}
                        onClick={confirmPayment}
                        className="w-full bg-green-500 text-white p-4 rounded-md mt-6 hover:bg-green-600"
                    >
                        {isPaymentStart ? "Payment Started" : "Confirm Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentProcessingPage;
