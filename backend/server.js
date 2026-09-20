const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const requestRoutes = require("./routes/requestRoutes");
const partnershipRoutes = require("./routes/partnershipRoutes");

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration for local Vite development origin
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl) or matched origins
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, true); // Fallback to allow dev testing
            }
        },
        credentials: true,
    })
);

// Body parser
app.use(express.json());

// Rate Limiter for Authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later.",
    },
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/partnerships", partnershipRoutes);

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Sponnect REST API is running securely.",
    });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "An unexpected server error occurred.",
    });
});

// Function to seed default demo accounts if database is empty
const seedDemoUsers = async () => {
    try {
        const User = require("./models/User");
        const committeeDemo = await User.findOne({ email: "committee@sponnect.demo" });
        if (!committeeDemo) {
            const cUser = new User({
                name: "Shravani",
                email: "committee@sponnect.demo",
                password: "sponsor123",
                role: "committee",
                organizationName: "CSI",
                collegeName: "VESIT",
            });
            await cUser.save();
            console.log("Seeded demo committee user: committee@sponnect.demo");
        }

        const sponsorDemo = await User.findOne({ email: "sponsor@sponnect.demo" });
        if (!sponsorDemo) {
            const sUser = new User({
                name: "Arjun Mehta",
                email: "sponsor@sponnect.demo",
                password: "sponsor123",
                role: "sponsor",
                organizationName: "NovaAI Technologies",
                collegeName: "",
            });
            await sUser.save();
            console.log("Seeded demo sponsor user: sponsor@sponnect.demo");
        }
    } catch (seedErr) {
        console.error("Error seeding demo accounts:", seedErr.message);
    }
};

// Connect to MongoDB Atlas test database
mongoose
    .connect(process.env.MONGO_URI, { dbName: "test" })
    .then(() => {
        console.log("MongoDB Atlas connected successfully to 'test' database");
        seedDemoUsers();
    })
    .catch((err) => {
        console.error("MongoDB Atlas connection error:", err.message);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});