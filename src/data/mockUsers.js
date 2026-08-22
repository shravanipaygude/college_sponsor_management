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
    id: "demo_committee_1",
    name: "Shravani",
    email: "committee@sponsorflow.demo",
    password: encode("sponsor123"),
    role: "committee",
    avatar: "SK",
    college: "VESIT",
    committee: "CSI Student Chapter",
    roleLabel: "Committee Head",
  },
  {
    id: "demo_sponsor_1",
    name: "Arjun Mehta",
    email: "sponsor@sponsorflow.demo",
    password: encode("sponsor123"),
    role: "sponsor",
    avatar: "AM",
    company: "NovaAI Technologies",
    industry: "AI / Technology",
    roleLabel: "Partnerships Lead",
  },
  {
    id: "demo_faculty_1",
    name: "Dr. Priya Sharma",
    email: "faculty@sponsorflow.demo",
    password: encode("sponsor123"),
    role: "faculty",
    avatar: "PS",
    college: "VESIT",
    department: "Computer Engineering",
    roleLabel: "Faculty Approver",
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

  const newUser = {
    id: `user_${Date.now()}`,
    ...userData,
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
