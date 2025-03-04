import { BASE_URL, Header } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
	isLoading:false,
	orders:null,
    orderId:null,
    cartId:null,
    orderList: [],
    orderDetails:null,
    Warehouses:[]
}
const adminOrderSlice = createSlice({
	name:'adminOrders',
    initialState,
    reducers:{
        resetOrderDetails:(state,action)=>{
            state.orderDetails = null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(adminGetAllOrders.pending,(state)=>{
            state.isLoading = true;
        }).addCase(adminGetAllOrders.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.orderList = action?.payload?.result || [];
        }).addCase(adminGetAllOrders.rejected,(state)=>{
            state.isLoading = false;
        }).addCase(adminGetUsersOrdersById.pending,(state)=>{
            state.isLoading = true;
        }).addCase(adminGetUsersOrdersById.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.orderDetails = action?.payload?.result;
        }).addCase(adminGetUsersOrdersById.rejected,(state)=>{
            state.isLoading = false;
            state.orderDetails = null;
        }).addCase(adminUpdateUsersOrdersById.pending,(state)=>{
            state.isLoading = true;
        }).addCase(adminUpdateUsersOrdersById.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.orderDetails = action?.payload?.result;
        }).addCase(adminUpdateUsersOrdersById.rejected,(state)=>{
            state.isLoading = false;
            state.orderDetails = null;
        }).addCase(fetchAllWareHouses.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAllWareHouses.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.Warehouses = action?.payload?.result;
        }).addCase(fetchAllWareHouses.rejected,(state,action)=>{
            state.isLoading = false;
        })
    }
})


export const adminGetAllOrders = createAsyncThunk('/orders/adminGetAllOrders',async()=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/orders/getAllOrders`,Header());
        console.log("Admin Get All Orders",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Admin fetching orders: `,error);
    }
})
export const adminGetUsersOrdersById = createAsyncThunk('/orders/adminGetOrderById',async(orderId)=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/orders/${orderId}`,Header());
        console.log("Fetching Order Id: ",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error adminGetOrderById orders: `,error);
    }
})
export const adminUpdateUsersOrdersById = createAsyncThunk('/orders/adminUpdateUsersOrdersById',async({orderId,status})=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.put(`${BASE_URL}/admin/orders/updateOrderStatus/${orderId}`,{status},Header());
        return response.data;
    } catch (error) {
        console.error(`Error adminUpdateUsersOrdersById orders: `,error);
    }
})



export const createNewWareHouse = createAsyncThunk('/logiscti/warehouse/createNewWareHouse',async(wareHouseData)=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.post(`${BASE_URL}/api/logistic/warehouse/create`,wareHouseData,Header());
        console.log("New WareHouse Created: ",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error creating new warehouse: `,error);
    }
})
export const fetchAllWareHouses = createAsyncThunk('/logistic/warehouse/fetchAllWareHouses',async()=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/api/logistic/warehouse`,Header());
        // console.log("All WareHouses: ",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching all warehouses: `,error);
    }
})
export const deleteWareHouse = createAsyncThunk('/logistic/warehouse/deleteWareHouse',async({wareHouseId})=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.delete(`${BASE_URL}/api/logistic/warehouse/${wareHouseId}`,Header());
        console.log("WareHouse Deleted: ",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting warehouse: `,error);
    }
})
export const fetchWareHouseById = createAsyncThunk('/logistic/warehouse/byid',async({wareHouseId})=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`${BASE_URL}/api/logistic/warehouse/${wareHouseId}`,Header());
        console.log("WareHouse By Id: ",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching warehouse by id: `,error);
    }
})

export const {resetOrderDetails} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;