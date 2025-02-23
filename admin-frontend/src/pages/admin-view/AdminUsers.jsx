import { useState, useEffect } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getAllCustomerWithDetails, removeCustomer } from "@/store/admin/users-slice";
import CustomerDetailsSingle from "@/components/admin-view/CustomerDetailsSingle";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingView from "./LoadingView";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
const pageSize = 10;

const UserTable = () => {
    const dispatch = useDispatch();
    const [filterQueryLink, setFilterQueryLink] = useState("");
	const[checkAll,setCheckAll] = useState(false);
    const [deletingCustomer, setDeletingCustomer] = useState([]);
	const[activeKeywords, setActiveKeywords] = useState(''); // State to manage the active search keywords
    const [inputKeyWoards, setInputKeyWords] = useState(""); // State to manage the search keywords
    const [page, setPage] = useState(1);  // Current page
    
    const { AllUser, pagination, isLoading, totalUsers } = useSelector(state => state.Customer); // Assuming `totalUsers` gives the total count
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleFetchAllUser = () => {
        const queryParams = `?page=${page}&pageSize=${pageSize}&keywoards=${activeKeywords}`; // Include keyWoards in the query
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
	useEffect(()=>{
		if(checkAll){
			setDeletingCustomer(AllUser.map(customer => customer._id));
		}else{
			setDeletingCustomer([]);
		}
	},[checkAll])
	const handleSelectAllCustomer = ()=>{
		setCheckAll(!checkAll);
		setDeletingCustomer(AllUser.map(customer => customer._id));
	}
	const handleSetActiveKeywords = (e) => {
		e.preventDefault();
        setActiveKeywords(inputKeyWoards);
    };
	
    useEffect(() => {
        handleFetchAllUser();
    }, [dispatch, page, pageSize, activeKeywords]); // Fetch data when keywords change

    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const HandleDeleteCustomer = async (e) => {
        e.preventDefault();
        const response = await dispatch(removeCustomer({ removingCustomerArray: deletingCustomer }));
        if (response?.payload?.Success) {
            toast.success("Users Deleted Successfully");
            setDeletingCustomer([]);
        } else {
            toast.error("Failed to Delete Users");
        }
        handleFetchAllUser();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };
    // Pagination Handlers
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            handleFetchAllUser();
        }
    };

    const handleNextPage = () => {
        if (page < pagination?.totalPages) {
            setPage(page + 1);
            handleFetchAllUser();
        }
    };
	console.log("selectedCustomer: ",selectedCustomer,isModalOpen);
    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            {isLoading ? <LoadingView /> : (
                <div className="overflow-x-auto min-w-[300px] min-h-full justify-start flex items-center flex-col">

					{/* Search Bar */}
					<form onSubmit={handleSetActiveKeywords} className="mb-4 items-center flex flex-col space-y-2">
						<Label className = {"underline text-xs text-gray-600"}>Type "Clear" to Show All Customers.</Label>
						<div className="w-fit justify-center items-center flex">
							<label htmlFor="search" className="mr-2">Keyword:</label>
							<Input
								type="text"
								id="search"
								value={inputKeyWoards}
								onChange={(e) => setInputKeyWords(e.target.value)}
								placeholder="Search by Name, Email, Phone..."
								className="border px-4 py-2 rounded-lg w-64"
							/>
						</div>
					</form>

					<div className="h-full w-full min-h-full space-x-1 overflow-x-auto">
						<Label className = {"uppercase justify-self-start mt-10"}> Page: {pagination?.currentPage} / {pagination?.totalPages} </Label>
						{deletingCustomer.length > 0 && (
							<Button className = {"w-fit"} onClick={HandleDeleteCustomer} variant={"destructive"}>
								<Trash/>
							</Button>
						)}
						{/* Header Section */}
						<div className="grid grid-cols-8 min-w-full gap-5 text-sm font-semibold text-gray-700 bg-gray-200">
							<div className="px-4 py-2 flex flex-row justify-center items-center space-x-1">
								<Label>Select</Label>
								<Checkbox id="selectAll" className="w-4 h-4" checked = {deletingCustomer.length >= AllUser?.length} onCheckedChange ={handleSelectAllCustomer} />
								
							</div>
							<div className="px-4 py-2 text-center">Sr.</div>
							<div className="px-4 py-2 text-center">Customer Name</div>
							<div className="px-4 py-2 text-center">Email ID</div>
							<div className="px-4 py-2 text-center">Phone Number</div>
							<div className="px-4 py-2 text-center">Total Purchases</div>
							<div className="px-4 py-2 text-center">Wishlist Count</div>
							<div className="px-4 py-2 text-center">Actions</div>
						</div>

						{/* Data Rows */}
						{AllUser.length > 0 && AllUser.map((customer, index) => (
						<div key={customer._id} className="grid grid-cols-8 gap-5 w-full text-sm hover:bg-gray-100">
							{/* Select */}
							<div className="w-auto justify-center flex items-center text-center">
								<Checkbox
									id="delCheck"
									checked={deletingCustomer.includes(customer._id)}
									onCheckedChange={() => handleChangeCustomer(customer._id)}
									className="w-4 h-4"
								/>
							</div>
							{/* Sr. */}
							<div className="px-4 py-2 text-center">{(page - 1) * pageSize + index + 1}</div>
							{/* Customer Name */}
							<div className="px-4 py-2 text-center">{customer?.name}</div>
							{/* Email */}
							<div className="px-4 py-2 text-center w-auto truncate">{customer?.email}</div>
							{/* Phone Number */}
							<div className="px-4 py-2 text-center">{customer?.phoneNumber}</div>
							{/* Total Purchases */}
							<div className="px-4 py-2 text-center">{customer?.totalPurchases}</div>
							{/* Wishlist Count */}
							<div className="px-4 py-2 text-center">{customer?.wishList?.length}</div>
							{/* Actions */}
							<Button
							onClick={() => openModal(customer)}
							className="bg-black text-white rounded-lg hover:bg-gray-800 my-2 w-full text-center p-4"
							>
							<span className="text-xs">View Details</span>
							</Button>
						</div>
						))}
					</div>

					{/* Pagination Controls */}
					<div className="flex justify-between w-full items-center mt-4">
						<Button onClick={handlePrevPage} disabled={page === 1}>
							Previous Page
						</Button>
						<Button onClick={handleNextPage} disabled={page * pageSize >= totalUsers}>
							Next Page
						</Button>
					</div>
					
					{/* Modal - User Details */}
					{/* {isModalOpen && selectedCustomer && (
						<div
							className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
							onClick={closeModal}
						>
							<div
								className="w-full max-w-4xl sm:max-w-6xl relative bg-white rounded-lg p-4"
								onClick={(e) => e.stopPropagation()}
							>
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
					)} */}
					</div>

            )}
			<Dialog open = {isModalOpen && selectedCustomer !== null} onOpenChange={()=>{
				closeModal();
			}}>
				{selectedCustomer && <CustomerDetailsSingle user={selectedCustomer} />}
			</Dialog>
        </div>
	);
}

export default UserTable;
