import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "../api/upload";
import toast from "react-hot-toast";

const ImageUpload = ({ onImageUploaded, initialImage = "", label = "Upload Image" }) => {
    const [imageUrl, setImageUrl] = useState(initialImage);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(initialImage);

    React.useEffect(() => {
        setImageUrl(initialImage);
        setPreview(initialImage);
    }, [initialImage]);

    const onDrop = useCallback(
        async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to Cloudinary
            setUploading(true);
            try {
                const url = await uploadImage(file);
                setImageUrl(url);
                onImageUploaded(url);
                toast.success("Image uploaded successfully!");
            } catch (error) {
                toast.error(error || "Failed to upload image");
                setPreview(initialImage);
            } finally {
                setUploading(false);
            }
        },
        [onImageUploaded, initialImage]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
        },
        maxFiles: 1,
        disabled: uploading,
        noClick: false,
        noKeyboard: false,
        multiple: false,
    });

    const removeImage = () => {
        setImageUrl("");
        setPreview("");
        onImageUploaded("");
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                {label}
            </label>

            {preview ? (
                <div className="relative w-full h-32 rounded-lg border-2 border-gray-200 overflow-hidden group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                            <p className="text-xs text-gray-600">Uploading...</p>
                        </>
                    ) : (
                        <>
                            {isDragActive ? (
                                <>
                                    <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                                    <p className="text-xs text-indigo-600 font-medium">
                                        Drop the image here
                                    </p>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-600 font-medium mb-1">
                                        Drag & drop an image here
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        or click to browse (JPG, PNG, WebP - Max 5MB)
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
