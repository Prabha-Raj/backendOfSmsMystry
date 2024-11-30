import Category from "../models/category.model.js";

// Create a new category
export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    const createdBy = req.params.id; // Assuming authentication middleware sets `req.user`

    try {
        // Check if category with the same name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        // Create and save the new category
        const category = new Category({ name, description, createdBy });
        await category.save();

        res.status(201).json({
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        console.error("Create Category Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        // Retrieve all categories sorted by creation date (newest first)
        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: "Categories retrieved successfully",
            categories,
        });
    } catch (error) {
        console.error("Get All Categories Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
    const { uid, categoryId } = req.params; // Extract user ID and category ID from the route

    try {
        // Find the category first
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if the user is authorized to delete this category
        if (uid !== category.createdBy.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this category",
            });
        }

        // Delete the category
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({
            message: "Category deleted successfully",
            category,
        });
    } catch (error) {
        console.error("Delete Category Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
