const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

const mongoose = require("mongoose");

// Create a new sponsor opportunity
router.post("/", async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.createdBy && !mongoose.Types.ObjectId.isValid(body.createdBy)) {
            delete body.createdBy;
        }
        const opportunity = new Opportunity(body);
        const savedOpportunity = await opportunity.save();

        res.status(201).json(savedOpportunity);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create opportunity",
            error: error.message,
        });
    }
});

// Get all sponsor opportunities
router.get("/", async (req, res) => {
    try {
        const opportunities = await Opportunity.find().sort({
            createdAt: -1,
        });

        res.json(opportunities);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch opportunities",
            error: error.message,
        });
    }
});

// Get one opportunity by ID
router.get("/:id", async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                message: "Opportunity not found",
            });
        }

        res.json(opportunity);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch opportunity",
            error: error.message,
        });
    }
});

// Update opportunity by ID
router.patch("/:id", async (req, res) => {
    try {
        const updatedOpportunity = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOpportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.json(updatedOpportunity);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update opportunity",
            error: error.message,
        });
    }
});

// Delete opportunity by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedOpportunity = await Opportunity.findByIdAndDelete(req.params.id);

        if (!deletedOpportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        res.json({ message: "Opportunity deleted successfully", id: req.params.id });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete opportunity",
            error: error.message,
        });
    }
});

module.exports = router;