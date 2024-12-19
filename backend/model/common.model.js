import mongoose from 'mongoose'

const bannerImagesSchema = new mongoose.Schema({
	HomeCarousal:[
		{
			url:String,
			Screen:String,
			default:[]
		}
	],
	DealsOfDay:[
		{
            url:String,
			Screen:String,
            default:[]
        }
	],
	BestAndExclusive:[
		{
			url:String,
			Screen:String,
            default:[]
        }
	]

},{timestamps:true})

const BannerModel = mongoose.model('Banner.Images', bannerImagesSchema)
export default BannerModel;