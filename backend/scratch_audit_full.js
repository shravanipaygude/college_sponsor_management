const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

async function auditDetailed() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    console.log("\n==================================================");
    console.log("USERS");
    console.log("==================================================");
    const users = await db.collection('users').find({}).toArray();
    users.forEach(u => {
      console.log(JSON.stringify(u, null, 2));
    });

    console.log("\n==================================================");
    console.log("EVENTS");
    console.log("==================================================");
    const events = await db.collection('events').find({}).toArray();
    events.forEach(e => {
      console.log(JSON.stringify(e, null, 2));
    });

    console.log("\n==================================================");
    console.log("OPPORTUNITIES");
    console.log("==================================================");
    const opportunities = await db.collection('opportunities').find({}).toArray();
    opportunities.forEach(o => {
      console.log(JSON.stringify(o, null, 2));
    });

    console.log("\n==================================================");
    console.log("REQUESTS");
    console.log("==================================================");
    const requests = await db.collection('requests').find({}).toArray();
    requests.forEach(r => {
      console.log(JSON.stringify(r, null, 2));
    });

    console.log("\n==================================================");
    console.log("PARTNERSHIPS");
    console.log("==================================================");
    const partnerships = await db.collection('partnerships').find({}).toArray();
    partnerships.forEach(p => {
      console.log(JSON.stringify(p, null, 2));
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error("Audit error:", err);
  }
}

auditDetailed();
