const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// Create a new request
// Sponsor -> Committee (Express Interest)
// Committee -> Sponsor (Approach Sponsor)
router.post("/", async (req, res) => {
    try {
        const request = new Request(req.body);
        const savedRequest = await request.save();

        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create request",
            error: error.message,
        });
    }
});

// Get all requests
router.get("/", async (req, res) => {
    try {
        const requests = await Request.find()
            .populate("event")
            .populate("opportunity")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message,
        });
    }
});

// Update request status - Accept / Decline
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["accepted", "declined"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or declined",
            });
        }

        const request = await Request.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({
                message: "Request not found",
            });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update request",
            error: error.message,
        });
    }
});

module.exports = router;