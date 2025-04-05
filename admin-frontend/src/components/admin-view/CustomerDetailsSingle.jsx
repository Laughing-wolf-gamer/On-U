import React, { useState } from 'react';
import { DialogContent, DialogTitle } from '../ui/dialog';

const CustomerDetailsSingle = ({ user }) => {
	console.log("Customer User: ",user)
    const [activeTab, setActiveTab] = useState("cart");

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const getItemsAmount = (item) => {
        const totalPrice = item?.productId?.salePrice || item?.productId?.price;
        const sellingPrice = totalPrice * item?.productId?.quantity;
        return sellingPrice;
    };

    const renderCart = (data) => {
        if (data.length === 0) {
            return (
                <div className="flex justify-center text-gray-500 py-4">No items available</div>
            );
        }
        return (
            <table className="min-w-full table-auto text-sm text-gray-700">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-center">Product _id</th>
                        <th className="px-4 py-2 text-center">Product Name</th>
                        <th className="px-4 py-2 text-center">Price</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2 text-center">{item?._id}</td>
                            <td className="px-4 py-2 text-center">{item?.productId?.shortTitle}</td>
                            <td className="px-4 py-2 text-center">{getItemsAmount(item)}</td>
                            <td className="px-4 py-2 text-center">{item?.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderOrders = (data) => {
        if (data.length === 0) {
            return (
                <div className="flex justify-center text-gray-500 py-4">No orders available</div>
            );
        }
        return (
            <table className="min-w-full table-auto text-sm text-gray-700">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-center">Order ID</th>
                        <th className="px-4 py-2 text-center">Total Amount</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                        <th className="px-4 py-2 text-center">Payment Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2 text-center">{item?._id}</td>
                            <td className="px-4 py-2 text-center">{item.TotalAmount}</td>
                            <td className="px-4 py-2 text-center">{item.orderItems?.length}</td>
                            <td className="px-4 py-2 text-center">{item.paymentMode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderWishList = (data) => {
        if (data.length === 0) {
            return (
                <div className="flex justify-center text-gray-500 py-4">No items available</div>
            );
        }
        return (
            <table className="min-w-full table-auto text-sm text-gray-700">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-center">Product Id</th>
                        <th className="px-4 py-2 text-center">Product Title</th>
                        <th className="px-4 py-2 text-center">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2 text-center">{item?.productId?._id}</td>
                            <td className="px-4 py-2 text-center">{item?.productId?.title}</td>
                            <td className="px-4 py-2 text-center">{item?.productId?.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <DialogContent className="bg-white max-w-screen-lg h-max max-h-[800px] overflow-y-auto rounded-lg">
            {/* User Info Section */}
            <DialogTitle className="text-2xl font-bold mb-6 text-center">User Details</DialogTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <div className='w-max justify-between items-center flex gap-4'>
						<strong>Profile Pic:</strong>
						<img src={user?.profilePic} alt="Profile Pic" className="w-20 h-20 rounded-full" />
					</div>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Phone:</strong> {user?.phoneNumber}</p>
                    <p><strong>Gender:</strong> {user?.gender}</p>
                    <p><strong>DOB:</strong> {new Date(user?.DOB).toLocaleDateString()}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <p><strong>Joined On:</strong> {new Date(user?.createdAt).toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                    <p><strong>Address:</strong> {user?.address?.length}</p>
                    <p><strong>Total Purchases:</strong> {user?.totalPurchases}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center mb-6 gap-2">
                <button
                    onClick={() => handleTabChange("cart")}
                    className={`px-6 py-2 font-semibold ${activeTab === "cart" ? "bg-gray-500 text-white" : "bg-gray-200 text-black"} rounded-lg`}
                >
                    Cart
                </button>
                <button
                    onClick={() => handleTabChange("orders")}
                    className={`px-6 py-2 font-semibold ${activeTab === "orders" ? "bg-gray-500 text-white" : "bg-gray-200 text-black"} rounded-lg`}
                >
                    Orders
                </button>
                <button
                    onClick={() => handleTabChange("wishList")}
                    className={`px-6 py-2 font-semibold ${activeTab === "wishList" ? "bg-gray-500 text-white" : "bg-gray-200 text-black"} rounded-lg`}
                >
                    Wish List
                </button>
            </div>

            {/* Content based on active tab */}
            <div>
                {activeTab === "cart" && (
                    <div className="min-h-fit">
                        {renderCart(user?.cart)}
                    </div>
                )}

                {activeTab === "orders" && (
                    <div className="min-h-fit">
                        {renderOrders(user?.orders.slice(0, 5))}
                    </div>
                )}

                {activeTab === "wishList" && (
                    <div className="min-h-fit">
                        {renderWishList(user?.wishList)}
                    </div>
                )}
            </div>
        </DialogContent>
    );
};

export default CustomerDetailsSingle;
