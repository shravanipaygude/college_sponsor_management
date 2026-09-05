const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Partnership = require("../models/Partnership");
const User = require("../models/User");
const Event = require("../models/Event");
const Opportunity = require("../models/Opportunity");
const Request = require("../models/Request");

// Create a new partnership (e.g., when a request is accepted)
// Prevents accidental duplicate partnerships for the same request
router.post("/", async (req, res) => {
    try {
        const body = { ...req.body };
        if (body.committee && !mongoose.Types.ObjectId.isValid(body.committee)) delete body.committee;
        if (body.sponsor && !mongoose.Types.ObjectId.isValid(body.sponsor)) delete body.sponsor;
        if (body.request && !mongoose.Types.ObjectId.isValid(body.request)) delete body.request;
        if (body.event && !mongoose.Types.ObjectId.isValid(body.event)) delete body.event;
        if (body.opportunity && !mongoose.Types.ObjectId.isValid(body.opportunity)) delete body.opportunity;
        if (body.approvedBy && !mongoose.Types.ObjectId.isValid(body.approvedBy)) delete body.approvedBy;

        const requestId = body.request;

        if (requestId) {
            const existingPartnership = await Partnership.findOne({ request: requestId })
                .populate("committee")
                .populate("sponsor")
                .populate("request")
                .populate("event")
                .populate("opportunity");

            if (existingPartnership) {
                return res.status(200).json(existingPartnership);
            }

            // Derive committee and sponsor from request if missing
            const requestDoc = await Request.findById(requestId);
            if (requestDoc) {
                if (!body.event && requestDoc.event) body.event = requestDoc.event;
                if (!body.opportunity && requestDoc.opportunity) body.opportunity = requestDoc.opportunity;

                if (!body.committee || !body.sponsor) {
                    if (requestDoc.receiverRole === "committee" || requestDoc.senderRole === "sponsor") {
                        body.committee = body.committee || requestDoc.receiver;
                        body.sponsor = body.sponsor || requestDoc.sender;
                    } else {
                        body.committee = body.committee || requestDoc.sender;
                        body.sponsor = body.sponsor || requestDoc.receiver;
                    }
                }
            }
        }

        if (body.event && body.sponsor) {
            const existingMatch = await Partnership.findOne({ event: body.event, sponsor: body.sponsor })
                .populate("committee")
                .populate("sponsor")
                .populate("request")
                .populate("event")
                .populate("opportunity");

            if (existingMatch) {
                return res.status(200).json(existingMatch);
            }
        }

        const partnership = new Partnership(body);
        const savedPartnership = await partnership.save();

        const populatedPartnership = await Partnership.findById(savedPartnership._id)
            .populate("committee")
            .populate("sponsor")
            .populate("request")
            .populate("event")
            .populate("opportunity");

        res.status(201).json(populatedPartnership);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create partnership",
            error: error.message,
        });
    }
});

// Get all partnerships (supports filtering by facultyApprovalStatus)
router.get("/", async (req, res) => {
    try {
        const query = {};
        if (req.query.facultyApprovalStatus) {
            query.facultyApprovalStatus = req.query.facultyApprovalStatus;
        }

        let partnerships = await Partnership.find(query)
            .populate("committee")
            .populate("sponsor")
            .populate("request")
            .populate("event")
            .populate("opportunity")
            .sort({ createdAt: -1 });

        if (req.query.collegeName) {
            const targetCollege = req.query.collegeName.trim().toLowerCase();
            partnerships = partnerships.filter((p) => {
                const docCollege = (
                    p.collegeName ||
                    p.committee?.collegeName ||
                    p.committee?.college ||
                    p.event?.collegeName ||
                    "VESIT"
                ).toLowerCase();
                return docCollege === targetCollege;
            });
        }

        res.json(partnerships);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch partnerships",
            error: error.message,
        });
    }
});

// Get one partnership by ID
router.get("/:id", async (req, res) => {
    try {
        const partnership = await Partnership.findById(req.params.id)
            .populate("request")
            .populate("event")
            .populate("opportunity");

        if (!partnership) {
            return res.status(404).json({
                message: "Partnership not found",
            });
        }

        res.json(partnership);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch partnership",
            error: error.message,
        });
    }
});

// Faculty approval/rejection endpoint
// Updates facultyApprovalStatus ("approved" | "rejected" | "pending"), facultyRemarks, approvedBy
router.patch("/:id/approval", async (req, res) => {
    try {
        const { facultyApprovalStatus, facultyRemarks, approvedBy } = req.body;

        if (!["pending", "approved", "rejected"].includes(facultyApprovalStatus)) {
            return res.status(400).json({
                message: "facultyApprovalStatus must be pending, approved, or rejected",
            });
        }

        const updateData = {
            facultyApprovalStatus,
        };

        if (facultyRemarks !== undefined) {
            updateData.facultyRemarks = facultyRemarks;
        }

        if (approvedBy !== undefined && mongoose.Types.ObjectId.isValid(approvedBy)) {
            updateData.approvedBy = approvedBy;
        }

        const partnership = await Partnership.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
            .populate("request")
            .populate("event")
            .populate("opportunity");

        if (!partnership) {
            return res.status(404).json({
                message: "Partnership not found",
            });
        }

        res.json(partnership);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update faculty approval status",
            error: error.message,
        });
    }
});

module.exports = router;
