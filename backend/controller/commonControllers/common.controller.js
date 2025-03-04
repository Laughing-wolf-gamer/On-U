import BannerModel from "../../model/banner.model.js";
import ContactQuery from "../../model/ContactQuery.model.js";
import Coupon from "../../model/Coupon.model.js";
import Option from "../../model/options.model.js";
import ProductModel from "../../model/productmodel.js";
import WebSiteModel from "../../model/websiteData.model.js";
import { sendCouponMail } from "../emailController.js";

export const getHomeBanners = async (req,res)=>{
	try {
		const banners = await BannerModel.find();
		// console.log("Banners: ",banners)
		return res.status(200).json({Success: true,message:"Successfully Fetched Banners", result:banners});
	} catch (error) {
		console.error(`Error getting Banners: `,error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const addHomeCarousalMultiple = async(req,res)=>{
	try {
		const{images,CategoryType,Header} = req.body;
		const ImageFiltered = images.map(img => img.url)
		console.log("Add Home Carousal Multiple req.body",images.map(img => img.url));
		// return;
		if(!images ||!images.length) return res.status(400).json({Success: false, message: "At least one image is required"});
		let banner = await BannerModel.findOne({CategoryType: CategoryType});
		if(!banner){
			banner = new BannerModel({CategoryType: CategoryType, Header: Header, Url: [...ImageFiltered]});
		}else{
			if(Header){
                banner.Header = Header;
            }
            if(ImageFiltered && ImageFiltered.length > 0){
                banner.Url.push(...ImageFiltered);
            }

		}
		await banner.save();
		const banners = await BannerModel.find({});
		console.log("Banners: ",banners)
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banners});
	} catch (error) {
		console.error(`Error getting`,error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const addHomeCarousal = async (req, res) => {
	try {
		const{url,CategoryType,Header} = req.body;
		console.log("Add Home Carousal req.body",req.body);
		if(!url && !Header) return res.status(400).json({Success: false, message: "URL is required"});
		let banner = await BannerModel.findOne({CategoryType: CategoryType});
		if(!banner){
			banner = new BannerModel({CategoryType: CategoryType,Header:Header,Url: [url]});
		}else{
			if(Header){
				banner.Header = Header;
			}
			if(url){
				banner.Url.push(url);
			}
		}
		await banner.save();
		const banners = await BannerModel.find({});
		console.log("Banners: ",banners)
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banners});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const removeHomeCarousal = async (req, res) => {
	try {
		const{id,imageIndex} = req.params;
		if(!id || !imageIndex) return res.status(400).json({Success: false, message: "Id is required"});
		const banner = await BannerModel.findById(id);
		if(!banner) return res.status(404).json({Success: false, message: "Banner not found"});
		banner.Url.splice(imageIndex,1);
		await banner.save();
		const banners = await BannerModel.find({});
		console.log("Banners: ",banners)
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banners});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
/// Filters...

export const FetchAllFilters  = async (req, res) => {
    try {
        const filters = await ProductModel.find({})
        .select('category subCategory gender AllColors -_id')  // Select only the category field and exclude _id
        console.log("All Filters: ",filters);
        const categoryValues = filters.map(item => item.category);
        const genderValues = filters.map(item => item.gender);
        const subCategoryValues = filters.map(item => item.subCategory);
        res.status(200).json({Success:true,message:"All Filters",result:{AllCategory:categoryValues || [],AllGenders:genderValues || [],AllSubCategory:subCategoryValues || []}})
    } catch (error) {
        console.error("Error Fetching Filters",error);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const setAboutData = async(req,res)=>{
    try {
      const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'AboutData'}); 
      if(!alreadyFoundWebsiteData){
        const about = new WebSiteModel({AboutData: req.body,tag: 'AboutData'});
        await about.save();
        console.log("About Data: ",about)
        return;
      }
      alreadyFoundWebsiteData.AboutData = req.body;
      await alreadyFoundWebsiteData.save();
      res.status(200).json({Success:true,message: 'About Data set successfully'});
      console.log("About Data: ",about)
    } catch (error) {
        console.error(`Error setting about data `,error);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const setTermsAndConditions = async(req,res)=>{
    try {
		console.log("Setting Terms and Conditions: ",req.body);
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'terms-and-conditions'}); 
        if(!alreadyFoundWebsiteData){
            const about = new WebSiteModel({TermsAndConditions: req.body,tag: 'terms-and-conditions'});
            await about.save();
            console.log("TermsAndConditions: ",about)
            return;
        }
        alreadyFoundWebsiteData.TermsAndConditions = req.body;
        await alreadyFoundWebsiteData.save();
        console.log("TermsAndConditions ",alreadyFoundWebsiteData)
        res.status(200).json({Success:true,message: 'Terms And Conditions set successfully'});
    } catch (error) {
        console.log("Error: ",error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
export const getTermsAndConditions = async (req, res) =>{
    try {
        const termsAndConditions = await WebSiteModel.findOne({tag:"terms-and-conditions"})
        if(!termsAndConditions) return res.status(404).json({Success: false, message: "Terms and Conditions not found"});
        res.status(200).json({Success: true, message: 'Terms and Conditions retrieved successfully', result: termsAndConditions});
    } catch (error) {
        console.error("Error: ",error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
export const setPrivacyPolicy = async (req, res) =>{
    try {
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'privacy-and-policy'}); 
        if(!alreadyFoundWebsiteData){
            const privacyAndPolicy = new WebSiteModel({TermsAndConditions: req.body,tag: 'privacy-and-policy'});
            await privacyAndPolicy.save();
            console.log("privacy-and-policy: ",privacyAndPolicy)
            return;
        }
        alreadyFoundWebsiteData.PrivacyAndPrivacy = req.body;
        await alreadyFoundWebsiteData.save();
        console.log("privacy-and-policy ",alreadyFoundWebsiteData)
        res.status(200).json({Success:true,message: 'Privacy and Policy set successfully'});
    } catch (error) {
        console.error("Error: ",error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
export const getPrivacyAndPolicy = async (req, res) =>{
    try {
        const privacyAndPolicy = await WebSiteModel.findOne({tag:"privacy-and-policy"})
        if(!privacyAndPolicy) return res.status(404).json({Success: false, message: "privacy-and-policys not found"});
        res.status(200).json({Success: true, message: 'privacy-and-policy retrieved successfully', result: privacyAndPolicy});
    } catch (error) {
        console.error("Error: ",error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
export const setContactUsePageData = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag:"contact-us"});
		if(!alreadyFoundWebsiteData){
			const contact = new WebSiteModel({ContactUsePageData: req.body, tag: 'contact-us'});
            await contact.save();
            console.log("Contact Use Page Data: ",contact)
            return;
		}
		alreadyFoundWebsiteData.ContactUsePageData = req.body;
		await alreadyFoundWebsiteData.save();
		res.status(200).json({Success: true, message: 'Contact Use Page Data set successfully'});
		console.log("Contact Use Page Data: ",contact)
	} catch (error) {
		console.error("Internal Server Error", error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const getContactUsPageData = async(req,res)=>{
	try {
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'contact-us'});
        // console.log("Contact Use Page Data: ",alreadyFoundWebsiteData)
        res.status(200).json({Success:true,message:"Contact Use Page Data",result: alreadyFoundWebsiteData?.ContactUsePageData || {}});
    } catch (error) {
        console.error(`Error getting`,error);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const getContactQuery = async(req,res)=>{
	try {
        const queries = await ContactQuery.find({});
        console.log("Contact Queries: ",queries)
        res.status(200).json({Success:true,message:"Contact Queries",result: queries});
    } catch (error) {
        console.error(`Error getting`,error);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const createContactQuery = async(req,res)=>{
	try {
		console.log("Query Data: ",req.body);
		const{contactDetails,message} = req.body;
		if(!contactDetails){
			return res.status(400).json({Success: false, message: "Contact Details are required"});
		}
		if(!message){
			return res.status(400).json({Success: false, message: "Message is required"});
		}
		const newQuery = new ContactQuery({QueryDetails:{...contactDetails},QueryMessage:message});
		await newQuery.save();
		res.status(201).json({Success: true, message: 'Query created successfully!', result: newQuery});
	} catch (error) {
		console.error("Error creating contact query: ",error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const getConvenienceFees = async(req,res)=>{
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
		console.log("Convenience Fees: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message:"Convenience Fees",result: alreadyFoundWebsiteData?.ConvenienceFees || 0});
	} catch (error) {
		console.error(`Error getting`,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const patchConvenienceOptions = async(req,res)=>{
	try {
		const {convenienceFees} = req.body;
		console.log("Convenience: ",req.body);
		if(!convenienceFees){
			return res.status(400).json({Success: false, message: "Convenience Fees are required"});
		}
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
		if(!alreadyFoundWebsiteData){
            const newConvenienceFees = new WebSiteModel({tag: 'ConvenienceFees',ConvenienceFees:convenienceFees});
			await newConvenienceFees.save();
			console.log("Convenience Fees: ",newConvenienceFees)
        }
		alreadyFoundWebsiteData.ConvenienceFees = Number(convenienceFees);
		await alreadyFoundWebsiteData.save();
		console.log("Convenience Fees: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message: 'Convenience Fees Patched successfully',result: alreadyFoundWebsiteData?.ConvenienceFees || 0});
	} catch (error) {
		console.error("Error Patching Options: ",error);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
}
export const removeAddressFormField = async(req,res)=>{
	try {
		const {addressFormFields} = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'Address'}); 
		if(!alreadyFoundWebsiteData){
			return res.status(404).json({Success:false,message: 'Address Data not found'});
		}
		const index = alreadyFoundWebsiteData.Address.findIndex(item => item === addressFormFields);
		if(index === -1){
			return res.status(404).json({Success:false,message: 'Address Data not found'});
		}
		alreadyFoundWebsiteData.Address.splice(index,1);
		await alreadyFoundWebsiteData.save();
		console.log("Address Data: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message: 'Address Data removed successfully',result: alreadyFoundWebsiteData?.Address || []});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
	}
}
export const setAddressField = async(req,res)=>{
	try {
		const {addressFormFields} = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'Address'}); 
		if(!alreadyFoundWebsiteData){
			const about = new WebSiteModel({Address: [addressFormFields],tag: 'Address'});
			await about.save();
			console.log("Address Data: ",about)
			return res.status(200).json({Success:true,message: 'Address Data set successfully'});
		}
		alreadyFoundWebsiteData.Address.push(addressFormFields);
		await alreadyFoundWebsiteData.save();
		console.log("Address Data: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message: 'Address Data set successfully',result: alreadyFoundWebsiteData?.Address || []});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
	}
}
export const getAddressField = async(req,res)=>{
	try {
	  const aboutData = await WebSiteModel.findOne({tag:'Address'});
	  console.log("Address Data: ",aboutData?.Address)
	  res.status(200).json({Success:true,message: 'Address Data Found',result: aboutData?.Address || []});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
}
export const getAboutData = async(req,res)=>{
	try {
	  const aboutData = await WebSiteModel.findOne({tag:'AboutData'});
	  console.log("About Data: ",aboutData)
	  res.status(200).json({Success:true,message: 'About Data Found',aboutData: aboutData?.AboutData || {}});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	  
	}
}



export const getAllOptions = async(req,res)=>{
	try {
		const allOptions = await Option.find({});
		res.status(200).json({success:true,message:"Fetch All Options",result:allOptions || []})
	} catch (error) {
		console.error(`Error Fetching Options`,error);
		res.status(500).json({success:false,message:"Failed to fetch all options"})
	}
}
// Fetch all options of a specific type
export const getOptions = async (req, res) => {
	try {
	  const { type } = req.params; // Get the type of option (e.g., category)
	  
	  if (!['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'].includes(type)) {
		return res.status(400).json({ message: 'Invalid option type' });
	  }
  
	  const options = await Option.find({ type });
	  res.status(200).json({Success:true,message:"Featch All Options",result:options});
	} catch (error) {
	  res.status(500).json({ message: 'Server error' });
	}
};
  
  // Add a new option
export const addOption = async (req, res) => {
	try {
		const { type, value } = req.body;
	
		if (!['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
	
		const existingOption = await Option.findOne({ type, value });
		if (existingOption) {
			return res.status(400).json({ message: 'Option already exists' });
		}
	
		const newOption = new Option({ type, value });
		await newOption.save();
	
		res.status(201).json({ Success:true,message: 'Option added successfully', result: newOption });
	} catch (error) {
	  	res.status(500).json({ message: 'Server error' ,result:null});
	}
};
  
  // Delete an option by its value
export const removeOptionsByType = async (req, res) => {
	try {
		// const parseData = JSON.parse(req.body);
		const { removingData} = req.body;
		const {type,value} = JSON.parse(removingData);
		console.log("Delete Options: ",type,value);
		if (!['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
		let canRemoveOption = true;
		switch (type) {
			case 'category':
                const availableProductCategoryItems = await ProductModel.find({category: value})
				if(availableProductCategoryItems.length > 0){
					canRemoveOption = false;
				}
                break;
            case'subcategory':
				const availableProductSubCategoryItems = await ProductModel.find({subCategory: value})
				if(availableProductSubCategoryItems.length > 0){
					canRemoveOption = false;
				}
                break;
            case 'gender':
                const availableProductGenderItems = await ProductModel.find({gender: value})
				if(availableProductGenderItems.length > 0){
					canRemoveOption = false;
				}
                break;
            default:
		}
		if(!canRemoveOption){
			return res.status(400).json({Success:true,message:"Cannot Remove Items If used"});
		}
		const deleted = await Option.findOneAndDelete({ type, value });
		console.log("Deleted Options: ",deleted);
		res.status(200).json({ Success:true,message: 'Option deleted successfully' });

	} catch (error) {
		console.error("Error Deleting Options ",error);
		res.status(500).json({ message: 'Server error' });
	}
};


export const sendMailToGetCoupon = async (req,res)=>{
	try {
		const{fullName,email} = req.body;
		const coupon = await Coupon.aggregate([{ $sample: { size: 1 } }]);
		const randomCoupon = coupon[0]; // Get the first (and only) item in the array
		if(randomCoupon){
			const success = await sendCouponMail(fullName,email,randomCoupon?.CouponCode)
			console.log("Coupon sent: ",success)
			if(!success){
                return res.status(500).json({ success:false,message: 'Failed to send coupon email'});
			}
			return res.status(200).json({ success:true,message: 'Coupon sent successfully'});
		}
		res.status(404).json({ success:false,message: 'No coupon found'});
	} catch (error) {
		console.error("Error sending email: ", error);
		res.status(500).json({ success:false,message: 'Failed to send email' });
	}
}





  