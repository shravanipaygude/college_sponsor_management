const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

const mongoose = require("mongoose");

// Create a new event
router.post("/", async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.createdBy && !mongoose.Types.ObjectId.isValid(body.createdBy)) {
            delete body.createdBy;
        }
        const event = new Event(body);
        const savedEvent = await event.save();

        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create event",
            error: error.message,
        });
    }
});

// Get all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message,
        });
    }
});

// Get one event by ID
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message,
        });
    }
});

// Update event by ID
router.patch("/:id", async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update event",
            error: error.message,
        });
    }
});

// Delete event by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully", id: req.params.id });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message,
        });
    }
});

module.exports = router;