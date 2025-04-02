/* import mongoose from 'mongoose'

const websiteSchema = new mongoose.Schema({
    tag:String,
    AboutData:Object,
    Address:Array,
    faqArray:[{
		question:String,
        answer:String,
    }],
	termsAndCondition:Object,
	privacyPolicy:Object,
    ConvenienceFees:Number,
    ContactUsePageData:Object,
	CouponBannerData:Object,
	ShiprocketToken:String,
    WebsiteDisclaimers:[{
        header:String,
        body:String,
        hoverBody:String,
        iconImage:String,
    }],
},{timestamps:true})

const WebSiteModel = mongoose.model('websiteData', websiteSchema)
export default WebSiteModel; */
import mongoose from 'mongoose';

// Define the Website Schema
const websiteSchema = new mongoose.Schema(
    {
        tag: {
            type: String,
            required: true,
            unique: true, // Make tag unique if appropriate (e.g., a unique identifier for the website)
            trim: true,   // Trim any leading/trailing spaces
        },
        AboutData: {
            type: mongoose.Schema.Types.Mixed, // Flexible object
            required: true,
        },
        Address: [{
            type: String, // Ensure addresses are strings; if more structure is needed, create a sub-schema
            required: true,
        }],
        faqArray: [{
            question: {
                type: String,
                required: true,
                trim: true,
            },
            answer: {
                type: String,
                required: true,
                trim: true,
            },
        }],
        termsAndCondition: {
            type: mongoose.Schema.Types.Mixed, // Flexible object (could be structured based on your data)
            required: true,
        },
        privacyPolicy: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        ConvenienceFees: {
            type: Number,
            min: 0, // Ensure the fee is always a positive number
        },
        ContactUsePageData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        CouponBannerData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        ShiprocketToken: {
            type: String,
            required: true,
            trim: true,
            unique: true, // Ensure that ShiprocketToken is unique
        },
        WebsiteDisclaimers: [{
            header: {
                type: String,
                required: true,
                trim: true,
            },
            body: {
                type: String,
                required: true,
                trim: true,
            },
            hoverBody: {
                type: String,
                required: true,
                trim: true,
            },
            iconImage: {
                type: String,
                required: true,
            },
        }],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
        versionKey: false, // Optional: Disable version key (__v) to prevent unnecessary overhead
    }
);

// Create index for frequently queried fields
websiteSchema.index({ tag: 1 }); // Index for tag field
websiteSchema.index({ ShiprocketToken: 1 }); // Index for ShiprocketToken if commonly queried

// Create and export the model
const WebSiteModel = mongoose.model('websiteData', websiteSchema);
export default WebSiteModel;
