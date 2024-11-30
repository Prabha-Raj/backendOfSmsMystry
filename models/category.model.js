import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true,
            maxlength: [50, "Category name cannot exceed 50 characters"],
        },
        description: {
            type: String,
            maxlength: [200, "Description cannot exceed 200 characters"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Refers to the User who created the category
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
