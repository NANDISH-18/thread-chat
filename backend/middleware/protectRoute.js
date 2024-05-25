import jwt from 'jsonwebtoken';
import users from '../models/userModel.js';

const protectRoute = async (req, res, next) => {
    try {
        // Extract the token from the cookies
        const token = req.cookies.jwt;

        // If no token is found, return an unauthorized status
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Verify the token using the secret key from environment variables
        const decode = jwt.verify(token, process.env.jwtToken);

        // Find the user by the decoded userId, excluding the password field
        const user = await users.findById(decode.userId).select('-password');

        // Add the user information to the request object for use in subsequent middleware or route handlers
        req.user = user;

        // Call the next middleware or route handler
        next();

    } catch (err) {
        // If an error occurs, return a 500 status and log the error message
        res.status(500).json({ message: err.message });
        console.log('Error in protect Route middleware', err.message);
    }
};

export default protectRoute;
