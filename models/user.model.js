import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true,
            minlength: [3, "Username should have at least 3 characters"],
            maxlength: [50, "Username can't exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email address"],
            unique: true,
            match: [
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                "Please provide a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password should have at least 6 characters"],
        },
        role: {
            type: String,
            enum: ["user", "admin"], // User role can be either user or admin
            default: "user",
        },
        avatar: {
            type: String, // URL or path to the user's avatar image
        },
        bio: {
            type: String,
            maxlength: [300, "Bio cannot exceed 300 characters"],
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);
const User = new mongoose.model("User", userSchema)
export default User