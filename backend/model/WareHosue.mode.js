import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const wareHouseSchema = new mongoose.Schema({
	pickup_location:{type:String,required:true},
	name:{type:String, required:true},
	email:{type:String, required:true, unique:true},
	phone:{type:String, required:true},
    pin_code:{type:Number,required:true},
    country:{type:String,required:true},
    state:{type:String,required:true},
    address:{type:String,required:true},
	address_2:{type:String,required:false},
	city:{type:String, required:true},
	state:{type:String, required:true},
	country:{type:String, required:true},
}, { timestamps: true });

const WareHouseModel = mongoose.model('wareHouse', wareHouseSchema);
export default WareHouseModel;