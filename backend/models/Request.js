const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        senderRole: {
            type: String,
            enum: ["committee", "sponsor"],
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        receiverRole: {
            type: String,
            enum: ["committee", "sponsor"],
            required: true,
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

        message: {
            type: String,
            default: "",
        },

        supportRequested: {
            type: String,
            default: "",
        },

        offerDetails: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Request", requestSchema);