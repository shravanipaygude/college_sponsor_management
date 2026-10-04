const http = require("http");

const BASE_URL = "http://localhost:5000/api";

async function makeRequest(path, method = "GET", headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
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

async function runSecurityTests() {
  console.log("==========================================");
  console.log("STARTING EXPERIMENT 6 SECURITY VERIFICATION");
  console.log("==========================================");

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
    // 1. Test Login as Committee
    console.log("\n--- TEST 1: Login as Committee ---");
    const committeeLoginRes = await makeRequest("/auth/login", "POST", {}, {
      email: "committee@sponnect.demo",
      password: "sponsor123",
    });
    assert(
      committeeLoginRes.status === 200 && committeeLoginRes.body.token && committeeLoginRes.body.user.role === "committee",
      `Committee login succeeded and returned JWT with committee role (Status: ${committeeLoginRes.status})`
    );
    const committeeToken = committeeLoginRes.body.token;

    // 2. Test Login as Sponsor
    console.log("\n--- TEST 2: Login as Sponsor ---");
    const sponsorLoginRes = await makeRequest("/auth/login", "POST", {}, {
      email: "sponsor@sponnect.demo",
      password: "sponsor123",
    });
    assert(
      sponsorLoginRes.status === 200 && sponsorLoginRes.body.token && sponsorLoginRes.body.user.role === "sponsor",
      `Sponsor login succeeded and returned JWT with sponsor role (Status: ${sponsorLoginRes.status})`
    );
    const sponsorToken = sponsorLoginRes.body.token;

    // 3. Test No JWT -> Protected API (POST /events)
    console.log("\n--- TEST 3: No JWT -> Protected API (POST /events) ---");
    const noJwtRes = await makeRequest("/events", "POST", {}, {
      title: "Unauthorized Event",
      description: "Should fail",
    });
    assert(
      noJwtRes.status === 401,
      `Request without JWT returned 401 Unauthorized (Status: ${noJwtRes.status})`
    );

    // 4. Test Valid Sponsor JWT -> Committee-only API (POST /events)
    console.log("\n--- TEST 4: Sponsor JWT -> Committee-only API (POST /events) ---");
    const sponsorOnCommitteeApiRes = await makeRequest(
      "/events",
      "POST",
      { Authorization: `Bearer ${sponsorToken}` },
      { title: "Sponsor Event Attempt", description: "Should be forbidden" }
    );
    assert(
      sponsorOnCommitteeApiRes.status === 403,
      `Sponsor JWT on Committee-only API returned 403 Forbidden (Status: ${sponsorOnCommitteeApiRes.status})`
    );

    // 5. Test Valid Committee JWT -> Sponsor-only API (POST /opportunities)
    console.log("\n--- TEST 5: Committee JWT -> Sponsor-only API (POST /opportunities) ---");
    const committeeOnSponsorApiRes = await makeRequest(
      "/opportunities",
      "POST",
      { Authorization: `Bearer ${committeeToken}` },
      { title: "Committee Opportunity Attempt", description: "Should be forbidden" }
    );
    assert(
      committeeOnSponsorApiRes.status === 403,
      `Committee JWT on Sponsor-only API returned 403 Forbidden (Status: ${committeeOnSponsorApiRes.status})`
    );

    // 6. Test GET /auth/me for Token Verification (Session Persistence)
    console.log("\n--- TEST 6: GET /auth/me Session Persistence Verification ---");
    const meRes = await makeRequest("/auth/me", "GET", { Authorization: `Bearer ${committeeToken}` });
    assert(
      meRes.status === 200 && meRes.body.user && meRes.body.user.email === "committee@sponnect.demo",
      `GET /auth/me verified JWT session successfully for committee@sponnect.demo (Status: ${meRes.status})`
    );

    // 7. Test User ID derivation from JWT (Step 8 check)
    console.log("\n--- TEST 8 CHECK: Committee creating Event inherits createdBy from req.user._id ---");
    const createEventRes = await makeRequest(
      "/events",
      "POST",
      { Authorization: `Bearer ${committeeToken}` },
      {
        title: "Test Security Event " + Date.now(),
        description: "Testing backend-derived user ID",
        category: "Technical Festival",
        sponsorshipNeeded: "Monetary",
        createdBy: "fake_user_id_from_hacker", // Malicious attempt to forge createdBy
      }
    );
    assert(
      createEventRes.status === 201 && createEventRes.body.createdBy !== "fake_user_id_from_hacker",
      `Backend correctly derived createdBy from JWT instead of forged payload`
    );

    console.log("\n==========================================");
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==========================================");

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error("Test error:", err.message);
    process.exit(1);
  }
}

runSecurityTests();
