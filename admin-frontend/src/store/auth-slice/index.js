import { BASE_URL, Header } from "@/config"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"


const initialState= {
	isAuthenticated: false,
	isLoading:true,
	user:null,
    token:null,
}
const authSlice = createSlice({
	name:'auth',
	initialState,
	reducers:{
		setUser:(state,action)=>{},
        resetTokenCredentials:(state)=>{
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            // sessionStorage.removeItem("token")
        }
	},
    extraReducers:(builder)=>{
        builder.addCase(registerUser.pending,(state)=>{
            state.isLoading = true;
        }).addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        }).addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        }).addCase(loginUser.pending,(state)=>{
            state.isLoading = true;
        }).addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = !action?.payload?.Success ? false:true;
            state.user = !action?.payload?.Success ? null:action?.payload?.user;
            state.token = action?.payload?.token;
            console.log("tokens: ",action?.payload?.token)
            sessionStorage.setItem("token",action?.payload?.token)
        }).addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            // sessionStorage.removeItem("token")
        }).addCase(checkAuth.pending,(state)=>{
            state.isLoading = true;
        }).addCase(checkAuth.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = action?.payload?.Success;
            state.user = !action?.payload?.Success ? null:action?.payload?.user;
        }).addCase(checkAuth.rejected,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            
        }).addCase(logoutUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isAuthenticated = false
            state.user = null
        })
    }
})
export const registerUser = createAsyncThunk('/auth/register',
    async(formData)=>{
        try {
            console.log(formData);
            const response = await axios.post(`${BASE_URL}/admin/auth/register`,formData,{
                withCredentials:true,
            });
            console.log('response',response);
            return response.data;
        } catch (error) {
            console.error(error);
            return {Success:false,message:error.message};
        }
    }
)
export const loginUser = createAsyncThunk('/auth/login',
    async(formData)=>{
        try {
            console.log(formData);
            const response = await axios.post(`${BASE_URL}/admin/auth/login`,formData,{
                withCredentials:true,
            });
            console.log('Log In Response: ',response);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const logoutUser = createAsyncThunk('/auth/logout',
    async()=>{
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/logout`,{},{
                withCredentials:true,
            });
            console.log('response',response);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
)
export const checkAuth = createAsyncThunk('/auth/checkAuth',
    async ()=>{
        try {
            const response = await axios.get(`${BASE_URL}/admin/auth/check-auth`,Header());
            console.log('Check Auth response',response.data);
            return response.data;
        } catch (error) {
            console.error("Error Checking Auth", error);
        }
    }
)



export const { setUser,resetTokenCredentials } = authSlice.actions;
export default authSlice.reducer;