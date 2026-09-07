const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

async function audit() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    const users = await db.collection('users').find({}).toArray();
    console.log("\n=== USERS ===");
    users.forEach(u => {
      console.log(`ID: ${u._id} | Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Org: ${u.organizationName} | College: ${u.collegeName}`);
    });

    const events = await db.collection('events').find({}).toArray();
    console.log("\n=== EVENTS ===");
    events.forEach(e => {
      console.log(`ID: ${e._id} | Title: ${e.title} | EventName: ${e.eventName} | CreatedBy: ${e.createdBy} | College: ${e.collegeName} | Org: ${e.organizationName}`);
    });

    const opportunities = await db.collection('opportunities').find({}).toArray();
    console.log("\n=== OPPORTUNITIES ===");
    opportunities.forEach(o => {
      console.log(`ID: ${o._id} | Title: ${o.title} | Company: ${o.companyName} | CreatedBy: ${o.createdBy}`);
    });

    const requests = await db.collection('requests').find({}).toArray();
    console.log("\n=== REQUESTS ===");
    requests.forEach(r => {
      console.log(`ID: ${r._id} | Status: ${r.status} | Sender: ${r.sender} | Receiver: ${r.receiver} | Event: ${r.event} | Opp: ${r.opportunity} | Details: ${r.agreementDetails}`);
    });

    const partnerships = await db.collection('partnerships').find({}).toArray();
    console.log("\n=== PARTNERSHIPS ===");
    partnerships.forEach(p => {
      console.log(`ID: ${p._id} | Status: ${p.status} | Committee: ${p.committee} | Sponsor: ${p.sponsor} | Request: ${p.request} | Details: ${p.agreementDetails}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error("Audit error:", err);
  }
}

audit();
