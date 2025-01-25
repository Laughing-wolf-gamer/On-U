import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const wareHouseSchema = new mongoose.Schema({
    pincode:{type:Number,required:true},
    country:{type:String,required:true},
    state:{type:String,required:true},
    address:{type:String,required:true},
}, { timestamps: true });

const WareHouseModel = mongoose.model('wareHouse', wareHouseSchema);
export default WareHouseModel;