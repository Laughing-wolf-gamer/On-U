import mongoose from 'mongoose'

const websiteSchema = new mongoose.Schema({
    tag:String,
    AboutData:Object,
    Address:Array,
    ConvenienceFees:Number,
    ContactUsePageData:Object,
    TermsAndConditions:Object,
    PrivacyAndPrivacy:Object,
},{timestamps:true})

const WebSiteModel = mongoose.model('websiteData', websiteSchema)
export default WebSiteModel;