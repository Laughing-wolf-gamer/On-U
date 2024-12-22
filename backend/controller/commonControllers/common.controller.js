import BannerModel from "../../model/banner.model.js";

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
		const{url,CategoryType} = req.body;
		console.log("Add Home Carousal req.body",req.body);
		if(!url) return res.status(400).json({Success: false, message: "URL is required"});
		let banner = await BannerModel.findOne({CategoryType: CategoryType});
		if(!banner){
			banner = new BannerModel({CategoryType: CategoryType,Url: [url]});
		}else{
			banner.Url.push(url);
		}
		await banner.save();
		const banners = await BannerModel.find();
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