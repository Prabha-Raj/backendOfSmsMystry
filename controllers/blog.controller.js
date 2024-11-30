import Blog from "../models/blog.model.js";

export const createBlog = async (req, res) => {
    const { title, content, categories, tags, coverImage, isPublished } = req.body;
    const author = req.user.id; // Assuming `req.user.id` contains the authenticated user's ID

    try {
        const blog = await Blog.create({
            title,
            content,
            author,
            categories,
            tags,
            coverImage,
            isPublished,
            publishedAt: isPublished ? new Date() : null,
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "username email") // Populate author details
            .populate("categories", "name"); // Populate category details

        res.status(200).json({
            message: "Blogs retrieved successfully",
            blogs,
        });
    } catch (error) {
        console.error("Get All Blogs Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


// get single blog by id
export const getBlogById = async (req, res) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId)
            .populate("author", "username email")
            .populate("categories", "name");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog retrieved successfully",
            blog,
        });
    } catch (error) {
        console.error("Get Blog By ID Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// update blog
export const updateBlog = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id; // Assuming the user's ID is available in `req.user`
    const { title, content, categories, tags, coverImage, isPublished } = req.body;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user is the author
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this blog" });
        }

        // Update fields
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.categories = categories || blog.categories;
        blog.tags = tags || blog.tags;
        blog.coverImage = coverImage || blog.coverImage;
        blog.isPublished = isPublished !== undefined ? isPublished : blog.isPublished;
        blog.lastUpdatedBy = userId;
        if (isPublished && !blog.publishedAt) {
            blog.publishedAt = new Date();
        }

        const updatedBlog = await blog.save();

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// delete blog
export const deleteBlog = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user is the author
        if (blog.author.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this blog" });
        }

        await blog.deleteOne();

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Delete Blog Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// add comments
export const addComment = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        blog.comments.push({
            user: userId,
            comment,
        });

        const updatedBlog = await blog.save();

        res.status(200).json({
            message: "Comment added successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Add Comment Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

export const incrementViews = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id; // Assuming you're storing user info in req.user

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has already viewed the blog
        if (blog.views.users.includes(userId)) {
            return res.status(400).json({ message: "You have already viewed this blog" });
        }

        // Increment the view count and add user to the views array
        blog.views.count += 1;
        blog.views.users.push(userId);

        const updatedBlog = await blog.save();

        res.status(200).json({
            message: "Blog view incremented and user tracked",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Increment Views Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

export const addLike = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID

    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has liked the blog, if yes, remove the like
        if (blog.dislikes.users.includes(userId)) {
            // Remove the user's ID from the likes array and decrement the count
            blog.dislikes.users = blog.dislikes.users.filter(user => user.toString() !== userId.toString());
            blog.dislikes.count -= 1;
        }

        // Check if the user has already liked the blog
        if (blog.likes.users.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this blog" });
        }

        // Add user to the likes array and increment the like count
        blog.likes.users.push(userId);
        blog.likes.count += 1;

        await blog.save();

        res.status(200).json({
            message: "Blog liked successfully",
            likes: blog.likes.count,
        });
    } catch (error) {
        console.error("Add Like Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// unLike Controller
export const unLike = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;  // Assuming the user's ID is stored in req.user

    try {
        // Find the blog by ID
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has already liked the blog
        if (!blog.likes.users.includes(userId)) {
            return res.status(400).json({ message: "You haven't liked this blog yet" });
        }

        // Remove the user's ID from the likes array and decrement the count
        blog.likes.users = blog.likes.users.filter(user => user.toString() !== userId.toString());
        blog.likes.count -= 1;

        // Save the updated blog
        const updatedBlog = await blog.save();

        res.status(200).json({
            message: "Blog unliked successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Unlike Blog Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


// disLike blog
export const dislikeBlog = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;  // Assuming the user's ID is stored in req.user

    try {
        // Find the blog by ID
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has liked the blog, if yes, remove the like
        if (blog.likes.users.includes(userId)) {
            // Remove the user's ID from the likes array and decrement the count
            blog.likes.users = blog.likes.users.filter(user => user.toString() !== userId.toString());
            blog.likes.count -= 1;
        }

        // Check if the user has already disliked the blog
        if (blog.dislikes.users.includes(userId)) {
            return res.status(400).json({ message: "You have already disliked this blog" });
        }

        // Add the user's ID to the dislikes array and increment the count
        blog.dislikes.users.push(userId);
        blog.dislikes.count += 1;

        // Save the updated blog
        const updatedBlog = await blog.save();

        res.status(200).json({
            message: "Blog disliked successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Dislike Blog Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


// remove dislike Controller
export const removeDislike = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;  // Assuming the user's ID is stored in req.user

    try {
        // Find the blog by ID
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has already liked the blog
        if (!blog.dislikes.users.includes(userId)) {
            return res.status(400).json({ message: "You haven't disliked this blog yet" });
        }

        // Remove the user's ID from the dislikes array and decrement the count
        blog.dislikes.users = blog.dislikes.users.filter(user => user.toString() !== userId.toString());
        blog.dislikes.count -= 1;

        // Save the updated blog
        const updatedBlog = await blog.save();

        res.status(200).json({
            message: "Removed dislike successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Dislike Blog Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};


