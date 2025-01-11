import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const paymentGatwaySchema = new mongoose.Schema({
    order_id:{type:String},
}, { timestamps: true });

const PaymentGatWayModel = mongoose.model('PaymentGatWay', paymentGatwaySchema);
export default PaymentGatWayModel;