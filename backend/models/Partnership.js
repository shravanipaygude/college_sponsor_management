const mongoose = require("mongoose");

const partnershipSchema = new mongoose.Schema(
    {
        committee: {
            type: mongoose.Schema.Types.Mixed,
            ref: "User",
            required: false,
        },

        sponsor: {
            type: mongoose.Schema.Types.Mixed,
            ref: "User",
            required: false,
        },

        event: {
            type: mongoose.Schema.Types.Mixed,
            ref: "Event",
            default: null,
        },

        opportunity: {
            type: mongoose.Schema.Types.Mixed,
            ref: "Opportunity",
            default: null,
        },

        request: {
            type: mongoose.Schema.Types.Mixed,
            ref: "Request",
            required: false,
        },

        collegeName: {
            type: String,
            default: "VESIT",
            trim: true,
        },

        agreementDetails: {
            type: String,
            default: "",
        },

        supportProvided: {
            type: String,
            default: "",
        },

        deliverables: {
            type: [String],
            default: [],
        },

        partnershipStatus: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
        },

        facultyApprovalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        facultyRemarks: {
            type: String,
            default: "",
        },

        approvedBy: {
            type: mongoose.Schema.Types.Mixed,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Partnership", partnershipSchema);