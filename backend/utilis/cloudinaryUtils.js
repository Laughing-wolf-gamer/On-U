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
/* const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    },
}); */

async function handleImageUpload(file){
    try {
        const maxFileSize = 52428800 || process.env.MAX_FILE_SIZE;
        const validFiles = file.size <= maxFileSize;
        if (!validFiles) {
            throw new Error('Some files exceed the maximum size of 10MB');
        }
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            resource_type: 'auto', // Automatically detect the resource type (image/video)
            quality: 60, // Reduce image quality to 60%
        });
        return result; // Return the result which contains the image URL, public_id, etc.
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
    }
}
async function handleMultipleImageUpload(files) {
    try {
        /* const validFiles = files.filter(file => file.size <= maxFileSize);
        if (validFiles.length !== files.length) {
            throw new Error('Some files exceed the maximum size of 10MB');
        } */
        const uploadPromises = files.map(file =>
            cloudinary.uploader.upload(file, {
                resource_type: 'auto',
                quality: 60, // Reduce image quality to 60%
                max_file_size: 50 * 1024 * 1024 // 50MB
            })
        );
        const results = await Promise.all(uploadPromises);
        return results; // Return an array of results with image URLs, public_ids, etc.
    } catch (error) {
        console.error('Error uploading multiple files to Cloudinary:', error);
        // throw new Error('Cloudinary multiple upload failed');
        return [];
    }
}

const upload = multer({storage,limits:{fileSize:process.env.MAX_FILE_SIZE || 52428800}});
export {handleImageUpload,handleMultipleImageUpload,upload};