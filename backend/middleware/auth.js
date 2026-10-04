const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "sponnect_jwt_secret_key_exp6_2026";

/**
 * Middleware to authenticate requests using JWT token in Authorization header.
 * Header format: Authorization: Bearer <token>
 */
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Authentication token is missing.",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Invalid token format.",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const userId = decoded.userId || decoded.id || decoded._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication payload.",
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Authentication error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Token is invalid or expired.",
        });
    }
};

/**
 * Middleware to restrict route access to specific user roles.
 * Example: requireRole("committee") or requireRole("committee", "sponsor")
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User identity not found.",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden. Access requires ${allowedRoles.join(" or ")} role.`,
            });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    requireRole,
    JWT_SECRET,
};
