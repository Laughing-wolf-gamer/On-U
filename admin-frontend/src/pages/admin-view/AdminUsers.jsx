import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
import { getAllCustomerWithDetails } from "@/store/admin/users-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
        <div className="overflow-x-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Table */}
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Sr.</th>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Customer Name</th>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Email ID</th>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Phone Number</th>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Total Purchases</th>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Wishlist Count</th>
                        <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {AllUser && AllUser.length > 0 && AllUser.map((customer, index) => (
                        <tr key={customer._id} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b text-sm text-gray-600">{index + 1}</td>
                            <td className="px-4 py-2 border-b text-sm text-gray-600">{customer?.name}</td>
                            <td className="px-4 py-2 border-b text-sm text-gray-600">{customer?.email}</td>
                            <td className="px-4 py-2 border-b text-sm text-gray-600">{customer?.phoneNumber}</td>
                            <td className="px-4 py-2 border-b text-sm text-gray-600">{customer?.totalPurchases}</td>
                            <td className="px-4 py-2 border-b text-sm text-gray-600">{customer?.wishList?.length}</td>
                            <td className="px-4 py-2 border-b text-sm text-gray-600">
                                <button
                                    onClick={() => openModal(customer)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
