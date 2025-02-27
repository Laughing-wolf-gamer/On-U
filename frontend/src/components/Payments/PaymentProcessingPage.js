import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { applyCouponToBag, create_order, fetchAllOrders, removeCouponFromBag } from "../../action/orderaction";
import { BASE_API_URL, BASE_CLIENT_URL, formattedSalePrice, headerConfig } from "../../config";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { ChevronRight, ChevronsRight, Icon, X } from "lucide-react";
import { useSettingsContext } from "../../Contaxt/SettingsContext";
import { useNavigate } from "react-router-dom";

const PaymentProcessingPage = ({ isOpen,discountAmount, selectedAddress, bag, totalAmount,originalsAmount, closePopup, user }) => {
    const navigation = useNavigate();
    const { error, isLoading, Razorpay } = useRazorpay();
    const dispatch = useDispatch();
    const [paymentMethod, setPaymentMethod] = useState("Prepaid");
    const [coupon, setCoupon] = useState("");
    // const [discount, setDiscount] = useState(0);
    const [isPaymentStart, setIsPaymentStart] = useState(false);
    const {checkAndCreateToast} = useSettingsContext();

    // Apply coupon discount
    const applyCoupon = async (e) => {
        e.preventDefault();
        if (bag && coupon) {
            await dispatch(applyCouponToBag({ bagId: bag._id, couponCode: coupon }));
            closePopup();
        } else {
            checkAndCreateToast("info","Please select a coupon and apply it before proceeding with payment");
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

    /* const handleCashFreePayment = async () => {
        if (!bag.orderItems || !bag.orderItems.length || bag.orderItems.length <= 0) {
            checkAndCreateToast("info","Your cart is empty, please add items to proceed");
            return;
        }
        if (selectedAddress === null) {
            checkAndCreateToast("info","Please select an address to proceed"); 
            return
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
                checkAndCreateToast("error",`Order Placed Successfully ${responseResult?.message}`);
                const ReturnUrlBase = DevMode ? "http://localhost:3000" : "https://on-u-frontend-website.onrender.com";
                let checkoutOptions = {
                    paymentSessionId: responseResult?.result?.payment_session_id,
                    redirectTarget: '_self',
                    returnUrl: `${ReturnUrlBase}/bag`,
                }

                cashfree?.checkout(checkoutOptions).then(function (result) {
                    if (result.error) {
                        checkAndCreateToast("error",result.error.message);
                        setIsPaymentStart(false);
                    }
                    if (result.redirect) {
                        checkAndCreateToast("info","Redirecting to Payment Gateway");
                    }
                });
            }
        } catch (error) {
            console.error(`Error creating order: `, error);
        } finally {
            setIsPaymentStart(false);
        }
    } */

    const handleRazerPayPayment = async () => {
		setIsPaymentStart(true);

		try {
			// Prepare payment data
			const userContact = user?.user?.phoneNumber;
			const userEmail = user?.user?.email;
			const userName = user?.user?.name || "Test User";
			const bagId = bag?._id;
			const orderItems = bag.orderItems.map(item => ({
				productId: item.productId,
				color: item.color,
				size: item.size.label,
				quantity: item.quantity,
				isChecked: item?.isChecked
			}));

			// Request order creation from the backend
			const { data } = await axios.post(
				`${BASE_API_URL}/api/payment/razerypay/order`,
				{
					amount: totalAmount,
					userId: user.id,
					contact: userContact,
					email: userEmail,
					callback_url: `${BASE_CLIENT_URL}/bag`,
				},
				headerConfig()
			);

			if (!data.success) {
				throw new Error("Failed to create order, please try again to process payment!");
			}

			// Configure Razorpay options
			const razorpayOptions = {
				key: data.keyId,
				amount: data.order.amount,
				currency: "INR",
				name: userName,
				image:user.user.profilePic,
				description: "Your order has been created",
				order_id: data.order.id,
				handler: function (response) {
					const paymentData = {
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_order_id: response.razorpay_order_id,
						razorpay_signature: response.razorpay_signature,
						bagId,
						selectedAddress,
						totalAmount,
						orderDetails: orderItems
					};

					sessionStorage.setItem("checkoutData", JSON.stringify(paymentData));
					checkAndCreateToast("success", "RazorPay Payment Success");
					window.open(`${BASE_CLIENT_URL}/bag/checkout/pending`, "_self");
				},
				prefill: {
					name: userName,
					email: userEmail,
					
					contact: userContact,
				},
				notes: {
					selectedAddress,
				},
				theme: {
					color: "#45D347",
				},
			};

			// Initialize Razorpay and handle payment failure
			const razor = new Razorpay(razorpayOptions);
			razor.on("payment.failed", function () {
				throw new Error("Payment Failed, Please try again");
			});

			razor.open();

		} catch (error) {
			console.error("Payment Failed:", error);
			checkAndCreateToast("error", error.message);
			window.open(`${BASE_CLIENT_URL}/bag/checkout/failure`, "_self");
		} finally {
			setIsPaymentStart(false);
		}
	};

    // Confirm payment
    const confirmPayment = async () => {
		// Ensure payment method is selected
		if (!paymentMethod) {
			checkAndCreateToast("error", "Please select a payment method.");
			setIsPaymentStart(false);
			return;
		}

		// Handle Cash on Delivery (COD)
		if (paymentMethod === "COD") {
			setIsPaymentStart(true);

			// Filter order items that are checked
			const filteredOrderDetails = bag?.orderItems?.filter(item => !item.productId.isChecked);

			console.log("Filtered Order Details: ", filteredOrderDetails);

			if (filteredOrderDetails.length === 0) {
				checkAndCreateToast("error", "Please select products to proceed with COD");
				setIsPaymentStart(false);
				return;
			}

			// Map the order details for COD
			const orderDetails = filteredOrderDetails.map(item => ({
				productId: item.productId,
				color: item.color,
				size: item.size.label,
				quantity: item.quantity,
				isChecked: item.isChecked
			}));

			// Prepare the order data
			const orderData = {
				bagId: bag?._id,
				ConvenienceFees: bag?.ConvenienceFees || 0,
				orderItems: orderDetails,
				paymentMode: paymentMethod,
				TotalAmount: totalAmount,
				Address: selectedAddress,
				status: 'Order Confirmed'
			};

			try {
				// Dispatch the create order action
				const response = await dispatch(create_order(orderData));

				// Check response success
				if (response?.success) {
					navigation('/bag/checkout/success');
					closePopup();
				} else {
					checkAndCreateToast("error", response?.message);
					navigation('/bag/checkout/failure');
					setIsPaymentStart(false);
				}
			} catch (error) {
				// Handle any errors that occur during order creation
				checkAndCreateToast("error", error?.message || "Failed to confirm order.");
				navigation('/bag/checkout/failure');
				setIsPaymentStart(false);
			} finally {
				// Ensure payment start state is reset after the process completes
				setIsPaymentStart(false);
				closePopup();
			}

		} else {
			// Handle Razorpay Payment
			handleRazerPayPayment();
		}
	};

    useEffect(()=>{
        if(error){
            checkAndCreateToast("error",`Failed payment ${error.message}`);
			setIsPaymentStart(false);
        }
    },[error])
    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);
	console.log("Payment Started: ",isPaymentStart);
    return (
        <div className="fixed font-kumbsan inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[80]">
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
                {/* <div className="space-y-4 text-gray-800">
                    {['Prepaid', 'COD'].map((payment) => (
                        <label key={payment} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={payment}
                                checked={paymentMethod === payment}
                                onChange={() => setPaymentMethod(payment)}
                                className="text-black"
                            />
                            <span className="text-lg">{payment}</span>
                        </label>
                    ))}
                </div> */}
				<PaymentMethodToggle defaultValue = {paymentMethod} OnPaymentModeSet={(mode)=>{
					console.log("payment mode set: ",mode);
					setPaymentMethod(mode)
				}} />

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
                        <span>₹{formattedSalePrice(originalsAmount)}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                        <span className="font-semibold">Saved:</span>
                        <span>{formattedSalePrice(bag?.totalDiscount)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-semibold text-gray-800">
                        <span>Total Amount:</span>
                        <span>₹{formattedSalePrice(totalAmount)}</span>
                    </p>
                </div>

                {/* Confirm Payment Button */}
                {/* <button
                    disabled={isPaymentStart || !paymentMethod || paymentMethod ===  '' }
                    onClick={confirmPayment}
                    className="w-full bg-black text-white p-4 rounded-md mt-6 hover:bg-gray-800 focus:ring-2 flex flex-row justify-center items-center focus:ring-black disabled:bg-gray-700"
                >
                    {isPaymentStart ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div> : <span>Confirm Payment</span>}
                </button> */}
				<SwipeToConfirmPaymentButton disabled = {isPaymentStart || !paymentMethod || paymentMethod ===  ''} HasStarted={isPaymentStart} OnSwipeComplete={()=> confirmPayment()}/>
            </div>
        </div>
    );
};
const PaymentMethodToggle = ({defaultValue ='', OnPaymentModeSet }) => {
	const [paymentMethod, setPaymentMethod] = useState(defaultValue || "Prepaid");

	const handleToggle = () => {
		const newPaymentMethod = paymentMethod === 'Prepaid' ? 'COD' : 'Prepaid';
		setPaymentMethod(newPaymentMethod);
		OnPaymentModeSet(newPaymentMethod);
	};

	return (
		<div className="space-y-6 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
			<div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 space-y-4 md:space-y-0">
				{/* Prepaid Label */}
				<div
					className={`px-7 max-w-md py-2 rounded-md text-center ${
						paymentMethod === 'Prepaid' 
						? 'font-semibold bg-black text-white' 
						: 'font-normal border border-black text-black'
					}`}
				>
					Prepaid
				</div>

				{/* Switch toggle */}
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={paymentMethod === 'COD'}
						onChange={handleToggle}
						className="sr-only"
					/>
					<div className="md:w-12 md:h-6 w-6 h-12 bg-gray-300 rounded-full transition-colors duration-300 ease-in-out">
						<div
						className={`w-6 h-6 bg-black rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
							paymentMethod === 'COD' ? 'md:translate-x-6 md:translate-y-0 translate-x-0 translate-y-6' : 'md:translate-x-0 translate-x-0 translate-y-0'
						}`}
						></div>
					</div>
				</label>

				{/* COD Label */}
				<div
					className={`px-7 max-w-md py-2 rounded-md text-center ${
						paymentMethod === 'COD' 
						? 'font-semibold bg-black text-white' 
						: 'font-normal border border-black text-black'
					}`}
				>
				COD
				</div>
			</div>
		</div>
	);
};
const SwipeToConfirmPaymentButton = ({ disabled = false, OnSwipeComplete, HasStarted }) => {
	const [isPaymentStart, setIsPaymentStart] = useState(false);
	const [arrowPosition, setArrowPosition] = useState(0); // Track the position of the arrow
	const [isSwiping, setIsSwiping] = useState(false); // To track if the user is actively swiping
	const buttonRef = useRef(null);

	// Handle mouse or touch movement
	const handleMove = (e) => {
		if (!isSwiping) return;

		const buttonWidth = buttonRef.current.offsetWidth;
		let mouseX = e.clientX || e.touches[0].clientX; // Get the position for mouse or touch
		let left = mouseX - buttonRef.current.getBoundingClientRect().left;
		
		// Ensure the arrow position stays between 0 and the button's width
		left = Math.max(0, Math.min(left, buttonWidth));
		
		setArrowPosition(left);
	};

	// Start dragging/swiping
	const handleStart = (e) => {
		setIsSwiping(true);
		handleMove(e); // To start the arrow at the correct position
	};

	// Stop dragging/swiping
	const handleEnd = () => {
		setIsSwiping(false);

		// If the swipe doesn't reach the full width, reset the position
		if (arrowPosition !== buttonRef.current.offsetWidth) {
			setArrowPosition(0); // Reset position
		}

		// Trigger payment if swipe is complete
		const progressPercentage = arrowPosition / buttonRef.current.offsetWidth;
		console.log("Progressive payment: ", progressPercentage);
		if (progressPercentage > 0.8) {
			confirmPayment();
		}
	};

	const confirmPayment = async () => {
		setIsPaymentStart(true);
		// Simulate a payment process (replace with actual logic)
		setTimeout(() => {
			setIsPaymentStart(false);
			// alert("Payment Started");
			if (OnSwipeComplete && !HasStarted) {
				setArrowPosition(0)
				setIsPaymentStart(false);
				OnSwipeComplete();
			}
		}, 200);
	};

	// Modify the background opacity based on the swipe progress, but ensure it never goes below 0.2
	const buttonBackground = `rgba(0, 0, 0, ${Math.min(1, Math.max(1, arrowPosition / buttonRef.current?.offsetWidth))})`; // Limiting opacity to range 0.2 to 0.8

	return (
		<div className="relative w-full max-w-md mx-auto">
			<button
				ref={buttonRef}
				disabled={disabled && isPaymentStart}
				onMouseDown={handleStart}
				onTouchStart={handleStart}
				onMouseMove={handleMove}
				onTouchMove={handleMove}
				onMouseUp={handleEnd}
				onTouchEnd={handleEnd}
				onMouseLeave={handleEnd}
				onTouchCancel={handleEnd}
				className={`w-full text-white p-4 rounded-md mt-6 bg-black hover:bg-gray-800 flex justify-center items-center relative disabled:bg-gray-700 overflow-hidden transition-all duration-300 ease-out`}
				style={{
					cursor: isSwiping ? "grabbing" : "grab", // Change cursor when swiping
					
					transform: `scale(${1 + (arrowPosition / buttonRef.current?.offsetWidth) * 0.05})`, // Scale the button slightly as you swipe
				}}
			>
				{/* Arrow that moves from left to right with smooth transition */}
				<div
					className="absolute transform -translate-y-1/2 text-white transition-all duration-200 ease-out"
					style={{
						left: `${(arrowPosition / buttonRef.current?.offsetWidth) * 100}%`,
						transform: `scale(${1 + (arrowPosition / buttonRef.current?.offsetWidth) * 0.5})`, // Scale the arrow as it moves
					}}
				>
					<span className="text-lg">
						<ChevronsRight size={40} strokeWidth={2} />
					</span>
				</div>

				{/* Button text and loading spinner when payment is in progress */}
				<span className="z-10">
					{isPaymentStart ? (
						<span>Processing Started....</span>
					) : (
						<Fragment >{HasStarted ? <div className="w-6 h-6 border-4 border-t-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div> : <span>Swipe Right to Start Payment</span>}</Fragment>
					)}
				</span>
			</button>
		</div>
	);
};



export default PaymentProcessingPage;
