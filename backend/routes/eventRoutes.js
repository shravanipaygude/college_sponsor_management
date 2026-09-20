const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const mongoose = require("mongoose");
const { authenticateToken, requireRole } = require("../middleware/auth");

// Helper for ownership comparison
const isOwner = (docCreatedBy, userId) => {
    if (!docCreatedBy || !userId) return false;
    const docId = typeof docCreatedBy === "object" && docCreatedBy._id ? docCreatedBy._id.toString() : docCreatedBy.toString();
    return docId === userId.toString();
};

// Create a new event — Committee only
router.post("/", authenticateToken, requireRole("committee"), async (req, res) => {
    try {
        const { title, description, category, sponsorshipNeeded, benefitsOffered, eventDate, collegeName } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: title and description are required.",
            });
        }

        // Trust authenticated user identity ONLY for createdBy and committeeName
        const body = {
            title: title.trim(),
            description: description.trim(),
            committeeName: req.user.organizationName || req.body.committeeName || "CSI",
            collegeName: collegeName || req.user.collegeName || "VESIT",
            eventDate: eventDate || new Date(),
            category: category || "Technical Festival",
            sponsorshipNeeded: sponsorshipNeeded || "Hybrid",
            benefitsOffered: Array.isArray(benefitsOffered) ? benefitsOffered : [],
            createdBy: req.user._id,
            status: "open",
        };

        const event = new Event(body);
        const savedEvent = await event.save();

        res.status(201).json(savedEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: error.message,
        });
    }
});

// Get all events — Public discovery marketplace
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: error.message,
        });
    }
});

// Get one event by ID — Public
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid event ID" });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch event",
            error: error.message,
        });
    }
});

// Update event by ID — Committee ownership required
router.patch("/:id", authenticateToken, requireRole("committee"), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid event ID" });
        }

        const existingEvent = await Event.findById(req.params.id);

        if (!existingEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Ownership Authorization Check
        if (!isOwner(existingEvent.createdBy, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You do not have permission to modify this event.",
            });
        }

        // Prevent modification of createdBy owner field
        const updateData = { ...req.body };
        delete updateData.createdBy;

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: error.message,
        });
    }
});

// Delete event by ID — Committee ownership required
router.delete("/:id", authenticateToken, requireRole("committee"), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid event ID" });
        }

        const existingEvent = await Event.findById(req.params.id);

        if (!existingEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Ownership Authorization Check
        if (!isOwner(existingEvent.createdBy, req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. You do not have permission to delete this event.",
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Event deleted successfully", id: req.params.id });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: error.message,
        });
    }
});

module.exports = router;