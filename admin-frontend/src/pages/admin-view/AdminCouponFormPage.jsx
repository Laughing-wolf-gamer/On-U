import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { createNewCoupon, deleteCoupon, editCoupon, fetchAllCoupons } from '@/store/admin/product-slice';
import { fetchAllOptions } from '@/store/common-slice';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const AdminCouponFormPage = () => {
    const { Coupons } = useSelector(state => state.adminProducts);
    const { AllOptions } = useSelector(state => state.common);
    const dispatch = useDispatch();

    // State to handle form data and coupons list
    const [couponName, setCouponName] = useState('');
    const [couponDescription, setCouponDescription] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponType, setCouponType] = useState('Percentage');
    const [discount, setDiscount] = useState('');
    const [minOrderAmount, setMinOrderAmount] = useState(0);
    const [customerLogin, setCustomerLogin] = useState(false);
    const [freeShipping, setFreeShipping] = useState(false);
    const [category, setCategory] = useState('');
    const [validDate, setValidDate] = useState('');
    const [status, setStatus] = useState('Active');
    const [modalCoupon, setModalCoupon] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');  // To filter orders by status
    
    // State to control the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sorting state
    const [sortOption, setSortOption] = useState('latest');
    const [sortedCoupons, setSortedCoupons] = useState(Coupons);

    
    const handleRemoveCoupon = async (couponId) => {
        await dispatch(deleteCoupon({ couponId }));
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        if(e){
            e.preventDefault();
        }
        const newCoupon = {
            couponName,
            couponCode,
            couponDescription,
            couponType,
            discount,
            minOrderAmount,
            customerLogin,
            freeShipping,
            category,
            status,
            validDate: validDate || '',
        };
        if (modalCoupon === null) {
            console.log("New Coupon: ", newCoupon);
            await dispatch(createNewCoupon({ couponData: newCoupon }));
            toast.success("Coupon created successfully")
        } else {
            console.log("Editing Coupon: ", modalCoupon);
            await dispatch(editCoupon({ couponId: modalCoupon._id, couponData: newCoupon }));
            toast.success("Coupon updated successfully")
        }
        resetForm();
        setModalCoupon(null);
        setIsModalOpen(false);  // Close the modal after submission
        dispatch(fetchAllCoupons());
    };

    // Reset the form fields after submission
    const resetForm = () => {
        setCouponName('');
        setCouponDescription('');
        setCouponCode('');
        setCouponType('Percentage');
        setDiscount('');
        setMinOrderAmount(0);
        setCustomerLogin(false);
        setFreeShipping(false);
        setCategory('');
        setValidDate('');
        setStatus('Active');
    };

    // Open the modal to edit coupon
    const openEditModal = (coupon) => {
        setCouponName(coupon?.CouponName);
        setCouponDescription(coupon?.Description);
        setCouponCode(coupon?.CouponCode);
        setCouponType(coupon?.CouponType);
        setDiscount(coupon?.Discount);
        setMinOrderAmount(coupon?.MinOrderAmount);
        setCustomerLogin(coupon?.CustomerLogin);
        setFreeShipping(coupon?.FreeShipping);
        setCategory(coupon?.Category);
        setValidDate(coupon.ValidDate);
        setStatus(coupon?.Status);
        setModalCoupon(coupon);
        setIsModalOpen(true)
    };

    useEffect(() => {
        dispatch(fetchAllCoupons());
        dispatch(fetchAllOptions());
    }, [dispatch]);
	console.log("validDate: ",validDate)
    useEffect(() => {
        let sortedCoupons = [...Coupons];

        switch (sortOption) {
            case 'latest':
                sortedCoupons = sortedCoupons.sort((a, b) => new Date(b.ValidDate) - new Date(a.ValidDate));
                break;
            case 'oldest':
                sortedCoupons = sortedCoupons.sort((a, b) => new Date(a.ValidDate) - new Date(b.ValidDate));
                break;
            case 'discountLowToHigh':
                sortedCoupons = sortedCoupons.sort((a, b) => a.Discount - b.Discount);
                break;
            case 'discountHighToLow':
                sortedCoupons = sortedCoupons.sort((a, b) => b.Discount - a.Discount);
                break;
            default:
                break;
        }

        setSortedCoupons(sortedCoupons);
    }, [Coupons, sortOption]);

    console.log("Coupon: ", Coupons);
    console.log("Modal opened: ", modalCoupon);
    const allCategories = AllOptions && AllOptions.length > 0 && AllOptions.filter(item => item.type === 'category') || [];

    // Check if there are no orders available
    const isNoCoupons = !Coupons || Coupons.length === 0;
    const filteredOrderList = sortedCoupons && sortedCoupons.length > 0 && sortedCoupons.filter(coupon => {
        if (statusFilter === '') return true; // No filter selected, show all orders
        return coupon?.Status === statusFilter;
    });

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">All Coupons</h2>
            <div className='w-full justify-between space-x-5 flex flex-row items-center'>
				<Select
					value={sortOption}
					onValueChange={(value) => setSortOption(value)}
					className="w-fit  bg-black text-white py-2 px-4 rounded-md"
				>
					<SelectTrigger className="w-full border border-gray-300 rounded-md">
						<SelectValue className="text-black" placeholder = {"Sort"}/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="latest">Latest</SelectItem>
						<SelectItem value="oldest">Oldest</SelectItem>
						<SelectItem value="discountLowToHigh">Discount: Low to High</SelectItem>
						<SelectItem value="discountHighToLow">Discount: High to Low</SelectItem>
					</SelectContent>
				</Select>
                {/* Button to trigger modal */}
				
                <Select 
                    className="w-fit bg-black text-white py-2 px-4 rounded-md"
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                >
					<SelectTrigger className="w-full border border-gray-300 rounded-md">
							<SelectValue className="text-black" placeholder = {"Filter"}/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">Filter Status (All)</SelectItem>
							<SelectItem value="Inactive">In Active</SelectItem>
							<SelectItem value="Active">Active</SelectItem>
						</SelectContent>
                </Select>
				<button 
					onClick={() => setIsModalOpen(true)} 
					className="w-fit bg-black whitespace-nowrap text-white py-2 px-4 rounded-md mb-4"
				>
					Create Coupon
				</button>

            </div>
            
            {isNoCoupons && (
                <div className="text-center p-4 mb-4 border border-gray-200 rounded-lg shadow-sm bg-gray-100">
                    <span className="text-lg font-semibold text-gray-800">No Coupons Available</span>
                </div>
            )}

            {/* All Coupons List */}
            {!isNoCoupons && (
                <div className="hidden sm:block">
                    {/* Table Header */}
                    <div className="grid grid-cols-7 text-center gap-4 p-4 bg-gray-100 font-semibold text-sm sm:text-base">
                        <div>Coupon Name</div>
                        <div>Coupon Code</div>
                        <div>Coupon Status</div>
                        <div>Coupon Type</div>
                        <div>Discount Amount</div>
                        <div className="text-center">Details</div>
                        <div className="text-center">Coupon Remove</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {
                            filteredOrderList && filteredOrderList && filteredOrderList.length > 0 && filteredOrderList.map((coupon) => (
                                <div key={coupon?._id} className="grid text-center grid-cols-7 gap-4 p-4 hover:bg-gray-100">
                                    <div className="text-sm sm:text-base">{coupon?.CouponName}</div>
                                    <div className="text-sm sm:text-base">{coupon?.CouponCode}</div>
                                    <div className="text-sm sm:text-base">
                                        <Badge className={`justify-center items-center py-1 px-3 hover:bg-transparent hover:shadow-md ${coupon.Status === "Active" ?"bg-green-600":"bg-red-600"} hover:bg-gray-600 text-white`}>
                                            {coupon.Status}
                                        </Badge>
                                    </div>
                                    <div className="text-sm sm:text-base">{coupon?.CouponType}</div>
                                    <div className="text-sm sm:text-base">{coupon?.Discount} </div>
                                    <div className="text-sm sm:text-base text-center">
                                        <Button onClick={() => openEditModal(coupon)} className="btn btn-primary text-xs sm:text-sm">
                                            View Details
                                        </Button>
                                    </div>
                                    <div className="text-sm sm:text-base text-center">
                                        <Button onClick={() => handleRemoveCoupon(coupon?._id)} className="bg-red-400 hover:bg-red-300 text-xs sm:text-sm">
                                            <X />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
            {/* Mobile-optimized layout */}
            <div className="sm:hidden">
                    {
                        Coupons && Coupons.length > 0 && Coupons.map((coupon) => (
                            <div key={coupon?._id} className="p-4 mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
                                <div className="flex flex-col space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">Coupon Name:</span>
                                        <span className="text-sm">{coupon?.CouponName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">Coupon Code:</span>
                                        <span className="text-sm">{coupon?.CouponCode}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">Coupon Discount:</span>
                                        <span className="text-sm">
                                            <Badge className={`py-1 px-3`}>{coupon?.Discount}</Badge>
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-sm">Coupon Price:</span>
                                        <span className="text-sm">₹ {coupon?.TotalAmount}</span>
                                    </div>
                                    <Button 
                                        onClick={() => openEditModal(coupon)}
                                        className="btn btn-primary mt-2 w-full text-sm"
                                    >
                                        View Details
                                    </Button>
                                    <Button 
                                        onClick={() => handleRemoveCoupon(coupon?._id)}
                                        className="btn btn-primary mt-2 w-full text-sm bg-red-400 hover:bg-red-300"
                                    >
                                        <X/>
                                    </Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
				<Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
					<DialogContent className="max-h-[70vh] overflow-y-auto p-4">
						<DialogTitle>
						Coupon Details:
						</DialogTitle>
						<div className="bg-white p-6 rounded-lg shadow-lg w-full">
						<h2 className="text-xl font-bold mb-4 text-center">{modalCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
						<form className="space-y-4">
							<input
								type="text"
								placeholder="Coupon Name"
								value={couponName}
								onChange={(e) => setCouponName(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
								required
							/>
							<textarea
								type="text"
								placeholder="Coupon Description"
								value={couponDescription}
								onChange={(e) => setCouponDescription(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
								rows="6"
							/>
							<input
								type="text"
								placeholder="Coupon Code"
								value={couponCode}
								onChange={(e) => setCouponCode(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
								required
							/>

							<Select
								value={couponType}
								onValueChange={(value) => {
									console.log("Coupon Type: " + value); // Log the selected value
									setCouponType(value); // Update your state
								}}
								id="coupon-type"
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							>
								<SelectTrigger className="w-full border border-gray-300 rounded-md">
									<SelectValue className="text-black" placeholder="Select Coupon Type" />
								</SelectTrigger>
								<SelectContent>
									{['Percentage', 'Price'].map((value, index) => (
										<SelectItem key={index} value={value}>
											{value}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<input
								type="number"
								placeholder="Discount"
								value={discount}
								onChange={(e) => setDiscount(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
							<input
							type="number"
							placeholder="Min Coupon Amount"
							value={minOrderAmount}
							onChange={(e) => setMinOrderAmount(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
							<label className="flex items-center justify-start">
							<input
								type="checkbox"
								checked={customerLogin}
								onChange={() => setCustomerLogin(!customerLogin)}
								className="mr-2"
							/>
							Customer Login Required
							</label>
							<label className="flex items-center justify-start">
							<input
								type="checkbox"
								checked={freeShipping}
								onChange={() => setFreeShipping(!freeShipping)}
								className="mr-2"
							/>
							Free Shipping
							</label>
							<Select
								value={category}
								onValueChange={(value) => setCategory(value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
								id = {"category"}
							>
								<SelectTrigger className="w-full border border-gray-300 rounded-md">
									<SelectValue className="text-black" placeholder = {"Select Category"}/>
								</SelectTrigger>
								<SelectContent>
								<SelectItem value={'none'}>Default</SelectItem>
									{allCategories && allCategories.length > 0 && allCategories.map((cat) => (
										<SelectItem key={cat.value} value={cat.value}>{cat.value}</SelectItem>
									))}
								</SelectContent>
							</Select>

							<DatePicker
								selected={validDate}
								onChange={(date) => setValidDate(date)}
								dateFormat="yyyy-MM-dd"
								placeholderText="Select a date"
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							/>
							<Select
								value={status}
								onValueChange={(value) => setStatus(value)}
								id = {"status"}
								className="w-full px-4 py-2 border border-gray-300 rounded-md"
							>
								<SelectTrigger className="w-full border border-gray-300 rounded-md">
									<SelectValue className="text-black" placeholder = {"Select Status"}/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>

							<div className="flex justify-between">
								<Button onClick={handleSubmit} type="submit" className="text-white px-6 py-2 rounded-md">
									{modalCoupon ? 'Update' : 'Create'}
								</Button>
							</div>
						</form>
						</div>
					</DialogContent>
					</Dialog>

            {/* Create Coupon Modal */}

        </div>
    );
};

export default AdminCouponFormPage;
