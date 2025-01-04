import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { create_order, createPaymentOrder, fetchAllOrders } from "../../action/orderaction";
import { useAlert } from "react-alert";
import { BASE_CLIENT_URL } from "../../config";
import { cashfree } from "../../utils/pgUtils";

const PaymentProcessingPage = ({ isOpen, selectedAddress, bag, totalAmount, closePopup ,user}) => {
    const dispatch = useDispatch();
    const { allorder } = useSelector(state => state.getallOrders);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const[isPaymentStart,setIsPaymentStart] = useState(false);
    const alert = useAlert();
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

    const handleCashFreePayment = async ()=>{
        if(!bag.orderItems || !bag.orderItems.length || bag.orderItems.length <= 0){
            alert("Your cart is empty, please add items to proceed");
            return;
        }
        if(selectedAddress === null){
            alert("Please select an address to proceed");
            return;
        }
        console.log("orderItems: ",bag.orderItems);
        // Call API to make cash free payment and update order status
        const data = {
            userId:user?.id,
            cartId:bag?._id,
            cartItems: bag.orderItems.map(item =>{
                return {
                    productId:item.productId,
                    title:item.title,
                    price:item?.salePrice > 0 ? item.salePrice : item.price,
                    quantity:item.quantity,
                }
            }),
            address:selectedAddress,
            orderStatus:'pending',
            paymentMethods:'Cashfree',
            totalAmount:bag.orderItems.length,
            orderDate:new Date(),
            orderUpdateDate:new Date(),
            paymentId:'',
            payerId:'',
        }
        try {
            const response = await dispatch(createPaymentOrder(data))
            console.log("Response: ",response?.payload?.result);
            /* sessionStorage.setItem("checkoutData",JSON.stringify({responseResult:bag.orderItems,bagId:bag._id}))
            const responseResult = response?.payload?.result?.orderData;
            if(response?.payload?.Success){
                alert.success(`Order Placed Successfully ${response?.payload?.message}`);
                let checkoutOptions = {
                    paymentSessionId: responseResult?.payment_session_id,
                    redirectTarget:'_self',
                    returnUrl:`${BASE_CLIENT_URL}/bag`,
                }
                console.log("responseResult: ",checkoutOptions);
                cashfree?.checkout(checkoutOptions).then(function(result){
                    if(result.error){
                        alert(result.error.message)
                        setIsPaymentStart(false);
                    }
                    if(result.redirect){
                        console.log("Redirection: ")
                        setIsPaymentStart(true);
                    }
                });
            } */
        } catch (error) {
          console.error(`Error creating order: `,error);
          setIsPaymentStart(false);
        }finally{
            setIsPaymentStart(false);
        }
    }
    const verifyAnyOrdersPayment = async()=>{
		/* try {
		  const data = JSON.parse(sessionStorage.getItem("checkoutData"))
		  console.log("Session Data:",data)
		  const resp = await dispatch(verifyingOrder({
			paymentData:data?.responseResult,
			orderId:data?.orderId,
			cartId:data?.cartId
		  }))
		  console.log(resp);
		  if(resp.payload.result === "SUCCESS"){
			toast({
				title: "Payment Successful",
				description: "Your order has been placed successfully",
			});
			window.location.href = "/shop/payment-success"
		  }else{
			window.location.href = "/shop/payment-failed"
		  }
		} catch (error) {
		  console.error(`Error Verifying order`)
		} */
	  }
	  /* useEffect(()=>{
		verifyAnyOrdersPayment();
	  },[]) */

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
                handleCashFreePayment();
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
