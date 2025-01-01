import mongoose from "mongoose";

// Schema for the options (category, subcategory, color, size, gender)
const optionSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true,
      enum: ['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'],
    },
    value: {
      type: String,
      required: true,
      unique: true,
    },
}, { timestamps: true });

const Option = mongoose.model('Option', optionSchema);
export default Option;