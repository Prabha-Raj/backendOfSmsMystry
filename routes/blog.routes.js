import express from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    addComment,
    incrementViews,
    addLike,
    unLike,
    dislikeBlog,
    removeDislike
} from "../controllers/blog.controller.js";
import authenticateUser from "../middlewares/authenticateUser.js";
const blogRouter = express.Router();

blogRouter.post("/create", authenticateUser, createBlog); // Create a blog
blogRouter.get("/get", authenticateUser, getAllBlogs); // Get all blogs
blogRouter.get("/get/:blogId", authenticateUser, getBlogById); // Get a single blog by ID
blogRouter.put("/update/:blogId", authenticateUser, updateBlog); // Update a blog
blogRouter.delete("/delete/:blogId", authenticateUser,  deleteBlog); // Delete a blog
blogRouter.put("/comment/:blogId", authenticateUser,  addComment); // Add a comment
blogRouter.put("/like/:blogId", authenticateUser,  addLike); // Add a like to a blog
blogRouter.put("/unlike/:blogId", authenticateUser, unLike); // remove like from blog
blogRouter.put("/dislike/:blogId", authenticateUser, dislikeBlog); // remove like from blog
blogRouter.put("/remove/dislike/:blogId", authenticateUser, removeDislike); // remove like from blog
blogRouter.put("/view/:blogId", authenticateUser, incrementViews); // Increment views

export default blogRouter;
