const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");
const { authenticateToken, JWT_SECRET } = require("../middleware/auth");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Middleware to verify database connection before handling auth requests
const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database Connection Error: Server is not connected to MongoDB Atlas. Please whitelist your IP address in MongoDB Atlas Network Access (0.0.0.0/0).",
        });
    }
    next();
};

// POST /api/auth/register — Register new committee or sponsor account
router.post("/register", checkDbConnection, async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            organizationName,
            collegeName,
            committee,
            company,
            college,
            committeeName,
            companyName,
        } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, email, password, and role are required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long.",
            });
        }

        if (!["committee", "sponsor"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be either 'committee' or 'sponsor'.",
            });
        }

        // Check duplicate email
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists.",
            });
        }

        // Determine organizationName and collegeName
        const finalOrganization =
            organizationName || committeeName || companyName || committee || company || name;
        const finalCollege = collegeName || college || (role === "committee" ? "VESIT" : "");

        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: password,
            role: role,
            organizationName: finalOrganization.trim(),
            collegeName: finalCollege.trim(),
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const safeUser = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationName: user.organizationName,
            collegeName: user.collegeName,
            college: user.collegeName,
            committee: user.role === "committee" ? user.organizationName : "",
            company: user.role === "sponsor" ? user.organizationName : "",
        };

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message,
        });
    }
});

// POST /api/auth/login — Authenticate user and issue JWT
router.post("/login", checkDbConnection, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Transparent Migration for Legacy Plain-Text Accounts on successful login
        if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
            try {
                user.password = password;
                await user.save();
                console.log(`Migrated legacy plain-text password to bcrypt hash for user: ${user.email}`);
            } catch (migrateErr) {
                console.error("Failed to transparently migrate legacy password hash:", migrateErr.message);
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const safeUser = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationName: user.organizationName,
            collegeName: user.collegeName,
            college: user.collegeName,
            committee: user.role === "committee" ? user.organizationName : "",
            company: user.role === "sponsor" ? user.organizationName : "",
        };

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: safeUser,
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({
            success: false,
            message: "Failed to sign in",
            error: error.message,
        });
    }
});

// GET /api/auth/me — Return current authenticated user profile
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const safeUser = {
            _id: req.user._id,
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            organizationName: req.user.organizationName,
            collegeName: req.user.collegeName,
            college: req.user.collegeName,
            committee: req.user.role === "committee" ? req.user.organizationName : "",
            company: req.user.role === "sponsor" ? req.user.organizationName : "",
        };

        res.json({
            success: true,
            user: safeUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile",
            error: error.message,
        });
    }
});

module.exports = router;
