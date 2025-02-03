import { useState, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllCustomerWithDetails } from "@/store/admin/users-slice";
import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
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
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                {/* Table Component from ShadCN */}
                <Table className="min-w-full">
                    <thead>
                        <tr className="text-sm font-semibold text-gray-700">
                            <th>Sr.</th>
                            <th>Customer Name</th>
                            <th>Email ID</th>
                            <th>Phone Number</th>
                            <th>Total Purchases</th>
                            <th>Wishlist Count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AllUser && AllUser.length > 0 && AllUser.map((customer, index) => (
                            <tr key={customer._id} className="text-sm hover:bg-gray-100">
                                <td>{index + 1}</td>
                                <td>{customer?.name}</td>
                                <td>{customer?.email}</td>
                                <td>{customer?.phoneNumber}</td>
                                <td>{customer?.totalPurchases}</td>
                                <td>{customer?.wishList?.length}</td>
                                <td>
                                    <Button
                                        onClick={() => openModal(customer)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                    >
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

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
