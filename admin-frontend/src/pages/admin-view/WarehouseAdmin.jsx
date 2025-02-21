import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createNewWareHouse, deleteWareHouse, fetchAllWareHouses } from '@/store/admin/order-slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const defaultData = {
	pickup_location: '',
	name:'',
	email:'',
	phone:'',
	pin_code:'',
	state:'',
	address:'',
	address_2:'',
	city:'',
	country: '',
}
const WarehouseAdmin = () => {
    const{Warehouses} = useSelector(state => state.adminOrder);
    const dispatch = useDispatch();
    const[filteredWarehouses,setFilteredWarehouses] = useState([]);
    const[countries,setCountries] = useState([]);
    const[states,setStates] = useState([]);
    // State to store warehouse locations

    // State for form inputs
    const [formData, setFormData] = useState(defaultData);

    // State for search filters
    const [search, setSearch] = useState({
        country: '',
        state: '',
    });

    const handleChange = (e) => {
		e.preventDefault();
		
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleAddWarehouse = async () => {
        // const newWarehouse = { ...formData, id: warehouses.length + 1 };
		if(!formData.name ||!formData.email ||!formData.phone ||!formData.pin_code ||!formData.state ||!formData.address ||!formData.city ||!formData.country ){
			toast.error('All fields are required');
			return;
		}
		if(!checkValidAddressLine(formData.address)){
			toast.error('Address should start with House/Flat/Road no.');
			return;
		}
        await dispatch(createNewWareHouse({...formData}))
        dispatch(fetchAllWareHouses());
        // setFormData(defaultData);
    };
	const checkValidAddressLine = (currentValue) => {
		const checkAddressLineRegex = /(?:Flat\s*no|Road\s*no)/;
		if(!checkAddressLineRegex.test(currentValue)){
			/* currentValue = currentValue.replace(checkAddressLineRegex, '');
			setFormData({...formData, [e.target.name]: currentValue }); */
			return false;
		}
		return true;
	}
    const handleDeleteWarehouse = async (id) => {
        console.log('DeleteWarehouse', id);
        // const updatedWarehouses = warehouses.filter((warehouse) => warehouse._id!== id);
        // setWarehouses(updatedWarehouses);
        await dispatch(deleteWareHouse({wareHouseId:id}));
        dispatch(fetchAllWareHouses()); // Refreshing the warehouses list after deletion
    };

    const handleEditWarehouse = (id) => {
        console.log('EditWarehouse', id);
        const warehouseToEdit = Warehouses.find((warehouse) => warehouse._id === id);
        console.log('Warehouse to edit', warehouseToEdit)
        setFormData({ ...warehouseToEdit });
    };
    useEffect(()=>{
        dispatch(fetchAllWareHouses());
    },[dispatch])
    useEffect(()=>{
        if(Warehouses){
            setCountries(Warehouses.map((warehouse) => warehouse.country))
            setStates(Warehouses.map((warehouse) => warehouse.state))
            setFilteredWarehouses(Warehouses
                .filter((warehouse) =>
                    (search.country ? warehouse.country.toLowerCase().includes(search.country.toLowerCase()) : true) &&
                    (search.state ? warehouse.state.toLowerCase().includes(search.state.toLowerCase()) : true)
                  )
                  .sort((a, b) => a.pickup_location.localeCompare(b.pickup_location)))
        }
    },[Warehouses])

    // Filter and sort warehouses
    console.log("states: ",states)
	
    return (
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-semibold mb-4 text-center">Warehouse Admin Page</h2>

			<div className="mb-4 flex space-x-4">
				{/* Country Filter */}
				<select
					name="country"
					value={search.country}
					onChange={handleSearchChange}
					className="p-2 border border-gray-300 rounded-md w-full"
				>
				<option value="">Filter by country</option>
					{countries && countries.length > 0 && countries.map((country,i) => (
						<option key={i} value={country}>
						{country}
						</option>
					))}
				</select>

				{/* State Filter */}
				<select
					name="state"
					value={search.state}
					onChange={handleSearchChange}
					className="p-2 border border-gray-300 rounded-md w-full"
				>
				<option value="">Filter by state</option>
				{search.country 
					? states.map((state) => (
						<option key={state} value={state}>
						{state}
						</option>
					))
					: null}
				</select>
			</div>

			{/* Warehouse Form */}
			<div className="mb-6 space-y-4">
				<div>
					<Label htmlFor="pickup_location" className="block text-sm font-semibold text-gray-700">Pickup Location</Label>
					<Input
						type="text"
						name="pickup_location"
						value={formData.pickup_location}
						onChange={handleChange}
						placeholder="Pickup Location"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="pin_code" className="block text-sm font-semibold text-gray-700">Pin Code</Label>
					<Input
						type="text"
						name="pin_code"
						value={formData.pin_code}
						onChange={handleChange}
						placeholder="Pin Code"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</Label>
					<Input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Name"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</Label>
					<Input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Email"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</Label>
					<Input
						type="phone"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						placeholder="Phone Number"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country</Label>
					<Input
						type="text"
						name="country"
						value={formData.country}
						onChange={handleChange}
						placeholder="Country"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="state" className="block text-sm font-semibold text-gray-700">State</Label>
					<Input
						type="text"
						name="state"
						value={formData.state}
						onChange={handleChange}
						placeholder="State"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="city" className="block text-sm font-semibold text-gray-700">City</Label>
					<Input
						type="text"
						name="city"
						value={formData.city}
						onChange={handleChange}
						placeholder="City"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address (Flat No./ Street No.)</Label>
					<Input
						type="text"
						name="address"
						value={formData.address}
						onChange={handleChange}
						placeholder="Example = Flat no 101, Some Road."
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<div>
					<Label htmlFor="address_2" className="block text-sm font-semibold text-gray-700">Address Line 2</Label>
					<Input
						type="text"
						name="address_2"
						value={formData.address_2}
						onChange={handleChange}
						placeholder="Address Line 2"
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				<Button
					onClick={handleAddWarehouse}
					className="w-full text-white p-2 rounded-md"
				>
					Add Warehouse
				</Button>
			</div>


			{/* Warehouse List Table */}
			<div className="tabs-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 p-4 gap-6 overflow-x-auto">
				
				{filteredWarehouses.map((warehouse,index) => {
					const action = warehouse;
					return(
						<div
							key={action?._id || index}
							className="tab-pane border border-gray-300 rounded-lg p-4"
						>
							<div className="grid grid-cols-2 gap-4">
								<div className="info-item">
									<strong>Name: </strong>
									{action?.name}
								</div>
								<div className="info-item">
									<strong>Pickup Location: </strong>
									{action?.pickup_location}
								</div>
								<div className="info-item">
									<strong>Email: </strong>
									{action?.email}
								</div>
								<div className="info-item">
									<strong>Phone: </strong>
									{action?.phone}
								</div>
								<div className="info-item">
									<strong>Pin Code: </strong>
									{action?.pin_code}
								</div>
								<div className="info-item">
									<strong>Country: </strong>
									{action?.country}
								</div>
								<div className="info-item">
									<strong>State: </strong>
									{action?.state}
								</div>
								<div className="info-item">
									<strong>Address: </strong>
									{action?.address}
								</div>
								<div className="info-item">
									<strong>Address 2: </strong>
									{action?.address_2}
								</div>
								<div className="info-item">
									<strong>City: </strong>
									{action?.city}
								</div>
								<div className="info-item">
									<strong>State: </strong>
									{action?.state}
								</div>
								<div className="info-item">
									<strong>Country: </strong>
									{action?.country}
								</div>
							</div>

							<div className="flex space-x-2 mt-4">
								<Button
									onClick={() => handleEditWarehouse(warehouse._id)}
									className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
								>
									Edit
								</Button>
								<Button
									onClick={() => handleDeleteWarehouse(warehouse._id)}
									className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
								>
									Delete
								</Button>
							</div>
						</div>
					)
				})}
			</div>

        </div>
    );
};

export default WarehouseAdmin;
