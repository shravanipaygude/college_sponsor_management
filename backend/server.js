const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import Routes
const eventRoutes = require("./routes/eventRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const requestRoutes = require("./routes/requestRoutes");
const partnershipRoutes = require("./routes/partnershipRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/partnerships", partnershipRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("Sponnect Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});