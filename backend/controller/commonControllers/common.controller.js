import BannerModel from "../../model/banner.model.js";
import Option from "../../model/options.model.js";
import ProductModel from "../../model/productmodel.js";
import WebSiteModel from "../../model/websiteData.model.js";

export const getHomeBanners = async (req,res)=>{
	try {
		const banners = await BannerModel.find();
		// console.log("Banners: ",banners)
		return res.status(200).json({Success: true,message:"Successfully Fetched Banners", result:banners});
	} catch (error) {
		console.error(`Error getting Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
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
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const removeHomeCarousal = async (req, res) => {
	try {
		const{id,imageIndex} = req.params;
		if(!id || !imageIndex) return res.status(400).json({Success: false, message: "Id is required"});
		const banner = await BannerModel.findById(id);
		if(!banner) return res.status(404).json({Success: false, message: "Banner not found"});
		banner.Url.splice(imageIndex,1);
		if(banner.Url.length === 0){
			await banner.remove();
		}
		await banner.save();
		const banners = await BannerModel.find({});
		console.log("Banners: ",banners)
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banners});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
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
        res.status(500).json({Success:false,message:"Internal Server Error"})
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
		res.status(200).json({Success:true,message:"Fetch All Options",result:allOptions || []})
	} catch (error) {
		console.error(`Error Fetching Options`,error);
		res.status(500).json({Success:false,message:"Failed to fetch all options"})
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

		const deleted = await Option.findOneAndDelete({ type, value });
		console.log("Deleted Options: ",deleted);

		res.status(200).json({ Success:true,message: 'Option deleted successfully' });
	} catch (error) {
		console.error("Error Deleting Options ",error);
		res.status(500).json({ message: 'Server error' });
	}
};
  