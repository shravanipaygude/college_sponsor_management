const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

// Create a new sponsor opportunity
router.post("/", async (req, res) => {
    try {
        const opportunity = new Opportunity(req.body);
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

// Get one opportunity
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

module.exports = router;