import mongoose from 'mongoose'

const bannerImagesSchema = new mongoose.Schema({
	ScreenType:String,// Wide,Mobile
	Size:String,
	HomeCarousal:[
		{
			type:String,
			default:[]
		}
	],
	DealsOfDay:[
		{
			type:String,
			default:[]
		}
	],
	BestOfOnU:[
		{
			type:String,
			default:[]
		}
	]

},{timestamps:true})

const BannerModel = mongoose.model('Banner.Images', bannerImagesSchema)
export default BannerModel;