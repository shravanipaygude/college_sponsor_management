const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Partnership = require("../models/Partnership");
const { authenticateToken } = require("../middleware/auth");

// Get all partnerships for the logged-in committee or sponsor user
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Query partnerships where the authenticated user is either committee or sponsor
        const query = {
            $or: [{ committee: userId }, { sponsor: userId }],
        };

        const partnerships = await Partnership.find(query)
            .populate("committee")
            .populate("sponsor")
            .populate("request")
            .populate("event")
            .populate("opportunity")
            .sort({ createdAt: -1 });

        res.json(partnerships);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch partnerships",
            error: error.message,
        });
    }
});

// Get one partnership by ID — Ownership required
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid partnership ID" });
        }

        const partnership = await Partnership.findById(req.params.id)
            .populate("committee")
            .populate("sponsor")
            .populate("request")
            .populate("event")
            .populate("opportunity");

        if (!partnership) {
            return res.status(404).json({
                success: false,
                message: "Partnership not found",
            });
        }

        const commId = partnership.committee ? (partnership.committee._id || partnership.committee).toString() : null;
        const sponId = partnership.sponsor ? (partnership.sponsor._id || partnership.sponsor).toString() : null;
        const userId = req.user._id.toString();

        if (commId !== userId && sponId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You do not have access to this partnership.",
            });
        }

        res.json(partnership);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch partnership",
            error: error.message,
        });
    }
});

module.exports = router;
