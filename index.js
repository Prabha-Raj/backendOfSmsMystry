import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./utils/connect.js"; // Ensure the correct path to your connect.js file
import userRouter from './routes/user.routes.js'
import categoryRouter from "./routes/category.routes.js";
import blogRouter from "./routes/blog.routes.js";

// Load environment variables
dotenv.config({});

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

// Default route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// APIs
app.use('/api/v1/user',userRouter)
app.use('/api/v1/category',categoryRouter)
app.use('/api/v1/blog', blogRouter)


// Start the server and connect to the database
const startServer = async () => {
    try {
        await connectDb(); // Connect to the database before starting the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1); // Exit the process on failure
    }
};

startServer();
