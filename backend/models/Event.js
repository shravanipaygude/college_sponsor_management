const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        committeeName: {
            type: String,
            required: true,
        },

        eventDate: {
            type: Date,
        },

        category: {
            type: String,
            default: "",
        },

        sponsorshipNeeded: {
            type: String,
            default: "",
        },

        benefitsOffered: {
            type: [String],
            default: [],
        },

        coverImage: {
            type: String,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Event", eventSchema);