import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById } from '../../../action/orderaction';
import DeliveryStatus from './DeliveryStatus';
import Loader from '../../Loader/Loader';
import { capitalizeFirstLetterOfEachWord, formattedSalePrice } from '../../../config';
import Footer from '../../Footer/Footer';
import BackToTopButton from '../../Home/BackToTopButton';
import { ChevronLeft } from 'lucide-react';

// Helper function to format the date
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

const OrderItem = ({ item }) => {
    return (
        <div key={item._id} className="border-b pb-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                <Link to={`/products/${item?.productId?._id}`} className="w-full md:w-1/4 flex justify-center">
                    <img
                        src={item?.color.images[0].url}
                        alt="Product"
                        className="w-28 h-28 object-contain rounded cursor-pointer"
                    />
                </Link>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 truncate">
						{item?.productId?.title?.length > 20 ? `${capitalizeFirstLetterOfEachWord(item?.productId?.title.slice(0,50))}` : capitalizeFirstLetterOfEachWord(item?.productId?.title)} 
					</h3>
					
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                        <span className="font-semibold">Color:</span>
                        <span
                            className="w-5 h-5 border-2 rounded-full"
                            style={{ backgroundColor: item.color.label }}
                            title={`Color: ${item.color.label}`}
                        />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <span className="font-semibold">Size:</span>
                        <span className="ml-2 w-10 h-5 border-2 text-center flex items-center justify-center rounded-md">{item.size}</span>
                    </div>
                </div>
                <div className="text-lg font-semibold text-gray-800 mt-2">₹ {formattedSalePrice(item.productId?.salePrice || item.productId?.price)}</div>
            </div>
        </div>
    );
};

const AddressSection = ({ address, userName }) => (
    <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
        <div className="bg-gray-100 p-6 rounded-md shadow-md">
            <p className="font-bold">{userName}</p>
            <p>{address}</p>
        </div>
    </div>
);

const OrderDetailsPage = ({ user }) => {
    const scrollableDivRef = useRef(null);
    const navigate = useNavigate(); // useNavigate hook to navigate back
    const { orderbyid, loading } = useSelector(state => state.getOrderById);
    const [orderItems, setOrderItems] = useState([]);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (orderbyid) {
            setOrderItems(orderbyid.orderItems);
        }
    }, [orderbyid]);

    // Back button handler
    const handleBackButtonClick = () => {
        navigate(-1); // This will go back to the previous page
    };

    return (
        <div ref={scrollableDivRef} className="w-screen h-screen overflow-y-auto bg-gray-50 font-sans">
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

                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-8 bg-white shadow-lg rounded-lg p-6 space-y-6">
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
                            <div className="grid grid-cols-2 gap-8">
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
                        <div className="col-span-12 lg:col-span-4 bg-gray-100 p-6 rounded-lg space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                            <div className="bg-white p-6 rounded-md shadow-md space-y-4">
                                <p className="font-semibold text-gray-800">Total Items: {orderbyid?.orderItems?.length}</p>
                                <p className="font-semibold text-gray-800">Total Amount: ₹ {formattedSalePrice(orderbyid?.TotalAmount)}</p>
                                <p className="font-semibold text-gray-800">Shipping: ₹ {formattedSalePrice(orderbyid?.ConveenianceFees)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader />
            )}
            <Footer />
            <BackToTopButton scrollableDivRef={scrollableDivRef} />
        </div>
    );
};

export default OrderDetailsPage;
