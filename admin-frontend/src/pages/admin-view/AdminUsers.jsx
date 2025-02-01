import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
import { getAllCustomerWithDetails } from "@/store/admin/users-slice";

const UserTable = () => {
    const dispatch = useDispatch();
    const { AllUser } = useSelector(state => state.Customer);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleFetchAllUser = () => {
        dispatch(getAllCustomerWithDetails());
    };

    useEffect(() => {
        handleFetchAllUser();
    }, [dispatch]);

    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                {/* Table-like Structure */}
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4 font-semibold text-gray-700">
                    {/* Table Headers */}
                    <div className="text-sm">Sr.</div>
                    <div className="text-sm">Customer Name</div>
                    <div className="text-sm">Email ID</div>
                    <div className="text-sm">Phone Number</div>
                    <div className="text-sm">Total Purchases</div>
                    <div className="text-sm">Wishlist Count</div>
                    <div className="text-sm">Actions</div>
                </div>

                {/* Table Data */}
                {AllUser && AllUser.length > 0 && AllUser.map((customer, index) => (
                    <div key={customer._id} className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4 hover:bg-gray-100 p-4 border rounded-lg">
                        <div className="text-sm">{index + 1}</div>
                        <div className="text-sm">{customer?.name}</div>
                        <div className="text-sm">{customer?.email}</div>
                        <div className="text-sm">{customer?.phoneNumber}</div>
                        <div className="text-sm">{customer?.totalPurchases}</div>
                        <div className="text-sm">{customer?.wishList?.length}</div>
                        <div className="text-sm">
                            <Button
                                onClick={() => openModal(customer)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Modal - User Details */}
                {isModalOpen && selectedCustomer && (
                    <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
                        onClick={closeModal}
                    >
                        <div
                            className="w-full max-w-4xl sm:max-w-6xl relative bg-white rounded-lg p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Customer Details Single Component */}
                            <CustomerDetailsSingle user={selectedCustomer} />

                            <div className="mt-4 text-right absolute top-0 right-4">
                                <Button
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTable;
