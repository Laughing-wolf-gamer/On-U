import mongoose from "mongoose";

const contactQuerySchema = new mongoose.Schema({
    QueryDetails:{type:Object,required:true},
    QueryMessage:{type:String,required:true},
    Status:{type:String,default:"Pending"},
}, { timestamps: true });

const ContactQuery = mongoose.model('contact.query', contactQuerySchema);
export default ContactQuery;