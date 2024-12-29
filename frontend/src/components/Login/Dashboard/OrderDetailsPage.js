import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrderById } from '../../../action/orderaction';
import DeliveryStatus from './DeliveryStatus';

// Reusable component for displaying order items
const OrderItem = ({ item }) => {
    return (
        <div key={item._id} className="flex items-center justify-start space-x-4 border-b pb-4">
            <img
                src={item.color.images[0].url}
                alt="Product"
                className="w-20 h-20 object-contain rounded"
            />
            <div className="w-52 flex flex-col overflow-hidden">
                <div className="flex flex-row justify-start w-full h-fit p-2">
                    <span className="font-extrabold text-black">
                        {item?.productId?.title?.length > 20
                            ? `${item?.productId?.title?.slice(0, 20)}...`
                            : item?.productId?.title}
                    </span>
                </div>
                <div className="flex flex-row justify-start w-full h-fit p-2">
                    <span className="font-semibold">Color:</span>
                    <span
                        className="ml-2 w-5 h-5 border-2 rounded-full"
                        style={{ backgroundColor: item.color.label }}
                        title={`Color: ${item.color.label}`}
                    />
                </div>
                <div className="flex flex-row justify-start w-full h-fit p-2">
                    <span className="font-semibold">Size:</span>
                    <span className="ml-2 w-10 h-5 border-2 text-center flex items-center justify-center rounded-md">
                        {item.size}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Reusable component for displaying address
const AddressSection = ({ address, userName }) => (
    <div className="mb-4">
        <h2 className="text-xl font-semibold">Address</h2>
        <h1>{userName}</h1>
        <div className="h-fit p-2 justify-start gap-4 items-center flex flex-col shadow-md rounded-md">
            {['address1', 'address2', 'citystate', 'pincode'].map((field) => (
                <div key={field} className="flex flex-row justify-start w-full h-fit p-2">
                    <span className="font-semibold">{field.replace(/([A-Z])/g, ' $1')}: </span>
                    <p className="ml-1 pl-5">{address?.[field]}</p>
                </div>
            ))}
        </div>
    </div>
);

const OrderDetailsPage = ({ user }) => {
    const { orderbyid } = useSelector(state => state.getOrderById);
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

    return (
        <Fragment>
            {orderbyid && (
                <>
                    <h1 className="text-2xl font-bold mb-6">Order Id: {orderbyid._id}</h1>
                    <div className="w-screen mx-auto p-6 gap-y-9 bg-white shadow-lg rounded-lg">
                        {/* Address Section */}
                        <AddressSection address={orderbyid?.SelectedAddress} userName={user?.user?.name} />

                        {/* Order Items Section */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Order Items</h2>
                            <ul className="space-y-4">
                                {orderItems && [1,2,3,5,4,5,6,7,8].map((item) => (
                                    <OrderItem key={item._id} item={orderItems[0]} />
                                ))}
                            </ul>
                        </div>

                        {/* Delivery Status Progress Bar */}
                        <div className="w-full min-h-fit justify-center items-center flex">
                            <DeliveryStatus status={orderbyid?.status || "Processing"} />
                        </div>

                        {/* Total Amount Section */}
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">Total Amount</h2>
                            <p className="text-lg font-bold">₹ {orderbyid?.TotalAmount}</p>
                        </div>

                        {/* Delivery and Payment Status Section */}
                        <div className="mb-4">
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">Delivery Status</h2>
                                    <p>{orderbyid?.status}</p>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Payment Status</h2>
                                    <p>{orderbyid?.paymentMode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Fragment>
    );
};

export default OrderDetailsPage;
