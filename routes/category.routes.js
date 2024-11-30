import express from "express";
import authenticateUser from "../middlewares/authenticateUser.js";
import { createCategory, getAllCategories, deleteCategory } from "../controllers/category.controller.js";


const categoryRouter = express.Router();

// authenticating all routes in one time
categoryRouter.use(authenticateUser);

// Routes for category operations
categoryRouter.post("/create/:id", createCategory); // Create a category
categoryRouter.get("/getall", getAllCategories); // Get all categories
categoryRouter.delete("/delete/user/:uid/category/:categoryId", deleteCategory); // Delete a category

export default categoryRouter;
