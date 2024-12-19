import BannerModel from "../../model/banner.model.js";

export const getHomeBanners = async (req,res)=>{
	try {
		const {ScreenType,BannerType} = req.params;
		if(!ScreenType || !BannerType) return res.status(400).json({Success: false, message: "All Params are required"});
		const banners = await BannerModel.find({ScreenType: ScreenType, Size: BannerType});
		console.log("Banners: ",banners)
        res.status(200).json({Success: true,message:"Successfully Fetched Banners", result:banners});
	} catch (error) {
		console.error(`Error getting Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const addHomeCarousal = async (req, res) => {
	try {
		const{url,ScreenType,BannerType} = req.body;
		console.log("req.body",req.body);
		if(!url) return res.status(400).json({Success: false, message: "URL is required"});
		let banner = await BannerModel.findOne({ScreenType: ScreenType,Size:BannerType});
		if(banner){
			switch(BannerType) {
				case "bestOfOnU":
					banner.BestOfOnU.push(url);
					break;
				case "homeCarousal":
					banner.HomeCarousal.push(url);
					break;
				case "dealsOfDay":
					banner.DealsOfDay.push(url);
					break;
			}
		}else{
			switch(BannerType) {
				case "bestOfOnU":
					banner = new BannerModel({BestOfOnU:[url],ScreenType: ScreenType,Size:BannerType});
					break;
				case "homeCarousal":
					banner = new BannerModel({HomeCarousal:[url],ScreenType: ScreenType,Size:BannerType});
					break;
				case "dealsOfDay":
					banner = new BannerModel({DealsOfDay:[url],ScreenType: ScreenType,Size:BannerType});
					break;
			}
			// banner = new BannerModel({HomeCarousal:[url],ScreenType: ScreenType});
		}
		await banner.save();
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banner});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const removeHomeCarousal = async (req, res) => {
	try {
		const{id} = req.params;
		const{ScreenType} = req.body;
		if(!url) return res.status(400).json({Success: false, message: "URL is required"});
		const banner = await BannerModel.findOne({ScreenType: ScreenType});
		await banner.save();
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banner});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}