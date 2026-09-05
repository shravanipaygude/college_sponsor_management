const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

const mongoose = require("mongoose");

// Create a new request
// Sponsor -> Committee (Express Interest)
// Committee -> Sponsor (Approach Sponsor)
router.post("/", async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.sender && typeof body.sender === "string" && mongoose.Types.ObjectId.isValid(body.sender)) {
            body.sender = new mongoose.Types.ObjectId(body.sender);
        }
        if (body.receiver && typeof body.receiver === "string" && mongoose.Types.ObjectId.isValid(body.receiver)) {
            body.receiver = new mongoose.Types.ObjectId(body.receiver);
        }
        if (body.event && typeof body.event === "string" && mongoose.Types.ObjectId.isValid(body.event)) {
            body.event = new mongoose.Types.ObjectId(body.event);
        }
        if (body.opportunity && typeof body.opportunity === "string" && mongoose.Types.ObjectId.isValid(body.opportunity)) {
            body.opportunity = new mongoose.Types.ObjectId(body.opportunity);
        }

        const duplicateQuery = { status: "pending" };
        if (body.sender) duplicateQuery.sender = body.sender;
        if (body.receiver) duplicateQuery.receiver = body.receiver;
        if (body.event) duplicateQuery.event = body.event;
        if (body.opportunity) duplicateQuery.opportunity = body.opportunity;

        if (body.sender && body.receiver && (body.event || body.opportunity)) {
            const existing = await Request.findOne(duplicateQuery);
            if (existing) {
                return res.status(200).json(existing);
            }
        }

        const request = new Request(body);
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
            .populate("sender")
            .populate("receiver")
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