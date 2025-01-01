import mongoose from 'mongoose'

const websiteSchema = new mongoose.Schema({
    tag:String,
    AboutData:Object,
    Address:Array
},{timestamps:true})

const WebSiteModel = mongoose.model('websiteData', websiteSchema)
export default WebSiteModel;