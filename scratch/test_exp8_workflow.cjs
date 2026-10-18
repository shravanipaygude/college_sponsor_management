const http = require("http");
const { io } = require("socket.io-client");
const path = require("path");
const mongoose = require(path.join(__dirname, "../backend/node_modules/mongoose"));
require(path.join(__dirname, "../backend/node_modules/dotenv")).config({ path: path.join(__dirname, "../backend/.env") });

const BASE_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

async function makeRequest(endpoint, method = "GET", headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runEndToEndWorkflow() {
  console.log("======================================================");
  console.log("EXPERIMENT 8 END-TO-END NOTIFICATION WORKFLOW TEST");
  console.log("======================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  let commSocket = null;
  let sponSocket = null;
  let createdRequestId = null;
  let createdPartnershipId = null;
  const createdNotificationIds = [];

  try {
    // 1. Log in Committee
    const commAuth = await makeRequest("/auth/login", "POST", {}, {
      email: "csi@vesit.demo",
      password: "Csi@Vesit2026",
    });
    const commToken = commAuth.body.token;
    const commUser = commAuth.body.user;

    // 2. Log in Sponsor
    const sponAuth = await makeRequest("/auth/login", "POST", {}, {
      email: "redbull@sponnect.demo",
      password: "RedBull@2026",
    });
    const sponToken = sponAuth.body.token;
    const sponUser = sponAuth.body.user;

    // 3. Connect sockets
    commSocket = await new Promise((resolve, reject) => {
      const s = io(SOCKET_URL, { auth: { token: commToken } });
      s.on("connect", () => resolve(s));
      s.on("connect_error", reject);
    });

    sponSocket = await new Promise((resolve, reject) => {
      const s = io(SOCKET_URL, { auth: { token: sponToken } });
      s.on("connect", () => resolve(s));
      s.on("connect_error", reject);
    });

    assert(commSocket.connected && sponSocket.connected, "Both Committee and Sponsor connected via Socket.IO");

    // 4. Find an existing event belonging to Committee
    const eventsRes = await makeRequest("/events", "GET", {
      Authorization: `Bearer ${commToken}`,
    });
    const event = eventsRes.body.find((e) => (e.createdBy?._id || e.createdBy) === commUser._id) || eventsRes.body[0];
    assert(!!event, `Found target event for sponsorship test: "${event?.title}"`);

    // 5. Track socket messages
    let commReceivedRequestNew = null;
    let sponReceivedRequestNew = false;
    commSocket.on("request:new", (data) => {
      commReceivedRequestNew = data;
    });
    sponSocket.on("request:new", () => {
      sponReceivedRequestNew = true;
    });

    // 6. Sponsor submits sponsorship request
    console.log("\n--- Workflow Step 1: Sponsor submits request to Committee ---");
    const createReqRes = await makeRequest("/requests", "POST", {
      Authorization: `Bearer ${sponToken}`,
    }, {
      eventId: event._id,
      message: "E2E Test Sponsorship Proposal",
      supportRequested: "₹25,000 Support",
      offerDetails: "Main Banner, Social Mention",
    });

    assert(
      createReqRes.status === 201 || createReqRes.status === 200,
      `Sponsor submitted request (status: ${createReqRes.status})`
    );
    createdRequestId = createReqRes.body._id;

    // Allow socket dispatch
    await new Promise((r) => setTimeout(r, 600));

    assert(
      commReceivedRequestNew !== null,
      `Committee received real-time 'request:new' socket event for request ${createdRequestId}`
    );
    assert(
      sponReceivedRequestNew === false,
      `Recipient Isolation: Sponsor did NOT receive 'request:new' socket event`
    );

    // 7. Verify persistent notification in Committee's feed
    console.log("\n--- Workflow Step 2: Verify Persistent Notification for Committee ---");
    const commNotifRes = await makeRequest("/notifications", "GET", {
      Authorization: `Bearer ${commToken}`,
    });
    const foundNotif = commNotifRes.body.notifications?.find(
      (n) => n.relatedId === createdRequestId || n.metadata?.requestId === createdRequestId
    );
    assert(
      !!foundNotif,
      `Persistent notification saved in MongoDB for Committee: "${foundNotif?.title} - ${foundNotif?.message}"`
    );
    if (foundNotif) createdNotificationIds.push(foundNotif._id);

    // 8. Test marking notification as read
    console.log("\n--- Workflow Step 3: Mark Notification as Read ---");
    if (foundNotif) {
      const readRes = await makeRequest(`/notifications/${foundNotif._id}/read`, "PATCH", {
        Authorization: `Bearer ${commToken}`,
      });
      assert(
        readRes.status === 200 && readRes.body.notification?.read === true,
        `Notification ${foundNotif._id} marked as read in database`
      );
    }

    // 9. Committee accepts the request
    console.log("\n--- Workflow Step 4: Committee accepts request -> Partnership created ---");
    let sponReceivedStatusChange = null;
    let commReceivedPartnership = null;
    let sponReceivedPartnership = null;

    sponSocket.on("request:statusChanged", (d) => {
      sponReceivedStatusChange = d;
    });
    commSocket.on("partnership:created", (d) => {
      commReceivedPartnership = d;
    });
    sponSocket.on("partnership:created", (d) => {
      sponReceivedPartnership = d;
    });

    const acceptRes = await makeRequest(`/requests/${createdRequestId}/status`, "PATCH", {
      Authorization: `Bearer ${commToken}`,
    }, {
      status: "accepted",
    });

    assert(
      acceptRes.status === 200 && acceptRes.body.request?.status === "accepted",
      `Committee accepted request (status: ${acceptRes.status})`
    );
    if (acceptRes.body.partnership) {
      createdPartnershipId = acceptRes.body.partnership._id;
    }

    // Allow socket delivery
    await new Promise((r) => setTimeout(r, 600));

    assert(
      sponReceivedStatusChange !== null && sponReceivedStatusChange.status === "accepted",
      `Sponsor received real-time 'request:statusChanged' socket event with status: accepted`
    );
    assert(
      commReceivedPartnership !== null,
      `Committee received real-time 'partnership:created' socket event`
    );
    assert(
      sponReceivedPartnership !== null,
      `Sponsor received real-time 'partnership:created' socket event`
    );

    // 10. Test Duplicate Prevention: Call accept again
    console.log("\n--- Workflow Step 5: Duplicate Prevention on Repeated Status Update ---");
    const repeatRes = await makeRequest(`/requests/${createdRequestId}/status`, "PATCH", {
      Authorization: `Bearer ${commToken}`,
    }, {
      status: "accepted",
    });
    assert(
      repeatRes.status === 200 && repeatRes.body.message === "Request is already accepted",
      `Duplicate status update caught safely: "${repeatRes.body.message}"`
    );

    // 11. Cleanup test records so MongoDB Atlas database is preserved without test residue
    console.log("\n--- Cleanup: Removing test records from MongoDB ---");
    await mongoose.connect(process.env.MONGO_URI, { dbName: "test" });
    const Request = require("../backend/models/Request");
    const Partnership = require("../backend/models/Partnership");
    const Notification = require("../backend/models/Notification");

    if (createdRequestId) {
      await Request.deleteOne({ _id: createdRequestId });
    }
    if (createdPartnershipId) {
      await Partnership.deleteOne({ _id: createdPartnershipId });
    }
    await Notification.deleteMany({
      $or: [
        { relatedId: createdRequestId },
        { "metadata.requestId": createdRequestId },
      ],
    });
    await mongoose.disconnect();
    console.log("[Cleanup] Test request, partnership, and notifications cleaned up successfully.");

    console.log("\n======================================================");
    console.log(`WORKFLOW RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("======================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Workflow test failed with error:", err);
    process.exit(1);
  } finally {
    if (commSocket) commSocket.disconnect();
    if (sponSocket) sponSocket.disconnect();
  }
}

runEndToEndWorkflow();
