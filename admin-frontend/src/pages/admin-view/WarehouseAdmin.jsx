import { Button } from '@/components/ui/button';
import { createNewWareHouse, deleteWareHouse, fetchAllWareHouses } from '@/store/admin/order-slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WarehouseAdmin = () => {
    const{Warehouses} = useSelector(state => state.adminOrder);
    const dispatch = useDispatch();
    const[filteredWarehouses,setFilteredWarehouses] = useState([]);
    const[countries,setCountries] = useState([]);
    const[states,setStates] = useState([]);
    // State to store warehouse locations

    // State for form inputs
    const [formData, setFormData] = useState({
        pincode: '',
        country: '',
        state: '',
        address: '',
    });

    // State for search filters
    const [search, setSearch] = useState({
        country: '',
        state: '',
    });

    // Example options for countries and states (you can customize this)
    /* const countries = ['India', 'USA', 'Canada'];
    const states = {
        India: ['Delhi', 'Mumbai', 'Kolkata'],
        USA: ['New York', 'California', 'Texas'],
        Canada: ['Ontario', 'Quebec', 'British Columbia'],
    }; */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    const handleAddWarehouse = async () => {
        // const newWarehouse = { ...formData, id: warehouses.length + 1 };
        await dispatch(createNewWareHouse({...formData}))
        dispatch(fetchAllWareHouses());
        // setWarehouses([...warehouses, newWarehouse]);
        setFormData({ pincode: '', country: '', state: '', address: '' });
    };

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
                  .sort((a, b) => a.pincode.localeCompare(b.pincode)))
        }
    },[Warehouses])

    // Filter and sort warehouses
    console.log("states: ",states)
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
            <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
                onClick={handleAddWarehouse}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
            Add Warehouse
            </button>
        </div>

        {/* Warehouse List Table */}
        <table className="w-full border-collapse">
            <thead>
            <tr>
                <th className="border px-4 py-2">Pincode</th>
                <th className="border px-4 py-2">Country</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filteredWarehouses.map((warehouse) => (
                <tr key={warehouse._id}>
                <td className="border px-4 py-2">{warehouse.pincode}</td>
                <td className="border px-4 py-2">{warehouse.country}</td>
                <td className="border px-4 py-2">{warehouse.state}</td>
                <td className="border px-4 py-2">{warehouse.address}</td>
                <td className="border px-4 py-2 flex space-x-2">
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
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default WarehouseAdmin;
