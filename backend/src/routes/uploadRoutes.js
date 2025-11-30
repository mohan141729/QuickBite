import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed."), false);
    }
};

// Configure multer with size limit (5MB)
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// Upload image route (protected with Clerk)
router.post("/image", clerkAuth, upload.single("image"), uploadImage);

export default router;
