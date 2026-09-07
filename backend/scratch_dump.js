const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function dumpAll() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  console.log("=== USERS ===");
  const users = await db.collection('users').find({}).toArray();
  users.forEach((u, i) => {
    console.log(`[USER ${i+1}] ID: ${u._id} | Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | Org: ${u.organizationName} | College: ${u.collegeName}`);
  });

  console.log("\n=== EVENTS ===");
  const events = await db.collection('events').find({}).toArray();
  events.forEach((e, i) => {
    console.log(`[EVENT ${i+1}] ID: ${e._id} | Title: ${e.title} | CreatedBy: ${e.createdBy} | CreatedAt: ${e.createdAt}`);
  });

  console.log("\n=== OPPORTUNITIES ===");
  const opportunities = await db.collection('opportunities').find({}).toArray();
  opportunities.forEach((o, i) => {
    console.log(`[OPPORTUNITY ${i+1}] ID: ${o._id} | Title: ${o.title} | Company: ${o.companyName} | CreatedBy: ${o.createdBy} | CreatedAt: ${o.createdAt}`);
  });

  console.log("\n=== REQUESTS ===");
  const requests = await db.collection('requests').find({}).toArray();
  requests.forEach((r, i) => {
    console.log(`[REQUEST ${i+1}] ID: ${r._id} | Status: ${r.status} | Sender: ${r.sender} | Receiver: ${r.receiver} | Event: ${r.event} | Opp: ${r.opportunity} | CreatedAt: ${r.createdAt} | Msg: ${r.message}`);
  });

  console.log("\n=== PARTNERSHIPS ===");
  const partnerships = await db.collection('partnerships').find({}).toArray();
  partnerships.forEach((p, i) => {
    console.log(`[PARTNERSHIP ${i+1}] ID: ${p._id} | Status: ${p.partnershipStatus} | Committee: ${p.committee} | Sponsor: ${p.sponsor} | Event: ${p.event} | Opp: ${p.opportunity} | Request: ${p.request} | Details: ${p.agreementDetails} | CreatedAt: ${p.createdAt}`);
  });

  await mongoose.disconnect();
}

dumpAll();
