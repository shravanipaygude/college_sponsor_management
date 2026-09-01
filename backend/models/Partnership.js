const mongoose = require("mongoose");

const partnershipSchema = new mongoose.Schema(
    {
        committee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        sponsor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            default: null,
        },

        opportunity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Opportunity",
            default: null,
        },

        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request",
            required: false,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Partnership", partnershipSchema);