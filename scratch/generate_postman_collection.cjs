const fs = require("fs");
const path = require("path");

const collection = {
  info: {
    _postman_id: "sponnect-api-collection-exp7",
    name: "Sponnect API",
    description: "Official Experiment 7 Postman Collection for RESTful API Validation of Sponnect Platform.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    // ── 1. AUTH FOLDER ──
    {
      name: "AUTH",
      item: [
        {
          name: "Register Committee Account",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 201 Created', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "pm.test('Response is JSON with token & user', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.eql(true);",
                  "    pm.expect(jsonData).to.have.property('token');",
                  "    pm.expect(jsonData.user.role).to.eql('committee');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "CSI Committee Head",
                email: "csi.head@vesit.ac.in",
                password: "committeePass123",
                role: "committee",
                organizationName: "CSI Student Chapter",
                collegeName: "VESIT"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/auth/register",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "register"]
            }
          }
        },
        {
          name: "Register Sponsor Account",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 201 Created', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "pm.test('Response is JSON with token & user', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.eql(true);",
                  "    pm.expect(jsonData).to.have.property('token');",
                  "    pm.expect(jsonData.user.role).to.eql('sponsor');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Nova Brand Manager",
                email: "contact@novaai.com",
                password: "sponsorPass123",
                role: "sponsor",
                organizationName: "NovaAI Technologies"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/auth/register",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "register"]
            }
          }
        },
        {
          name: "Login Committee",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('JWT token generated & stored in environment', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.token).to.be.a('string');",
                  "    pm.environment.set('committeeToken', jsonData.token);",
                  "    pm.environment.set('token', jsonData.token);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "committee@sponnect.demo",
                password: "sponsor123"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/auth/login",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "login"]
            }
          }
        },
        {
          name: "Login Sponsor",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Sponsor JWT token generated & stored in environment', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.token).to.be.a('string');",
                  "    pm.environment.set('sponsorToken', jsonData.token);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "sponsor@sponnect.demo",
                password: "sponsor123"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/auth/login",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "login"]
            }
          }
        },
        {
          name: "Get Current User Profile (/me)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Returns authenticated user details', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.user).to.have.property('email');",
                  "    pm.expect(jsonData.user).to.not.have.property('password');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            url: {
              raw: "{{baseUrl}}/api/auth/me",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "me"]
            }
          }
        },
        {
          name: "Negative: Register with Invalid Email",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 400 Bad Request', function () {",
                  "    pm.response.to.have.status(400);",
                  "});",
                  "pm.test('Error message returned for invalid email', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.eql(false);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Invalid User",
                email: "not-an-email",
                password: "password123",
                role: "committee"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/auth/register",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "register"]
            }
          }
        },
        {
          name: "Negative: Login with Wrong Password",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 401 Unauthorized', function () {",
                  "    pm.response.to.have.status(401);",
                  "});",
                  "pm.test('Error message returned for wrong password', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.eql(false);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "committee@sponnect.demo",
                password: "wrongPassword999"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/auth/login",
              host: ["{{baseUrl}}"],
              path: ["api", "auth", "login"]
            }
          }
        }
      ]
    },

    // ── 2. EVENTS FOLDER ──
    {
      name: "EVENTS",
      item: [
        {
          name: "Get All Events (Public)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Response is an array of events', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/events",
              host: ["{{baseUrl}}"],
              path: ["api", "events"]
            }
          }
        },
        {
          name: "Create Event (Committee Only)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 201 Created', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "pm.test('Event created & _id saved to environment', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('_id');",
                  "    pm.expect(jsonData.title).to.eql('TechSurge 2026 Hackathon');",
                  "    pm.environment.set('eventId', jsonData._id);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "TechSurge 2026 Hackathon",
                description: "Annual national level 24-hour coding hackathon organized by CSI.",
                category: "Technical Festival",
                sponsorshipNeeded: "Monetary Sponsorship + Cloud Credits",
                benefitsOffered: ["Main Stage Branding", "Keynote Talk Slot", "Social Media Promotion"],
                eventDate: "2026-11-15T00:00:00.000Z"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/events",
              host: ["{{baseUrl}}"],
              path: ["api", "events"]
            }
          }
        },
        {
          name: "Get Single Event By ID",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Event details match created ID', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData._id).to.eql(pm.environment.get('eventId'));",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/events/{{eventId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "events", "{{eventId}}"]
            }
          }
        },
        {
          name: "Update Event (Committee Owner Only)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Updated event title is saved', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.title).to.include('Updated');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "TechSurge 2026 Hackathon (Updated Title)"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/events/{{eventId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "events", "{{eventId}}"]
            }
          }
        },
        {
          name: "Negative: Create Event Without Token",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 401 Unauthorized', function () {",
                  "    pm.response.to.have.status(401);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Unauthorized Event",
                description: "Missing JWT header"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/events",
              host: ["{{baseUrl}}"],
              path: ["api", "events"]
            }
          }
        },
        {
          name: "Negative: Sponsor Attempts Committee Event Creation",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 403 Forbidden', function () {",
                  "    pm.response.to.have.status(403);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{sponsorToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Sponsor Event Attempt",
                description: "Should fail because sponsor role cannot create events"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/events",
              host: ["{{baseUrl}}"],
              path: ["api", "events"]
            }
          }
        },
        {
          name: "Negative: Get Event with Invalid ObjectId",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 400 Bad Request', function () {",
                  "    pm.response.to.have.status(400);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/events/invalid-object-id-12345",
              host: ["{{baseUrl}}"],
              path: ["api", "events", "invalid-object-id-12345"]
            }
          }
        }
      ]
    },

    // ── 3. OPPORTUNITIES FOLDER ──
    {
      name: "OPPORTUNITIES",
      item: [
        {
          name: "Get All Opportunities (Public)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Response is an array', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/opportunities",
              host: ["{{baseUrl}}"],
              path: ["api", "opportunities"]
            }
          }
        },
        {
          name: "Create Opportunity (Sponsor Only)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 201 Created', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "pm.test('Opportunity created & _id saved', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('_id');",
                  "    pm.environment.set('opportunityId', jsonData._id);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{sponsorToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "AI Developer Sponsorship Grant 2026",
                description: "NovaAI is providing ₹75,000 cash grant and API credits to top college tech fests.",
                category: "AI / Technology",
                supportType: ["Monetary Grant", "API Credits"],
                amountOrValue: "₹75,000",
                requirements: ["Logo on main banner", "Stall in exhibition hall", "Keynote address slot"]
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/opportunities",
              host: ["{{baseUrl}}"],
              path: ["api", "opportunities"]
            }
          }
        },
        {
          name: "Get Single Opportunity By ID",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/opportunities/{{opportunityId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "opportunities", "{{opportunityId}}"]
            }
          }
        },
        {
          name: "Negative: Committee Attempts Sponsor Opportunity Creation",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 403 Forbidden', function () {",
                  "    pm.response.to.have.status(403);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Committee Creating Opp Attempt",
                description: "Should fail with 403"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/opportunities",
              host: ["{{baseUrl}}"],
              path: ["api", "opportunities"]
            }
          }
        }
      ]
    },

    // ── 4. REQUESTS FOLDER ──
    {
      name: "REQUESTS",
      item: [
        {
          name: "Create Partnership Request (Sponsor -> Event)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 201 Created or 200 OK', function () {",
                  "    pm.expect(pm.response.code).to.be.oneOf([200, 201]);",
                  "});",
                  "pm.test('Request created & requestId saved', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('_id');",
                  "    pm.environment.set('requestId', jsonData._id);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{sponsorToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                eventId: "{{eventId}}",
                message: "NovaAI Technologies would like to sponsor your TechSurge hackathon.",
                supportRequested: "₹50,000 + 100 AI Vouchers",
                offerDetails: "Main Stage Banner, Product Workshop"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/requests",
              host: ["{{baseUrl}}"],
              path: ["api", "requests"]
            }
          }
        },
        {
          name: "Get User Requests (Authenticated)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Returns list of requests', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            url: {
              raw: "{{baseUrl}}/api/requests",
              host: ["{{baseUrl}}"],
              path: ["api", "requests"]
            }
          }
        },
        {
          name: "Accept Request (Designated Recipient Only)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Request accepted & Partnership created', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData.request.status).to.eql('accepted');",
                  "    if (jsonData.partnership && jsonData.partnership._id) {",
                  "        pm.environment.set('partnershipId', jsonData.partnership._id);",
                  "    }",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                status: "accepted"
              }, null, 2)
            },
            url: {
              raw: "{{baseUrl}}/api/requests/{{requestId}}/status",
              host: ["{{baseUrl}}"],
              path: ["api", "requests", "{{requestId}}", "status"]
            }
          }
        },
        {
          name: "Negative: Get Requests Without Token",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 401 Unauthorized', function () {",
                  "    pm.response.to.have.status(401);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/requests",
              host: ["{{baseUrl}}"],
              path: ["api", "requests"]
            }
          }
        }
      ]
    },

    // ── 5. PARTNERSHIPS FOLDER ──
    {
      name: "PARTNERSHIPS",
      item: [
        {
          name: "Get User Partnerships (Authenticated)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Returns list of active partnerships', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.be.an('array');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            url: {
              raw: "{{baseUrl}}/api/partnerships",
              host: ["{{baseUrl}}"],
              path: ["api", "partnerships"]
            }
          }
        },
        {
          name: "Get Single Partnership By ID",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 200 OK', function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "pm.test('Partnership contains committee & sponsor data', function () {",
                  "    var jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('partnershipStatus');",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Bearer {{committeeToken}}" }
            ],
            url: {
              raw: "{{baseUrl}}/api/partnerships/{{partnershipId}}",
              host: ["{{baseUrl}}"],
              path: ["api", "partnerships", "{{partnershipId}}"]
            }
          }
        },
        {
          name: "Negative: Get Partnerships Without Token",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "pm.test('Status code is 401 Unauthorized', function () {",
                  "    pm.response.to.have.status(401);",
                  "});"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{baseUrl}}/api/partnerships",
              host: ["{{baseUrl}}"],
              path: ["api", "partnerships"]
            }
          }
        }
      ]
    }
  ]
};

const environment = {
  id: "sponnect-environment-exp7",
  name: "Sponnect Environment",
  values: [
    { key: "baseUrl", value: "http://localhost:5000", enabled: true },
    { key: "token", value: "", enabled: true },
    { key: "committeeToken", value: "", enabled: true },
    { key: "sponsorToken", value: "", enabled: true },
    { key: "eventId", value: "", enabled: true },
    { key: "opportunityId", value: "", enabled: true },
    { key: "requestId", value: "", enabled: true },
    { key: "partnershipId", value: "", enabled: true }
  ]
};

const postmanDir = path.join(__dirname, "..", "postman");
if (!fs.existsSync(postmanDir)) {
  fs.mkdirSync(postmanDir, { recursive: true });
}

fs.writeFileSync(
  path.join(postmanDir, "Sponnect.postman_collection.json"),
  JSON.stringify(collection, null, 2)
);

fs.writeFileSync(
  path.join(postmanDir, "Sponnect.postman_environment.json"),
  JSON.stringify(environment, null, 2)
);

console.log("Successfully generated Postman Collection and Environment in /postman directory!");
