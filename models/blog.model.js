import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title for the blog"],
            maxlength: [150, "Title can't exceed 150 characters"],
        },
        content: {
            type: String,
            required: [true, "Content cannot be empty"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: "User",
            required: true,
        },
        categories: {
            type: [String], // Array of category names
            required: [true, "Please provide at least one category"],
        },
        tags: {
            type: [String], // Array of tags
        },
        coverImage: {
            type: String, // URL or path to the blog's cover image
        },
        likes: {
            count: {
                type: Number,
                default: 0,
                min: 0, // Prevent negative likes
            },
            users: [
                {
                    type: mongoose.Schema.Types.ObjectId, // References the User model
                    ref: "User",
                },
            ],
        },
        dislikes: {
            count: {
                type: Number,
                default: 0,
                min: 0, // Prevent negative dislikes
            },
            users: [
                {
                    type: mongoose.Schema.Types.ObjectId, // References the User model
                    ref: "User",
                },
            ],
        },
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
                    ref: "User",
                    required: true,
                },
                comment: {
                    type: String,
                    required: [true, "Comment cannot be empty"],
                    maxlength: [500, "Comment cannot exceed 500 characters"],
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        views: {
            count: {
                type: Number,
                default: 0, // Initial value is 0
                min: 0, // Prevent negative views
            },
            users: [
                {
                    type: mongoose.Schema.Types.ObjectId, // References the User model
                    ref: "User",
                },
            ],
        },
        isPublished: {
            type: Boolean,
            default: false, // Blog is draft by default
        },
        publishedAt: {
            type: Date, // Automatically set when the blog is published
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
