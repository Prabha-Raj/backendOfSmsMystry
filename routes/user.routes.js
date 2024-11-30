import {
    signup,
    login,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    logout
} from "../controllers/user.controller.js";
import express from "express";
import authenticateUser from "../middlewares/authenticateUser.js";

const userRouter = express.Router();

// Public routes (no authentication required)
userRouter.post('/signup', signup); // User registration
userRouter.post('/login', login);   // User login

// Protected routes (authentication required)
userRouter.get("/getuser/:id", authenticateUser, getUser);       // Get specific user details
userRouter.get("/getallusers", authenticateUser, getAllUsers);   // Get all users
userRouter.put("/update/:id", authenticateUser, updateUser);     // Update user details
userRouter.delete('/delete/:id', authenticateUser, deleteUser);  // Delete a user
userRouter.post('/logout', authenticateUser, logout);  // logout user

export default userRouter;
