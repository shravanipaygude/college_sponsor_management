const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Partnership = require("../models/Partnership");
const Event = require("../models/Event");
const Opportunity = require("../models/Opportunity");
const mongoose = require("mongoose");
const { authenticateToken } = require("../middleware/auth");

// Create a new request — Authenticated user (Sponsor -> Committee Event OR Committee -> Sponsor Opportunity)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { eventId, opportunityId, message, supportRequested, offerDetails } = req.body;
        const senderId = req.user._id;
        const senderRole = req.user.role;

        let targetReceiver = null;
        let targetReceiverRole = null;
        let targetEventId = null;
        let targetOppId = null;

        // CASE A: Sponsor expresses interest in a Committee Event
        if (senderRole === "sponsor" && (eventId || req.body.event)) {
            const eId = eventId || req.body.event;
            if (!mongoose.Types.ObjectId.isValid(eId)) {
                return res.status(400).json({ success: false, message: "Invalid event ID" });
            }
            const eventDoc = await Event.findById(eId);
            if (!eventDoc) {
                return res.status(404).json({ success: false, message: "Target event not found" });
            }
            targetEventId = eventDoc._id;
            targetReceiver = eventDoc.createdBy;
            targetReceiverRole = "committee";
        }
        // CASE B: Committee approaches a Sponsor Opportunity
        else if (senderRole === "committee" && (opportunityId || req.body.opportunity)) {
            const oId = opportunityId || req.body.opportunity;
            if (!mongoose.Types.ObjectId.isValid(oId)) {
                return res.status(400).json({ success: false, message: "Invalid opportunity ID" });
            }
            const oppDoc = await Opportunity.findById(oId);
            if (!oppDoc) {
                return res.status(404).json({ success: false, message: "Target opportunity not found" });
            }
            targetOppId = oppDoc._id;
            targetReceiver = oppDoc.createdBy;
            targetReceiverRole = "sponsor";
        } else {
            // Fallback for direct IDs if supplied
            if (req.body.receiver && mongoose.Types.ObjectId.isValid(req.body.receiver)) {
                targetReceiver = req.body.receiver;
                targetReceiverRole = req.body.receiverRole || (senderRole === "sponsor" ? "committee" : "sponsor");
            }
            if (req.body.event && mongoose.Types.ObjectId.isValid(req.body.event)) {
                targetEventId = req.body.event;
            }
            if (req.body.opportunity && mongoose.Types.ObjectId.isValid(req.body.opportunity)) {
                targetOppId = req.body.opportunity;
            }
        }

        if (!targetReceiver) {
            return res.status(400).json({
                success: false,
                message: "Target recipient user could not be resolved.",
            });
        }

        // Prevent duplicate pending request
        const duplicateQuery = {
            sender: senderId,
            receiver: targetReceiver,
            status: "pending",
        };
        if (targetEventId) duplicateQuery.event = targetEventId;
        if (targetOppId) duplicateQuery.opportunity = targetOppId;

        const existing = await Request.findOne(duplicateQuery);
        if (existing) {
            return res.status(200).json(existing);
        }

        const newRequest = new Request({
            sender: senderId,
            senderRole: senderRole,
            receiver: targetReceiver,
            receiverRole: targetReceiverRole,
            event: targetEventId,
            opportunity: targetOppId,
            message: message || "Partnership request",
            supportRequested: supportRequested || "",
            offerDetails: offerDetails || "",
            status: "pending",
        });

        const savedRequest = await newRequest.save();
        const populatedRequest = await Request.findById(savedRequest._id)
            .populate("sender")
            .populate("receiver")
            .populate("event")
            .populate("opportunity");

        // Emit real-time Socket.IO event 'request:new' to target recipient room
        const io = req.app.get("io");
        if (io && populatedRequest && populatedRequest.receiver) {
            const targetRoom = `user:${populatedRequest.receiver._id.toString()}`;
            const requestPayload = {
                requestId: populatedRequest._id,
                sender: {
                    _id: populatedRequest.sender._id,
                    name: populatedRequest.sender.name,
                    organizationName: populatedRequest.sender.organizationName,
                    role: populatedRequest.sender.role,
                },
                receiver: populatedRequest.receiver._id,
                event: populatedRequest.event ? { _id: populatedRequest.event._id, title: populatedRequest.event.title } : null,
                opportunity: populatedRequest.opportunity ? { _id: populatedRequest.opportunity._id, title: populatedRequest.opportunity.title } : null,
                message: populatedRequest.message,
                supportRequested: populatedRequest.supportRequested,
                offerDetails: populatedRequest.offerDetails,
                status: populatedRequest.status,
                timestamp: populatedRequest.createdAt || new Date().toISOString(),
            };
            console.log(`[Socket.IO] Emitting 'request:new' to room: ${targetRoom}`);
            io.to(targetRoom).emit("request:new", requestPayload);
        }

        res.status(201).json(populatedRequest);
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create request",
            error: error.message,
        });
    }
});

// Get requests — Authenticated user's incoming or outgoing requests
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Query requests where current user is either sender or receiver
        const requests = await Request.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate("sender")
            .populate("receiver")
            .populate("event")
            .populate("opportunity")
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch requests",
            error: error.message,
        });
    }
});

// Update request status — Accept / Decline (Target receiver only)
router.patch("/:id/status", authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["accepted", "declined"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be 'accepted' or 'declined'.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid request ID" });
        }

        const unpopulatedReq = await Request.findById(req.params.id);

        if (!unpopulatedReq) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        // Target receiver ownership check
        const receiverId = unpopulatedReq.receiver ? (unpopulatedReq.receiver._id || unpopulatedReq.receiver).toString() : null;
        if (receiverId !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Forbidden. Only the designated request recipient can accept or decline this request.",
            });
        }

        unpopulatedReq.status = status;
        await unpopulatedReq.save();

        const request = await Request.findById(req.params.id)
            .populate("sender")
            .populate("receiver")
            .populate("event")
            .populate("opportunity");

        let partnershipDoc = null;

        if (status === "accepted") {
            const rawSender = unpopulatedReq.sender;
            const rawReceiver = unpopulatedReq.receiver;
            const rawEvent = unpopulatedReq.event;
            const rawOpp = unpopulatedReq.opportunity;

            let committeeId = null;
            let sponsorId = null;

            if (rawEvent || unpopulatedReq.senderRole === "sponsor" || unpopulatedReq.receiverRole === "committee") {
                committeeId = rawReceiver;
                sponsorId = rawSender;
            } else {
                committeeId = rawSender;
                sponsorId = rawReceiver;
            }

            if (committeeId && typeof committeeId === "string" && mongoose.Types.ObjectId.isValid(committeeId)) {
                committeeId = new mongoose.Types.ObjectId(committeeId);
            }
            if (sponsorId && typeof sponsorId === "string" && mongoose.Types.ObjectId.isValid(sponsorId)) {
                sponsorId = new mongoose.Types.ObjectId(sponsorId);
            }

            // Reuse or create EXACTLY ONE Partnership document for this request
            partnershipDoc = await Partnership.findOne({ request: request._id })
                .populate("committee")
                .populate("sponsor")
                .populate("request")
                .populate("event")
                .populate("opportunity");

            if (!partnershipDoc) {
                const partnershipData = {
                    request: request._id,
                    committee: committeeId,
                    sponsor: sponsorId,
                    event: rawEvent || null,
                    opportunity: rawOpp || null,
                    agreementDetails: request.message || "Partnership Agreement",
                    supportProvided: request.supportRequested || "Sponsorship Support",
                    deliverables: request.offerDetails
                        ? request.offerDetails.split(",").map((s) => s.trim()).filter(Boolean)
                        : ["Main Stage Branding"],
                    partnershipStatus: "active",
                    facultyApprovalStatus: "approved",
                };

                try {
                    const newPartnership = new Partnership(partnershipData);
                    const saved = await newPartnership.save();
                    partnershipDoc = await Partnership.findById(saved._id)
                        .populate("committee")
                        .populate("sponsor")
                        .populate("request")
                        .populate("event")
                        .populate("opportunity");
                } catch (createErr) {
                    if (createErr.code === 11000) {
                        partnershipDoc = await Partnership.findOne({ request: request._id })
                            .populate("committee")
                            .populate("sponsor")
                            .populate("request")
                            .populate("event")
                            .populate("opportunity");
                    } else {
                        throw createErr;
                    }
                }
            }
        }

        // Socket.IO Real-Time Notifications
        const io = req.app.get("io");
        const origSenderId = request.sender ? (request.sender._id || request.sender).toString() : null;
        const origReceiverId = request.receiver ? (request.receiver._id || request.receiver).toString() : null;

        if (io && origSenderId) {
            const senderRoom = `user:${origSenderId}`;
            const statusPayload = {
                requestId: request._id,
                status: request.status,
                sender: origSenderId,
                receiver: origReceiverId,
                event: request.event ? { _id: request.event._id, title: request.event.title } : null,
                opportunity: request.opportunity ? { _id: request.opportunity._id, title: request.opportunity.title } : null,
                timestamp: new Date().toISOString(),
            };
            console.log(`[Socket.IO] Emitting 'request:statusChanged' to room: ${senderRoom}`);
            io.to(senderRoom).emit("request:statusChanged", statusPayload);
        }

        if (io && partnershipDoc) {
            const commId = partnershipDoc.committee ? (partnershipDoc.committee._id || partnershipDoc.committee).toString() : null;
            const sponId = partnershipDoc.sponsor ? (partnershipDoc.sponsor._id || partnershipDoc.sponsor).toString() : null;

            const pPayload = {
                partnershipId: partnershipDoc._id,
                requestId: request._id,
                committee: commId,
                sponsor: sponId,
                event: partnershipDoc.event ? { _id: partnershipDoc.event._id, title: partnershipDoc.event.title } : null,
                opportunity: partnershipDoc.opportunity ? { _id: partnershipDoc.opportunity._id, title: partnershipDoc.opportunity.title } : null,
                partnershipStatus: partnershipDoc.partnershipStatus,
                timestamp: partnershipDoc.createdAt || new Date().toISOString(),
            };

            if (commId) {
                console.log(`[Socket.IO] Emitting 'partnership:created' to room: user:${commId}`);
                io.to(`user:${commId}`).emit("partnership:created", pPayload);
            }
            if (sponId) {
                console.log(`[Socket.IO] Emitting 'partnership:created' to room: user:${sponId}`);
                io.to(`user:${sponId}`).emit("partnership:created", pPayload);
            }
        }

        res.json({
            request,
            partnership: partnershipDoc,
        });
    } catch (error) {
        console.error("Error updating request status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update request status",
            error: error.message,
        });
    }
});

module.exports = router;