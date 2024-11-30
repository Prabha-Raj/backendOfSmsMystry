import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Authentication token missing. Please login.",
                success: false,
            });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token. Please login again.",
                    success: false,
                });
            }

            // Attach user data to the request object
            req.user = {
                id: decoded.id,
                role: decoded.role,
            };
            next(); // Proceed to the next middleware/route handler
        });
    } catch (error) {
        console.error("Authentication Middleware Error:", error);
        res.status(500).json({
            message: "Server Error",
            success: false,
        });
    }
};

export default authenticateUser;
