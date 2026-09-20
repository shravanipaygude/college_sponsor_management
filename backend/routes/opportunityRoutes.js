const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");
const mongoose = require("mongoose");
const { authenticateToken, requireRole } = require("../middleware/auth");

// Helper for ownership comparison
const isOwner = (docCreatedBy, userId) => {
    if (!docCreatedBy || !userId) return false;
    const docId = typeof docCreatedBy === "object" && docCreatedBy._id ? docCreatedBy._id.toString() : docCreatedBy.toString();
    return docId === userId.toString();
};

// Create a new sponsor opportunity — Sponsor only
router.post("/", authenticateToken, requireRole("sponsor"), async (req, res) => {
    try {
        const { title, description, supportType, amountOrValue, requirements, category, interestedIn } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title and description are required.",
            });
        }

        // Trust authenticated user identity ONLY for createdBy and companyName
        const body = {
            title: title.trim(),
            description: description.trim(),
            companyName: req.user.organizationName || req.body.companyName || "Corporate Sponsor",
            supportType: Array.isArray(supportType) ? supportType : ["Hybrid"],
            amountOrValue: amountOrValue || "₹50,000",
            requirements: Array.isArray(requirements) ? requirements : [],
            category: category || "AI / Technology",
            interestedIn: Array.isArray(interestedIn) ? interestedIn : [],
            createdBy: req.user._id,
            status: "open",
        };

        const opportunity = new Opportunity(body);
        const savedOpportunity = await opportunity.save();

        res.status(201).json(savedOpportunity);
    } catch (error) {
        console.error("Error creating opportunity:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create opportunity",
            error: error.message,
        });
    }
});

// Get all sponsor opportunities — Public discovery marketplace
router.get("/", async (req, res) => {
    try {
        const opportunities = await Opportunity.find().sort({ createdAt: -1 });
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch opportunities",
            error: error.message,
        });
    }
});

// Get one opportunity by ID — Public
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid opportunity ID" });
        }

        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found",
            });
        }

        res.json(opportunity);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch opportunity",
            error: error.message,
        });
    }
});

// Update opportunity by ID — Sponsor ownership required
router.patch("/:id", authenticateToken, requireRole("sponsor"), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid opportunity ID" });
        }

        const existingOpp = await Opportunity.findById(req.params.id);

        if (!existingOpp) {
            return res.status(404).json({ success: false, message: "Opportunity not found" });
        }

        // Ownership Authorization Check
        if (!isOwner(existingOpp.createdBy, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You do not have permission to modify this opportunity.",
            });
        }

        // Prevent modification of createdBy owner field
        const updateData = { ...req.body };
        delete updateData.createdBy;

        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedOpportunity);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update opportunity",
            error: error.message,
        });
    }
});

// Delete opportunity by ID — Sponsor ownership required
router.delete("/:id", authenticateToken, requireRole("sponsor"), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid opportunity ID" });
        }

        const existingOpp = await Opportunity.findById(req.params.id);

        if (!existingOpp) {
            return res.status(404).json({ success: false, message: "Opportunity not found" });
        }

        // Ownership Authorization Check
        if (!isOwner(existingOpp.createdBy, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You do not have permission to delete this opportunity.",
            });
        }

        await Opportunity.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Opportunity deleted successfully", id: req.params.id });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete opportunity",
            error: error.message,
        });
    }
});

module.exports = router;