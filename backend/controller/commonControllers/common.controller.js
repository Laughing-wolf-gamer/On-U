import BannerModel from "../../model/common.model.js";

export const getBanners = async (req,res)=>{
	try {
		/* const {ScreenType} = req.body;
		if(!ScreenType) return res.status(400).json({Success: false, message: "ScreenType is required"}); */
		const banners = await BannerModel.find({});
        res.status(200).json({Success: true, banners});
	} catch (error) {
		console.error(`Error getting Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const addHomeCarousal = async (req, res) => {
	try {
		const{url} = req.body;
		if(!url) return res.status(400).json({Success: false, message: "URL is required"});
		const bannerAlreadyExists = await BannerModel.find({});
		let banner = bannerAlreadyExists[0];
		if(!banner){
			banner = new BannerModel({HomeCarousal:[url]});
		}else{
			banner.HomeCarousal.push(url);
		}
		await banner.save();
		console.log("Banner: ",banner);
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banner});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}