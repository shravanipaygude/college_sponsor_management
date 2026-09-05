// ============================================================
// SponsorFlow — Mock User Accounts for Experiment 2
//
// Mock frontend authentication for Experiment 2.
// Real backend authentication and secure password handling
// will be implemented in a later experiment.
// ============================================================

// Simple base64 encoding for mock password storage.
// This is NOT secure — it is intentional for a frontend-only demo.
const encode = (str) => btoa(str);
const decode = (str) => atob(str);

/**
 * Default demo accounts for easy testing.
 * These are seeded into localStorage on first load.
 */
export const defaultDemoAccounts = [
  {
    _id: "650000000000000000000001",
    id: "650000000000000000000001",
    name: "Shravani",
    email: "committee@sponnect.demo",
    password: encode("sponsor123"),
    role: "committee",
    avatar: "SK",
    college: "VESIT",
    collegeName: "VESIT",
    committee: "CSI",
    organizationName: "CSI",
    roleLabel: "Committee Head",
  },
  {
    _id: "650000000000000000000002",
    id: "650000000000000000000002",
    name: "Arjun Mehta",
    email: "sponsor@sponnect.demo",
    password: encode("sponsor123"),
    role: "sponsor",
    avatar: "AM",
    company: "NovaAI Technologies",
    organizationName: "NovaAI Technologies",
    industry: "AI / Technology",
    roleLabel: "Partnerships Lead",
  },
];

/**
 * Seeds default demo accounts into localStorage if none exist.
 * Called once when AuthProvider mounts for the first time.
 */
export function seedDefaultUsers() {
  const existing = localStorage.getItem("sf_users");
  if (!existing) {
    localStorage.setItem("sf_users", JSON.stringify(defaultDemoAccounts));
    return defaultDemoAccounts;
  }
  // Ensure demo accounts always exist (merge if missing)
  const users = JSON.parse(existing);
  const demoEmails = defaultDemoAccounts.map((d) => d.email);
  const existingEmails = users.map((u) => u.email);
  const missing = defaultDemoAccounts.filter(
    (d) => !existingEmails.includes(d.email)
  );
  if (missing.length > 0) {
    const merged = [...users, ...missing];
    localStorage.setItem("sf_users", JSON.stringify(merged));
    return merged;
  }
  return users;
}

/**
 * Retrieves all registered users from localStorage.
 */
export function getStoredUsers() {
  const data = localStorage.getItem("sf_users");
  return data ? JSON.parse(data) : [];
}

/**
 * Adds a new user to localStorage.
 * Returns the created user object (without password).
 */
export function addUser(userData) {
  const users = getStoredUsers();

  // Check for duplicate email
  if (users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }

  // Generate a valid 24-character Mongoose ObjectId string
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const randomHex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  const hexId = timestamp + randomHex;

  const collegeName = userData.collegeName || userData.college || "";
  const organizationName =
    userData.organizationName ||
    userData.committee ||
    userData.company ||
    userData.college ||
    "";

  const newUser = {
    _id: hexId,
    id: hexId,
    ...userData,
    collegeName,
    organizationName,
    password: encode(userData.password),
  };

  users.push(newUser);
  localStorage.setItem("sf_users", JSON.stringify(users));

  // Return user without password
  const { password, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Validates login credentials against stored users.
 * Returns user object (without password) or null.
 */
export function validateCredentials(email, password) {
  const users = getStoredUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) return null;

  try {
    if (decode(user.password) !== password) return null;
  } catch {
    return null;
  }

  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}
