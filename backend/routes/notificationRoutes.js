const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { authenticateToken } = require("../middleware/auth");

/**
 * GET /api/notifications
 * Fetch all notifications belonging to the authenticated user
 */
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ recipient: userId })
            .populate("sender", "name email organizationName collegeName role")
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: error.message,
        });
    }
});

/**
 * GET /api/notifications/unread-count
 * Return unread count for current user
 */
router.get("/unread-count", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const count = await Notification.countDocuments({
            recipient: userId,
            read: false,
        });

        res.json({
            success: true,
            unreadCount: count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to count unread notifications",
            error: error.message,
        });
    }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read (recipient ownership enforced)
 */
router.patch("/:id/read", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
        }

        const notification = await Notification.findOne({
            _id: id,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or access denied",
            });
        }

        notification.read = true;
        await notification.save();

        res.json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Error marking notification as read:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to mark notification as read",
            error: error.message,
        });
    }
});

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for the authenticated user as read
 */
router.patch("/read-all", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await Notification.updateMany(
            { recipient: userId, read: false },
            { $set: { read: true } }
        );

        res.json({
            success: true,
            modifiedCount: result.modifiedCount,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to mark all notifications as read",
            error: error.message,
        });
    }
});

module.exports = router;
