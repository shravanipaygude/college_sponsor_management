import React, { createContext, useState, useEffect } from "react";
import {
  seedDefaultUsers,
  validateCredentials,
  addUser,
} from "../data/mockUsers";

// AuthContext shares authentication state across the application.
// Components access it through the useAuth() custom hook.
export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire application and manages:
 * - user: the currently authenticated user object
 * - role: the user's role (committee / sponsor / faculty)
 * - isAuthenticated: whether a user is logged in
 * - login / register / logout functions
 *
 * Mock frontend authentication for Experiment 2.
 * Real backend authentication and secure password handling
 * will be implemented in a later experiment.
 */
export function AuthProvider({ children }) {
  // useState manages the authenticated user and loading state.
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect seeds default demo users and restores persisted session on mount.
  useEffect(() => {
    // Seed demo accounts on first load
    seedDefaultUsers();

    // useEffect restores the persisted SponsorFlow session.
    // Check localStorage first (Remember Me), then sessionStorage.
    const storedSession =
      localStorage.getItem("sf_session") ||
      sessionStorage.getItem("sf_session");

    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setUser(sessionData);
        setIsAuthenticated(true);
      } catch {
        // Corrupted session — clear it
        localStorage.removeItem("sf_session");
        sessionStorage.removeItem("sf_session");
      }
    }

    setLoading(false);
  }, []);

  /**
   * login() validates credentials and persists the session.
   * Uses localStorage when Remember Me is enabled, sessionStorage otherwise.
   */
  const login = async (email, password, rememberMe = false) => {
    // Simulate brief network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const validUser = validateCredentials(email, password);
    if (!validUser) {
      throw new Error("Invalid email or password. Please try again.");
    }

    // Do NOT store passwords inside the active session.
    const sessionData = { ...validUser };

    // useEffect-compatible: persist session based on Remember Me preference
    if (rememberMe) {
      localStorage.setItem("sf_session", JSON.stringify(sessionData));
      sessionStorage.removeItem("sf_session");
    } else {
      sessionStorage.setItem("sf_session", JSON.stringify(sessionData));
      localStorage.removeItem("sf_session");
    }

    setUser(sessionData);
    setIsAuthenticated(true);

    return sessionData;
  };

  /**
   * register() creates a new mock user account in localStorage.
   * Does NOT auto-login — user must log in after registration.
   */
  const register = async (userData) => {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generate avatar initials from name
    const nameParts = userData.name.trim().split(" ");
    const avatar =
      nameParts.length >= 2
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : userData.name.slice(0, 2).toUpperCase();

    // Build role label
    const roleLabelMap = {
      committee: "Committee Head",
      sponsor: "Corporate Sponsor",
      faculty: "Faculty Approver",
    };

    const newUser = addUser({
      ...userData,
      avatar,
      roleLabel: roleLabelMap[userData.role] || "Member",
    });

    return newUser;
  };

  /**
   * logout() clears session from all storage and resets state.
   * No full browser reload required.
   */
  const logout = () => {
    localStorage.removeItem("sf_session");
    sessionStorage.removeItem("sf_session");
    setUser(null);
    setIsAuthenticated(false);
  };

  // The role is derived from the authenticated user object.
  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
