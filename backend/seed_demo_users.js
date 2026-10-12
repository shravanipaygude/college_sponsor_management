const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config({ path: path.join(__dirname, ".env") });

const demoUsers = [
    {
        name: "CSI VESIT",
        email: "csi@vesit.demo",
        password: "Csi@Vesit2026",
        role: "committee",
        organizationName: "CSI",
        collegeName: "VESIT",
    },
    {
        name: "IEEE VESIT",
        email: "ieee@vesit.demo",
        password: "Ieee@Vesit2026",
        role: "committee",
        organizationName: "IEEE",
        collegeName: "VESIT",
    },
    {
        name: "ISTE VESIT",
        email: "iste@vesit.demo",
        password: "Iste@Vesit2026",
        role: "committee",
        organizationName: "ISTE",
        collegeName: "VESIT",
    },
    {
        name: "ISA VESIT",
        email: "isa@vesit.demo",
        password: "Isa@Vesit2026",
        role: "committee",
        organizationName: "ISA",
        collegeName: "VESIT",
    },
    {
        name: "Red Bull Partnerships",
        email: "redbull@sponnect.demo",
        password: "RedBull@2026",
        role: "sponsor",
        organizationName: "Red Bull",
        collegeName: "",
    },
    {
        name: "SUGAR Cosmetics Partnerships",
        email: "sugar@sponnect.demo",
        password: "Sugar@2026",
        role: "sponsor",
        organizationName: "SUGAR Cosmetics",
        collegeName: "",
    },
];

async function seedDemoUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "test" });
        console.log("Connected to MongoDB Atlas 'test' database.");

        const results = [];

        for (const account of demoUsers) {
            let existingUser = await User.findOne({ email: account.email });

            if (existingUser) {
                existingUser.name = account.name;
                existingUser.role = account.role;
                existingUser.organizationName = account.organizationName;
                existingUser.collegeName = account.collegeName;
                existingUser.password = account.password;
                await existingUser.save();
                results.push({ email: account.email, status: "updated", id: existingUser._id.toString() });
            } else {
                const newUser = new User(account);
                await newUser.save();
                results.push({ email: account.email, status: "created", id: newUser._id.toString() });
            }
        }

        console.log("Seed completed successfully:");
        console.log(JSON.stringify(results, null, 2));

        await mongoose.disconnect();
        return results;
    } catch (err) {
        console.error("Error seeding demo users:", err);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDemoUsers();
}

module.exports = { demoUsers, seedDemoUsers };
