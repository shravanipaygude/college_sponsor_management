const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["committee", "sponsor"],
            required: true,
        },

        organizationName: {
            type: String,
            default: "",
            trim: true,
        },

        collegeName: {
            type: String,
            default: "",
            trim: true,
        },

        logo: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to hash password before saving to MongoDB
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    if (!this.password.startsWith("$2a$") && !this.password.startsWith("$2b$")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Method to compare candidate password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$")) {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    return candidatePassword === this.password;
};

module.exports = mongoose.model("User", userSchema);