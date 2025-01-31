import { BASE_URL, filterOptions, Header } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
	isLoading:false,
	featuresList:[],
    AllOptions:[],
    aboutData:null,
    convenienceFees:0,
    addressFormFields:[],
    ContactUsPageData:null,
    filterOptions:null,

}
const commonSlice = createSlice({
	name:'common',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addFeaturesImage.pending,(state)=>{
            state.isLoading = true;
        }).addCase(addFeaturesImage.fulfilled,(state,action)=>{
            state.isLoading = false;
			state.featuresList = action?.payload?.result;
        }).addCase(addFeaturesImage.rejected,(state)=>{
            state.isLoading = false;
			state.featuresList = null;
        }).addCase(getFeatureImage.pending,(state)=>{
            state.isLoading = true;
        }).addCase(getFeatureImage.fulfilled,(state,action)=>{
            state.isLoading = false;
			state.featuresList = action?.payload?.result;
        }).addCase(getFeatureImage.rejected,(state)=>{
            state.isLoading = false;
			state.featuresList = [];
        }).addCase(delFeatureImage.pending,(state)=>{
            state.isLoading = true;
        }).addCase(delFeatureImage.fulfilled,(state,action)=>{
            state.isLoading = false;
			state.featuresList = action?.payload?.result;
        }).addCase(delFeatureImage.rejected,(state)=>{
            state.isLoading = false;
			state.featuresList = [];
        }).addCase(sendAboutData.pending,(state)=>{
            state.isLoading = true;
        }).addCase(sendAboutData.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.aboutData = action?.payload?.result;
        }).addCase(sendAboutData.rejected,(state)=>{
            state.isLoading = false;
            state.aboutData = null;
        }).addCase(fetchAllFilters.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAllFilters.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.filterOptions = action?.payload?.result;
        }).addCase(fetchAllOptions.pending,(state)=>{
            state.isLoading = false;
        }).addCase(fetchAllOptions.fulfilled,(state,action)=>{
            state.isLoading = true;
            state.AllOptions = action?.payload?.result;
        }).addCase(fetchAllOptions.rejected,(state,action)=>{
            state.isLoading = false;
            state.AllOptions = []
        }).addCase(fetchAddressFormData.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAddressFormData.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.addressFormFields = action?.payload?.result;
        }).addCase(fetchAddressFormData.rejected,(state)=>{
            state.isLoading = false;
            state.addressFormFields = [];
        }).addCase(setConvenienceFees.pending,(state,action)=>{
            state.isLoading = true;
        }).addCase(setConvenienceFees.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.convenienceFees = action?.payload?.result;
        }).addCase(setConvenienceFees.rejected,(state,action)=>{
            state.isLoading = false;
            console.error(action.error);
            state.convenienceFees = -1;
        }).addCase(sendContactUsPage.pending,(state) =>{
            state.isLoading = true;
        }).addCase(sendContactUsPage.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.ContactUsPageData = action?.payload?.result;
        }).addCase(sendContactUsPage.rejected,(state,action)=>{
            state.isLoading = false;
            state.ContactUsPageData = null;
        })
    }
})


export const addFeaturesImage = createAsyncThunk('/common/addFeaturesImage',async(data)=>{
	try {
        const response = await axios.post(`${BASE_URL}/api/common/create/home/carousal`,data,Header());
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
        return null;
    }
})
export const addMultipleImages = createAsyncThunk('/common/addMultipleImage',async(data)=>{
    try {
        const response = await axios.post(`${BASE_URL}/api/common/create/home/carousal/multiple`,data,Header());
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
        return null;
    }
})
export const getFeatureImage = createAsyncThunk('/common/getFeatureImage',async()=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/common/fetch/all`);
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
        return null;
    }
})
export const delFeatureImage = createAsyncThunk('/common/delFeatureImage',async({id,imageIndex})=>{
    try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        const response = await axios.delete(`${BASE_URL}/api/common/del/${id}/${imageIndex}`,{
            withCredentials:true,
            headers: {
                Authorization:`Bearer ${token}`,
                "Cache-Control": "no-cache, must-revalidate, proxy-revalidate"
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
        return null;
    }
})
export const sendAddressFormData = createAsyncThunk('/common/sendAddressFormData',async(data)=>{
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.put(`${BASE_URL}/api/common/website/address`,data,Header());
        return response.data;
    } catch (error) {
        console.error(`Error Sending Address Data: `,error);
    }
})
export const removeAddressFormData = createAsyncThunk('/common/removeAddressFormData',async(data)=>{
    try {
        const response = await axios.patch(`${BASE_URL}/api/common/website/address/remove`,data,Header());
        return response.data;
    } catch (error) {
        console.error(`Error Removing Address Data: `,error);
    }
})
export const fetchAddressFormData = createAsyncThunk('/common/fetchAddressFormData',async()=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/common/website/address`);
        return response.data;
    } catch (error) {
        console.error(`Error Fetching Address Data: `,error);
    }
})
export const sendAboutData = createAsyncThunk('/common/sendAboutData',async(data)=>{
    try {
        const token = sessionStorage.getItem('token');
        // console.log(token);
        const response = await axios.put(`${BASE_URL}/api/common/website/about`,data,Header());
        console.log('Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Sending About Page Data: `,error);
    }
})
export const sendContactUsPage = createAsyncThunk('/common/contact-us',async(data) =>{
    try {
        const response = await axios.put(`${BASE_URL}/api/common/website/contact-us`,data,Header());
        console.log('Contact Use Page Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Sending Contact Us Page Data: `,error);
    }
})

export const setConvenienceFees = createAsyncThunk('/common/setConvenienceFees',async({convenienceFees})=>{
    try {
        const response = await axios.put(`${BASE_URL}/api/common/website/convenienceFees`,{convenienceFees},Header());
        console.log('Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Setting Convenience Fees: `,error);
    }
})
export const fetchAllFilters = createAsyncThunk('/common/fetchAllFilters',async()=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/common/product/filters`);
        console.log("Filters: ",response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Review product: `,error);
    }
})
export const fetchAllOptions = createAsyncThunk('/common/fetchAllOptions',async()=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/common/options/get/all`);
        // console.log("All Options: ",response.data);
        return response.data;
    } catch (error) {
        console.error("Error Fething All Options: ",error);   
    }
})

export const fetchOptionsByType = createAsyncThunk(
    '/common/fetchOptionsByType',
    async (type) => {
        try {
            // Check the type and fetch the corresponding data
            const response = await axios.get(`${BASE_URL}/api/common/options/getByType/${type}`);
            // Return the response data based on the type
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${type} options:`, error);
            throw error;
        }
    }
);
  
// Add a new filter option (e.g., category, subcategory)
export const addNewOption = createAsyncThunk(
    '/common/addOption',
    async ({ type, value }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/common/options/add`, { type, value },Header());
            return response.data; // Return the added option
        } catch (error) {
            console.error('Error adding option:', error);
            throw error;
        }
    }
);
  
// Delete an option (e.g., category, subcategory)
export const deleteOption = createAsyncThunk('/common/deleteOption', async (data) => {
        try {
            // const token = sessionStorage.getItem('token');
            // console.log(token);
            console.log("Delete Data: ",data);
            const response = await axios.post(`${BASE_URL}/api/common/options/removeByType`,{removingData:JSON.stringify(data)},Header());
            console.log("Response: ",response.data);
            return response.data; // Return the type and value of the deleted option
        } catch (error) {
            console.error('Error deleting option:', error);
            throw error;
        }
    }
);



// export const {resetSearchResult} = searchProductSlice.actions;
export default commonSlice.reducer;