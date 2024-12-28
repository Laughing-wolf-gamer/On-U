import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new multer.memoryStorage();

async function handleImageUpload(file){
    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto', // Automatically detect the resource type (image/video)
        });
        return result; // Return the result which contains the image URL, public_id, etc.
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
    }
}
async function handleMultipleImageUpload(files) {
    try {
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file, {
                resource_type: 'auto',
            })
        );
        const results = await Promise.all(uploadPromises);
        return results; // Return an array of results with image URLs, public_ids, etc.
    } catch (error) {
        console.error('Error uploading multiple files to Cloudinary:', error);
        throw new Error('Cloudinary multiple upload failed');
    }
}

const upload = multer({storage});
export {handleImageUpload,handleMultipleImageUpload,upload};