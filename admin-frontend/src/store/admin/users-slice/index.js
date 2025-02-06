import { BASE_URL, Header } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const adminCustomerSlice = createSlice({
    name:"adminAllUsers",
    initialState:{
        isLoading:false,
        AllUser:[]
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllCustomerWithDetails.pending,(state)=>{
            state.isLoading = true;
        }).addCase(getAllCustomerWithDetails.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.AllUser = action?.payload.result;
            console.log(action?.payload?.data);
        }).addCase(getAllCustomerWithDetails.rejected,(state,action)=>{
            state.isLoading = false;
            state.AllUser = [];
        })
    }
})
export const getAllCustomerWithDetails = createAsyncThunk('/users/getAllUsersWithDetails',async ()=>{
    try {
        const response = await axios.get(`${BASE_URL}/admin/customer/all`,Header());
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
})
export const removeCustomer = createAsyncThunk('/users/removeCustomer',async ({removingCustomerArray})=>{
    try {
        const response = await axios.patch(`${BASE_URL}/admin/customer/del`,{removingCustomerArray},Header());
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
})

export default adminCustomerSlice.reducer;