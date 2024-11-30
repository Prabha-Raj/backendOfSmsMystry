import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.DB_URI);

        console.log(`Database connected successfully to host: ${res.connection.host}`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        // process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
