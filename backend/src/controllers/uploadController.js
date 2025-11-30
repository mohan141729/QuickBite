import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<String>} - Secure URL of uploaded image
 */
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary using buffer
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "quickbite",
                    resource_type: "image",
                    transformation: [
                        { width: 1000, height: 1000, crop: "limit" },
                        { quality: "auto" },
                        { fetch_format: "auto" },
                    ],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(req.file.buffer);
        });

        res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message,
        });
    }
};
