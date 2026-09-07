const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Partnership = require("../models/Partnership");
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

        // Fetch unpopulated request first to preserve raw sender/receiver IDs
        const unpopulatedReq = await Request.findById(req.params.id);

        if (!unpopulatedReq) {
            return res.status(404).json({
                message: "Request not found",
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
            // Extract raw unpopulated sender and receiver IDs to ensure non-null assignment
            const rawSender = unpopulatedReq.sender;
            const rawReceiver = unpopulatedReq.receiver;
            const rawEvent = unpopulatedReq.event;
            const rawOpp = unpopulatedReq.opportunity;

            // CASE A: Sponsor expressed interest in Committee Event (request.event present or receiver is committee / sender is sponsor)
            // CASE B: Committee approached Sponsor Opportunity (request.opportunity present or sender is committee / receiver is sponsor)
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

            // Check if partnership already exists for this request
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
            } else if (!partnershipDoc.committee || !partnershipDoc.sponsor) {
                // Heal existing partnership if committee or sponsor was saved as null
                await Partnership.updateOne(
                    { _id: partnershipDoc._id },
                    { $set: { committee: committeeId, sponsor: sponsorId } }
                );
                partnershipDoc = await Partnership.findById(partnershipDoc._id)
                    .populate("committee")
                    .populate("sponsor")
                    .populate("request")
                    .populate("event")
                    .populate("opportunity");
            }
        }

        res.json({
            request,
            partnership: partnershipDoc,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update request",
            error: error.message,
        });
    }
});

module.exports = router;