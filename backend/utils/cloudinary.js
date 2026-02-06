import {v2 as cloudinary} from "cloudinary";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resourceType = 'auto'; // Default to auto (handles both images and videos)
        if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
        }
        return {
            folder: 'job_portal',
            resource_type: resourceType,
            public_id: `file_${Date.now()}_${file.originalname}`
        };
    }
});

export { cloudinary, storage };