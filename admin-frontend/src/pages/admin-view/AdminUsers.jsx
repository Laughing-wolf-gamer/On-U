import { useState, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllCustomerWithDetails, removeCustomer } from "@/store/admin/users-slice";
import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
import { useDispatch, useSelector } from "react-redux";

const UserTable = () => {
    const dispatch = useDispatch();
    const[deletingCustomer,setDeletingCustomer] = useState([])
    const { AllUser } = useSelector(state => state.Customer);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleFetchAllUser = () => {
        dispatch(getAllCustomerWithDetails());
    };
    const handleChangeCustomer = (id) =>{

        if(deletingCustomer.includes(id)){
            setDeletingCustomer(deletingCustomer.filter(current => current !== id))
        }else{
            setDeletingCustomer([...deletingCustomer,id])
        }
        setIsModalOpen(false);
        setSelectedCustomer(null);
    }
    useEffect(() => {
        handleFetchAllUser();
    }, [dispatch]);

    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };
    const HandleDeleteCustomer = async (e)=>{
        e.preventDefault();
        const response = await dispatch(removeCustomer({removingCustomerArray:deletingCustomer}));
        console.log("Response: ", response);
        // setDeletingCustomer([]);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };
    console.log("Check Deleting Customer: ",deletingCustomer);
    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
                {
                    deletingCustomer.length > 0 && <div className="flex justify-between items-center mb-4">
                        <Button onClick ={HandleDeleteCustomer} variant = {"destructive"}>
                            Delete Users
                        </Button>
                    </div>
                }
                
                <Table className="min-w-full table-auto">
                    <thead>
                    <tr className="text-sm font-semibold text-gray-700">
                        <th className="px-4 py-2 text-left">Select</th>
                        <th className="px-4 py-2 text-left">Sr.</th>
                        <th className="px-4 py-2 text-left">Customer Name</th>
                        <th className="px-4 py-2 text-left">Email ID</th>
                        <th className="px-4 py-2 text-left">Phone Number</th>
                        <th className="px-4 py-2 text-left">Total Purchases</th>
                        <th className="px-4 py-2 text-left">Wishlist Count</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {AllUser && AllUser.length > 0 && AllUser.map((customer, index) => (
                        <tr key={customer._id} className="text-sm hover:bg-gray-100">
                            <td className="px-4 py-2 text-center">
                                <input
                                    type="checkbox"
                                    id='delCheck'
                                    onChange={()=>{
                                        // console.log("Check: ",customer._id);
                                        handleChangeCustomer(customer._id);
                                    }}                                
                                />
                            </td>
                            <td className="px-4 py-2 text-center">{index + 1}</td>
                            <td className="px-4 py-2 text-center">{customer?.name}</td>
                            <td className="px-4 py-2 text-center">{customer?.email}</td>
                            <td className="px-4 py-2 text-center">{customer?.phoneNumber}</td>
                            <td className="px-4 py-2 text-center">{customer?.totalPurchases}</td>
                            <td className="px-4 py-2 text-center">{customer?.wishList?.length}</td>
                            <td className="px-4 py-2 text-center">
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
