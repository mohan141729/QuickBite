import api from "./axios";

/**
 * Upload image to Cloudinary via backend
 * @param {File} file - Image file to upload
 * @returns {Promise<String>} - Uploaded image URL
 */
export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await api.post("/upload/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.url;
    } catch (error) {
        console.error("Image upload error:", error);
        throw error.response?.data?.message || "Failed to upload image";
    }
};
