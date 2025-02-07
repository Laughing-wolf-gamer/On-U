import mongoose from 'mongoose'

const websiteSchema = new mongoose.Schema({
    tag:String,
    AboutData:Object,
    Address:Array,
    ConvenienceFees:Number,
    ContactUsePageData:Object,
    WebsiteDisclaimers:[{
        header:String,
        body:String,
        hoverBody:String,
        iconImage:String,
    }],
},{timestamps:true})

const WebSiteModel = mongoose.model('websiteData', websiteSchema)
export default WebSiteModel;