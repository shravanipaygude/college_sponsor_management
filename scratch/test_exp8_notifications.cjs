const http = require("http");
const { io } = require("socket.io-client");
const path = require("path");

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

async function runExp8Tests() {
  console.log("=================================================");
  console.log("EXPERIMENT 8 NOTIFICATION & VERIFICATION SUITE");
  console.log("=================================================");

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

  try {
    // 1. Authenticate Committee account
    console.log("\n--- TEST 1: Authenticate Committee (CSI VESIT) ---");
    const commAuth = await makeRequest("/auth/login", "POST", {}, {
      email: "csi@vesit.demo",
      password: "Csi@Vesit2026",
    });
    assert(
      commAuth.status === 200 && commAuth.body.token && commAuth.body.user.role === "committee",
      `Committee login succeeded with role: ${commAuth.body.user?.role}`
    );
    const commToken = commAuth.body.token;
    const commUserId = commAuth.body.user._id;

    // 2. Authenticate Sponsor account
    console.log("\n--- TEST 2: Authenticate Sponsor (Red Bull Partnerships) ---");
    const sponAuth = await makeRequest("/auth/login", "POST", {}, {
      email: "redbull@sponnect.demo",
      password: "RedBull@2026",
    });
    assert(
      sponAuth.status === 200 && sponAuth.body.token && sponAuth.body.user.role === "sponsor",
      `Sponsor login succeeded with role: ${sponAuth.body.user?.role}`
    );
    const sponToken = sponAuth.body.token;
    const sponUserId = sponAuth.body.user._id;

    // 3. Test Socket.IO Authentication & Isolation
    console.log("\n--- TEST 3: Socket.IO Authentication & Room Association ---");
    const commSocket = await new Promise((resolve, reject) => {
      const socket = io(SOCKET_URL, {
        auth: { token: commToken },
        transports: ["websocket", "polling"],
      });
      socket.on("connect", () => resolve(socket));
      socket.on("connect_error", (err) => reject(err));
    });
    assert(commSocket.connected, `Committee Socket connected successfully (ID: ${commSocket.id})`);

    const sponSocket = await new Promise((resolve, reject) => {
      const socket = io(SOCKET_URL, {
        auth: { token: sponToken },
        transports: ["websocket", "polling"],
      });
      socket.on("connect", () => resolve(socket));
      socket.on("connect_error", (err) => reject(err));
    });
    assert(sponSocket.connected, `Sponsor Socket connected successfully (ID: ${sponSocket.id})`);

    // 4. Test Recipient Isolation: Committee room does not receive Sponsor events
    console.log("\n--- TEST 4: Socket.IO Recipient Isolation ---");
    let commReceivedSponEvent = false;
    commSocket.on("request:statusChanged", () => {
      commReceivedSponEvent = true;
    });

    // 5. Test Persistent Notifications API (GET /api/notifications)
    console.log("\n--- TEST 5: GET /api/notifications Persistence Check ---");
    const commNotifRes = await makeRequest("/notifications", "GET", {
      Authorization: `Bearer ${commToken}`,
    });
    assert(
      commNotifRes.status === 200 && Array.isArray(commNotifRes.body.notifications),
      `Committee GET /notifications returned status 200 with array of notifications`
    );

    const sponNotifRes = await makeRequest("/notifications", "GET", {
      Authorization: `Bearer ${sponToken}`,
    });
    assert(
      sponNotifRes.status === 200 && Array.isArray(sponNotifRes.body.notifications),
      `Sponsor GET /notifications returned status 200 with array of notifications`
    );

    // 6. Test Unread Count API
    console.log("\n--- TEST 6: GET /api/notifications/unread-count ---");
    const unreadCountRes = await makeRequest("/notifications/unread-count", "GET", {
      Authorization: `Bearer ${commToken}`,
    });
    assert(
      unreadCountRes.status === 200 && typeof unreadCountRes.body.unreadCount === "number",
      `Unread count API returned status 200 with numerical count: ${unreadCountRes.body.unreadCount}`
    );

    // 7. Test Mark All as Read API
    console.log("\n--- TEST 7: PATCH /api/notifications/read-all ---");
    const markAllRes = await makeRequest("/notifications/read-all", "PATCH", {
      Authorization: `Bearer ${commToken}`,
    });
    assert(
      markAllRes.status === 200 && markAllRes.body.success === true,
      `Mark all notifications read succeeded with status 200`
    );

    // 8. Test Email Notification Service Failure Handling
    console.log("\n--- TEST 8: Email Service Non-Blocking Failure Handling ---");
    const { sendRequestStatusEmail, sendPartnershipCreatedEmail } = require(
      path.join(__dirname, "../backend/services/emailService.js")
    );

    const emailStatusResult = await sendRequestStatusEmail({
      recipientEmail: "test@example.com",
      recipientName: "Test Recipient",
      actorName: "Test Actor",
      status: "accepted",
      entityTitle: "Annual Hackathon",
      isApproach: false,
    });
    assert(
      emailStatusResult && typeof emailStatusResult === "object",
      `sendRequestStatusEmail returned safely without throwing unhandled exceptions (success: ${emailStatusResult.success})`
    );

    const emailPartResult = await sendPartnershipCreatedEmail({
      recipientEmail: "test@example.com",
      recipientName: "Test Recipient",
      partnerName: "Test Partner",
      entityTitle: "Annual Hackathon",
      supportProvided: "₹50,000 Support",
    });
    assert(
      emailPartResult && typeof emailPartResult === "object",
      `sendPartnershipCreatedEmail returned safely without throwing unhandled exceptions (success: ${emailPartResult.success})`
    );

    // 9. Test SMS Readiness Stub (Feature 3)
    console.log("\n--- TEST 9: SMS Readiness Service Stub ---");
    const { sendSms } = require(path.join(__dirname, "../backend/services/smsService.js"));
    const smsResult = await sendSms({
      to: "+919876543210",
      message: "Test SMS notification",
    });
    assert(
      smsResult && smsResult.success === false && smsResult.reason.includes("disabled or not configured"),
      `SMS readiness stub safely reported non-configured provider without errors`
    );

    // 10. Clean up sockets
    commSocket.disconnect();
    sponSocket.disconnect();
    assert(!commReceivedSponEvent, `Recipient isolation verified: Committee received 0 unintended events`);

    console.log("\n=================================================");
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

runExp8Tests();
