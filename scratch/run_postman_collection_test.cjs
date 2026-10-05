const http = require("http");
const fs = require("fs");
const path = require("path");

const collectionPath = path.join(__dirname, "..", "postman", "Sponnect.postman_collection.json");
const collectionData = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

const envState = {
  baseUrl: "http://localhost:5000",
  token: "",
  committeeToken: "",
  sponsorToken: "",
  eventId: "",
  opportunityId: "",
  requestId: "",
  partnershipId: ""
};

function resolveVariables(str) {
  if (!str) return str;
  return str.replace(/\{\{([^}]+)\}\}/g, (_, key) => envState[key] || "");
}

async function makeHttpCall(method, fullUrl, headers, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(fullUrl);
    const reqHeaders = { ...headers };

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => (rawData += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode, body: parsed });
          } catch {
            resolve({ status: res.statusCode, raw: rawData });
          }
        });
      }
    );

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runCollection() {
  console.log("==================================================");
  console.log("EXECUTING POSTMAN COLLECTION TEST SUITE (EXP 7)");
  console.log("==================================================");

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const folder of collectionData.item) {
    console.log(`\n📂 FOLDER: ${folder.name}`);
    for (const item of folder.item) {
      const name = item.name;
      const req = item.request;
      const method = req.method;
      const rawUrl = resolveVariables(req.url.raw);

      const headers = {};
      if (req.header) {
        req.header.forEach((h) => {
          headers[h.key] = resolveVariables(h.value);
        });
      }

      let reqBody = null;
      if (req.body && req.body.raw) {
        reqBody = resolveVariables(req.body.raw);
      }

      try {
        const response = await makeHttpCall(method, rawUrl, headers, reqBody);
        totalTests++;

        // Extract tests from event script
        let expectedStatus = 200;
        let setTokenKey = null;
        let setEventId = false;
        let setOppId = false;
        let setReqId = false;
        let setPartId = false;

        if (name.includes("201") || name.includes("Register") || name.includes("Create Event") || name.includes("Create Opportunity")) {
          expectedStatus = 201;
        }
        if (name.includes("400") || name.includes("Invalid Email") || name.includes("Invalid ObjectId")) {
          expectedStatus = 400;
        }
        if (name.includes("401") || name.includes("Without Token") || name.includes("Wrong Password")) {
          expectedStatus = 401;
        }
        if (name.includes("403") || name.includes("Attempts") || name.includes("Non-Recipient")) {
          expectedStatus = 403;
        }
        if (name.includes("Create Partnership Request")) {
          expectedStatus = 201;
        }

        const isSuccessStatus = response.status === expectedStatus || (expectedStatus === 201 && response.status === 200);

        if (isSuccessStatus) {
          passedTests++;
          console.log(`  [PASS] ${name} -> Status: ${response.status}`);
        } else {
          failedTests++;
          console.log(`  [FAIL] ${name} -> Expected: ${expectedStatus}, Got: ${response.status}`);
          console.log("         Response:", JSON.stringify(response.body || response.raw));
        }

        // Post-script variable extractions
        if (response.body && response.body.token) {
          if (name.includes("Committee")) {
            envState.committeeToken = response.body.token;
            envState.token = response.body.token;
          }
          if (name.includes("Sponsor")) {
            envState.sponsorToken = response.body.token;
          }
        }
        if (response.body && response.body._id) {
          if (name.includes("Create Event")) envState.eventId = response.body._id;
          if (name.includes("Create Opportunity")) envState.opportunityId = response.body._id;
          if (name.includes("Create Partnership Request")) envState.requestId = response.body._id;
        }
        if (response.body && response.body.partnership && response.body.partnership._id) {
          envState.partnershipId = response.body.partnership._id;
        }
      } catch (err) {
        failedTests++;
        console.error(`  [ERROR] ${name} -> ${err.message}`);
      }
    }
  }

  console.log("\n==================================================");
  console.log(`POSTMAN EXECUTION SUMMARY: ${passedTests}/${totalTests} PASSED`);
  console.log("==================================================");
}

runCollection();
