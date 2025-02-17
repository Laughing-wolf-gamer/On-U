import { BASE_URL, filterOptions, Header } from "@/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
	isLoading:false,
	featuresList:[],
    AllOptions:[],
	
    aboutData:null,
    termsAndCondition:null,
    privacyPolicy:null,
    convenienceFees:0,
    addressFormFields:[],
    faqsWebsite:[],
    ContactUsPageData:null,
    DisclaimerData:[],
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
        }).addCase(fetchAboutData.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchAboutData.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.aboutData = action?.payload?.aboutData;
        }).addCase(fetchAboutData.rejected,(state)=>{
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
        }).addCase(getContactUsPageData.pending,(state) =>{
            state.isLoading = true;
        }).addCase(getContactUsPageData.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.ContactUsPageData = action?.payload?.result;
        }).addCase(getContactUsPageData.rejected,(state,action)=>{
            state.isLoading = false;
            state.ContactUsPageData = null;
        }).addCase(fetchWebsiteDisclaimer.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchWebsiteDisclaimer.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.DisclaimerData = action?.payload?.result || [];
        }).addCase(fetchWebsiteDisclaimer.rejected,(state)=>{
            state.isLoading = false;
            state.DisclaimerData = [];
        }).addCase(fetchTermsAndCondition.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchTermsAndCondition.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.termsAndCondition = action?.payload?.result || null;
        }).addCase(fetchTermsAndCondition.rejected,(state)=>{
            state.isLoading = false;
            state.termsAndCondition = null;
        }).addCase(fetchPrivacyPolicyWebsite.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchPrivacyPolicyWebsite.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.privacyPolicy = action?.payload?.result || null;
        }).addCase(fetchPrivacyPolicyWebsite.rejected,(state)=>{
            state.isLoading = false;
            state.privacyPolicy = null;
        }).addCase(fetchFAQSWebstis.pending,(state)=>{
            state.isLoading = true;
        }).addCase(fetchFAQSWebstis.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.faqsWebsite = action?.payload?.result || [];
        }).addCase(fetchFAQSWebstis.rejected,(state)=>{
            state.isLoading = false;
            state.faqsWebsite = [];
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
export const sendAboutData = createAsyncThunk('/common/sendAboutData',async(abouts)=>{
    try {
        // console.log(token);
        const response = await axios.put(`${BASE_URL}/api/common/website/about`,abouts,Header());
        console.log('Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Sending About Page Data: `,error);
    }
})
export const fetchAboutData = createAsyncThunk('/common/fetchAboutData',async()=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/common/website/about`);
        console.log('About Page Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error("Error Fetching About Page Data")
        throw error;
    }
})
export const setTermsAndCondition = createAsyncThunk('/common/updateTermsAndCondition',async(data)=>{
	try {
		const response = await axios.put(`${BASE_URL}/api/common/website/terms-and-condition`,data,Header());
		console.log('Termsn and Conditions Response: ', response.data);
        return response.data;
	} catch (error) {
		console.error('Error deleting option:', error);
        throw error;
	}
})
export const fetchTermsAndCondition = createAsyncThunk('/common/getTermsAndCondition',async()=>{
	try {
		const response = await axios.get(`${BASE_URL}/api/common/website/terms-and-condition`);
		console.log('Termsn and Conditions Response: ', response.data);
        return response.data;
	} catch (error) {
		console.error("Error Deleting ")
		throw error;
	}
})
export const setPrivacyPolicyWebsite = createAsyncThunk('/common/setPrivacyPolicy',async(data)=>{
	try {
        const response = await axios.put(`${BASE_URL}/api/common/website/privacy-policy`,data,Header());
        console.log('Privacy Policy Response: ', response.data);
        return response?.data?.Success;
    } catch (error) {
        console.error(`Error Sending Privacy Policy Page Data: `,error);
        return false;
    }
})
export const setFAQSWebstis = createAsyncThunk('/common/setFAQS',async(faqData)=>{
	try {
        const response = await axios.put(`${BASE_URL}/api/common/website/faqs`,{faqData},Header());
        console.log('Privacy Policy Response: ', response.data);
        return response?.data?.Success;
    } catch (error) {
        console.error(`Error Sending FAQs Page Data: `,error);
        return false;
    }
})
export const fetchFAQSWebstis = createAsyncThunk('/common/faq',async()=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/common/website/faqs`);
        // console.log('FAQs Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Fetching FAQs: `,error);
    }
});
export const removeFAQById = createAsyncThunk('/common/removeFAQ',async({faqId})=>{

	try {
		console.log("Removing FAQ: ",faqId);
        const response = await axios.patch(`${BASE_URL}/api/common/website/faqs?faqId=${faqId}`,{},Header());
        console.log('Privacy Policy Response: ', response.data);
        return response?.data?.Success;
    } catch (error) {
        console.error(`Error removing FAQId Data: `,error);
        return false;
    }
})

export const fetchPrivacyPolicyWebsite = createAsyncThunk('/common/getPrivacyPolicy',async()=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/common/website/privacy-policy`);
        console.log('Privacy Policy Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Fetching Privacy Policy: `,error);
    }
})
export const setDisclaimerData = createAsyncThunk('/common/setDisclaimerData',async(data)=>{
    try {
        const response = await axios.put(`${BASE_URL}/api/common/website/disclaimer`,data,Header());
        console.log('disclaimer Response: ', response.data);
        return response?.data?.Success;
    } catch (error) {
        console.error(`Error Sending About Page Data: `,error);
        return false;
    }
})
export const editDisclaimerData = createAsyncThunk('/common/setDisclaimerData',async({disclaimersId,disclaimers})=>{
    try {
        const response = await axios.patch(`${BASE_URL}/api/common/website/disclaimer/edit/${disclaimersId}`,disclaimers,Header());
        console.log('disclaimer Response: ', response.data);
        return response?.data?.Success;
    } catch (error) {
        console.error(`Error Sending About Page Data: `,error);
        return false;
    }
})
export const removeDisclaimerData = createAsyncThunk('/common/setDisclaimerData',async({disclaimersId})=>{
    try {
        const response = await axios.patch(`${BASE_URL}/api/common/website/disclaimer/remove/${disclaimersId}`,{},Header());
        console.log('disclaimer Response: ', response.data);
        return response?.data?.Success;
    } catch (error) {
        console.error(`Error Sending About Page Data: `,error);
        return false;
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
export const getContactUsPageData = createAsyncThunk('/common/getContactUsPageData',async()=>{
	try {
        const response = await axios.get(`${BASE_URL}/api/common/website/contact-us`);
        console.log('Contact Use Page Response: ', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error Fetching Contact Us Page Data: `,error);
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
export const fetchWebsiteDisclaimer = createAsyncThunk('/common/getAllDisclaimer',async()=>{
    try {
        const response = await axios.get(`${BASE_URL}/api/common/website/disclaimer`);
        console.log("Disclaimers: ",response?.data);
        return response.data;
    } catch (error) {
        console.error("Error Fetching All Options: ",error);
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
});
export const updateOptionActive = createAsyncThunk('/common/updateOptionActive', async (data) => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        console.log("Updating Data: ",data);
        const response = await axios.post(`${BASE_URL}/api/common/options/updateActiveState`,{updatingData:JSON.stringify(data)},Header());
        console.log("Response: ",response.data);
        return response.data; // Return the type and value of the deleted option
    } catch (error) {
        console.error('Error deleting option:', error);
        throw error;
    }
});
export const updateColorName = createAsyncThunk('/common/updateColorName', async (data) => {
    try {
        // const token = sessionStorage.getItem('token');
        // console.log(token);
        console.log("updateColorName Data: ",data);
        const response = await axios.post(`${BASE_URL}/api/common/options/updateColorName`,{updatingData:JSON.stringify(data)},Header());
        console.log("Response: ",response.data);
        return response.data; // Return the type and value of the deleted option
    } catch (error) {
        console.error('Error deleting option:', error);
        throw error;
    }
});




// export const {resetSearchResult} = searchProductSlice.actions;
export default commonSlice.reducer;