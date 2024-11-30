import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";

// Signup Controller
export const signup = async (req, res) => {
    const { fullname, username, email, password, role, avatar, bio } = req.body;

    try {
        if (!fullname || !username || !email || !password){
            return res.status(400).json({
                message:"Something is missing, fullname, username, email is required"
            })
        }
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email is already taken" });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            role,
            avatar,
            bio,
        });

        // Save the user to the database
        const user = await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Login Controller
export const login = async (req, res) => {
    const { username, password, role} = req.body;
    try {

        if (!username || !password){
            return res.status(400).json({
                message:"Something is missing username, password and role are required"
            })
        }

        // Find user by email
        const user = await User.findOne({ username:username }) 
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if(role !== user.role){
            return res.status(403).json({
                message:"user is not exist with this role"
            })
        }

        // Generate JWT Token      
        const tokenData = { id: user._id, role: user.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200)
        .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
        .json({
            message: `Welcome back, ${user.fullname}!`,
            user,
            success: true,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Logout Controller
export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
                message: "You are logged out successfully!",
                success: true,
            });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server Error", success: false });
    }
};


// Get User Controller
export const getUser = async (req, res) => {
    const userId  = req.params.id;

    try {
        const user = await User.findOne({_id:userId});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message:"these are the registered users",
            user
        });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find(); 

        // If no users found
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Return the list of users
        res.status(200).json({
            message: "List of all registered users",
            users,
        });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


// Update User Controller
export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { fullname, username, email, password, avatar, bio } = req.body;
    try {
        if(!fullname || !username || !email && !password){
            return res.status(400).json({
                message:"Something is missing, fullname, username, email are required"
            })
        }
        const user = await User.findOne({_id:userId});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update other fields
        if(fullname) user.fullname = fullname || user.fullname;
        if(username) user.username = username || user.username;
        if(email) user.email = email || user.email;
        if(fullname) user.avatar = avatar || user.avatar;
        if(bio) user.bio = bio || user.bio;

        // Save updated user
        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete User Controller
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    // console.log("userid",userId)

    try {
        const user = await User.findByIdAndDelete({ _id:userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
