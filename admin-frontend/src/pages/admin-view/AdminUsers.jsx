import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getAllCustomerWithDetails, removeCustomer } from "@/store/admin/users-slice";
import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
import { useDispatch, useSelector } from "react-redux";
import LoadingView from "./LoadingView";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useSettingsContext } from "@/Context/SettingsContext";
const pageSize = 10;

const UserTable = () => {
    const dispatch = useDispatch();
    const { checkAndCreateToast } = useSettingsContext();
    const [checkAll, setCheckAll] = useState(false);
    const [deletingCustomer, setDeletingCustomer] = useState([]);
    const [activeKeywords, setActiveKeywords] = useState(''); // State to manage the active search keywords
    const [inputKeyWoards, setInputKeyWords] = useState(""); // State to manage the search keywords
    const [page, setPage] = useState(1);  // Current page

    const { AllUser, pagination, isLoading } = useSelector(state => state.Customer);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleFetchAllUser = () => {
        const queryParams = `?page=${page}&pageSize=${pageSize}&keywoards=${activeKeywords}`;
        dispatch(getAllCustomerWithDetails(queryParams));
    };

    const handleChangeCustomer = (id) => {
        if (deletingCustomer.includes(id)) {
            setDeletingCustomer(deletingCustomer.filter(current => current !== id));
        } else {
            setDeletingCustomer([...deletingCustomer, id]);
        }
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    useEffect(() => {
        if (checkAll) {
            setDeletingCustomer(AllUser.map(customer => customer._id));
        } else {
            setDeletingCustomer([]);
        }
    }, [checkAll]);

    const handleSelectAllCustomer = () => {
        setCheckAll(!checkAll);
        setDeletingCustomer(AllUser.map(customer => customer._id));
    };

    const handleSetActiveKeywords = (e) => {
        e.preventDefault();
        if (inputKeyWoards.trim() === '') {
            return;
        }
        if (inputKeyWoards.toLowerCase() === 'clear') {
            setActiveKeywords('');
        } else {
            setActiveKeywords(inputKeyWoards);
        }
    };

    useEffect(() => {
        handleFetchAllUser();
    }, [dispatch, page, pageSize, activeKeywords]);

    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const HandleDeleteCustomer = async (e) => {
        e.preventDefault();
        const response = await dispatch(removeCustomer({ removingCustomerArray: deletingCustomer }));
        if (response?.payload?.Success) {
            checkAndCreateToast('success', "Users Deleted Successfully");
            setDeletingCustomer([]);
        } else {
            checkAndCreateToast('error', "Failed to Delete Users");
        }
        handleFetchAllUser();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    // Pagination Handlers
    const handlePrevPage = () => {
        if (pagination?.currentPage > 1) {
            setPage(pagination?.currentPage - 1);
            handleFetchAllUser();
        }
    };

    const handleNextPage = () => {
        if (pagination?.currentPage < pagination?.totalPages) {
            setPage(pagination?.currentPage + 1);
            handleFetchAllUser();
        } else {
            checkAndCreateToast('error', "No More Pages Available");
        }
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            {isLoading ? <LoadingView /> : (
                <div className="w-full min-h-full justify-start flex items-center flex-col">
                    <form onSubmit={handleSetActiveKeywords} className="mb-4 items-center flex flex-col space-y-2 ">
                        <Label className={"underline text-xs text-gray-600"}>Type "Clear" to Show All Customers.</Label>
                        <div className="w-fit justify-center items-center flex space-x-2">
                            <label htmlFor="search" className="mr-2">Keyword:</label>
                            <Input
                                type="text"
                                id="search"
                                value={inputKeyWoards}
                                onChange={(e) => setInputKeyWords(e.target.value)}
                                placeholder="Search by Name, Email, Phone..."
                                className="border px-4 py-2 rounded-lg w-64"
                            />
                            <Button type="submit" className="w-fit">Search</Button>
                        </div>
                    </form>

                    <div className="h-full w-full min-h-full space-x-1">
						<Label className={"uppercase justify-self-start mt-10"}> Page: {pagination?.currentPage} / {pagination?.totalPages} </Label>
						
						{deletingCustomer.length > 0 && (
							<Button className={"w-fit"} onClick={HandleDeleteCustomer} variant={"destructive"}>
								<Trash />
							</Button>
						)}

						{/* Table Section */}
						<table className="min-w-full table-auto text-sm text-gray-700">
							{/* Table Header */}
							<thead className="bg-gray-200">
								<tr>
									<th className="px-4 py-2 text-center">
										<Label>Select</Label>
										<Checkbox 
											id="selectAll" 
											className="w-4 h-4" 
											checked={deletingCustomer.length >= AllUser?.length} 
											onCheckedChange={handleSelectAllCustomer} 
										/>
									</th>
									<th className="px-4 py-2 text-center">Sr.</th>
									<th className="px-4 py-2 text-center">Customer Name</th>
									<th className="px-4 py-2 text-center">Email ID</th>
									<th className="px-4 py-2 text-center">Phone Number</th>
									<th className="px-4 py-2 text-center">Total Purchases</th>
									<th className="px-4 py-2 text-center">Wishlist Count</th>
									<th className="px-4 py-2 text-center">Actions</th>
								</tr>
							</thead>
							
							{/* Table Body */}
							<tbody>
								{AllUser.length > 0 && AllUser.map((customer, index) => (
									<tr key={customer._id} className="hover:bg-gray-100">
										{/* Select */}
										<td className="px-4 py-2 text-center">
											<Checkbox 
												id="delCheck" 
												checked={deletingCustomer.includes(customer._id)} 
												onCheckedChange={() => handleChangeCustomer(customer._id)} 
												className="w-4 h-4"
											/>
										</td>
										{/* Sr. */}
										<td className="px-4 py-2 text-center">{(page - 1) * pageSize + index + 1}</td>
										{/* Customer Name */}
										<td className="px-4 py-2 text-center">{customer?.name}</td>
										{/* Email */}
										<td className="px-4 py-2 text-center w-auto truncate">{customer?.email}</td>
										{/* Phone Number */}
										<td className="px-4 py-2 text-center">{customer?.phoneNumber}</td>
										{/* Total Purchases */}
										<td className="px-4 py-2 text-center">{customer?.totalPurchases}</td>
										{/* Wishlist Count */}
										<td className="px-4 py-2 text-center">{customer?.wishList?.length}</td>
										{/* Actions */}
										<td className="px-4 py-2 text-center">
											<Button 
												onClick={() => openModal(customer)} 
												className="bg-black text-white rounded-lg hover:bg-gray-800 my-2 w-full p-2"
											>
												<span className="text-xs">View Details</span>
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>


                    {/* Pagination Controls */}
                    <div className="flex justify-between w-full items-center mt-4">
                        <Button onClick={handlePrevPage} disabled={page === 1}>
                            Previous Page
                        </Button>
                        <Button onClick={handleNextPage} disabled={page === pagination?.totalPages}>
                            Next Page
                        </Button>
                    </div>
                </div>
            )}
            <Dialog open={isModalOpen && selectedCustomer !== null} onOpenChange={() => closeModal()}>
                {selectedCustomer && <CustomerDetailsSingle user={selectedCustomer} />}
            </Dialog>
        </div>
    );
}

export default UserTable;
