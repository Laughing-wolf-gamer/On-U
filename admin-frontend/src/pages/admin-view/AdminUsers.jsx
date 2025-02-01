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
                {/* Flex Layout for Users */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AllUser && AllUser.length > 0 && AllUser.map((customer, index) => (
                        <div key={customer._id} className="border rounded-lg p-4 hover:bg-gray-100">
                            <div className="font-semibold text-lg mb-2">{index + 1}. {customer?.name}</div>
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Email:</strong> {customer?.email}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Phone:</strong> {customer?.phoneNumber}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>Total Purchases:</strong> {customer?.totalPurchases}
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                                <strong>Wishlist Count:</strong> {customer?.wishList?.length}
                            </div>
                            <Button
                                onClick={() => openModal(customer)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                View Details
                            </Button>
                        </div>
                    ))}
                </div>

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
