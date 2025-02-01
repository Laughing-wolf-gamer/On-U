import React, { useState } from 'react';

const CustomerDetailsSingle = ({ user }) => {
    console.log("Selected Customer: ", user);
    const [activeTab, setActiveTab] = useState("cart");

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getItemsAmount = (item) => {
        const totalPrice = item?.productId.salePrice || item?.productId.price;
        const sellingPrice = totalPrice * item?.productId?.quantity;
        return sellingPrice;
    };

    const renderCart = (data) => {
        if (data.length === 0) {
            return (
                <div className="flex justify-center text-gray-500 py-4">No items available</div>
            );
        }
        return data.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 border-b py-4">
                <div className="">{item?._id}</div>
                <div className="">{item?.productId?.shortTitle}</div>
                <div className="">{getItemsAmount(item)}</div>
                <div className="">{item?.quantity}</div>
            </div>
        ));
    };

    const renderOrders = (data) => {
        if (data.length === 0) {
            return (
                <div className="flex justify-center text-gray-500 py-4">No orders available</div>
            );
        }
        return data.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 border-b py-4">
                <div>{item?._id}</div>
                <div>{item.TotalAmount}</div>
                <div>{item.orderItems?.length}</div>
                <div>{item.paymentMode}</div>
            </div>
        ));
    };

    const renderWishList = (data) => {
        if (data.length === 0) {
            return (
                <div className="flex justify-center text-gray-500 py-4">No items available</div>
            );
        }
        return data.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 border-b py-4">
                <div>{item?.productId?._id}</div>
                <div>{item?.productId?.title}</div>
                <div>{item?.productId?.price}</div>
            </div>
        ));
    };

    return (
        <div className="w-full mx-auto h-fit p-6 bg-white shadow-lg rounded-lg">
            {/* User Info Section */}
            <h2 className="text-2xl font-bold mb-6 text-center">User Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phoneNumber}</p>
                    <p><strong>Gender:</strong> {user.gender}</p>
                    <p><strong>DOB:</strong> {user.DOB}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Created At:</strong> {user.createdAt}</p>
                </div>
                <div className="space-y-2">
                    <p><strong>Address:</strong> {user?.address?.length}</p>
                    <p><strong>Total Purchases:</strong> {user.totalPurchases}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center mb-6">
                <button
                    onClick={() => handleTabChange("cart")}
                    className={`px-6 py-2 font-semibold ${activeTab === "cart" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-tl-lg md:rounded-none md:rounded-tl-lg`}
                >
                    Cart
                </button>
                <button
                    onClick={() => handleTabChange("orders")}
                    className={`px-6 py-2 font-semibold ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} md:rounded-none`}
                >
                    Orders
                </button>
                <button
                    onClick={() => handleTabChange("wishList")}
                    className={`px-6 py-2 font-semibold ${activeTab === "wishList" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded-tr-lg md:rounded-none`}
                >
                    Wish List
                </button>
            </div>

            {/* Content based on active tab */}
            <div>
                {activeTab === "cart" && (
                    <div className='min-h-fit'>
                        <div className="grid grid-cols-4 gap-4 font-semibold border-b py-2">
                            <div>Product _id</div>
                            <div>Product Name</div>
                            <div>Price</div>
                            <div>Quantity</div>
                        </div>
                        <div className=''>
                            <div className="h-60 overflow-y-auto">
                                {renderCart(user.cart)}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className='min-h-fit'>
                        <div className="grid grid-cols-4 gap-4 font-semibold border-b py-2">
                            <div>Order ID</div>
                            <div>Total Amount</div>
                            <div>Quantity</div>
                            <div>Payment Mode</div>
                        </div>
                        <div className=''>
                            <div className="h-60 overflow-y-auto">
                                {renderOrders(user.orders.slice(0, 5))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "wishList" && (
                    <div className='min-h-fit'>
                        <div className="grid grid-cols-4 gap-4 font-semibold border-b py-2">
                            <div>Product Id</div>
                            <div>Product Title</div>
                            <div>Price</div>
                        </div>
                        <div className=''>
                            <div className="max-h-96 overflow-y-auto">
                                {renderWishList(user.wishList)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetailsSingle;
