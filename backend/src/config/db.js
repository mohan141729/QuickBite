import mongoose from "mongoose"

const connectDB = async () => {
    try {
        // Fallback to local DB if env var is missing
        const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickbite_db';
        await mongoose.connect(connStr);
        console.log(`DB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // Don't exit process in dev mode, might recover
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

export default connectDB;

