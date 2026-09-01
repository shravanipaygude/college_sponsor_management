const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        supportType: {
            type: [String],
            default: [],
        },

        amountOrValue: {
            type: String,
            default: "",
        },

        requirements: {
            type: [String],
            default: [],
        },

        category: {
            type: String,
            default: "",
        },

        campaignImage: {
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

module.exports = mongoose.model("Opportunity", opportunitySchema);