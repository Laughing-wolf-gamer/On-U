import { BASE_URL, Header } from "@/config";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const adminProductSlice = createSlice({
    name:"adminProducts",
    initialState:{
        isLoading:false,
        products:[],
        Coupons:[],
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllProducts.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.products = action?.payload.result;
            console.log(action?.payload?.data);
        }).addCase(fetchAllProducts.rejected,(state,action)=>{
            state.isLoading = false;
            state.products = [];
        }).addCase(fetchAllCoupons.pending,(state,action)=>{
            state.isLoading = true;
        }).addCase(fetchAllCoupons.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.Coupons = action?.payload.result;
        }).addCase(fetchAllCoupons.rejected,(state) =>{
            state.isLoading = false;
            state.Coupons = [];
        })
    }
})
export const getProductsById = createAsyncThunk('/products/getProductsById',async (id)=>{
    try {
        const response = await axios.get(`${BASE_URL}/admin/product/get/${id}`,Header());
        return response.data;
    } catch (error) {
        console.error(error);
    }
})
export const addNewProduct = createAsyncThunk('/products/addNewProduct',async (formData)=>{
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        const response = await axios.post(`${BASE_URL}/admin/product/add`,formData,Header());
        return response.data;
    } catch (error) {
        console.error(error);
    }
})
export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts',async ()=>{
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/product/all`,Header());
        return response.data;
    } catch (error) {
        console.error("Error Fetching all Products",error);
    }
})
export const editProducts = createAsyncThunk('/products/edit',async ({id,formData})=>{
    try {
        // const token = sessionStorage.getItem('token');
        console.log(formData);
        const response = await axios.put(`${BASE_URL}/admin/product/edit/${id}`,formData,Header());
        return response?.data;
    } catch (error) {
        console.error("Error Editing Products: ",error);
    }
})
export const delProducts = createAsyncThunk('/products/del',async (id)=>{
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        const response = await axios.delete(`${BASE_URL}/admin/product/del/${id}`,Header());
        return response?.data;
    } catch (error) {
        console.error(error);
    }
})


export const createNewCoupon = createAsyncThunk('/admin/product/createCoupon',async({couponData}) =>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.post(`${BASE_URL}/admin/product/coupons/create`,couponData,Header());
        return response?.data;
    } catch (error) {
        console.error("Error creating coupon: ",error);
    }
})
export const editCoupon = createAsyncThunk('/admin/product/coupons/edit',async({couponId,couponData})=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.put(`${BASE_URL}/admin/product/coupons/edit/${couponId}`,couponData,Header());
        return response?.data;
    } catch (error) {
        console.error("Error editing coupon: ",error);
    }
})

export const deleteCoupon = createAsyncThunk('/admin/product/coupons/delete',async({couponId})=>{
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        const response = await axios.delete(`${BASE_URL}/admin/product/coupons/remove/${couponId}`,Header());
        return response?.data;
    } catch (error) {
        console.error("Error deleting coupon: ",error);
    }
})

export const fetchAllCoupons = createAsyncThunk('/admin/product/coupons/all',async()=>{
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        const response = await axios.get(`${BASE_URL}/admin/product/coupons/all`,Header());
        return response?.data;
    } catch (error) {
        console.error("Error fetching all coupon");
        return [];
    }
})


export default adminProductSlice.reducer;