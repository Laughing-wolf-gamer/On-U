import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchOrderById, sendExchangeRequest, sendOrderCancel, sendOrderReturn } from '../../../action/orderaction';
import DeliveryStatus from './DeliveryStatus';
import Loader from '../../Loader/Loader';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice } from '../../../config';
import Footer from '../../Footer/Footer';
import BackToTopButton from '../../Home/BackToTopButton';
import { ChevronLeft } from 'lucide-react';
import WhatsAppButton from '../../Home/WhatsAppButton';
import { useSettingsContext } from '../../../Contaxt/SettingsContext';

// Helper function to format the date
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

const OrderItem = ({ item }) => (
    <div key={item._id} className="border-b pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to={`/products/${item?.productId?._id}`} className="w-full md:w-1/4 flex justify-center">
                <img
                    src={item?.color.images[0].url}
                    alt="Product"
                    className="w-28 h-28 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
                />
            </Link>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate hover:text-blue-500 cursor-pointer">
                    {capitalizeFirstLetterOfEachWord(item?.productId?.title)}
                </h3>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                    <span className="font-semibold">Color:</span>
                    <span
                        className="w-5 h-5 border-2 rounded-full"
                        style={{backgroundColor: item?.color?.name}}
                        title={`Color: ${item?.color?.name}`}
                    />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Size:</span>
                    <span className="ml-2 w-10 h-5 border-2 text-center flex items-center justify-center rounded-md bg-gray-100">
                        {item.size}
                    </span>
                </div>
            </div>
            <div className="text-lg font-semibold text-gray-800 mt-2">₹ {formattedSalePrice(item.productId?.salePrice || item.productId?.price)}</div>
        </div>
    </div>
);

const AddressSection = ({ address, userName }) => (
    <div className="mb-6 border p-2 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
        <div className="py-2 w-full space-y-2">
            {Object.entries(address).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium text-base">{capitalizeFirstLetterOfEachWord(key)}:</span>
                    <span className="font-normal">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

const OrderDetailsPage = ({ user }) => {
    const { checkAndCreateToast } = useSettingsContext();
    const location = useLocation();
    const scrollableDivRef = useRef(null);
    const navigate = useNavigate(); 
    const { orderbyid, loading } = useSelector(state => state.getOrderById);
    const [orderItems, setOrderItems] = useState([]);
    const dispatch = useDispatch();
    const { id } = location.state;

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id))
        } else {
            navigate(-1);
        }
    }, [dispatch, location]);

    useEffect(() => {
        if (orderbyid) {
            setOrderItems(orderbyid.orderItems);
        }
    }, [orderbyid]);

    const createOrderReturn = async (e) => {
        if (!orderbyid?.IsReturning) {
            await dispatch(sendOrderReturn({ orderId: orderbyid._id }));
            await dispatch(fetchOrderById(id));
            if (orderbyid?.IsReturning) {
                checkAndCreateToast("success", 'Order Returned Successfully');
            } else {
                checkAndCreateToast("success", 'Order Exchanged Successfully');
            }
        } else {
            checkAndCreateToast('error', 'Order is already in return process');
        }
    }
	const createCancelOrder = async(e)=>{
		if(!orderbyid?.IsCancelled){
			const response = await dispatch(sendOrderCancel({ orderId: orderbyid._id }));
            await dispatch(fetchOrderById(id));
			if(response){
				if (orderbyid?.IsCancelled) {
					checkAndCreateToast("success", 'Order Cancelled Successfully');
				} else {
					checkAndCreateToast("success", 'Order Refunded Successfully');
				}
			}else{
				checkAndCreateToast('error','Failed to Cancel Order')
			}
		}
	}

    const createOrderExchange = async (e) => {
        if (!orderbyid?.IsInExcnage) {
            await dispatch(sendExchangeRequest({ orderId: orderbyid._id }));
            await dispatch(fetchOrderById(id));
            if (orderbyid?.IsInExcnage) {
                checkAndCreateToast("success", 'Order Exchanged Successfully');
            } else {
                checkAndCreateToast("success", 'Order Returned Successfully');
            }
        } else {
            checkAndCreateToast('error', 'Order is already in exchange process');
        }
    }

    const handleBackButtonClick = () => {
        navigate(-1); 
    };

    return (
        <div ref={scrollableDivRef} className="w-full min-h-screen overflow-y-auto bg-gray-50 font-sans">
            {!loading && orderbyid ? (
                <div className="max-w-screen-2xl w-full mx-auto py-8 px-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

                    {/* Back Button */}
                    <button
                        onClick={handleBackButtonClick}
                        className="text-sm hover:underline font-semibold text-gray-600 mb-6 flex items-center space-x-2"
                    >
                        <ChevronLeft />
                        <span>Back to Orders</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="col-span-1 lg:col-span-8 bg-white rounded-lg p-2 sm:p-3 md:p-6 xl:p-5 2xl:p-6 space-y-6 border border-gray-600">
                            {/* Order Created Date */}
                            {orderbyid?.createdAt && (
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800">Order Date</h2>
                                    <p className="text-lg text-gray-600">{formatDate(orderbyid.createdAt)}</p>
                                </div>
                            )}

                            {/* Address Section */}
                            {orderbyid?.address && <AddressSection address={orderbyid.address} userName={user?.user?.name} />}

                            {/* Order Items Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
                                {orderItems?.length > 0 && orderItems.map((item, index) => (
                                    <OrderItem key={item._id || index} item={item} />
                                ))}
                            </div>

                            {/* Delivery Status */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">Delivery Status</h2>
                                <DeliveryStatus status={orderbyid?.status || "Processing"} />
                            </div>

                            {/* Total Amount Section */}
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold text-gray-800">Total Amount</h2>
                                <p className="text-lg font-bold text-gray-800">₹ {formattedSalePrice(orderbyid?.TotalAmount)}</p>
                            </div>

                            {/* Payment and Delivery Status */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800">Delivery Status</h2>
									<p>{orderbyid?.status}</p>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-800">Payment Mode</h2>
                                    <p>{orderbyid?.paymentMode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Order Summary */}
                        <div className="col-span-1 lg:col-span-4 justify-between flex flex-col bg-white p-2 sm:p-3 md:p-6 xl:p-5 2xl:p-6 rounded-lg space-y-6 border border-gray-600">
                            <div className="rounded-md  space-y-4">
                            	<h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                                {orderbyid?.address && <AddressSection address={orderbyid.address} userName={user?.user?.name} />}
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-800">Total Items:</p>
                                    <p className="text-base text-gray-600">{orderbyid?.orderItems?.length}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-800">Total Amount:</p>
                                    <p className="text-base text-gray-600">₹{formattedSalePrice(orderbyid?.TotalAmount)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-800">Shipping:</p>
                                    <p className="text-base text-gray-600">{orderbyid.ConveenianceFees > 0 ? `₹${formattedSalePrice(orderbyid?.ConveenianceFees)}` : "Free"}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
								{
									orderbyid?.status === 'Delivered' ? (<button
										disabled={!orderbyid || orderbyid?.IsReturning}
										onClick={createOrderReturn}
										className="w-full py-4 bg-gray-800 text-white rounded-md active:shadow-md hover:shadow-xl transition-all disabled:bg-gray-400"
									>
										{orderbyid?.IsReturning ? "Return Request in Process" : "Request To Return"}
									</button>):(
										<button
											disabled={!orderbyid || orderbyid?.IsCancelled}
											onClick={createCancelOrder}
											className="w-full py-4 bg-gray-800 text-white rounded-md active:shadow-md hover:shadow-xl transition-all disabled:bg-gray-400"
										>
											{orderbyid?.IsCancelled ? "Cancel Request in Process" : "Request Cancel Order"}
										</button>
									)
								}
                                
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
            <Footer />
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
            <WhatsAppButton scrollableDivRef={scrollableDivRef} />
        </div>
    );
};

export default OrderDetailsPage;
